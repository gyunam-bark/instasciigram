import express from 'express'
import PostRoutes from './routes/post-routes.mjs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import Pixel from './models/pixel.mjs'

export default class Server {
  static #DEFAULT_PORT = 3000

  static #__FILENAME = fileURLToPath(import.meta.url)
  static #__DIRNAME = dirname(this.#__FILENAME)

  static #server = express()

  static run(port = this.#DEFAULT_PORT) {
    this.#server.use(express.urlencoded({ extended: true }))
    this.#server.use(express.json())
    this.#server.use(express.static(path.resolve(this.#__DIRNAME, './views')))

    // api document
    this.#server.get('/', (req, res) => {
      try {
        res.sendFile(path.resolve(this.#__DIRNAME, './views/document.html'))
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
    })

    // create post
    this.#server.post('/posts', (req, res) => {
      try {
        const post = PostRoutes.createPost(req.body)

        res.status(201).json(post)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
    })

    // get posts
    this.#server.get('/posts', (req, res) => {
      try {
        const { page = 1, pageSize = 10, keyword = '' } = req.query

        const result = PostRoutes.getPosts({
          page: Number(page),
          pageSize: Number(pageSize),
          keyword
        })

        res.status(200).json(result)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
    })

    // get post
    this.#server.get('/posts/:id', (req, res) => {
      try {
        const { id } = req.params
        const result = PostRoutes.getPost({ id: Number(id) })

        res.status(200).json(result)
      } catch (error) {
        res.status(404).json({ error: error.message })
      }
    })

    // update post
    this.#server.patch('/posts/:id', (req, res) => {
      try {
        const { id } = req.params
        const { password = '', ...fields } = req.body

        const result = PostRoutes.updatePost({
          ...fields,
          id: Number(id),
          password
        })

        res.status(200).json(result)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
    })

    // delete
    this.#server.delete('/posts/:id', (req, res) => {
      try {
        const { id } = req.params
        const { password = '' } = req.query
        const result = PostRoutes.deletePost({
          id: Number(id),
          password
        })
        res.status(200).json(result)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
    })

    this.#server.get('/render/:id', (req, res) => {
      const { id } = req.params
      const result = PostRoutes.getPost({ id: Number(id) })
      const { title, writer, size, pixels } = result

      let asciiHtml = ''

      for (let i = 0; i < pixels.length; i++) {
        const pixel = Pixel.fromHex(pixels[i])

        asciiHtml += `<span style="color: rgb(${pixel.red}, ${pixel.green}, ${pixel.blue})">${pixel.ascii}</span>`
        if ((i + 1) % size === 0) asciiHtml += '<br>'
      }

      const html = `
      <!DOCTYPE html>
      <html lang="ko">
      <head>
        <meta charset="UTF-8" />
        <title>${title} - ASCII Art</title>
        <style>
          body {
            margin: 0;
            height: 100vh;
            background: #fff;
            color: #000;
            font-family: monospace;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .ascii {
            text-align: center;
            font-size: 12px;
            line-height: 1.1;
            white-space: pre;
          }
        </style>
      </head>
      <body>
        <div class="ascii">
          <h2 style="color:black">${title} by ${writer}</h2>
          <div style="border-width:1px; border-style:solid; border-color:#000;">
          ${asciiHtml}
          </div>
        </div>
      </body>
      </html>
          `

      res.send(html.trim())
    })

    this.#server.listen(port, () => {
      console.log(`server running at http://localhost:${port}`)
    })
  }
}