import type { Meta, StoryObj } from '@storybook/react-vite'

import Password from './Password'

const meta = {
  title: 'Field/Password',
  component: Password,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Stored secrets (API keys, tokens). The value never reaches the browser — ' +
          'the server sends `isSet` (a boolean) and nothing else, so an untouched field ' +
          'submits empty and the save handler reads empty as "keep the stored value".'
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    placeholder: { control: 'text' },
    isSet: { control: 'boolean' },
    locked: { control: 'boolean' },
    lockedMessage: { control: 'text' }
  },
  args: {
    label: 'API key',
    name: 'api_key'
  }
} satisfies Meta<typeof Password>

export default meta

type Story = StoryObj<typeof meta>

export const Empty: Story = {
  args: {
    description: 'No key saved yet.'
  }
}

/** A value exists server-side. The field still holds nothing. */
export const ValueSaved: Story = {
  args: {
    isSet: true,
    placeholder: undefined,
    description: 'Leave empty to keep the saved key.'
  }
}

/** Defined outside this screen — read-only, no reveal toggle, still focusable. */
export const Locked: Story = {
  args: {
    isSet: true,
    locked: true,
    lockedMessage: 'Defined in wp-config.php.'
  }
}

/** Every rendered and announced string is overridable. */
export const Translated: Story = {
  args: {
    label: 'Clé API',
    isSet: true,
    labels: {
      reveal: 'Afficher la valeur',
      hide: 'Masquer la valeur',
      shown: 'Valeur affichée.',
      hidden: 'Valeur masquée.',
      valueSet: '•••••••• Enregistrée',
      valueSetDescription: 'Une valeur est enregistrée et masquée. La saisie la remplace.'
    }
  }
}
