import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Accordion, IconButton } from '@tangible/ui'
import { Button } from '../../../base'
import { Checkbox } from '../../../field'
import BulkActions from '../../common/BulkActions'
import {
  getHeaderConfig,
  renderHeaderValue
} from './header'

/**
 * Double-clicking the overview row toggles it, unless the double-click landed
 * on something that already has its own behaviour
 */
const INTERACTIVE = 'button, a, input, select, textarea, label, [role="button"], [role="link"]'

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

  const itemKey = (item, i) => String(item.key ?? i)
  const toggle = key => setOpenKey(current => current === key ? undefined : key)

  const onOverviewDoubleClick = key => (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest(INTERACTIVE)) return
    toggle(key)
  }

  /**
   * Stop a double-click from selecting the overview text
   */
  const onOverviewMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.detail > 1) event.preventDefault()
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
          value={ openKey ?? '' }
          onValueChange={ setOpenKey }
          className='tf-repeater-items tf-repeater-advanced-items'
        >
          { items && items.slice(0, maxLength).map((item, i) => {

            const key = itemKey(item, i)
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
                    </div> }
                  <div className='tf-repeater-advanced-label-row-index'>
                    { i + 1 }
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
                    { maxLength !== undefined &&
                      <div className="tf-repeater-advanced-overview-item-actions is-size-sm">
                        <Button
                          type="text-primary"
                          { ...actionProps }
                          onPress={ () => toggle(key) }
                        >
                          { string(isOpen ? 'close' : 'edit') }
                        </Button>
                        { renderAction( 'clone', i, { type : 'text-primary', ...actionProps } ) }
                        { renderAction( 'delete', i, { buttonProps : { type: 'text-danger', ...actionProps } } ) }
                      </div> }
                  </div>
                  <Accordion.Trigger asChild>
                    <IconButton
                      icon="system/chevron-down"
                      label={ string(isOpen ? 'collapseItem' : 'expandItem', { index: i + 1 }) }
                      size="sm"
                      showTooltip
                      className="tf-button-repeater-overview-open tf-repeater-advanced-toggle tf-repeater-advanced-label-row-arrow"
                    />
                  </Accordion.Trigger>
                </div>
                { /* Closed rows render no fields (a contract the field-group
                     tests pin); TUI's panel still owns the aria/inert state */ }
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
