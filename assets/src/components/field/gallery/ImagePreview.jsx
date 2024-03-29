import { 
  useState,
  useEffect
} from 'react'

import { getMedia } from '../../../requests/media'

/**
 * TODO: Have common preview components shared between gallery and file upload 
 */

const ImagePreview = props => {

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
      <div className="tf-gallery-item">
        Loading...
      </div>
    )
  }

  return(
    <div className="tf-gallery-item">
      <img src={ data.source_url } />
    </div>
  )
}

export default ImagePreview
