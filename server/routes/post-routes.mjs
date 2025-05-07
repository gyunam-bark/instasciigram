import Database from "../database.mjs";

export default class PostRoutes {
  static createPost({ title = '', writer = '', password = '', tags = [], size = 0, pixels = [] }) {
    try {
      return Database.createPost({ title, writer, password, tags, size, pixels })
    } catch (error) {
      throw new Error(`create post failed: ${error.message}`)
    }
  }

  static getPosts({ page = 0, pageSize = 0, keyword = '' }) {
    try {
      return Database.getPosts({ page, pageSize, keyword })
    } catch (error) {
      throw new Error(`get posts failed: ${error.message}`)
    }
  }

  static getPost({ id = 0 }) {
    try {
      return Database.getPost(id)
    } catch (error) {
      throw new Error(`get post failed: ${error.message}`)
    }
  }

  static updatePost({ id = 0, title = '', writer = '', password = '', tags = [], size = 0, pixels = [] }) {
    try {
      return Database.updatePost(id, password, { title, writer, tags, size, pixels })
    } catch (error) {
      throw new Error(`update post failed: ${error.message}`)
    }
  }

  static deletePost({ id = 0 }) {
    try {
      return Database.deletePost(id)
    } catch (error) {
      throw new Error(`delete post failed: ${error.message}`)
    }
  }
}