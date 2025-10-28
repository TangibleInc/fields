import {
  indentWithTab,
  history,
  defaultKeymap,
  historyKeymap
} from '@codemirror/commands'

import {
  foldGutter,
  indentOnInput,
  indentUnit,
  bracketMatching,
  foldKeymap,
  syntaxHighlighting,
  defaultHighlightStyle
} from '@codemirror/language'

import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap
} from '@codemirror/autocomplete'

import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightSpecialChars,
  drawSelection,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLine,
  keymap,
  EditorView
} from '@codemirror/view'

import { EditorState } from '@codemirror/state'
import { highlightSelectionMatches } from '@codemirror/search'
import { html } from '@codemirror/lang-html'

/**
 * @see https://github.com/RPGillespie6/codemirror-quickstart/
 */
const createEditorState = (
  initialContents,
  onChange = false
) => {

  const extensions = [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    indentUnit.of("    "),
    indentOnInput(),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
      indentWithTab,
      ...closeBracketsKeymap,
      ...defaultKeymap,
      ...historyKeymap,
      ...foldKeymap,
      ...completionKeymap,
    ]),
    /**
     * We support only html color scheme for now as we added this component
     * for the editor, but we might want to support multiple languages in the
     * future
     */
    html(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    EditorView.updateListener.of(view => {
      if ( view.docChanged && onChange ) {
        onChange( view.state.doc.toString() )
      }
    }),
    EditorView.lineWrapping
  ]

  return EditorState.create({
    doc: initialContents,
    extensions
  })
}

const createEditorView = (state, parent) => (
  new EditorView({
    state,
    parent,
    lineWrapping: true
  })
)

export {
  createEditorState,
  createEditorView
}
