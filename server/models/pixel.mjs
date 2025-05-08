import Parser from "../utils/parser.mjs"

export default class Pixel {
  #red
  #green
  #blue
  #ascii

  constructor(hex = '') {
    try {
      const { red, green, blue, ascii } = Parser.hexToRgba(hex)

      this.#red = red
      this.#green = green
      this.#blue = blue
      this.#ascii = ascii

    } catch (error) { throw error }
  }

  get red() { return this.#red }
  get green() { return this.#green }
  get blue() { return this.#blue }
  get ascii() { return this.#ascii }

  toHex() {
    try {
      const hex = Parser.rgbaToHex(this.#red, this.#green, this.#blue, this.#ascii)
      return hex
    } catch (error) { throw error }
  }

  toRgba() {
    return {
      red: this.#red,
      green: this.#green,
      blue: this.#blue,
      ascii: this.#ascii
    }
  }

  static fromHex(hex = '') {
    try {
      const pixel = new Pixel(hex)
      return pixel
    } catch (error) { throw error }
  }

  static fromRgba(red, green, blue, ascii) {
    try {
      const hex = Parser.rgbaToHex(red, green, blue, ascii)
      return new Pixel(hex)
    } catch (error) { throw error }
  }
}