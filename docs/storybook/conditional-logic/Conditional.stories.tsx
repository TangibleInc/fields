import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, setConfig } from '../../../assets/src/index'

/**
 * Same values as the Dynamic Values stories, so the picker shows the same
 * registry from one page to the other
 */
const dynamics = {
  categories: {
    'post': {
      label: 'Post',
      name: 'post',
      values: ['post-title', 'post-id'],
    },
    'site': {
      label: 'Site',
      name: 'site',
      values: ['site-title'],
    },
  },
  values: {
    'post-title': {
      category: 'post',
      name: 'post-title',
      label: 'Post title',
      type: 'text',
      description: 'The title of the current post',
      fields: [],
    },
    'post-id': {
      category: 'post',
      name: 'post-id',
      label: 'Post ID',
      type: 'number',
      description: 'The ID of the current post',
      fields: [],
    },
    'site-title': {
      category: 'site',
      name: 'site-title',
      label: 'Site title',
      type: 'text',
      description: 'The title of the site',
      fields: [],
    },
  }
}

const meta = {
  title: 'Features/Conditional Logic',
  component: Field,
  decorators: [
    Story => {
      setConfig({ dynamics })
      return (
        <div style={{ minWidth: '500px' }}>
          <Story />
        </div>
      )
    }
  ],
  parameters: {
    layout: 'padded',
    docs: {
      toc: {
        headingSelector: 'h2, h3',
        title: 'Contents'
      },
      source: {
        transform: (code, story) => {
          const componentString = 'const { Field } = window.tangibleFields'
          const formatedCode = code.replace(/renderfield/gi, 'Field')
          return formatedCode.includes(componentString)
            ? formatedCode
            : `${componentString}\n\n${formatedCode}`
        },
      }
    }
  },
  args: {
    type: 'conditional-panel',
    name: 'conditions',
    label: 'Conditions',
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Groups are joined with OR, conditions inside a group with AND
 */
export const Panel: Story = {}

/**
 * The stored value: two groups, the first one with two conditions
 */
export const SavedValue: Story = {
  args: {
    value: JSON.stringify([
      {
        key: 'group-1',
        data: [
          { key: 'condition-1', left_value: '[[post-id]]', operator: '_eq', right_value: '5' },
          { key: 'condition-2', left_value: '[[site-title]]', operator: '_contains', right_value: 'Tangible' },
        ]
      },
      {
        key: 'group-2',
        data: [
          { key: 'condition-3', left_value: '[[post-title]]', operator: '_neq', right_value: 'Hello world' },
        ]
      }
    ])
  }
}

/**
 * A restricted list of operators, with custom labels
 */
export const Operators: Story = {
  args: {
    operators: {
      _eq: 'Is',
      _neq: 'Is not',
      _contains: 'Contains',
    }
  }
}

/**
 * Dynamic values restricted to the post category and to text and number values
 */
export const DynamicValues: Story = {
  args: {
    dynamic: {
      categories: ['post'],
      types: ['text', 'number'],
    }
  }
}

/**
 * The panel opens in a modal, and changes are kept only when saved
 */
export const Modal: Story = {
  args: {
    useModal: true,
  }
}

/**
 * Custom fields for each condition: the left value is a select instead of a text
 */
export const CustomFields: Story = {
  args: {
    fields: [
      {
        type: 'select',
        name: 'left_value',
        label: 'Subject',
        labelVisuallyHidden: true,
        choices: {
          '[[post-id]]': 'Post ID',
          '[[post-title]]': 'Post title',
          '[[site-title]]': 'Site title',
        }
      },
      {
        type: 'select',
        name: 'operator',
        label: 'Operator',
        labelVisuallyHidden: true,
        choices: {
          _eq: 'Is',
          _neq: 'Is not',
        }
      },
      {
        type: 'text',
        name: 'right_value',
        label: 'Value',
        labelVisuallyHidden: true,
      }
    ]
  }
}
