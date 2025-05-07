import Post from './models/post.mjs'

export default class Database {
  static #posts = new Map()
  static #id = 1

  static getPosts(schemes = {}) {
    const { page = 1, pageSize = 10, keyword = '' } = schemes

    const all = Array.from(this.#posts.values())

    const filtered = keyword.trim() ? all.filter(
      post => {
        const { title, writer, tags } = post.toJSON()
        const lowerKeyword = keyword.toLowerCase()
        return (
          title.toLowerCase().includes(lowerKeyword) ||
          writer.toLowerCase().includes(lowerKeyword) ||
          tags.some(tag => tag.toLowerCase().includes(lowerKeyword))
        )
      }) : all

    const start = page * pageSize
    const end = start + pageSize
    const paged = pageSize > 0 ? filtered.slice(start, end) : filtered

    return paged.map(post => post.toJSON())
  }

  static createPost(schemes = {}) {
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
}