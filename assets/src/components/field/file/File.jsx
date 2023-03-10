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

import { postMedia } from "../../../requests/media"
import FilePreview from "./FilePreview"

/**
 * TODO:
 * - Better styling
 * - Possibility to use another preview component (keep current as default)
 */

const FileUpload = (props) => {
  const { mimetypes } = TangibleFields
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

    const data = await postMedia(file[0])

    setFile(false)
    setUploads([...uploads, data.id])
    isLoading(false)
  }

  const removeUpload = (i) => {
    setUploads([...uploads.slice(0, i), ...uploads.slice(i + 1)])
  }

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
    <div class="tf-file">
      {props.label && <Label {...labelProps}>{props.label}</Label>}
      <VisuallyHidden>
        <input
          type="file"
          ref={ref}
          accept={getAllowedTypes()}
          onChange={(e) => setFile(e.target.files)}
          {...fieldProps}
        />
      </VisuallyHidden>
      <div class="tf-file-container">
        <input
          type="hidden"
          name={props.name ?? ""}
          value={JSON.stringify(uploads)}
        />
        <ul class="tf-file-list">
          {uploads.map((upload, i) => (
            <FilePreview
              key={upload}
              id={upload}
              remove={() => removeUpload(i)}
            />
          ))}
        </ul>
        <div class="tf-file-field">
          <Button
            type="action"
            onPress={() => (props.wp_media ? open() : ref.current.click())}
            isDisabled={!canChooseFile()}
            aria-hidden="true"
          >
            {props.buttonText ?? "Choose"}
          </Button>
          <div class="tf-file-text" aria-hidden="true">
            {file.length > 0 ? file[0].name : placeholder}
          </div>
          { !props.wp_media && (
            <Button type="action" onPress={upload} isDisabled={!canUpload()}>
              {props.uploadText ?? "Upload"}
            </Button>
          )}
        </div>
      </div>
      {props.description && (
        <Description {...descriptionProps}>{props.description}</Description>
      )}
    </div>
  )
}

export default FileUpload
