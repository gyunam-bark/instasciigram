export default class Parser {
  static #BYTE_MIN = 0
  static #BYTE_MAX = 255
  static #ASCII_LENGTH = 1

  static hexToRgba(hex = '') {
    const PATTERN_HEX = /^[0-9a-fA-F]{8}$/
    if (PATTERN_HEX.test(hex) === false) {
      throw new Error(`[error] invalid hex string. expected 8-digit hex like "RRGGBBAA". received: ${hex}`)
    }

    const red = parseInt(hex.slice(0, 2), 16)
    const green = parseInt(hex.slice(2, 4), 16)
    const blue = parseInt(hex.slice(4, 6), 16)
    const ascii = String.fromCharCode(parseInt(hex.slice(6, 8), 16))

    return { red, green, blue, ascii }
  }

  static rgbaToHex(red = 0, green = 0, blue = 0, ascii = '') {
    if (typeof red !== 'number' || red < this.#BYTE_MIN || red > this.#BYTE_MAX || !Number.isInteger(red)) {
      throw new Error(`[error] red must be an integer between ${this.#BYTE_MIN} and ${this.#BYTE_MAX}. received: ${red}`)
    }

    if (typeof green !== 'number' || green < this.#BYTE_MIN || green > this.#BYTE_MAX || !Number.isInteger(green)) {
      throw new Error(`[error] green must be an integer between ${this.#BYTE_MIN} and ${this.#BYTE_MAX}. received: ${green}`)
    }

    if (typeof blue !== 'number' || blue < this.#BYTE_MIN || blue > this.#BYTE_MAX || !Number.isInteger(blue)) {
      throw new Error(`[error] blue must be an integer between ${this.#BYTE_MIN} and ${this.#BYTE_MAX}. received: ${blue}`)
    }

    if (typeof ascii !== 'string' || ascii.length !== this.#ASCII_LENGTH) {
      throw new Error(`[error] ascii must be a single character string. received: ${ascii}`)
    }

    const asciiCharacter = ascii.charCodeAt(0)

    const hex = (
      Parser.byteToHex(red) +
      Parser.byteToHex(green) +
      Parser.byteToHex(blue) +
      Parser.byteToHex(asciiCharacter)
    ).toUpperCase()

    return hex
  }

  static byteToHex(byte) {
    return byte.toString(16).padStart(2, '0').toUpperCase()
  }
}