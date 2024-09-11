import { 
  useState, 
  useEffect
} from 'react'

import { 
  getOptions, 
  initJSON 
} from '../../../utils'

import { getAsyncProps } from './async'
import { RenderChoices } from '../../base'

import ComboBox from './ComboBox'
import MultipleComboBox from './MultipleComboxBox'

/**
 * Export used when initialized from a php function, or inside a repeater
 * 
 * The data returned by the ComboBox component is different according to the type of list (async or not)
 * 
 * A regular combox box return just the value (or a comma separated list a value if multiple)
 * but the async combox return an object with the value and the label for each element
 * 
 * @see control-list.js
 */
export default props => {
  
  const [value, setValue] = useState(
    props.isAsync
      ? initJSON(props.value ?? '')
      : props.value ?? false
  )

  /**
   * getAsyncProps init the useAsyncList() hook
   * 
   * It's OK to use it inside a condition because the value of props.isAsync will never change  
   */
  const itemProps = props.isAsync
    ? getAsyncProps(props)
    : {
      defaultItems: getOptions(props.choices ?? {})
    }

  useEffect(() => props.onChange && props.onChange(value), [value])
  useEffect(() => props.onChange && props.onChange(value), [itemProps.selectedKeys])

  if( props.multiple ) {
    return(
      <>
        <input 
          type="hidden" 
          name={ props.name ?? '' } 
          value={ props.isAsync ? JSON.stringify(value) : value } 
        />
        <MultipleComboBox 
          { ...props }
          onChange={ values => setValue(props.isAsync ? values : values.join(',')) }
          value={ value }
        >
          { RenderChoices }
        </MultipleComboBox>
      </>
    )
  }

  return(
    <>
      <input 
        type="hidden" 
        name={ props.name ?? '' } 
        value={ props.isAsync ? JSON.stringify(value) : value } 
      />
      <ComboBox 
        focusStrategy={ 'first' }
        label={ props.label ?? null }
        placeholder={ props.placeholder }
        description={ props.description ?? false }
        selectedKey={ value } 
        onSelectionChange={ setValue }
        onFocusChange={ props.onFocusChange ?? false }
        autoFocus={ props.autoFocus ?? false }
        isAsync={ props.isAsync ?? false }
        showButton={ props.showButton ?? true }
        menuTrigger="focus"
        labelVisuallyHidden={ props.labelVisuallyHidden ?? false }
        descriptionVisuallyHidden={ props.descriptionVisuallyHidden ?? false }
        disabledKeys={ props.disabledKeys ?? [] }
        readOnly={ props.readOnly ?? false }
        { ...itemProps }
      >
        { RenderChoices }
      </ComboBox>
    </>  
  )
}
