export type Token =
  | { type: 'text'; value: string }
  | { type: 'token'; raw: string }

/**
 * Walk-based tokeniser for stored strings with [[raw]] dynamic value tokens.
 *
 * Rules:
 * - `\\` → escape next character (emit literal)
 * - `[[` → look for `]]`. If found with non-empty inner → token. Else literal.
 * - `[[]]` → literal text (empty inner not valid)
 * - Everything else → accumulate into text segment
 */
export function tokenise(input: string): Token[] {
  const tokens: Token[] = []
  let textBuffer = ''
  let i = 0

  const flushText = () => {
    if (textBuffer.length > 0) {
      tokens.push({ type: 'text', value: textBuffer })
      textBuffer = ''
    }
  }

  while (i < input.length) {
    // Escape sequence
    if (input[i] === '\\' && i + 1 < input.length) {
      const next = input[i + 1]
      // Only escape backslash and opening bracket sequences
      if (next === '\\' || (next === '[' && i + 2 < input.length && input[i + 2] === '\\' && i + 3 < input.length && input[i + 3] === '[')) {
        // \\[\\[ → literal [[
        if (next === '[' && i + 2 < input.length && input[i + 2] === '\\' && i + 3 < input.length && input[i + 3] === '[') {
          textBuffer += '[['
          i += 4
          continue
        }
        // \\\\ → literal \
        textBuffer += '\\'
        i += 2
        continue
      }
      // Not a recognised escape — emit both characters literally
      textBuffer += input[i]
      i += 1
      continue
    }

    // Token open
    if (input[i] === '[' && i + 1 < input.length && input[i + 1] === '[') {
      const start = i + 2
      const closeIndex = input.indexOf(']]', start)

      if (closeIndex !== -1 && closeIndex > start) {
        // Valid token with non-empty inner
        const raw = input.slice(start, closeIndex)
        flushText()
        tokens.push({ type: 'token', raw })
        i = closeIndex + 2
        continue
      }

      // No valid close or empty inner — literal text
      textBuffer += '['
      i += 1
      continue
    }

    // Regular character
    textBuffer += input[i]
    i += 1
  }

  flushText()
  return tokens
}
