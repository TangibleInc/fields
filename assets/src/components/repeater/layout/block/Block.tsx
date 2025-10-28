import { useState } from 'react'

import { 
  Button,
  ExpandablePanel 
} from '../../../base'

import { Checkbox, Switch } from '../../../field'
import { renderTitle } from '../../common/helpers'

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
  name,
  renderFooterActions,
  renderAction,
  parent
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
      { renderAction( 'clone', i ) }
      <Button type="action" onPress={ () => toggleItem(i) }>
        { activeItem !== i ? 'Edit' : 'Close' }
      </Button>
      { renderAction( 'delete', i ) }
    </>
  )

  return(
    <>
      <div className='tf-repeater-items tf-repeater-block-items'>
        { useBulk && 
          <BulkActions
            actions={ bulkOptions }
            dispatch={ dispatch }
          /> }
        { items && items.slice(0, maxLength).map((item, i) => (
          <ExpandablePanel
            key={ item.key ?? i } 
            title={ renderTitle(item, i, title, name, renderItem, parent) }
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
      { renderFooterActions() }
    </>
  )
}

export default Block
