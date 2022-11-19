import {
  Decoration,
  EditorView,
  ViewPlugin, 
  MatchDecorator,
  WidgetType
} from '@codemirror/view'

/**
 * @see https://codemirror.net/examples/decoration/ 
 */

class DynamicString extends WidgetType {

  constructor(slug) {
    super(slug)
    this.slug = slug
  }

  toDOM() {
    const span = document.createElement('span')
    span.setAttribute('style', 'border: 1px grey solid; padding: 2px 5px')
    span.textContent = this.slug
    return span
  }
}

/**
 * Apply decoration on string like [[this]]
 */
const placeholderMatcher = new MatchDecorator({
  regexp: /\[\[([A-zÀ-ú0-9_\- ][^\[\]]+)\]\]/g,
  decoration: match => Decoration.replace({
    widget: new DynamicString(match[1]),
  })
})

const dynamicString = ViewPlugin.fromClass(class {

  constructor(view) {
    this.placeholders = placeholderMatcher.createDeco(view)
  }

  update(update) {
    this.placeholders = placeholderMatcher.updateDeco(update, this.placeholders)
  }
  
},{
  decorations: instance => instance.placeholders,
  provide: plugin => EditorView.atomicRanges.of(view => (
    view.plugin(plugin)?.placeholders || Decoration.none
  ))
})

/**
 * Create code mirror example 
 */
const createInput = (
  element, 
  initialText = '', 
  onChange = false
) => (
  
  new EditorView({
    doc: initialText,
    parent: element,
    extensions: [
      dynamicString,

      /**
       * onChange callback
       * 
       * @see https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/11
       */
      EditorView.updateListener.of(v => {
        if( v.docChanged && onChange ) {
          onChange(v.state.doc.toString())
        } 
      })
      
    ]
  })
)

export default createInput

