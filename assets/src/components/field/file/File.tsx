import { 
  useRef,
  useState,
  useEffect
 } from "react"

import { 
  useField,
  VisuallyHidden
 } from "react-aria"

import { 
  Button,
  Description, 
  Label
} from "../../base"
import { getConfig } from '../../../index.tsx'

import { postMedia } from "../../../requests/media"
import FilePreview from "./FilePreview"
import Notice from '../../base/notice/Notice'

/**
 * TODO:
 * - Better styling
 * - Possibility to use another preview component (keep current as default)
 */

const FileUpload = (props) => {
  const { mimetypes } = getConfig()
  const ref = useRef(null)

  const [file, setFile] = useState(false)
  const [loading, isLoading] = useState(false)
  const [uploads, setUploads] = useState(
    props.value
      ? Array.isArray(props.value)
        ? props.value
        : JSON.parse(props.value)
      : []
  )
  const [notice, setNotice] = useState(false)

  const { labelProps, fieldProps, descriptionProps } = useField(props)

  useEffect(() => props.onChange && props.onChange(uploads), [uploads])

  const placeholder = props.placeholder ?? "No file selected"
  const maxUpload = props.maxUpload ?? false

  const canUpload = () =>
    (maxUpload === false || uploads.length < maxUpload) &&
    !loading &&
    file !== false

  const canChooseFile = () =>
    (maxUpload === false || uploads.length < maxUpload) && !loading

  /**
   * We will upload the file with an ajax call, so that the value can just be
   * attachment ids
   *
   * That way, we won't have to deal with uploading files outside of the module
   */
  const upload = async () => {
    isLoading(true)
    setNotice(false)

    postMedia(file[0])
      .then(data => setUploads([...uploads, data.id]))
      .catch(data => setNotice(data.message))
      .finally(() => {
        setFile(false)
        isLoading(false)
      })
  }

  const removeUpload = (i) => {
    setUploads([...uploads.slice(0, i), ...uploads.slice(i + 1)])
  }

  const isWpMediaDisabled = () => 
    props.wp_media === false || props.wp_media === "false"

  const getAllowedTypes = () => {
    const { mimeTypes } = props;
    const mimeValues = Object.values(mimetypes);
    
    const filterByMimetypePrefix = (type) => type.includes('/')
      ? type
      : mimeValues.filter((val) => val.startsWith(`${type}/`))

    const allowedTypes = mimeTypes
      ? Array.isArray(mimeTypes)
        ? mimeTypes.flatMap(filterByMimetypePrefix)
        : filterByMimetypePrefix(mimeTypes)
      : mimeValues

    return allowedTypes.join(', ')
  }

  const open = () => {
    const media = wp.media({
      title: "Choose File",
      multiple: false,
      library: {
        type: getAllowedTypes(),
      },
    })

    media.on("select", () => {
      const chosenFile = media.state().get("selection").first().toJSON()
      setUploads([...uploads, chosenFile.id])
    })

    media.open()
  }

  return (
    <div className="tf-file">
      { props.label && 
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      <VisuallyHidden>
        <input
          type="file"
          ref={ref}
          accept={getAllowedTypes()}
          onChange={(e) => setFile(e.target.files)}
          {...fieldProps}
        />
      </VisuallyHidden>
      <div className="tf-file-container">
        <input
          type="hidden"
          name={props.name ?? ""}
          value={JSON.stringify(uploads)}
        />
        <ul className="tf-file-list">
          {uploads.map((upload, i) => (
            <FilePreview
              key={upload}
              id={upload}
              remove={() => removeUpload(i)}
            />
          ))}
        </ul>
        <div className="tf-file-field">
          <Button
            type="action"
            onPress={() => ( isWpMediaDisabled() ? ref.current.click() : open())}
            isDisabled={!canChooseFile()}
            aria-hidden="true"
          >
            {props.buttonText ?? "Choose"}
          </Button>
          <div className="tf-file-text" aria-hidden="true">
            {file.length > 0 ? file[0].name : placeholder}
          </div>
          { isWpMediaDisabled() && (
            <Button type="action" onPress={upload} isDisabled={!canUpload()}>
              {props.uploadText ?? "Upload"}
            </Button>
          )}
        </div>
      </div>
      {notice && (
        <Notice message={notice} type="error" onDismiss={() => setNotice(false)} />
      )}
      {props.description && (
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description>
      )}
    </div>
  )
}

export default FileUpload
