import { useState } from 'react'
import { Accordion } from '@tangible/ui'

import { PanelItem } from '../../../base/expandable-panel/ExpandablePanel'
import { Checkbox, Switch } from '../../../field'
import { renderTitle } from '../../common/helpers'
import ToggleLink from '../../common/ToggleLink'
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
  renderMoveHandle,
  parent,
  string
}) => {

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
            label={ `Select item ${i + 1}` }
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
            label={ `Enable item ${i + 1}` }
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

  const footer = i => (
    <>
      { renderAction( 'clone', i ) }
      <ToggleLink index={ i + 1 } string={ string } type="action" />
      { renderAction( 'delete', i ) }
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
            footer={ maxLength !== undefined ? footer(i) : undefined }
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
