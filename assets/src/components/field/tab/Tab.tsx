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
   */
  const uncontrolled = (props.uncontrolled ?? false) === true

  const tabs = Object.keys(props.tabs ?? {}).map(
    key => ({ ...props.tabs[ key ], name: key })
  )

  const [activeTab, setActiveTab] = useState( tabs[0]?.name ?? false )
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
      <Container>
        <Header>
          { tabs.map(tab => (
            <Title
              key={ tab.name }
              isOpen={ tab.name === activeTab }
              onPress={ () => setActiveTab(tab.name) }
            >
              { tab.title }
            </Title>
          )) }
        </Header>
        { tabs && tabs.map((tab, indexTab) => (
          <Content
            key={ tab.name }
            isActive={ tab.name === activeTab }
          >
            <FieldGroup
              { ...props }
              name={ null }
              fields={tab.fields}
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
