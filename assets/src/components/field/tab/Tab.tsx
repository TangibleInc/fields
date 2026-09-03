import {
  useState,
  useEffect
} from 'react'

import { Tabs } from '../../base'
import { initJSON } from '../../../utils'
import { FieldGroup } from '..'

const Tab = props => {

  const {
    Header,
    Container,
    Content,
    Title
  } = Tabs

  /**
   * In some cases, we use a Tab component but we
   * don't want the Tab itself to hold a value
   *
   * When component is uncontrolled, we also make sure to
   * use <Content /> with behavior=hide instead of
   * behavior=remove, to be sure fields are always rendered
   * if used inside an html <form />
   */
  const uncontrolled = (props.uncontrolled ?? false) === true

  const tabs = Object.keys(props.tabs ?? {}).map(
    key => ({ ...props.tabs[ key ], name: key })
  )

  const [activeTab, setActiveTab] = useState<string | undefined>( tabs[0]?.name )
  const [value, setValue] = useState(
    uncontrolled ? {} : initJSON( props.value )
  )

  useEffect(() => {
    if ( uncontrolled ) return;
    props.onChange && props.onChange(value)
  }, [value])

  return(
    <>
      { ! uncontrolled &&
        <input
          type="hidden"
          name={ props.name ?? '' }
          value={ JSON.stringify( value ) }
        /> }
      <Container
        value={ activeTab }
        onValueChange={ setActiveTab }
        label={ props.label ?? 'Tabs' }
      >
        <Header>
          { tabs.map(tab => (
            <Title key={ tab.name } value={ tab.name }>
              { tab.title }
            </Title>
          )) }
        </Header>
        { tabs && tabs.map((tab, indexTab) => (
          <Content
            key={ tab.name }
            value={ tab.name }
            behavior={ uncontrolled ? 'hide' : 'remove' }
          >
            <FieldGroup
              { ...props }
              name={ null }
              fields={ tab.fields }
              uncontrolled={ uncontrolled }
              value={ uncontrolled ? undefined : (value[ tab.name ] ?? {}) }
              onChange={ tabValue => setValue({
                ...value,
                [ tab.name ]: tabValue
              }) }
            />
          </Content> )) }
      </Container>
    </>
  )
}

export default Tab
