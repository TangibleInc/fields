/**
 * Validate whether a text string matches a mask pattern.
 *
 * Mask characters:
 * - `9` → digit
 * - `a` → letter
 * - `*` → alphanumeric
 * - anything else → literal match
 *
 * Extracted from codemirror/index.ts for reuse with native <input>.
 */
export function matchesMask(text: string, mask: string): boolean {
  if (text.length !== mask.length) return false

  for (let i = 0; i < text.length; i++) {
    const maskChar = mask[i]
    const textChar = text[i]

    switch (maskChar) {
      case 'a':
        if (!/[a-zA-Z]/.test(textChar)) return false
        break
      case '9':
        if (!/[0-9]/.test(textChar)) return false
        break
      case '*':
        if (!/[a-zA-Z0-9]/.test(textChar)) return false
        break
      default:
        if (textChar !== maskChar) return false
        break
    }
  }

  return true
}

/**
 * Generate a placeholder string from a mask pattern.
 * Mask chars (9, a, *) become underscore; literals remain.
 */
export function maskToPlaceholder(mask: string): string {
  let placeholder = ''
  for (const char of mask) {
    placeholder += char === 'a' || char === '9' || char === '*' ? '_' : char
  }
  return placeholder
}
