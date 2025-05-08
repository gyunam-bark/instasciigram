import pg from 'pg'
import dotenv from 'dotenv'
dotenv.config()

const { Pool } = pg

export default class Database {
  static #pool = null

  static async init() {
    if (!this.#pool) {
      this.#pool = new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
      })

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS posts (
          id SERIAL PRIMARY KEY,
          title TEXT NOT NULL,
          writer TEXT NOT NULL,
          password TEXT NOT NULL,
          tags TEXT[] DEFAULT '{}',
          size INTEGER NOT NULL,
          pixels TEXT[] DEFAULT '{}',
          created_at TIMESTAMP NOT NULL,
          updated_at TIMESTAMP NOT NULL
        )
      `
      await this.#pool.query(createTableQuery)
      console.log('postgresql connect success and posts table ready to serve.')
    }
  }

  static get pool() {
    if (!this.#pool) {
      throw new Error('postgresql database not initialized. call Database.init() first.')
    }
    return this.#pool
  }

  static async getPosts({ page = 1, pageSize = 10, keyword = '' } = {}) {
    const offset = (page - 1) * pageSize
    const loweredKeyword = `%${keyword.toLowerCase()}%`

    const query = keyword.trim()
      ? `SELECT * FROM posts
         WHERE LOWER(title) LIKE $1 OR LOWER(writer) LIKE $1 OR EXISTS (
           SELECT 1 FROM unnest(tags) tag WHERE LOWER(tag) LIKE $1
         )
         ORDER BY created_at DESC
         LIMIT $2 OFFSET $3`
      : `SELECT * FROM posts
         ORDER BY created_at DESC
         LIMIT $1 OFFSET $2`

    const values = keyword.trim()
      ? [loweredKeyword, pageSize, offset]
      : [pageSize, offset]

    const { rows } = await this.pool.query(query, values)
    return rows
  }

  static async getPost(id = 0) {
    const { rows } = await this.pool.query('SELECT * FROM posts WHERE id = $1', [id])
    if (rows.length === 0) {
      return { status: 404, id, error: 'post not found' }
    }
    return rows[0]
  }

  static async deletePost(id = 0, password = '') {
    const post = await this.getPost(id)
    if (post.status === 404) return post
    if (post.password !== password) {
      return { status: 401, id, error: 'incorrect password' }
    }

    await this.pool.query('DELETE FROM posts WHERE id = $1', [id])
    return { id }
  }

  static async createPost({
    title = '', writer = '', password = '', tags = [],
    size = 0, pixels = []
  } = {}) {
    const now = new Date().toISOString()
    const result = await this.pool.query(
      `INSERT INTO posts (title, writer, password, tags, size, pixels, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title.trim() || 'untitled',
        writer.trim() || 'anonymous',
        password,
        tags,
        size,
        pixels,
        now,
        now
      ]
    )
    return result.rows[0]
  }

  static async updatePost(id = 0, password = '', {
    title = '', writer = '', tags = [], size = 0, pixels = []
  } = {}) {
    const post = await this.getPost(id)
    if (post.status === 404) return post
    if (post.password !== password) {
      return { status: 401, id, error: 'incorrect password' }
    }

    const updated = {
      title: title.trim() || post.title,
      writer: writer.trim() || post.writer,
      tags: tags.length ? tags : post.tags,
      size: size || post.size,
      pixels: pixels.length ? pixels : post.pixels,
      updatedAt: new Date().toISOString()
    }

    const result = await this.pool.query(
      `UPDATE posts SET title = $1, writer = $2, tags = $3, size = $4, pixels = $5, updated_at = $6
       WHERE id = $7 RETURNING *`,
      [updated.title, updated.writer, updated.tags, updated.size, updated.pixels, updated.updatedAt, id]
    )

    return result.rows[0]
  }
}