import { 
  useState,
  useEffect
} from 'react'

import { Button } from '../../base'
import { getMedia } from '../../../requests/media'

const FilePreview = props => {

  const [loaded, isLoaded] = useState(false)
  const [data, setData] = useState(false)

  useEffect(() => {

    const fetch = async () => {

      const data = await getMedia(props.id)

      setData(data)
      isLoaded(true)
    }

    fetch()
  }, [])

  if( ! loaded || ! data ) {
    return(
      <li className="tf-file-item">
        Loading...
      </li>
    )
  }

  const fileUrl = data.source_url
  const fileName = fileUrl.split('/').pop()
  const fileExtension = fileName.split('.').length === 2
    ? fileName.split('.')[1]
    : ''

  const title = data.title.rendered

  /**
   * The attachment title often already ends with the extension (file.csv),
   * add it again would give file.csv.csv
   */
  const displayName = fileExtension && ! title.toLowerCase().endsWith(`.${fileExtension.toLowerCase()}`)
    ? `${title}.${fileExtension}`
    : title

  return(
    <li className="tf-file-item">
      { data.media_type === 'image' &&
        <img
          loading="lazy"
          decoding="async"
          src={ fileUrl }
          alt={ data.alt_text }
          className="attachment-medium size-medium"
          /> }
      <span>{ displayName }</span>
      <Button type="danger" onPress={ () => props.remove() }>
        Remove
      </Button>
    </li>
  )
}

export default FilePreview
