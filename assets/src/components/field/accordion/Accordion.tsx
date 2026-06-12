import {
  useState,
  useEffect
} from 'react'

import { Switch } from '../../field'
import { FieldGroup } from '..'
import { ExpandablePanel } from '../../base'
import { initJSON } from '../../../utils'

const Accordion = props => {

  /**
   * In some cases, we use a Accordion component but we
   * don't want the Accordion itself to hold a value
   */
  const uncontrolled = (props.uncontrolled ?? false) === true

  const [value, setValue] = useState(
    uncontrolled ? {} : initJSON(props.value)
  )

  useEffect(() => {
    if ( uncontrolled ) return;
    props.onChange && props.onChange(value)
  }, [value])

  const isEnabled = isEnabled => {
    setValue({
      ...value,
      enabled: isEnabled === true || isEnabled === 'on'
        ? 'on' : 'off'
    })
  }

  const headerLeft = ! uncontrolled && props.useSwitch
    ? <div onClick={ e => e.stopPropagation() }>
        <Switch
          value={ value.enabled ?? 'off' }
          onChange={ isEnabled }
          label={ 'Toggle accordion' }
          labelVisuallyHidden={ true }
        />
      </div>
    : null

  return(
    <div className='tf-accordion'>
      { ! uncontrolled &&
        <input
          type='hidden'
          name={ props.name ?? '' }
          value={ JSON.stringify( value ) }
        /> }
      <ExpandablePanel
        title={ props.title ?? false }
        headerLeft={ headerLeft }
        behavior={ uncontrolled ? 'hide' : 'remove' }
        isOpen={ props.isOpen ?? false }
      >
        <FieldGroup
          { ...props }
          name={ null }
          fields={ props.fields }
          value={ value }
          onChange={ setValue }
          uncontrolled={ uncontrolled }
        />
      </ExpandablePanel>
    </div>
  )
}

export default Accordion
