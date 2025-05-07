import express from 'express'
import PostRoutes from './routes/post-routes.mjs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

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
    this.#server.get('/', this.sendApiDocument)

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

        const post = PostRoutes.createPost({
          title,
          writer,
          password,
          tags: tags,
          size: Number(size),
          pixels: pixels
        })
        res.status(201).json(post)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
    })

    this.#server.get('/posts', (req, res) => {
      try {
        const result = PostRoutes.getPosts(req.body)

        res.status(200).json(result)
      } catch (error) {
        res.status(400).json({ error: error.message })
      }
    })

    this.#server.listen(port, () => {
      console.log(`server running at http://localhost:${port}`)
    })
  }

  static sendApiDocument(req, res) {
    try {
      res.sendFile(path.resolve(this.#__DIRNAME, './views/index.html'))
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  }
}