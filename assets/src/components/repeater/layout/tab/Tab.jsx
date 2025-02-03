import { useState } from 'react'
import { renderTitle } from '../../common/helpers'

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

  const [activeItem, setActiveItem] = useState(0)

  const actions = <>
    <div className='tf-repeater-tab-add-item tf-tab-item'>
      { maxLength !== undefined &&
        <Button
          type={ 'text-primary' }
          onPress={ () => dispatch({ type: 'add' }) }
          isDisabled={ maxLength <= items.length }
        >
          { string('add') }
        </Button> }
    </div>
    <div className='tf-repeater-tab-icon-actions'>
      { renderAction( 'clone', activeItem, {
        type                  : 'icon-clone',
        className             : 'tf-tab-item',
        contentVisuallyHidden : true
      } ) }
      { renderAction( 'delete', activeItem, {
        label       : 'Remove',
        title       :'Confirmation',
        onValidate  : () => {
          dispatch({ type : 'remove', item : activeItem })
          setActiveItem( activeItem == 0 ? 0 : activeItem - 1 )
        },
        buttonProps : {
          type                  : 'icon-trash',
          contentVisuallyHidden : true,
          className             : 'tf-tab-item'
        }
      } ) }
    </div>
  </>

  return(
    <Container className="tf-repeater-tab-container">
      <Header
        className="tf-repeater-items tf-repeater-tab-items"
        actionsClassName="tf-repeater-tab-actions"
        actions={ actions }
      >
        { items && items.slice(0, maxLength).map((item, i) => (
          <Title
            key={ item.key ?? i }
            isOpen={ activeItem == i }
            className='tf-repeater-tab-item'
            onPress={ () => setActiveItem(i) }
          >
            { renderTitle(item, i, title, name, renderItem, parent) }
          </Title>
        )) }
      </Header>
    { items[ activeItem ] &&
      <Content
        key={ items[ activeItem ].key ?? activeItem }
        className='tf-repeater-tab-content'
      >
        { rowFields.map((control, i) => (
          <Row key={ control.name ?? i } className='tf-repeater-tab-row'>
            { beforeRow && beforeRow(items[ activeItem ], activeItem, dispatch) }
            { control.type === 'title'
              ? <RowTitle className='tf-repeater-tab-row-title tf-repeater-tab-row-title-section'>
                  { renderItem(control, items[ activeItem ], activeItem) }
                </RowTitle>
              : <>
                  <RowLabel className='tf-repeater-tab-row-title'>
                    { control.label ?? '' }
                  </RowLabel>
                  <RowField className="tf-repeater-tab-item-field">
                    { renderItem(control, items[ activeItem ], activeItem) }
                  </RowField>
                </> }
            { afterRow && afterRow(items[ activeItem ], activeItem, dispatch) }
          </Row> )) }
      </Content> }
    </Container>
  )
}

export default Tab
