import { Item } from 'react-stately'

import Select from './Select'

/**
 * Export used when initialized from a php functions, or inside a repeater
 * 
 * @see control-list.js
 */
 export default props => (
  <Select 
    selectedKey={ props.value } 
    onSelectionChange={ props.onChange } 
    { ...props }
  >
    { item => <Item key={ item.id }>{ item.name }</Item> }
  </Select>
)
