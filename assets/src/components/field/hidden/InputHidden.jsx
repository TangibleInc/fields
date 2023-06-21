const InputHidden = props => (
  <input
    type="hidden"
    name={ props.name }
    value={ props.value }
    { ...props.attributes }
  />
)

export default InputHidden