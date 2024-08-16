import {
  useEffect,
  useRef,
  useState
} from 'react'

import {
  createEditorView,
  createEditorState
} from './create'

const Editor = props => {

  const [value, setValue] = useState(props.value ?? '')
  const element = useRef(null)
  const editor = useRef(null)

  useEffect(() => {
    if ( props.onChange ) props.onChange(value)
  }, [value])

  useEffect(() => {

    if ( editor.current ) return;

    const initialState = createEditorState( props.value ?? '', setValue)
    editor.current = createEditorView(initialState, element.current)
  }, [element.current])

  return (
    <div className="tf-code">
      <div className="tf-code-editor" ref={ element }>
      </div>
    </div>
  )
}

export default Editor
