import { Plugin } from 'prosemirror-state'
import { NodeSelection } from 'prosemirror-state'

/**
 * When a dynamicValue node is selected (NodeSelection) and the user types
 * a printable character, replace the pill with that character.
 * Also handles paste replacing selected pills.
 */
export function replaceOnTypePlugin() {
  return new Plugin({
    props: {
      handleKeyDown(view, event) {
        const { state } = view
        if (!(state.selection instanceof NodeSelection)) return false
        if (state.selection.node.type.name !== 'dynamicValue') return false

        // Ignore modifier keys, navigation, function keys, etc.
        if (
          event.ctrlKey ||
          event.metaKey ||
          event.altKey ||
          event.key.length !== 1
        ) {
          return false
        }

        const { from, to } = state.selection
        const tr = state.tr.replaceWith(from, to, state.schema.text(event.key))
        view.dispatch(tr)
        return true
      },

      handlePaste(view, _event, slice) {
        const { state } = view
        if (!(state.selection instanceof NodeSelection)) return false
        if (state.selection.node.type.name !== 'dynamicValue') return false

        const { from, to } = state.selection
        const tr = state.tr.replaceRange(from, to, slice)
        view.dispatch(tr)
        return true
      },
    },
  })
}
