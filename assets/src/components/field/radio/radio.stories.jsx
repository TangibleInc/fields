import Radio from './index.jsx'

export default {
  title: 'Field/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      description: 'Radio group label',
    },
    value: {
      control: 'text',
      description: 'Default selected value',
    },
    choices: {
      control: 'object',
      description: 'Key/value pairs or array of objects for options',
    },
    onChange: { 
      action: 'changed', 
      description: 'Fires when selection changes' 
    }
  },
  args: {
    label: 'Favorite Fruit',
    value: 'apple',
    choices: {
      apple: 'Apple',
      banana: 'Banana',
      cherry: 'Cherry'
    }
  }
}

export const Default = {}