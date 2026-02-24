import { Plugin } from 'prosemirror-state'
import { keymap } from 'prosemirror-keymap'
import { Slice, Fragment } from 'prosemirror-model'
import { NodeSelection } from 'prosemirror-state'

/**
 * Plugin for single-line mode. Four responsibilities:
 * 1. Suppress Enter (unless NodeSelection on dynamicValue — handled by caller)
 * 2. Flatten pasted content to single line
 * 3. Normalise doc to single block after any transaction
 * 4. Flatten dropped content
 */

interface SingleLineOptions {
  onEnterNodeSelection?: () => boolean
}

export function singleLinePlugins(options: SingleLineOptions = {}) {
  const enterKeymap = keymap({
    Enter: (state) => {
      // If NodeSelection on dynamicValue, delegate to caller (e.g. open modal)
      if (
        state.selection instanceof NodeSelection &&
        state.selection.node.type.name === 'dynamicValue' &&
        options.onEnterNodeSelection
      ) {
        return options.onEnterNodeSelection()
      }
      // Otherwise suppress
      return true
    },
  })

  const singleLinePlugin = new Plugin({
    props: {
      /**
       * Flatten pasted content to single line
       */
      transformPasted(slice) {
        const schema = slice.content.firstChild?.type.schema
        if (!schema) return slice

        const inlineNodes: any[] = []
        let needsSpace = false

        slice.content.forEach((block, _offset, index) => {
          block.forEach(child => {
            if (needsSpace && inlineNodes.length > 0) {
              // Add space between blocks
              const lastNode = inlineNodes[inlineNodes.length - 1]
              if (lastNode.isText) {
                inlineNodes[inlineNodes.length - 1] = schema.text(
                  lastNode.text + ' '
                )
              } else {
                inlineNodes.push(schema.text(' '))
              }
            }
            inlineNodes.push(child)
            needsSpace = false
          })
          needsSpace = true
        })

        if (inlineNodes.length === 0) return slice

        const line = schema.nodes.line.create(null, Fragment.from(inlineNodes))
        return new Slice(Fragment.from(line), slice.openStart, slice.openEnd)
      },

      /**
       * Flatten dropped content
       */
      handleDrop(view, event, slice) {
        if (!slice || slice.content.childCount <= 1) return false

        const schema = view.state.schema
        const inlineNodes: any[] = []
        let needsSpace = false

        slice.content.forEach(block => {
          block.forEach(child => {
            if (needsSpace && inlineNodes.length > 0) {
              inlineNodes.push(schema.text(' '))
            }
            inlineNodes.push(child)
            needsSpace = false
          })
          needsSpace = true
        })

        // Let ProseMirror handle the actual drop with our flattened content
        return false
      },
    },

    /**
     * Normalise: if doc has >1 block, merge all blocks into one.
     */
    appendTransaction(transactions, _oldState, newState) {
      const doc = newState.doc
      if (doc.childCount <= 1) return null

      const inlineNodes: any[] = []
      const schema = newState.schema

      doc.forEach((block, _offset, index) => {
        block.forEach(child => {
          inlineNodes.push(child)
        })
        // Add space between merged blocks (but not after last)
        if (index < doc.childCount - 1 && inlineNodes.length > 0) {
          const last = inlineNodes[inlineNodes.length - 1]
          if (last.isText) {
            inlineNodes[inlineNodes.length - 1] = schema.text(
              (last.text ?? '').trimEnd() + ' '
            )
          } else {
            inlineNodes.push(schema.text(' '))
          }
        }
      })

      // Collapse consecutive whitespace
      const cleaned: any[] = []
      for (const node of inlineNodes) {
        if (node.isText) {
          let text = node.text ?? ''
          text = text.replace(/\s{2,}/g, ' ')
          if (text.length > 0) {
            cleaned.push(schema.text(text))
          }
        } else {
          cleaned.push(node)
        }
      }

      // Trim leading space
      if (cleaned.length > 0 && cleaned[0].isText) {
        const trimmed = (cleaned[0].text ?? '').trimStart()
        if (trimmed.length === 0) {
          cleaned.shift()
        } else {
          cleaned[0] = schema.text(trimmed)
        }
      }

      // Trim trailing space
      if (cleaned.length > 0 && cleaned[cleaned.length - 1].isText) {
        const trimmed = (cleaned[cleaned.length - 1].text ?? '').trimEnd()
        if (trimmed.length === 0) {
          cleaned.pop()
        } else {
          cleaned[cleaned.length - 1] = schema.text(trimmed)
        }
      }

      const line = schema.nodes.line.create(null, Fragment.from(cleaned))
      const newDoc = schema.nodes.doc.create(null, Fragment.from(line))

      const tr = newState.tr.replaceWith(0, newState.doc.content.size, newDoc.content)

      // Place cursor at end
      tr.setSelection(
        newState.selection.constructor === NodeSelection
          ? newState.selection
          : (newState.selection as any).constructor.near(tr.doc.resolve(tr.doc.content.size - 1))
      )

      return tr
    },
  })

  return [enterKeymap, singleLinePlugin]
}
