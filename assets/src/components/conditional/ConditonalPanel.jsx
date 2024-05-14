import { 
  useState, 
  useEffect,
  Fragment
} from 'react'

import { 
  uniqid, 
  initJSON,
  deepCopy
} from '../../utils'

import { 
  Button, 
  ModalTrigger
} from '../base/'

import ConditionGroup from './ConditionGroup'

const ConditionalPanel = props => {
  
  const emptyRow = () => ({ 
    key: uniqid(), 
    data: [{ key: uniqid(), operator: '_eq' }]
  })

  /**
   * If no modal, saved value is not used
   * 
   * When we use the modal however, we need both state as change can be discared when
   * closing the modal
   */
  const initialValue = () => initJSON(props.value ?? '', [ emptyRow() ]) 
  const [savedValue, setSavedValue] = useState( initialValue() )
  const [value, setValue] = useState( initialValue() )

  useEffect(() => {
    props.onChange && props.onChange(props.useModal ? savedValue : value)
  }, [props.useModal ? savedValue : value])

  /**
   * Auto remove groups when no group when empty, unless it's the last one
   */
  useEffect(() => {
    if( value.length === 1 ) return;
    const groups = value.filter(group => group.data.length !== 0)
    if( groups.length !== value.length ) setValue([ ...groups ])
  }, [value])

  const insertGroup = position => setValue([
    ...value.slice(0, position),
    emptyRow(),
    ...value.slice(position)
  ])

  const updateGroup = (groupValue, i) => {
    const updatedValue = value
    updatedValue[i].data = groupValue
    setValue([ ...updatedValue ])
  }

  const Wrapper = props.useModal ? ModalTrigger : Fragment
  const wrapperProps = props.useModal 
    ? { 
        title       : 'Conditional rules', 
        label       : 'Open conditional panel',
        confirmText : 'Save',
        onCancel    : () => {
          setValue([ ...deepCopy(savedValue) ])
        },
        onValidate  : () => {
          setSavedValue([ ...deepCopy(value) ])
        },
      } 
    : {}

  return(
    <>
      <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(props.useModal ? savedValue : value) } />
      <div className="tf-label" >{ props.label ?? '' }</div>
      <Wrapper { ...wrapperProps }>
        <div className="tf-conditional-panel">
          <div className="tf-conditional-panel-container">
            <div className="tf-conditional-groups">
              { value.map((group, i) => (
                <div key={ group.key } className="tf-conditional-group">
                  <ConditionGroup 
                    canDelete={ value.length !== 1 || group.data.length !== 1 }
                    value={ group.data } 
                    onChange={ value => updateGroup(value, i) } 
                  />
                  <div className="tf-conditional-group-actions">
                    <strong>Or</strong>
                    <Button type="primary" onPress={ () => insertGroup(i + 1) }>
                      Add group
                    </Button>
                  </div>
                </div>
              )) }
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  )
}

export default ConditionalPanel
