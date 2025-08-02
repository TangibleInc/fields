import TextField from './Text.jsx'

export default {
  title: 'Field/Text',
  component: TextField,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    description: { control: 'text' },
    onChange: { action: 'changed' }
  },
  args: {
    label: 'Name',
    value: 'John Doe',
    description: 'Enter your full name'
  }
}

export const Default = {}