import { Fragment } from 'react'
import { VisuallyHidden } from 'react-aria'

const Label = ({ 
  labelProps, 
  parent,
  children,
  ...props
}) => {
  const Wrapper = parent?.labelVisuallyHidden ? VisuallyHidden : Fragment
  const content = props.content ?? children
  return(
    <Wrapper>
      <label className='tf-label' { ...labelProps } htmlFor={ parent?.name ?? '' }>
        { content }
      </label>
    </Wrapper>
  )
}

export default Label
