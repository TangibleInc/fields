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

  return(
    <li className="tf-file-item">
      <span>{ data.title.rendered }</span>
      <Button type="upload-list" onPress={ () => props.remove() }>
        Remove
      </Button>
    </li>
  )
}

export default FilePreview
