import { useState } from 'react'

import { 
  Button, 
  ModalTrigger,
  ExpandablePanel 
} from '../../../base'

import { Checkbox, Switch } from '../../../field'
import { isDependentString } from '../../../dependent/utils'
import BulkActions from '../../common/BulkActions'

const Block = ({
  items,
  dispatch,
  rowFields,
  renderItem,
  maxLength,
  title = false,
  useSwitch,
  useBulk,
  name
}) => {

  const [activeItem, setActiveItem] = useState(0)
  const toggleItem = i => setActiveItem( i !== activeItem ? i : false )

  const bulkOptions = { 'deletion': 'Delete' }

  if ( useSwitch ) {
    bulkOptions['enabled'] = 'Enabled'
    bulkOptions['disabled'] = 'Disabled'
  }

  const getHeaderLeft = (item, i) => {
    return (
      <>
        {
          useBulk
          ? <div onClick={ e => e.stopPropagation() }>
              <Checkbox
                label={ `Select item ${i + 1}` }
                labelVisuallyHidden={ true }
                value={ item._bulkCheckbox }
                onChange={ value => dispatch({ 
                  type    : 'update',
                  item    : i,
                  control : '_bulkCheckbox',
                  value   : value
                }) } 
              />
            </div>  
          : null
        }
        { 
          useSwitch
          ? <div onClick={ e => e.stopPropagation() }>
              <Switch 
                label={ `Enable item ${i + 1}` }
                labelVisuallyHidden={ true }
                value={ item.enabled }
                onChange={ value => dispatch({ 
                  type    : 'update',
                  item    : i,
                  control : 'enabled',
                  value   : value
                }) }
              />
            </div>  
          : null 
        }
      </>
    ) 
  }

  const actions = (i, item) => (
     <> 
      { maxLength !== undefined &&
        <Button
          type="action"
          isDisabled={ maxLength <= items.length }
          onPress={() => dispatch({ 
            type : 'clone',
            item : item
          })}
        >
          Clone
        </Button> }
      <Button type="action" onPress={ () => toggleItem(i) }>
        { activeItem !== i ? 'Edit' : 'Close' }
      </Button>
      { maxLength !== undefined && 
        <ModalTrigger 
          title="Confirmation"
          label="Remove"
          onValidate={ () => dispatch({ type : 'remove', item : i }) }
        >
          Are you sure you want to remove item { i + 1 }?
        </ModalTrigger> }
    </>
  )

  /**
   * In order to support dependent value from the repeater, we have
   * to render the title as an element so that it's wrapped inside
   * a new dependent wrapper that can access repeater values
   */
  const renderTitle = (item, i) => {

    const text = title ? title : ('Item ' + (i + 1))

    if( ! isDependentString(text) ) return text;

    const element = { 
      type      : 'wrapper',
      name      : `_repeater-title-${name}-${item.key}`,
      content   : title,
      dependent : true
    }
    return renderItem(element, item, i)
  }

  return(
    <div className='tf-repeater-items tf-repeater-block-items'>
      { useBulk && 
        <BulkActions
          actions={ bulkOptions }
          dispatch={ dispatch }
        /> }
      { items && items.slice(0, maxLength).map((item, i) => (
        <ExpandablePanel
          key={ item.key ?? i } 
          title={ renderTitle(item, i) }
          footer={ actions(i, item) }
          isOpen={ activeItem === i }
          className="tf-repeater-block-item"
          onChange={ visible => visible 
            ? (activeItem !== i ? setActiveItem(i) : null)
            : (activeItem === i ? setActiveItem(false) : null) }
          headerLeft={ getHeaderLeft(item, i) }
        > 
          { rowFields.map(control => ( 
            <div key={ control.name ?? i } className="tf-repeater-block-item-field">
              { renderItem(control, item, i) }
            </div>
          )) } 
        </ExpandablePanel>
      )) }
    </div>
  )
}

export default Block
