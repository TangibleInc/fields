import { Plugin } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

/**
 * Placeholder plugin — shows placeholder text when doc is empty.
 * "Empty" means zero text content AND zero atom nodes.
 */
export function placeholderPlugin(text: string, readOnly?: boolean) {
  if (!text || readOnly) {
    return new Plugin({})
  }

  return new Plugin({
    props: {
      decorations(state) {
        const doc = state.doc
        let hasContent = false

        doc.descendants(node => {
          if (node.isText || node.isAtom) {
            hasContent = true
            return false // stop traversal
          }
        })

        if (hasContent) return DecorationSet.empty

        const placeholder = document.createElement('span')
        placeholder.className = 'tf-dt-placeholder'
        placeholder.textContent = text
        placeholder.setAttribute('contenteditable', 'false')

        return DecorationSet.create(doc, [
          Decoration.widget(1, placeholder, { side: -1 }),
        ])
      },
    },
  })
}
