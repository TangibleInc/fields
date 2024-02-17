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
  getLabel = (match, items) => (items[ match ] ?? match),
  config = {}
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
            handleMasking( view, config.inputMask )
          }
        }

        if( view.docChanged && onChange ) {
          console.log('sent to onChange')
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
      }),

      /**
       * Readonly mode
       * @see https://discuss.codemirror.net/t/codemirror-6-readonly-view/2333
       */
      EditorView.contentAttributes.of({ 
        contenteditable: ! (config.readOnly ?? false) 
      }),
    ]
  })
)

const handleMasking = ( view, mask ) => {

  // Initialize an array to store characters of the new value
  let value = view.state.doc.toString()
  let newValue = [];

  // Initialize counters
  let maskIndex = 0

  while ( maskIndex < mask.length ) {
    let maskChar = mask[maskIndex];

    switch (maskChar) {
      case 'a':
        // if (valueChar.match(/[a-zA-Z]/)) {
        //   newValue.push(valueChar);
        //   valueIndex++;
        // } else {
          newValue.push('_');
        // }
        break;
      default:
        newValue.push(maskChar);
        break;
    }

    maskIndex++;
  }

  if ( value !== newValue.join('') ) {
    view.view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: newValue.join('') },
      // selection: { anchor: head, head: head }
    });
  }


  // update.changes.iterChanges((from, _to, _fromB, toB) => {
  //
  // })
  // let { head } = update.state.selection.main;
  //
  // const newValue = applyMask( update, config.inputMask )
  // if ( newValue !== update.state.doc.toString() ) {
  //   console.log(newValue)
  //   update.view.dispatch({
  //     changes: { from: 0, to: update.state.doc.length, insert: newValue },
  //     // selection: { anchor: head, head: head }
  //   });
  // }
  //
  // // Initialize counters
  // let maskIndex, valueIndex;
  // maskIndex = valueIndex = 0;
  // // Traverse the mask
  // while ( maskIndex < mask.length && valueIndex < value.length ) {
  //   let maskChar = mask[maskIndex];
  //   let valueChar = value[valueIndex];
  //
  //   switch (maskChar) {
  //     // case '9':
  //     //   if (valueChar.match(/[0-9]/)) {
  //     //     newValue.push(valueChar);
  //     //     valueIndex++;
  //     //   } else {
  //     //     newValue.push('_');
  //     //   }
  //     //   break;
  //     // case '*':
  //     //   if (valueChar.match(/[a-zA-Z0-9]/)) {
  //     //     newValue.push(valueChar);
  //     //     valueIndex++;
  //     //   } else {
  //     //     newValue.push('_');
  //     //   }
  //     //   break;
  //   }
  //
  //
  // }
  //
  // // Add the remaining mask pattern, if there are any left
  // if ( maskIndex < mask.length ) {
  //   let remMask = mask.slice(maskIndex);
  //   remMask = remMask.replace(/9|a|\*/g, '_');
  //   newValue.push(remMask);
  // }
  //
  // update.changes.iterChanges((from,_to, _fromB, toB) => {
  //   let insertedText = update.state.doc.sliceString(from, toB)
  //   if ( update.state.doc.sliceString(from, toB) === '\n' ) {
  //
  //   }
  //
  //     console.log(update.state.doc.toString(), from, toB, insertedText, insertedText === '', insertedText === '\n')
  // });
  //
  // bbb-22 (6) => 99 (5) => aa9-9_ (dont move pointer of text)
  // aaa-99 (6) => aaa (3) => ___-__
  // aaa-99 (6) => a9 (1) =>
  // ___-__ (6) => a___-__ (7) =>
  // aa_-99 (6) => aaaa_-99 (8) =>
  // aaa-99 (6) => aaaaa-99 (9) =>
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
  createInput
}
