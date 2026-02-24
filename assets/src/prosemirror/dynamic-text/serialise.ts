import { Node, Fragment } from 'prosemirror-model'
import { dynamicTextSchema } from './schema'
import { tokenise } from './tokenise'
import { generateId } from '../../utils/generate-id'

/**
 * Escaping policy for text content:
 * - Backslash is the escape prefix
 * - Escape `\` first, then `[[`
 */
function escapeText(text: string): string {
  return text.replaceAll('\\', '\\\\').replaceAll('[[', '\\[\\[')
}

/**
 * Unescape stored string back to display text:
 * - Unescape `\[\[` first, then `\\`
 */
function unescapeText(text: string): string {
  return text.replaceAll('\\[\\[', '[[').replaceAll('\\\\', '\\')
}

/**
 * Convert a stored string (with `[[raw]]` tokens) into a ProseMirror document.
 */
export function stringToDoc(value: string, singleLine?: boolean): Node {
  const schema = dynamicTextSchema

  // Normalise to single line if requested
  let input = value
  if (singleLine) {
    input = input.replace(/\n+/g, ' ')
  }

  // Split into lines (unless single-line, which produces exactly one)
  const lines = singleLine ? [input] : input.split('\n')

  const lineNodes = lines.map(lineStr => {
    const tokens = tokenise(lineStr)
    const inlineNodes: Node[] = []

    for (const token of tokens) {
      if (token.type === 'text') {
        const unescaped = unescapeText(token.value)
        if (unescaped.length > 0) {
          inlineNodes.push(schema.text(unescaped))
        }
      } else {
        inlineNodes.push(
          schema.nodes.dynamicValue.create({
            raw: token.raw,
            id: generateId(),
          })
        )
      }
    }

    return schema.nodes.line.create(null, Fragment.from(inlineNodes))
  })

  // Ensure at least one empty line
  if (lineNodes.length === 0) {
    lineNodes.push(schema.nodes.line.create())
  }

  return schema.nodes.doc.create(null, Fragment.from(lineNodes))
}

/**
 * Convert a ProseMirror document back to a stored string with `[[raw]]` tokens.
 */
export function docToString(doc: Node): string {
  const lineStrings: string[] = []

  doc.forEach(block => {
    let lineStr = ''

    block.forEach(child => {
      if (child.isText) {
        lineStr += escapeText(child.text ?? '')
      } else if (child.type.name === 'dynamicValue') {
        lineStr += `[[${child.attrs.raw}]]`
      }
    })

    lineStrings.push(lineStr)
  })

  return lineStrings.join('\n')
}
