import { 
  post, 
  get 
} from '.'

const postMedia = file => {

  const { api } = TangibleFields

  /**
   * @see https://gist.github.com/ahmadawais/0ccb8a32ea795ffac4adfae84797c19a 
   */

  const formData = new FormData()
	
  formData.append( 'file', file )
	formData.append( 'title', file.name )
	formData.append( 'caption', file.caption )

  return post(api.endpoint.media, formData)
}

const getMedia = id => {

  const { api } = TangibleFields
  
  return get(api.endpoint.media + id)
}

export {
  postMedia,
  getMedia
}
