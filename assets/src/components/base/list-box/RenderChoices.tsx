import { Section, Item } from 'react-stately'

/**
 * Helper function to easily render choices inside components that use a ListBox (select, combobox... etc) 
 */
const RenderChoices = item => (
  item.choices 
    ? <Section key={ item.key ?? item.name } title={ item.label ?? '' } items={ item.choices ?? [] }>
        { item => <Item key={ item.value ?? '' }>{ item.label ?? '' }</Item> }
      </Section>
    : <Item key={ item.value ?? '' }>{ item.label ?? '' }</Item>
)

export default RenderChoices 
