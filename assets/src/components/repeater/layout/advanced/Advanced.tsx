import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Accordion, IconButton } from '@tangible/ui'
import { Button } from '../../../base'
import { Checkbox } from '../../../field'
import BulkActions from '../../common/BulkActions'
import ToggleLink from '../../common/ToggleLink'
import { isInteractiveTarget } from '../../../../utils/interactive'
import {
  getHeaderConfig,
  renderHeaderValue
} from './header'

/**
 * Gesture: the overview row is a dense, table-like summary whose values are
 * worth selecting and copying, so a *double*-click toggles it (the chevron is
 * the primary control). Block rows are card headers and toggle on a single
 * click; see base/expandable-panel. Clicks that start on a control are left
 * to that control
 */

const Advanced = ({
  items,
  fields,
  rowFields,
  renderItem,
  maxLength,
  dispatch,
  headerFields = false,
  beforeRow = false,
  afterRow = false,
  renderAction,
  renderFooterActions,
  renderMoveHandle,
  repeatable,
  useBulk,
  string
}) => {

  /**
   * Open item tracked by key rather than index, so removing a row above the
   * open one does not silently open a different row
   */
  const [openKey, setOpenKey] = useState<string | undefined>(undefined)

  const headerColumns = getHeaderConfig(fields, headerFields)

  /**
   * Row actions read as WP list-table row actions: small text links
   */
  const actionProps = { size: 'xs', variant: 'link' } as const

  const itemKey = item => String(item.key) // assigned on hydration, see dispatcher.ts
  const toggle = key => setOpenKey(current => current === key ? undefined : key)

  const onOverviewDoubleClick = key => (event: MouseEvent<HTMLDivElement>) => {
    if (isInteractiveTarget(event.target)) return
    toggle(key)
  }

  /**
   * Stop a double-click from selecting text in the chrome of the row; header
   * values stay selectable, since double-clicking a title or ID to copy it is
   * a real use
   */
  const onOverviewMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.detail < 2) return
    if ((event.target as Element).closest('.tf-repeater-advanced-label-row-item')) return
    event.preventDefault()
  }

  return(
    <>
      { useBulk &&
        <BulkActions
          actions={{ 'deletion': string('bulkDelete') }}
          dispatch={ dispatch }
          string={ string }
        /> }
      <div className='tf-repeater-advanced'>
        <div className='tf-repeater-advanced-header tf-repeater-advanced-label-row'>
          <div key={ 'index' } className='tf-repeater-advanced-label-row-index'></div>
          { headerColumns.map((column, h) => (
            <div key={ h } className='tf-repeater-advanced-header-item tf-repeater-advanced-label-row-item'>
              { column.label ?? '' }
            </div>
          )) }
          <div key={ 'arrow' } className='tf-repeater-advanced-label-row-arrow'></div>
        </div>
        <Accordion
          type="single"
          collapsible
          variant="flush"
          value={ openKey ?? null }
          onValueChange={ setOpenKey }
          className='tf-repeater-items tf-repeater-advanced-items'
        >
          { items && items.slice(0, maxLength).map((item, i) => {

            const key = itemKey(item)
            const isOpen = openKey === key

            return (
              <Accordion.Item
                key={ key }
                value={ key }
                className="tf-repeater-advanced-item"
              >
                <div
                  className='tf-repeater-advanced-overview tf-repeater-advanced-label-row'
                  onDoubleClick={ onOverviewDoubleClick(key) }
                  onMouseDown={ onOverviewMouseDown }
                >
                  { useBulk &&
                    <div className="tf-repeater-advanced-item-checkbox">
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
                      />
                    </div> }
                  <div className='tf-repeater-advanced-label-row-index'>
                    { renderMoveHandle(i) ?? (i + 1) }
                  </div>
                  <div className="tf-repeater-advanced-overview-item-container">
                    <div className="tf-repeater-advanced-overview-item-fields">
                      { headerColumns.map((column, columnKey) => (
                        <div
                          key={ columnKey }
                          className='tf-repeater-advanced-overview-item tf-repeater-advanced-label-row-item'
                        >
                          { renderHeaderValue(column, item) }
                        </div>
                      )) }
                    </div>
                    { repeatable &&
                      <div className="tf-repeater-advanced-overview-item-actions">
                        <ToggleLink index={ i + 1 } string={ string } { ...actionProps } />
                        { renderAction( 'clone', i, { type : 'text-primary', ...actionProps } ) }
                        { renderAction( 'delete', i, { buttonProps : { type: 'text-danger', ...actionProps } } ) }
                      </div> }
                  </div>
                  <Accordion.Trigger asChild unstyled>
                    <IconButton
                      icon="system/chevron-down"
                      label={ string(isOpen ? 'collapseItem' : 'expandItem', { index: i + 1 }) }
                      size="sm"
                      showTooltip
                      className="tf-button-repeater-overview-open tf-repeater-advanced-toggle tf-repeater-advanced-label-row-arrow"
                    />
                  </Accordion.Trigger>
                </div>
                { /* Closed rows render no fields: a contract the field-group tests
                     pin, and a deliberate trade against TUI's close animation,
                     which has nothing left to collapse. TUI's panel still owns
                     the aria-hidden/inert state */ }
                <Accordion.Panel className="tf-repeater-advanced-panel">
                  { isOpen &&
                    <div className='tf-repeater-advanced-row'>
                      { beforeRow && beforeRow(item, i, dispatch) }
                      { rowFields.map(control => (
                        <div key={ control.name ?? i } className="tf-repeater-advanced-item-field">
                          { renderItem(control, item, i) }
                        </div>
                      )) }
                      { afterRow && afterRow(item, i, dispatch) }
                    </div> }
                </Accordion.Panel>
              </Accordion.Item>
            )
          }) }
        </Accordion>
      </div>
      { renderFooterActions() }
    </>
  )
}

export default Advanced
