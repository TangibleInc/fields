import {
  Decoration,
  EditorView,
  ViewPlugin, 
  MatchDecorator,
  WidgetType
} from '@codemirror/view'

/**
 * Create code mirror example 
 */
const createInput = (
  element, 
  initialText = '', 
  onChange = false,
  sections = []
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
      
        update(update){
          this.placeholders = this.matchResults(this.items).updateDeco(update, this.placeholders)
        }

        matchResults(items) {  
          return new MatchDecorator({
            regexp: /\[\[([A-zÀ-ú0-9_\- ][^\[\]]+)\]\]/g,
            decoration: match => Decoration.replace({
              widget: new DynamicString(
                match[1],
                items[ match[1] ] ?? match[1]
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

  constructor(slug, label) {
    super(slug)
    this.slug = slug
    this.label = label
  }

  toDOM() {

    const span = document.createElement('span')

    span.setAttribute('class', 'tf-dynamic-text-item')
    span.setAttribute('data-id', this.slug)
    span.textContent = this.label
    
    return span
  }

}

export { createInput }

