import { useListState } from 'react-stately'
import { Item } from 'react-stately'
import ListBox from './ListBox.jsx'

export default {
  title: 'Field/ListBox',
  component: ListBox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}

const Template = (args) => {
  const state = useListState({
    ...args,
    children: [
      <Item key="left">Left</Item>,
      <Item key="center">Center</Item>,
      <Item key="right">Right</Item>,
    ],
  })

  return <ListBox {...args} state={state} />
}

export const Default = Template.bind({})
Default.args = {
  label: 'Alignment',
  selectionMode: 'single',
}