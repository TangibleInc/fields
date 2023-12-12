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
  const fileExtension = fileUrl.split('/').pop().split('.').length === 2
    ? fileUrl.split('/').pop().split('.')[1]
    : ''

  return(
    <li className="tf-file-item">
      { data.media_type === 'image' && <img
        loading="lazy" decoding="async"
        src={fileUrl} alt={data.alt_text}
        className="attachment-medium size-medium"
      />}
      <span>{`${data.title.rendered}${fileExtension !== '' ? '.' + fileExtension : ''}`}</span>
      <Button type="action" onPress={ () => props.remove() }>
        Remove
      </Button>
    </li>
  )
}

export default FilePreview
