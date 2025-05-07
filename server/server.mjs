import express from 'express'
import PostRoutes from './routes/post-routes.mjs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import Render from './utils/render.mjs'

export default class Server {
  static #DEFAULT_PORT = 3000
  static #server = express()

  static #__FILENAME = fileURLToPath(import.meta.url)
  static #__DIRNAME = dirname(this.#__FILENAME)

  static run(port = this.#DEFAULT_PORT) {
    this.#server.use(express.urlencoded({ extended: true }))
    this.#server.use(express.json())
    this.#server.use(express.static(path.resolve(this.#__DIRNAME, './views')))

    // home
    this.#server.get('/', this.sendIndexPageFile)

    // post
    this.#server.post('/posts', (req, res) => {
      try {
        const {
          title = '',
          writer = '',
          password = '',
          tags = '',
          size = 0,
          pixels = ''
        } = req.body

        const tagsArray = Array.isArray(tags)
          ? tags
          : typeof tags === 'string'
            ? tags.split(',').map(t => t.trim()).filter(Boolean)
            : []

        const pixelsArray = Array.isArray(pixels)
          ? pixels
          : typeof pixels === 'string'
            ? pixels.split(',').map(p => p.trim()).filter(Boolean)
            : []

        const post = PostRoutes.createPost({
          title,
          writer,
          password,
          tags: tagsArray,
          size: Number(size),
          pixels: pixelsArray
        })

        const art = Render.pixelsToColoredHtmlCode(post.pixels, post.size)

        const html = `
          <div class="post">
            <h3>${post.title}</h3>
            <p>by ${post.writer}</p>
            <p><strong>Tags:</strong> ${post.tags.join(', ')}</p>
            <p><strong>Size:</strong> ${post.size}</p>
            <div style=" white-space: pre; text-align:center; font-size:2rem; line-height:1; letter-spacing: 0;">${art}</div>
          </div>
        `
        res.status(201).send(html)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
    })

    this.#server.get('/posts', (req, res) => {
      try {
        const result = PostRoutes.getPosts(req.query)
        const html = result.map(post => {
          const art = Render.pixelsToColoredHtmlCode(post.pixels, post.size)

          return `
          <div class="post">
            <h3>${post.title}</h3>
            <p>by ${post.writer}</p>
            <p><strong>Tags:</strong> ${post.tags.join(', ')}</p>
            <p><strong>Size:</strong> ${post.size}</p>
            <div style=" white-space: pre; text-align:center; font-size:2rem; line-height:1; letter-spacing: 0;">${art}</div>
          </div>
        `}).join('')

        res.status(200).send(html)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
    })

    this.#server.listen(port, () => {
      console.log(`server running at http://localhost:${port}`)
    })
  }

  static sendIndexPageFile(req, res) {
    try {
      res.sendFile(path.resolve(this.#__DIRNAME, './views/index.html'))
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}