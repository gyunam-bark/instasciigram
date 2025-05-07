import Post from './models/post.mjs'

export default class Database {
  static #posts = new Map()
  static #id = 1

  static async getPosts(schemes = {}) {
    const { page = 1, pageSize = 10, keyword = '' } = schemes

    const all = Array.from(this.#posts.values())
    const loweredKeyword = keyword.toLowerCase()

    let filtered = []

    if (loweredKeyword !== '' && loweredKeyword.length > 0) {
      filtered = all.filter(post => {
        const { title, writer, tags } = post.toJSON()
        return (
          title.toLowerCase().includes(loweredKeyword) ||
          writer.toLowerCase().includes(loweredKeyword) ||
          tags.some(tag => tag.toLowerCase().includes(loweredKeyword))
        )
      })
    } else {
      filtered = all
    }

    const start = (page - 1) * pageSize
    const end = start + pageSize

    if (filtered.length <= pageSize && page === 1) {
      return filtered.map(post => post.toJSON())
    }

    if (start >= filtered.length) {
      return []
    }

    const filteredPage = filtered.slice(start, end)
    return filteredPage.map(post => post.toJSON())
  }

  static async getPost(id = 0) {
    const post = this.#posts.get(id)
    return post ? post.toJSON() : { status: 404, id: id, error: 'post not found' }
  }

  static async deletePost(id = 0, password = '') {
    const post = this.#posts.get(id)
    if (post === undefined) { return { status: 404, id: id, error: 'post not found' } }
    if (post.password !== password) { return { status: 401, id: id, error: 'incorrect password' } }

    this.#posts.delete(id)
    return { id: id }
  }

  static async createPost(schemes = {}) {
    const { title = '', writer = '', password = '', tags = [], size = 0, pixels = [] } = schemes
    const id = this.#id++
    const now = new Date().toISOString()
    const post = new Post({
      id: id,
      title: title.trim().length > 0 ? title : 'untitled',
      writer: writer.trim().length > 0 ? writer : 'anonymouse',
      password: password,
      tags: tags,
      size: size,
      pixels: pixels,
      createdAt: now,
      updatedAt: now,
    })

    this.#posts.set(id, post)

    return post.toJSON()
  }

  static async updatePost(id = 0, password = '', schemes = {}) {
    const post = this.#posts.get(id)
    if (post === undefined) {
      return { status: 404, id: id, error: 'post not found' }
    }
    if (post.password !== password) {
      return { status: 401, id: id, error: 'incorrect password' }
    }

    const {
      title = '',
      writer = '',
      tags = [],
      size = 0,
      pixels = []
    } = schemes

    const updated = post.toJSON()

    updated.title = title.trim().length > 0 ? title : updated.title
    updated.writer = writer.trim().length > 0 ? writer : updated.writer
    updated.tags = tags.length > 0 ? tags : updated.tags
    updated.size = size || updated.size
    updated.pixels = pixels.length > 0 ? pixels : updated.pixels
    updated.updatedAt = new Date().toISOString()

    const updatedPost = new Post(updated)
    this.#posts.set(id, updatedPost)

    return updatedPost.toJSON()
  }
}