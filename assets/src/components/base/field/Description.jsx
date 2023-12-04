import { Fragment } from 'react'
import { VisuallyHidden } from 'react-aria'

const Description = ({ 
  descriptionProps, 
  parent,
  children
}) => {
  const Wrapper = parent?.descriptionVisuallyHidden ? VisuallyHidden : Fragment
  return(
    <Wrapper>
      <div className="tf-description" { ...descriptionProps }>
        { children }
      </div>
    </Wrapper>
  )
}

export default Description
