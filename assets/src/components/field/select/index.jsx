import { 
  Item, 
  Section 
} from 'react-stately'

import { getOptions } from '../../../utils'

import Select from './Select'
import MultipleSelect from './MultipleSelect'

/**
 * Export used when initialized from a php functions, or inside a repeater
 * 
 * @see control-list.js
 */
 export default props => (
  props.multiple
    ? <MultipleSelect 
        items={ getOptions(props.choices ?? {}) } 
        { ...props }
      >
        { item => item.choices 
          ? <Section key={ item.value ?? '' } title={ item.label ?? '' } items={ item.choices ?? [] }>
              { item => <Item key={ item.value ?? '' }>{ item.label ?? '' }</Item> }
            </Section>
          : <Item key={ item.value ?? '' }>{ item.label ?? '' }</Item> }
      </MultipleSelect>
    : <Select 
        selectedKey={ props.value } 
        onSelectionChange={ props.onChange } 
        items={ getOptions(props.choices ?? {}) } 
        { ...props }
      >
        { item => item.choices 
          ? <Section key={ item.value ?? '' } title={ item.label ?? '' } items={ item.choices ?? [] }>
              { item => <Item key={ item.value ?? '' }>{ item.label ?? '' }</Item> }
            </Section>
          : <Item key={ item.value ?? '' }>{ item.label ?? '' }</Item> }
      </Select>
)
