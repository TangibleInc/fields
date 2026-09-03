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
  const activeIndex = Math.max(0, items.findIndex(item => keyOf(item) === activeKey))
  const resolvedKey = items[activeIndex] ? keyOf(items[activeIndex]) : undefined

  /**
   * After removing the active item, show its neighbour: the next one, else
   * the previous
   */
  const removeActive = () => {
    const next = items[activeIndex + 1] ?? items[activeIndex - 1]
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
    <div className='tf-repeater-tab-icon-actions'>
      { renderAction( 'clone', activeIndex, iconAction('system/copy', 'secondary', 'ghost') ) }
      { renderAction( 'delete', activeIndex, {
        onConfirm   : removeActive,
        buttonProps : iconAction('system/trash', 'danger', 'ghost')
      } ) }
    </div>
  </>

  return(
    <Container
      value={ resolvedKey }
      onValueChange={ setActiveKey }
      label={ string('itemsLabel') }
      className="tf-repeater-tab-container"
    >
      <Header
        label={ string('itemsLabel') }
        className="tf-repeater-items tf-repeater-tab-items"
        actionsClassName="tf-repeater-tab-actions"
        actions={ actions }
      >
        { items && items.slice(0, maxLength).map((item, i) => (
          <Title
            key={ keyOf(item) }
            value={ keyOf(item) }
            className='tf-repeater-tab-item'
          >
            { renderTitle(item, i, title, name, renderItem, parent) }
          </Title>
        )) }
      </Header>
      { items && items.map((item, itemIndex) => (
        <Content
          key={ keyOf(item) }
          value={ keyOf(item) }
          isActive={ keyOf(item) === resolvedKey }
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
