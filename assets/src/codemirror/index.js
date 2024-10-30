import {
  Decoration,
  EditorView,
  ViewPlugin,
  MatchDecorator,
  WidgetType,
  placeholder
} from '@codemirror/view'

import { EditorState } from '@codemirror/state'
import { dynamicValueRegex } from '../dynamic-values'

/**
 * Create code mirror example
 */
const createInput = (
  element,
  initialText = '',
  onChange = false,
  sections = [],
  getLabel = (match, items) => (items[ match ] ?? match),
  config = {},
  customPlaceholder = ''
) => (
  new EditorView({
    doc: initialText,
    parent: element,
    extensions: [
      placeholder(customPlaceholder),
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
                }),
                config
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
        if ( config.inputMask ) {
          if ( view.focusChanged ) {
            if ( view.state.doc.toString().includes('_') ) {
              view.view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: '' } });
            } else if ( view.state.doc.toString().length === 0 && view.view.hasFocus ) {
              handleMasking( view, config.inputMask )
            }
          } else if ( view.docChanged && view.view.hasFocus ) {
            if ( handleMasking( view, config.inputMask ) ) return
          }
        }
        if( view.docChanged && onChange ) onChange(view.state.doc.toString())
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
      }),

      /**
       * Readonly mode
       * @see https://codemirror.net/docs/ref/#state.EditorState.readOnly
       * @see https://discuss.codemirror.net/t/codemirror-6-readonly-view/2333
       */
      EditorState.readOnly.of(config.readOnly ?? false),
      EditorView.contentAttributes.of({
        contenteditable: ! (config.readOnly ?? false)
      }),
    ]
  })
)

var processedValue = false
const handleMasking = ( view, mask ) => {

  if ( view.state.doc.toString().length === 0 ) {
    let placeholder = ''
    for ( const char of mask ) {
      placeholder += ( char === 'a' || char === '9' || char === '*' ) ? '_' : char
    }
    view.view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: placeholder } });

  } else {
    if ( view.startState.doc.toString() === '' || processedValue ) {
      processedValue = false
      return false
    }

    const newValue = view.startState.doc.toString().split('')
    let lastEnd
    view.changes.iterChanges(( fromA, toA, fromB, toB) => {
      const changes = view.state.doc.sliceString(fromB, toB).split('')
      let end = Math.min( Math.max( toA, toB ), newValue.length )
      let maskIndex = Math.min(fromA, fromB)
      lastEnd = changes.length > 0 ? end : maskIndex
      let changeIndex = 0

      let matchEnd = false
      while ( maskIndex !== end ) {
        let maskChar = mask[maskIndex]
        let newChar = changes[changeIndex];

        switch (maskChar) {
          case 'a':
            if ( newChar && newChar.match(/[a-zA-Z]/) ) {
              newValue[maskIndex] = newChar
              changeIndex += 1
            } else {
              newValue[maskIndex] = '_'
              if ( !matchEnd ) {
                matchEnd = true
                lastEnd = maskIndex
              }
            }
            break
          case '9':
            if ( newChar && newChar.match(/[0-9]/) ) {
              newValue[maskIndex] = newChar
              changeIndex += 1
            } else {
              newValue[maskIndex] = '_'
              if ( !matchEnd ) {
                matchEnd = true
                lastEnd = maskIndex
              }
            }
            break
          case '*':
            if ( newChar && newChar.match(/[a-zA-Z0-9]/) ) {
              newValue[maskIndex] = newChar
              changeIndex += 1
            } else {
              newValue[maskIndex] = '_'
              if ( !matchEnd ) {
                matchEnd = true
                lastEnd = maskIndex
              }
            }
            break
          default:
            newValue[maskIndex] = maskChar
            break
        }
        maskIndex += 1
      }
    })

    processedValue = true
    view.view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: newValue.join('') },
      selection: { anchor: lastEnd, head: lastEnd }
    });
    return true
  }
}

const matchesMask = ( text, mask ) => {
  if ( text.length !== mask.length ) return false

  for ( let i = 0; i < text.length; i++ ) {
    let maskChar = mask[i]
    let textChar = text[i];

    switch ( maskChar ) {
      case 'a':
        if ( !textChar.match(/[a-zA-Z]/) ) return false
        break
      case '9':
        if ( !textChar.match(/[0-9]/) ) return false
        break
      case '*':
        if ( !textChar.match(/[a-zA-Z0-9]/) ) return false
        break
      default:
        if ( textChar !== maskChar ) return false
        break
    }
  }

  return true
}

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

  constructor(value, label, onRemove, config) {
    super(value)

    this.value = value
    this.label = label
    this.onRemove = onRemove
    this.config = config
  }

  toDOM() {

    const span = document.createElement('span')

    span.setAttribute('class', 'tf-dynamic-text-item')
    span.setAttribute('data-id', this.value)
    span.textContent = this.label

    if( this.config?.readOnly === true ) return span;

    const editButton = document.createElement('span')

    editButton.setAttribute('class', 'tf-dynamic-text-item-delete')
    editButton.addEventListener('click', this.onRemove)
    span.appendChild(editButton)

    return span
  }
}

export {
  createInput, matchesMask
}
