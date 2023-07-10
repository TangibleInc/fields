import {
  Decoration,
  EditorView,
  ViewPlugin, 
  MatchDecorator,
  WidgetType
} from '@codemirror/view'

import { dynamicValueRegex } from '../dynamic-values'

/**
 * Create code mirror example 
 */
const createInput = (
  element, 
  initialText = '', 
  onChange = false,
  sections = [],
  getLabel = (match, items) => (items[ match ] ?? match)
) => (
  new EditorView({
    doc: initialText,
    parent: element,
    extensions: [
      
      /**
       * Needed to display a string like [[this]] as a span element instead
       * 
       * @see DynamicString class below
       * @see https://codemirror.net/examples/decoration/ 
       */
      ViewPlugin.fromClass(class {

        constructor(view) {      
          this.items = getItemsObject(sections)
          this.placeholders = this.matchResults(this.items).createDeco(view)
        }
      
        update(update) {
          this.placeholders = this.matchResults(this.items).updateDeco(update, this.placeholders)
        }

        matchResults(items) {  
          return new MatchDecorator({
            regexp: dynamicValueRegex,
            decoration: (match, view, from) => Decoration.replace({
              widget: new DynamicString(
                match[1],
                getLabel(match[1], items),
                /**
                 * For deletions, insert can be omitted
                 * @see https://codemirror.net/examples/change/
                 */
                () => view.dispatch({
                  changes: {
                    from: from, 
                    to: from + match[1].length + 4 // value + delimiters
                  }
                })
              ),
            })
          })
        }
        
      },{
        decorations: instance => instance.placeholders,
        provide: plugin => EditorView.atomicRanges.of(view => (
          view.plugin(plugin)?.placeholders || Decoration.none
        ))
      }),

      /**
       * onChange callback
       * 
       * @see https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/11
       */
      EditorView.updateListener.of(view => {
        if( view.docChanged && onChange ) {
          onChange(view.state.doc.toString())
        } 
      }), 
      
      /**
       * @see https://discuss.codemirror.net/t/changing-the-font-size-of-cm6/2935/6
       */
      EditorView.theme({
        ".cm-scroller": {
          fontFamily: "inherit",
          alignItems: "center !important"
        },
        "&.cm-editor.cm-focused": {
          outline: "none"
        }
      })
    ]
  })
)

/**
 * Convert array of item or sections to an object, so that we can easily access the label 
 * associated to each value
 */
const getItemsObject = sections => {

  // If no section, it's already an object of choices
  if( ! Array.isArray(sections) ) return sections

  // Get all choices from each sections
  return sections.reduce(
    (accumulator, item) => ({
      ...accumulator, 
      ...(item.choices ?? {})
    }), {}
  )
}

class DynamicString extends WidgetType {

  constructor(value, label, onRemove) {
    super(value)

    this.value = value
    this.label = label
    this.onRemove = onRemove
  }

  toDOM() {

    const span = document.createElement('span')

    span.setAttribute('class', 'tf-dynamic-text-item')
    span.setAttribute('data-id', this.value)
    span.textContent = this.label
        
    const editButton = document.createElement('span')

    editButton.setAttribute('class', 'tf-dynamic-text-item-delete')
    editButton.addEventListener('click', this.onRemove)
    span.appendChild(editButton)
    
    return span
  }
}

export { 
  createInput
}

