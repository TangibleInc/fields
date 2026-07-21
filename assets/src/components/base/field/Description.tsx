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
      <div className="tf-description tui-field__helper" { ...descriptionProps }>
        { content }
      </div>
    </Wrapper>
  )
}

export default Description
