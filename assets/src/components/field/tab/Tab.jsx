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
  
  const tabs = Object.keys(props.tabs ?? {}).map(
    key => ({ ...props.tabs[ key ], name: key })
  )
    
  const [activeTab, setActiveTab] = useState( tabs[0]?.name ?? false )
  const [value, setValue] = useState( initJSON( props.value ) )

  useEffect(() => props.onChange && props.onChange(value), [value])
  
  return(
    <>
      <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(value) } />
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
        <Content>
          { activeTab &&
            <FieldGroup key={ activeTab }
              { ...props }
              name={ null } 
              fields={ props.tabs[ activeTab ].fields } 
              value={ value[ activeTab ] ?? {} }
              onChange={ tabValue => setValue({
                ...value,
                [activeTab]: tabValue
              }) }
            /> }
        </Content>
      </Container>
    </>
  )
}

export default Tab
