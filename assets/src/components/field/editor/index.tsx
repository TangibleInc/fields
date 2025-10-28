import ProseMirror from './prosemirror/Editor'
import TinyMce from './TinyMce.tsx'

export default props => {

  const { editor } = props

  if (editor === 'tinymce') {
    return <TinyMce {...props} />
  } else {
    return <ProseMirror {...props} />
  }
}
