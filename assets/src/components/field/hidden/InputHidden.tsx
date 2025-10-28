const InputHidden = props => (
  <input
    type="hidden"
    name={ props.name }
    value={ props.value }
    { ...props.attributes }
    className={ `tf-hidden ${props.class ?? ''} ${props.className ?? ''}` }
  />
)

export default InputHidden
