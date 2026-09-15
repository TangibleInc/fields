import type { ReactNode } from 'react'
import { createContext, useContext } from 'react'
import { Tabs } from '@tangible/ui'

/**
 * Tabbed sections on TUI Tabs (underline variant). Compound API:
 *
 *  <Container value={ active } onValueChange={ setActive } label="Sections">
 *    <Header actions={ ... }>
 *      <Title value="one">Content 1</Title>
 *      <Title value="two">Content 2</Title>
 *    </Header>
 *    <Content value="one">
 *      <Row>
 *        <RowLabel>A field</RowLabel>
 *        <RowField>...</RowField>
 *      </Row>
 *    </Content>
 *    <Content value="two" behavior="hide">...</Content>
 *  </Container>
 *
 * TUI owns the tablist semantics, arrow-key navigation and the panel's
 * aria-hidden/inert state, and hides inactive panels through its stylesheet
 * (so these need a .tui-interface ancestor, which every fields wrapper has).
 * The Container's `label` names the tablist; Content decides what is mounted
 */

interface TabsState {
  activeValue: string | undefined
  label: string
}

const TabsStateContext = createContext<TabsState>({ activeValue: undefined, label: 'Tabs' })

interface ContainerProps {
  value: string | undefined
  onValueChange: (value: string) => void
  /** Accessible name of the tablist */
  label: string
  /** TUI: 'auto' selects on focus, 'manual' needs Enter/Space */
  activationMode?: 'auto' | 'manual'
  className?: string
  children: ReactNode
}

const Container = ({ value, onValueChange, label, activationMode, className, children }: ContainerProps) => (
  <TabsStateContext.Provider value={{ activeValue: value, label }}>
    <Tabs
      variant="underline"
      value={ value }
      onValueChange={ onValueChange }
      activationMode={ activationMode }
      className={ ['tf-tab-container', className].filter(Boolean).join(' ') }
    >
      { children }
    </Tabs>
  </TabsStateContext.Provider>
)

interface HeaderProps {
  actions?: ReactNode
  className?: string
  actionsClassName?: string
  children: ReactNode
}

const Header = ({ actions, className, actionsClassName, children }: HeaderProps) => {
  const { label } = useContext(TabsStateContext)
  return (
    <div className="tf-tab-header">
      <Tabs.List
        aria-label={ label }
        className={ ['tf-tab-items', className].filter(Boolean).join(' ') }
      >
        { children }
      </Tabs.List>
      { actions &&
        <div className={ ['tf-tab-actions', actionsClassName].filter(Boolean).join(' ') }>
          { actions }
        </div> }
    </div>
  )
}

interface TitleProps {
  value: string
  className?: string
  children: ReactNode
}

const Title = ({ value, className, children }: TitleProps) => (
  <Tabs.Tab
    value={ value }
    className={ ['tf-tab-item', className].filter(Boolean).join(' ') }
  >
    { children }
  </Tabs.Tab>
)

interface ContentProps {
  value: string
  /**
   * 'remove' (default) unmounts inactive content; 'hide' keeps it mounted so
   * hidden inputs still submit with the form (TUI hides the panel)
   */
  behavior?: 'remove' | 'hide'
  className?: string
  children: ReactNode
}

const Content = ({ value, behavior = 'remove', className, children }: ContentProps) => {
  const { activeValue } = useContext(TabsStateContext)
  return (
    <Tabs.Panel
      value={ value }
      className={ ['tf-tab-content', className].filter(Boolean).join(' ') }
    >
      { (activeValue === value || behavior === 'hide') && children }
    </Tabs.Panel>
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
    <span className='tf-label tui-field__label'>
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
