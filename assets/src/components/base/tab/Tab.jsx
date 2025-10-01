import { useState, useEffect } from 'react'
import Button from '../button/Button'

/**
 * No logic/state, just to share the CSS/classes
 * 
 *  <Container>
 *    <Header>
 *      <Title>Content 1</Title>
 *      <Title>Content 2</Title>
 *    <Header>
 *    <Content>
 *      <Row>
 *        <RowTitle>Content 1</RowTitle>
 *      </Row>
 *      <Row>
 *        <RowLabel>A field</RowLabel>
 *        <RowField>
 *          // ...
 *        </RowField>
 *      </Row>
 *      // ...
 *    <Content>
 *  <Tabs>
 */
 
const Container = props => (
  <div className={ 'tf-tab-container ' + (props.className ?? '') }>
    { props.children }
  </div>
)

const Header = props => (
  <div className='tf-tab-header'>
    <div className={ 'tf-tab-items ' + (props.className ?? '') }>
      { props.children }
    </div>
    { props.actions && 
      <div className={ 'tf-tab-actions ' + (props.actionsClassName ?? '') }>
        { props.actions }
      </div> }
  </div>
)

const Title = props => (
  <div 
    className={ 'tf-tab-item ' + (props.className ?? '') }
    data-open={ props.isOpen ?? false }
  >
    <Button type={ 'text-action' } onPress={ props.onPress }>
      { props.children }
    </Button>
  </div>
)

const Content = props => {

  const [ isActive, setIsActive ] = useState( props.isActive ?? false )

  useEffect(() => {
    if ( props.isActive !== isActive ) setIsActive( props.isActive )
  }, [ props.isActive ])

  if ( ! isActive ) return <></>;

  return(
    <div className={ 'tf-tab-content ' + (props.className ?? '') }>
      { props.children }
    </div>
  )
}

const Row = props => (
  <div className={ 'tf-tab-row ' + (props.className ?? '') }>
    { props.children }
  </div>
)

const RowTitle = props => (
  <div className={ 'tf-tab-row-title tf-tab-row-title-section ' + (props.className ?? '') }>
    { props.children }
  </div>
)

const RowLabel = props => (
  <div className={ 'tf-tab-row-title ' + (props.className ?? '') }>
    <span className='tf-label'>
      { props.children }
    </span>
  </div>
)

const RowField = props => (
  <div className={ 'tf-tab-row-field ' + (props.className ?? '') }>
    { props.children }
  </div>
)

export {
  Container,
  Content,
  Header,
  Row,
  RowField,
  RowLabel,
  RowTitle,
  Title
}
