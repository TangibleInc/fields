import { Fragment } from 'react'
import { VisuallyHidden } from 'react-aria'

const Label = ({ 
  labelProps, 
  parent,
  children
}) => {
  const Wrapper = parent?.labelVisuallyHidden ? VisuallyHidden : Fragment
  return(
    <Wrapper>
      <label className='tf-label' { ...labelProps }>
        { children }
      </label>
    </Wrapper>
  )
}

export default Label
