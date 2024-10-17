import { Fragment } from 'react'
import { VisuallyHidden } from 'react-aria'

const Description = ({ 
  descriptionProps, 
  parent,
  children,
  ...props
}) => {
  const Wrapper = parent?.descriptionVisuallyHidden ? VisuallyHidden : Fragment
  const content = props.content ?? children
 
  let classes = ''
  classes += Array.isArray( content ) && Array( content ).length ? 'tf-description-multiple-children' : ''
  
  return(
    <Wrapper>
      <div className={`tf-description ${ classes }`} { ...descriptionProps }>
        { content }
      </div>
    </Wrapper>
  )
}

export default Description
