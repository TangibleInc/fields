import { useState } from 'react'
import { renderTitle } from '../../common/helpers'
import { iconAction } from '../../common/actions'

import {
  Button,
  Tabs
} from '../../../base'

const Tab = ({
  items,
  rowFields,
  renderItem,
  renderAction,
  maxLength,
  repeatable,
  dispatch,
  name,
  title = false,
  beforeRow = false,
  afterRow = false,
  parent,
  string
}) => {

  const {
    Header,
    Container,
    Content,
    Row,
    RowField,
    RowLabel,
    RowTitle,
    Title
  } = Tabs

  /**
   * Active tab by item key (assigned on hydration), so removing or cloning
   * never shifts which item is shown
   */
  const [activeKey, setActiveKey] = useState<string | undefined>(
    items?.[0]?.key !== undefined ? String(items[0].key) : undefined
  )

  const keyOf = item => String(item.key)
  const shown = items.slice(0, maxLength)

  /**
   * A key that no longer exists (or none yet) falls back to the first item
   * for display; the actions below are gated on there being items at all,
   * so the fallback never retargets a destructive action onto an empty list
   */
  const foundIndex = shown.findIndex(item => keyOf(item) === activeKey)
  const activeIndex = foundIndex === -1 ? 0 : foundIndex
  const resolvedKey = shown[activeIndex] ? keyOf(shown[activeIndex]) : undefined

  /**
   * After removing the active item, show its neighbour: the next one, else
   * the previous
   */
  const removeActive = () => {
    const next = shown[activeIndex + 1] ?? shown[activeIndex - 1]
    dispatch({ type : 'remove', item : activeIndex })
    setActiveKey(next ? keyOf(next) : undefined)
  }

  const actions = repeatable && <>
    <Button
      type="text-primary"
      onPress={ () => dispatch({ type: 'add' }) }
      isDisabled={ maxLength <= items.length }
    >
      { string('add') }
    </Button>
    { shown.length > 0 &&
      <div className='tf-repeater-tab-icon-actions'>
        { renderAction( 'clone', activeIndex, { buttonProps: iconAction('system/copy', 'secondary', 'ghost') } ) }
        { renderAction( 'delete', activeIndex, {
          onConfirm    : removeActive,
          restoreFocus : false, // the trigger survives; the dialog restores to it
          buttonProps  : iconAction('system/trash', 'danger', 'ghost')
        } ) }
      </div> }
  </>

  /**
   * Name the tablist after the field when it has a label, so several tab
   * repeaters on one screen stay distinguishable
   */
  const listLabel = parent?.label
    ? string('itemsLabelNamed', { label: parent.label })
    : string('itemsLabel')

  return(
    <Container
      value={ resolvedKey }
      onValueChange={ setActiveKey }
      label={ listLabel }
      className="tf-repeater-tab-container"
    >
      <Header
        className="tf-repeater-items tf-repeater-tab-items"
        actionsClassName="tf-repeater-tab-actions"
        actions={ actions }
      >
        { shown.map((item, i) => (
          <Title
            key={ keyOf(item) }
            value={ keyOf(item) }
            className='tf-repeater-tab-item'
          >
            { renderTitle(item, i, title, name, renderItem, parent) }
          </Title>
        )) }
      </Header>
      { shown.map((item, itemIndex) => (
        <Content
          key={ keyOf(item) }
          value={ keyOf(item) }
          className='tf-repeater-tab-content'
        >
          { rowFields.map((control, i) => (
            <Row key={ control.name ?? i } className='tf-repeater-tab-row'>
              { beforeRow && beforeRow(item, itemIndex, dispatch) }
              { control.type === 'title'
                ? <RowTitle className='tf-repeater-tab-row-title tf-repeater-tab-row-title-section'>
                    { renderItem(control, item, itemIndex) }
                  </RowTitle>
                : <>
                    <RowLabel className='tf-repeater-tab-row-title'>
                      { control.label ?? '' }
                    </RowLabel>
                    <RowField className="tf-repeater-tab-item-field">
                      { renderItem(control, item, itemIndex) }
                    </RowField>
                  </> }
              { afterRow && afterRow(item, itemIndex, dispatch) }
            </Row> )) }
        </Content> )) }
    </Container>
  )
}

export default Tab
