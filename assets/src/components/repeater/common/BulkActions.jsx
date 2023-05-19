import { 
  useState,
  useEffect 
} from 'react'

import { 
  Button,
  ModalTrigger 
} from '../../base'

import { 
  Checkbox,
  Select
} from '../../field'

/**
 * Currently this component is used only by the Block layout, but we might want 
 * to make it available table layout as well 
 */

const BulkActions = (props) => {

  const [action, setAction] = useState('')
  const [checkbox, setCheckbox] = useState(false)

  useEffect(() => {
    checkbox
      ? props.dispatch({ type : 'bulkCheck' })
      : props.dispatch({ type : 'bulkUncheck' })
  }, [checkbox])

  /**
   * @see ../dispatcher.js
   */
  const applyAction = () => {    
    switch(action) {
      case 'enabled':
      case 'disabled':
        props.dispatch({ 
          type     : 'bulkUpdate',
          control  : 'enabled',
          value    : action === 'enabled' ? 'on' : 'off',
          callback : () => {
            props.dispatch({ type : 'bulkUncheck' })
            setCheckbox(false)
          }
        })
        break;
      case 'deletion':
        props.dispatch({ 
          type     : 'bulkRemove',
          callback : () => {
            props.dispatch({ type : 'bulkUncheck' })
            setCheckbox(false)
          }
        })
        break;
    }
  }

  return(
    <div className='tf-repeater-bulk-actions'>
      <Checkbox value={ checkbox } onChange={ setCheckbox } />
      <Select
        placeholder="Bulk actions"
        choices={ props.actions }
        value={ action }
        onChange={ setAction }
      />
      { action === 'deletion' 
        ? <ModalTrigger 
            title="Confirmation"
            label="Apply"
            onValidate={ applyAction }
          >
            Are you sure you want to remove the selected items?
          </ModalTrigger>  
        : <Button type="action" onPress={ applyAction }>
            Apply
          </Button> }
    </div>
  )
}

export default BulkActions
