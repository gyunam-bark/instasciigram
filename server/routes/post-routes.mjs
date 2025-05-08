import Database from "../database.mjs";

export default class PostRoutes {
  static async createPost({ title = '', writer = '', password = '', tags = [], size = 0, pixels = [] }) {
    try {
      return await Database.createPost({ title, writer, password, tags, size, pixels })
    } catch (error) {
      throw new Error(`create post failed: ${error.message}`)
    }
  }

  static async getPosts({ page = 0, pageSize = 0, keyword = '' }) {
    try {
      return await Database.getPosts({ page, pageSize, keyword })
    } catch (error) {
      throw new Error(`get posts failed: ${error.message}`)
    }
  }

  static async getPost({ id = 0 }) {
    try {
      return await Database.getPost(id)
    } catch (error) {
      throw new Error(`get post failed: ${error.message}`)
    }
  }

  static async updatePost({ id = 0, title = '', writer = '', password = '', tags = [], size = 0, pixels = [] }) {
    try {
      return await Database.updatePost(id, password, { title, writer, tags, size, pixels })
    } catch (error) {
      throw new Error(`update post failed: ${error.message}`)
    }
  }

  static async deletePost({ id = 0, password = '' }) {
    try {
      return await Database.deletePost(id, password)
    } catch (error) {
      throw new Error(`delete post failed: ${error.message}`)
    }
  }
}