import { forwardRef } from 'react'
import { Radio as TuiRadio } from '@tangible/ui'

export interface FieldsRadioProps {
  value: string
  children?: React.ReactNode
  isDisabled?: boolean
  className?: string
  id?: string
}

const Radio = forwardRef<HTMLButtonElement, FieldsRadioProps>((props, ref) => {

  const {
    value,
    children,
    isDisabled,
    className,
  } = props

  return (
    <TuiRadio
      ref={ref}
      value={value}
      label={children}
      disabled={Boolean(isDisabled)}
      className={className}
    />
  )
})

export default Radio
