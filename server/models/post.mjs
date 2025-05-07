import Validator from "../utils/validator.mjs"

export default class Post {
  #id
  #title
  #writer
  #password
  #tags
  #size
  #pixels
  #createdAt
  #updatedAt

  constructor({
    id = 0, title = '', writer = '',
    password = '', tags = [], size = 1,
    pixels = [], createdAt = '', updatedAt = ''
  }) {
    try {
      this.#id = Validator.id(id)
      this.#title = Validator.title(title)
      this.#writer = Validator.writer(writer)
      this.#password = Validator.password(password)
      this.#tags = Validator.tags(tags)
      this.#size = Validator.size(size)
      this.#pixels = Validator.pixels(pixels, this.#size)
      this.#createdAt = Validator.createdAt(createdAt)
      this.#updatedAt = Validator.updatedAt(updatedAt)

    } catch (error) {
      throw new Error(`failed create instance of post class: ${error}`)
    }
  }

  get id() { return this.#id }
  get title() { return this.#title }
  get writer() { return this.#writer }
  get password() { return this.#password }
  get tags() { return this.#tags }
  get size() { return this.#size }
  get pixels() { return this.#pixels }
  get createdAt() { return this.#createdAt }
  get updatedAt() { return this.#updatedAt }

  static fromJson(json) {
    return new Post(json)
  }

  toJSON() {
    return {
      id: this.#id,
      title: this.#title,
      writer: this.#writer,
      password: this.#password,
      tags: this.#tags,
      size: this.#size,
      pixels: this.#pixels,
      createdAt: this.#createdAt,
      updatedAt: this.#updatedAt
    }
  }
}