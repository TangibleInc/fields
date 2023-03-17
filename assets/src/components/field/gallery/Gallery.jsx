import { 
  useState,
  useEffect
} from 'react'

import { useField } from 'react-aria'

import { 
  Button,
  Label,
  Description 
} from '../../base'

import ImagePreview from './ImagePreview'

/**
 * TODO: Find a way to only allows images  
 */

const Gallery = props => {

  const [value, setValue] = useState(
    props.value && Array.isArray(props.value)
      ? props.value
      : (props.value 
          ? props.value.split(',') 
          : [])
  )

  const { 
    labelProps, 
    inputProps, 
    descriptionProps, 
  } = useField(props)

  useEffect(() => props.onChange && props.onChange(value), [value])

  /**
   * Init and open media library modal
   */
  const open = () => {

    const media = wp.media({
      frame: 'post',
			multiple: true,
      button: {
        text: 'Use this media'
      },
      // @see https://wordpress.stackexchange.com/a/268597/190549 but dosen't seems to work anymore
      library: {
        type: [ 'image' ]
      },
      state: value.length < 1 ? 'gallery' : 'gallery-edit',
      selection: getSelection()
    })

    // Set state with selection when closing the modal
    media.on({
      update: selection => {
        setValue(selection.models.map(image => (image.id)))
      },
      open: () => {
        media.menuView.unset('playlist')
        media.menuView.unset('video-playlist')
      }
		}, this)
    
    media.open()
  }

  const getSelection = () => {
    
    const selection = wp.media.query({
      orderby: 'post__in',
      order: 'ASC',
      type: 'image',
      perPage: -1,
      post__in: value,
    })
  
    return new wp.media.model.Selection( selection.models, {
      props: selection.props.toJSON(),
      multiple: true,
    })
  }

  return(
    <div class="tf-gallery">
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <div class="tf-gallery-preview">
        { value.map(image => <ImagePreview key={ image } id={ image }/>) }
      </div>
      <div class="tf-gallery-buttons">
        <Button type="action" onPress={ open }>
          { value.length < 1 ? 'Create gallery' : 'Edit gallery' } 
        </Button>
        {
          value.length > 0 && (
            <Button type="action" onPress={ () => setValue([]) }>
              Clear gallery
            </Button>
          )
        }
      </div>

     
      <input type="hidden" name={ props.name ?? '' } value={ value.join(',') } { ...inputProps } />
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
}

export default Gallery
