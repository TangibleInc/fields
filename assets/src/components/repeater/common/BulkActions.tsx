import { 
  useState,
  useEffect 
} from 'react'

import { 
  Button,
  ConfirmTrigger 
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
      <Checkbox 
        label={ 'Select or unselect all items' }
        labelVisuallyHidden={ true }      
        value={ checkbox } 
        onChange={ setCheckbox } 
      />
      <Select
        label={ 'Select bulk action' }
        labelVisuallyHidden={ true }
        placeholder="Bulk actions"
        choices={ props.actions }
        value={ action }
        onChange={ setAction }
      />
      { action === 'deletion' 
        ? <ConfirmTrigger
            label="Apply"
            title="Remove selected items?"
            confirmText="Remove"
            buttonProps={{ type: 'action' }}
            onConfirm={ applyAction }
          >
            The selected items will be removed.
          </ConfirmTrigger>
        : <Button type="action" onPress={ applyAction }>
            Apply
          </Button> }
    </div>
  )
}

export default BulkActions
