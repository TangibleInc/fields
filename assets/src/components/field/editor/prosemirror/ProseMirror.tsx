import {
  useEffect,
  useState,
  useRef,
  forwardRef
} from 'react'

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'

import {
  exampleSetup,
  buildMenuItems
} from 'prosemirror-example-setup'
import { types } from '../../../../index.tsx'

import CodeEditor from '../../code/Editor'

const ProseMirror = forwardRef(({
  rawView = true,
  ...props
}, ref) => {

  const [value, setValue] = useState(props.value ?? '')
  const [view, setView] = useState('visual')
  const editorView = useRef(null)

  const ButtonGroup = types.get('button-group')

  useEffect(() => {
    if ( props.onChange ) props.onChange(value)
  }, [value])

  useEffect(() => {

    const customSchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
      marks: schema.spec.marks,
    })

    const plugins = exampleSetup({
      schema      : customSchema,
      menuContent : buildMenuItems(customSchema).fullMenu
    })

    const editorWrapper = document.createElement('div')
    const contentDiv = document.createElement('div')
    contentDiv.innerHTML = value

    editorWrapper.appendChild(contentDiv)

    const doc = DOMParser.fromSchema(customSchema).parse(contentDiv, { preserveWhitespace: true })
    const state = EditorState.create({ doc, plugins })

    editorView.current = new EditorView(ref.current, {
      state: state,
      dispatchTransaction: transaction => {

        const newState = editorView.current.state.apply(transaction)
        editorView.current.updateState(newState)

        const rendered = editorView.current.dom.innerHTML
        setValue(rendered)
      },
    })

    return () => editorView.current.destroy()
  }, [view])

  return <div className="tf-editor-content">
    { rawView && <div className="tf-editor-view-toggle">
      <ButtonGroup
        label={ 'Switch view' }
        labelVisuallyHidden={ true }
        value={ view }
        onChange={ view => {
          setView(view)
          if ( view === 'raw' ) ref.current = null
        }}
        choices={{
          visual : 'Visual',
          raw    : 'Raw'
        }}
      />
    </div> }
    { view === 'visual'
      ? <div className="tf-editor-visual-view" ref={ ref } />
      : <CodeEditor value={ value } onChange={ setValue } />}
  </div>
})

export default ProseMirror
