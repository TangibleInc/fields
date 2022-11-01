import { 
  useState, 
  useEffect 
} from 'react'

import {
  Item,
  Picker
} from '@adobe/react-spectrum'

const Select = props => {
    
  const [value, setValue] = useState(props.value ?? '')

  if( props.onChange ) {
    useEffect(() => props.onChange(value), [value])
  }
  
  return(
    <>
      <input type="hidden" name={ props.name } value={ value } />
      <Picker
        selectedKey={ value }
        name={ props.name ?? null }
        description={ props.description ?? null }
        placeholder={ props.placeholder ?? null }
        label={ props.label ?? null }
        items={ props.options ?? [] }
        onSelectionChange={ value => {
          console.log(value)
          setValue(value) 
        }}
      >
        { item => (<Item key={ item.name }>{ item.name }</Item>) }
      </Picker>
    </>
  )
}

export default Select
