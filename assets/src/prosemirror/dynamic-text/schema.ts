import { Schema } from 'prosemirror-model'
import { generateId } from '../../utils/generate-id'

const dynamicTextSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    line: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'div.tf-dt-line' }],
      toDOM: () => ['div', { class: 'tf-dt-line' }, 0] as const,
    },
    text: { group: 'inline', inline: true },
    dynamicValue: {
      group: 'inline',
      inline: true,
      atom: true,
      selectable: true,
      draggable: false,
      isolating: true,
      attrs: {
        raw: { default: '' },
        id: { default: '' },
      },
      toDOM: node =>
        [
          'span',
          {
            'data-dynamic-value': node.attrs.raw,
            'data-dynamic-id': node.attrs.id,
          },
        ] as const,
      parseDOM: [
        {
          tag: 'span[data-dynamic-value]',
          getAttrs: (dom: HTMLElement) => ({
            raw: dom.getAttribute('data-dynamic-value'),
            id: dom.getAttribute('data-dynamic-id') ?? generateId(),
          }),
        },
      ],
    },
  },
  marks: {},
})

export { dynamicTextSchema }
