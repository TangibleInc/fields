import { Plugin } from 'prosemirror-state'
import { Slice, Fragment, Node } from 'prosemirror-model'
import { generateId } from '../../../utils/generate-id'

/**
 * Deduplicates dynamicValue IDs on paste.
 * When pasted content contains dynamicValue nodes, all their IDs are rewritten
 * to fresh values via generateId(). This prevents copy-paste from creating
 * two pills with the same ID.
 */
export function dedupIdsPlugin() {
  return new Plugin({
    props: {
      transformPasted(slice) {
        const newContent = rewriteIds(slice.content)
        return new Slice(newContent, slice.openStart, slice.openEnd)
      },
    },
  })
}

function rewriteIds(fragment: Fragment): Fragment {
  const nodes: Node[] = []

  fragment.forEach(node => {
    if (node.type.name === 'dynamicValue') {
      nodes.push(
        node.type.create(
          { ...node.attrs, id: generateId() },
          node.content,
          node.marks
        )
      )
    } else if (node.content.size > 0) {
      nodes.push(node.copy(rewriteIds(node.content)))
    } else {
      nodes.push(node)
    }
  })

  return Fragment.from(nodes)
}
