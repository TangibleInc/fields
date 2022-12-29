import { 
  useRef,
  useState,
  useEffect
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
 * - Possibility to use another preview component (keep current as default)
 */

const FileUpload = props => {
  
  const { mimetypes } = TangibleFields
  
  const ref = useRef(null)

  const [file, setFile] = useState(false)
  const [loading, isLoading] = useState(false)
  const [uploads, setUploads] = useState(props.value 
    ? (Array.isArray(props.value) ? props.value : JSON.parse(props.value))
    : []
  )

  const {
    labelProps, 
    fieldProps,
    descriptionProps
  } = useField(props)
  
  useEffect(() => props.onChange && props.onChange(uploads), [uploads])
  
  const placeholder = props.placeholder ?? 'No file selected'
  const maxUpload = props.maxUpload ?? false

  const canUpload = () => (
    (maxUpload === false || uploads.length < maxUpload) && ! loading && file !== false
  )

  const canChooseFile = () => (
    (maxUpload === false || uploads.length < maxUpload) && ! loading
  )

  /**
   * We will upload the file with an ajax call, so that the value can just be
   * attachment ids
   * 
   * That way, we won't have to deal with uploading files outside of the module 
   */
  const upload = async () => {
    
    isLoading(true)

    const data = await postMedia(file[0])

    setFile(false)
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
    props.mimeTypes
      ? props.mimeTypes
      : Object.values(mimetypes)
  )

  return(
    <div class="tf-file">
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
      <div class="tf-file-container">
        <input type='hidden' name={ props.name ?? '' } value={ JSON.stringify(uploads) } />
        <ul class="tf-file-list">
          { uploads.map((upload, i) => (
            <FilePreview 
              key={ upload } 
              id={ upload } 
              remove={ () => removeUpload(i) } 
            />
          )) }
        </ul>
        <div class="tf-file-field">
          <Button 
            type='action' 
            onPress={ () => ref.current.click() } 
            isDisabled={ ! canChooseFile() } 
            aria-hidden="true"
          >
            { props.buttonText ?? 'Choose' }
          </Button>
          <div class="tf-file-text" aria-hidden="true">
            { file.length > 0 
              ? file[0].name
              : placeholder }
          </div>
          <Button type='action' onPress={ upload } isDisabled={ ! canUpload() }>
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
