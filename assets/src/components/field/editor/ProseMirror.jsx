import { 
  useEffect,
  useRef, 
  useState
} from 'react'

import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import { Schema, DOMParser } from 'prosemirror-model'
import { schema } from 'prosemirror-schema-basic'
import { addListNodes } from 'prosemirror-schema-list'
import { exampleSetup } from 'prosemirror-example-setup'

import { useTextField } from 'react-aria'

import { 
  Label, 
  Description 
} from '../../base'

const ProseMirror = (props) => {
  const editorRef = useRef(null)
  const [value, setValue] = useState(props.value)

  const {
    labelProps,
    inputProps,
    descriptionProps,
  } = useTextField(props, editorRef)

  useEffect(() => {
    // Update local state when props.value changes
    setValue(props.value)
  }, [props.value])

  useEffect(() => props.onChange && props.onChange(value), [value])

  useEffect(() => {
    const mySchema = new Schema({
      nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
      marks: schema.spec.marks,
    })
  
    const plugins = exampleSetup({ schema: mySchema })
  
    const editorWrapper = document.createElement('div')
    const contentDiv = document.createElement('div')
    contentDiv.innerHTML = value
  
    editorWrapper.appendChild(contentDiv)
  
    const doc = DOMParser.fromSchema(mySchema).parse(contentDiv, { preserveWhitespace: true })
    const state = EditorState.create({ doc: doc, plugins: plugins })
  
    const editorView = new EditorView(editorRef.current, {
      state: state,
      dispatchTransaction: (transaction) => {
        const newState = editorView.state.apply(transaction)
        editorView.updateState(newState)
  
        const rendered = editorView.dom.innerHTML
        setValue(rendered)
      },
    })
  
    return () => editorView.destroy()
  }, [])
  
  return (
    <div className="tf-editor">
      {props.label &&
        <Label {...labelProps}>
          {props.label}
        </Label>}
      <input { ...inputProps } type="hidden" name={props.name} value={value} />
      <div ref={editorRef} />
      {props.description &&
        <Description {...descriptionProps}>
          {props.description}
        </Description>}
    </div>
  )

}

export default ProseMirror;
