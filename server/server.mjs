import express from 'express'
import PostRoutes from './routes/post-routes.mjs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

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

    this.#server.listen(port, () => {
      console.log(`server running at http://localhost:${port}`)
    })
  }
}