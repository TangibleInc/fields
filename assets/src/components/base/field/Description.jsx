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
  return(
    <Wrapper>
      <div className="tf-description" { ...descriptionProps }>
        { content }
      </div>
    </Wrapper>
  )
}

export default Description
