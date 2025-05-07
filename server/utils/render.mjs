export default class Render {
  static pixelToColoredSpanTag(hex) {
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const charCode = parseInt(hex.slice(6, 8), 16)
    const char = String.fromCharCode(charCode)

    return `<span style="color: rgb(${r},${g},${b})">${char}</span>`
  }

  static pixelsToColoredHtmlCode(pixels, size) {
    const coloredChars = pixels.map(this.pixelToColoredSpanTag)
    const lines = []

    for (let i = 0; i < coloredChars.length; i += size) {
      const row = coloredChars.slice(i, i + size).join('')
      lines.push(row)
    }

    return lines.join('<br>')
  }
}