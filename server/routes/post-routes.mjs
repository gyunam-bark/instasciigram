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

  }

  static updatePost({ id = 0, title = '', writer = '', password = '', tags = [], size = 0, pixels = [] }) {

  }

  static deletePost({ id = 0 }) {

  }
}