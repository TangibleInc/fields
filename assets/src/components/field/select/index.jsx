import { getOptions } from '../../../utils'
import { RenderChoices } from '../../base'

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
        onChange={ props.onChange }
      >
        { RenderChoices }
      </MultipleSelect>
    : <Select 
        selectedKey={ props.value } 
        onSelectionChange={ props.onChange } 
        items={ getOptions(props.choices ?? {}) } 
        { ...props }
      >
        { RenderChoices }
      </Select>
)
