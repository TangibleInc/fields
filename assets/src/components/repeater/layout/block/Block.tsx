import { useState } from 'react'
import { Accordion } from '@tangible/ui'

import { PanelItem } from '../../../base'
import { Checkbox, Switch } from '../../../field'
import { renderTitle } from '../../common/helpers'
import ToggleLink from '../../common/ToggleLink'
import BulkActions from '../../common/BulkActions'
import { iconAction } from '../../common/actions'

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
  renderMoveHandle,
  repeatable,
  actionsPosition = 'footer',
  parent,
  string
}) => {

  /**
   * 'footer' (default): Clone / Edit-Close / Remove as buttons under the
   * content. 'header': Clone and Remove as ghost icon buttons in the trigger
   * row; the trigger itself covers open/close
   */
  const inlineActions = actionsPosition === 'header'

  /**
   * Open item tracked by key (assigned on hydration, see dispatcher.ts), so
   * removing or moving rows never switches which one is open
   */
  const [openKey, setOpenKey] = useState<string | undefined>(
    items?.[0]?.key !== undefined ? String(items[0].key) : undefined
  )

  const bulkOptions = { 'deletion': string('bulkDelete') }

  if ( useSwitch ) {
    bulkOptions['enabled'] = 'Enabled'
    bulkOptions['disabled'] = 'Disabled'
  }

  const headerLeft = (item, i) => {
    const handle = renderMoveHandle(i)
    if ( ! useBulk && ! useSwitch && ! handle ) return null
    return (
      <>
        { handle }
        { useBulk &&
          <Checkbox
            label={ string('selectItem', { index: i + 1 }) }
            labelVisuallyHidden={ true }
            value={ item._bulkCheckbox }
            onChange={ value => dispatch({
              type    : 'update',
              item    : i,
              control : '_bulkCheckbox',
              value   : value
            }) }
          /> }
        { useSwitch &&
          <Switch
            label={ string('enableItem', { index: i + 1 }) }
            labelVisuallyHidden={ true }
            value={ item.enabled }
            onChange={ value => dispatch({
              type    : 'update',
              item    : i,
              control : 'enabled',
              value   : value
            }) }
          /> }
      </>
    )
  }

  /**
   * ToggleLink reads the item's accordion context; these elements are created
   * here but only render inside PanelItem, which is what makes that work
   */
  const footer = i => (
    <>
      { renderAction( 'clone', i ) }
      <ToggleLink index={ i + 1 } string={ string } type="action" />
      { renderAction( 'delete', i ) }
    </>
  )

  const headerRight = i => (
    <>
      { renderAction( 'clone', i, iconAction('system/copy', 'secondary', 'ghost') ) }
      { renderAction( 'delete', i, { buttonProps: iconAction('system/trash', 'danger', 'ghost') } ) }
    </>
  )

  return(
    <>
      { useBulk &&
        <BulkActions
          actions={ bulkOptions }
          dispatch={ dispatch }
          string={ string }
        /> }
      <Accordion
        type="single"
        collapsible
        value={ openKey ?? null }
        onValueChange={ setOpenKey }
        className='tf-repeater-items tf-repeater-block-items'
      >
        { items && items.slice(0, maxLength).map((item, i) => (
          <PanelItem
            key={ item.key }
            value={ String(item.key) }
            className="tf-repeater-block-item"
            title={ renderTitle(item, i, title, name, renderItem, parent) }
            headerLeft={ headerLeft(item, i) }
            headerRight={ repeatable && inlineActions ? headerRight(i) : undefined }
            footer={ repeatable && ! inlineActions ? footer(i) : undefined }
          >
            { rowFields.map(control => (
              <div key={ control.name ?? i } className="tf-repeater-block-item-field">
                { renderItem(control, item, i) }
              </div>
            )) }
          </PanelItem>
        )) }
      </Accordion>
      { renderFooterActions() }
    </>
  )
}

export default Block
