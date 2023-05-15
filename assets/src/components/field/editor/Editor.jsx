import ProseMirror from './ProseMirror.jsx';
import TinyMce from './TinyMce.jsx';

const Editor = (props) => {
  const { editor } = props;

  if (editor === 'tinymce') {
    return <TinyMce {...props} />;
  } else {
    return <ProseMirror {...props} />;
  }
  
}

export default Editor;