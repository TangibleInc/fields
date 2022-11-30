import { 
  useRef,
  useState
} from 'react'

import { 
  useField,
  VisuallyHidden 
} from 'react-aria'

import { 
  Button,
  Description,
  Label
} from '../../base'

import { postMedia } from '../../../requests/media'
import FilePreview from './FilePreview'

/**
 * TODO:
 * - Better styling
 * - Limit update number
 * - Possibility to use another previw component (keep current as default)
 * - Support onChange props
 */

const FileUpload = (props) => {
  
  const { mimetypes } = TangibleFields
  
  const ref = useRef(null)

  const [file, setFile] = useState(false)
  const [uploads, setUploads] = useState(JSON.parse(props.value ?? ''))
  const [loading, isLoading] = useState(false)

  const {
    labelProps, 
    fieldProps,
    descriptionProps
  } = useField(props)
  
  const placeholder = props.placeholder ?? 'No file selected'

  /**
   * We will upload the file with an ajax call, so the field value can just be
   * attachment ids
   * 
   * That way, we won't have to deal directly uploading files outside of the module 
   */
  const upload = async () => {
    
    isLoading(true)

    const data = await postMedia(file[0])

    setFile([])
    setUploads([...uploads, data.id])
    isLoading(false)
  }  

  const removeUpload = i => {
    setUploads([
      ...uploads.slice(0, i),
      ...uploads.slice(i + 1)
    ])
  }

  const getAllowedTypes = () => (
    props.allowedTypes
      ? props.allowedTypes
      : Object.values(mimetypes)
  )

  return(
    <div class="tf-file-upload">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <VisuallyHidden>
        <input 
          type="file" 
          accept={ getAllowedTypes().join(', ') }
          ref={ ref }
          onChange={ e => setFile(e.target.files) } 
          { ...fieldProps }
        />
      </VisuallyHidden>
      <div class="tf-file-upload-container">
        <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(uploads) } />
        <ul class="tf-file-upload-list">
          { uploads.map((upload, i) => (
            <FilePreview 
              key={ upload } 
              id={ upload } 
              remove={ () => removeUpload(i) } 
            />
          )) }
        </ul>
        <div class="tf-file-upload-field">
          <Button type='action' onPress={ () => ref.current.click() } isDisabled={ loading } aria-hidden="true">
            { props.buttonText ?? 'Choose' }
          </Button>
          <div class="tf-file-upload-text" aria-hidden="true">
            { file.length > 0 
              ? file[0].name
              : placeholder }
          </div>
          <Button type='action' onPress={ upload } isDisabled={ loading }>
            { props.uploadText ?? 'Upload' }
          </Button>
        </div>
      </div>
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default FileUpload
