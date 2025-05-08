export default class Validator {
  static #SIZES = [1, 2, 4, 8, 16, 32, 64]

  static #PATTERN = {
    DATE: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
    HEX: /^[0-9a-fA-F]{8}$/
  }

  static id(number = 0) {
    const key = 'id'
    this.#checkNumberRange(key, number, { min: 1 })

    return number
  }

  static title(string = '') {
    const key = 'title'

    this.#checkStringRange(key, string, { min: 0, max: 32 })

    return string
  }

  static writer(string = '') {
    const key = 'writer'

    this.#checkStringRange(key, string, { min: 0, max: 32 })

    return string
  }

  static password(string = '') {
    const key = 'password'

    this.#checkStringRange(key, string, { min: 0, max: 16 })

    return string
  }

  static size(number = 0) {
    const key = 'size'

    this.#checkEnums(key, number, this.#SIZES)

    return number
  }

  static tags(array = []) {
    const key = 'tags'

    this.#checkArray(key, array, { min: 0, max: 8, callback: this.tag.bind(this) })

    return array
  }

  static tag(string = '') {
    const key = 'tag'

    this.#checkStringRange(key, string, { min: 0, max: 16 })

    return string
  }

  static pixels(array = [], size = 1) {
    const key = 'pixels'

    this.#checkArray(key, array, { min: 1, max: size * size, callback: this.pixel.bind(this) })

    return array
  }

  static pixel(string = '') {
    const key = 'hex'

    this.#checkHex(key, string)

    return string
  }

  static createdAt(string = '') {
    const key = 'createdAt'

    this.#checkDate(key, string)

    return string
  }

  static updatedAt(string = '') {
    const key = 'updatedAt'

    this.#checkDate(key, string)

    return string
  }

  // ================
  // private
  // ================
  static #checkNumberRange(key = '', number = 0, options = {}) {
    const { min, max } = options

    if (typeof number !== 'number' || Number.isInteger(number) === false) {
      throw new Error(`invalid ${key}: must be a integer. received: ${number}`)
    }

    const minCondition = min !== undefined ? number < min : false
    const maxCondition = max !== undefined ? number > max : false

    if (minCondition || maxCondition) {
      const minLimit = min ?? 0
      const maxLimit = max ?? min
      throw new Error(`invalid ${key}: must be between ${minLimit} and ${maxLimit}. received: ${number}`)
    }
  }

  static #checkStringRange(key = '', string = '', options = {}) {
    const { min, max } = options

    if (typeof string !== 'string') {
      throw new Error(`invalid ${key}: must be a string. received: ${typeof string}`)
    }

    const trimmed = string.trim()
    const length = trimmed.length

    const minCondition = min !== undefined ? length < min : false
    const maxCondition = max !== undefined ? length > max : false

    if (minCondition || maxCondition) {
      const minLimit = min ?? 0
      const maxLimit = max ?? min
      throw new Error(`invalid ${key}: length must be between ${minLimit} and ${maxLimit}. received: ${string}(${length})`)
    }
  }

  static #checkEnums(key = '', value, enums = []) {
    if (Array.isArray(enums) === false) {
      throw new Error(`invalid ${key}: enum enums must be an array.`)
    }

    const referenceType = typeof enums[0]
    const valueType = typeof value

    if (valueType !== referenceType) {
      throw new Error(`invalid ${key}: type mismatch. expected ${referenceType}, received ${valueType}`)
    }

    if (enums.includes(value) === false) {
      throw new Error(`invalid ${key}: must be one of [${enums.join(', ')}]. received: ${value}`)
    }
  }

  static #checkArray(key = '', array = [], options = {}) {
    const { min, max, callback } = options

    if (Array.isArray(array) === false) {
      throw new Error(`invalid ${key}: must be a array. received: ${typeof array}`)
    }

    const length = array.length

    const minCondition = min !== undefined ? length < min : false
    const maxCondition = max !== undefined ? length > max : false

    if (minCondition || maxCondition) {
      const minLimit = min ?? 0
      const maxLimit = max ?? min
      throw new Error(`invalid ${key}: length must be between ${minLimit} and ${maxLimit}. received: ${key}[${length}]`)
    }

    if (typeof callback !== 'function') {
      throw new Error(`invalid ${key}: callback is not a function.`)
    }

    array.forEach((item) => callback(item))
  }

  static #checkHex(key = '', hex = '') {
    if (this.#PATTERN.HEX.test(hex) === false) {
      throw new Error(`invalid ${key}: must be 'rrggbbaa'. received: ${hex}`)
    }
  }

  static #checkDate(key = '', date = '') {

    if (typeof date !== 'string') {
      throw new Error(`invalid ${key}: must be a string. received: ${typeof date}`)
    }

    if (this.#PATTERN.DATE.test(date) === false) {
      throw new Error(`invalid ${key}: must be  "YYYY-MM-DDTHH:MM:SS.sssZ". received: ${date}`)
    }

    const parsed = Date.parse(date)
    if (isNaN(parsed) === true) {
      throw new Error(`invalid ${key}: failed to parse date. received: ${date}`)
    }
  }
}