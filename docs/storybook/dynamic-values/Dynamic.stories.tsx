import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, setConfig } from '../../../assets/src/index'
import { createDynamicValuesAPI } from '../../../assets/src/dynamic-values'
import DynamicFieldSettings, {
  type DynamicFieldSettingsProps,
  type DynamicFieldSettingsSubmitMeta,
} from '../../../assets/src/components/dynamic/settings-modal/DynamicFieldSettings'

/**
 * Dynamic values need a global config with categories and values
 *
 * In WordPress, this is set from PHP via TangibleFieldsConfig
 */
setConfig({
  dynamics: {
    categories: {
      'post': {
        label: 'Post',
        name: 'post',
        values: [
          'post-title',
          'post-date',
          'post-id',
          'post-meta',
        ]
      },
      'site': {
        label: 'Site',
        name: 'site',
        values: [
          'site-title',
          'site-color',
        ]
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
      'post-date': {
        category: 'post',
        name: 'post-date',
        label: 'Post date',
        type: 'date',
        description: 'The publication date of the current post',
        fields: [
          {
            type: 'text',
            name: 'format',
            label: 'Date format',
          }
        ],
      },
      'post-id': {
        category: 'post',
        name: 'post-id',
        label: 'Post ID',
        type: 'number',
        description: 'The ID of the current post',
        fields: [],
      },
      'post-meta': {
        category: 'post',
        name: 'post-meta',
        label: 'Post meta',
        type: 'text',
        description: 'A custom field value from the current post',
        fields: [
          {
            type: 'text',
            name: 'field',
            label: 'Field name',
          },
          {
            type: 'select',
            name: 'format',
            label: 'Format',
            choices: {
              'raw': 'Raw',
              'rendered': 'Rendered',
            },
          }
        ],
      },
      'site-title': {
        category: 'site',
        name: 'site-title',
        label: 'Site title',
        type: 'text',
        description: 'The title of the site',
        fields: [],
      },
      'site-color': {
        category: 'site',
        name: 'site-color',
        label: 'Site color',
        type: 'color',
        description: 'The primary color of the site',
        fields: [],
      },
    }
  }
})

type IntegrationExampleProps = Omit<DynamicFieldSettingsProps, 'open' | 'onOpenChange' | 'onSubmit' | 'dynamic'> & {
  /** Categories the dialog offers, every registered one when omitted */
  categories?: string[]
}

/**
 * A consumer with its own UI: a button opens the dialog, and what the dialog
 * submits is shown underneath (the token and the pick behind it)
 */
const IntegrationExample = ({ categories, editingRaw, ...props }: IntegrationExampleProps) => {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<{ raw: string; meta: DynamicFieldSettingsSubmitMeta } | null>(null)
  const dynamic = createDynamicValuesAPI({ categories })

  return (
    <div className="tf-interface tui-interface">
      <button type="button" className="tui-button" onClick={() => setOpen(true)}>
        { editingRaw ? `Edit [[${editingRaw}]]` : 'Insert a dynamic value' }
      </button>
      <DynamicFieldSettings
        { ...props }
        open={ open }
        onOpenChange={ setOpen }
        dynamic={ dynamic }
        editingId={ editingRaw ? 'story' : undefined }
        editingRaw={ editingRaw }
        onSubmit={ (raw, meta) => setLast({ raw, meta }) }
      />
      { last && (
        <pre style={{ marginTop: '1rem', fontSize: '12px' }}>
          raw:  { last.raw }{'\n'}
          meta: { JSON.stringify(last.meta, null, 2) }
        </pre>
      ) }
    </div>
  )
}

const meta = {
  title: 'Features/Dynamic Values',
  component: Field,
  decorators: [
    Story => (
      <div style={{ minWidth: '500px' }}>
        <Story />
      </div>
    )
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
          let formatedCode = ''

          const context = story.globals?.context ?? 'default'
          const componentString = 'const { Field } = window.tangibleFields'

          formatedCode = code.replace(/renderfield/gi, 'Field')
          if ( ! formatedCode.includes(`context="${context}"`) ) {
            formatedCode = formatedCode.replace(/<Field\n/, `<Field\n  context="${context}"\n`)
          }
          if ( ! formatedCode.includes(componentString) ) {
            formatedCode = `${componentString}\n\n${formatedCode}`
          }

          return formatedCode
        },
      }
    }
  },
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Text field with dynamic values in insert mode — allows mixing
 * regular text and dynamic values in the same input
 */
export const TextInsert: Story = {
  args: {
    type: 'text',
    label: 'Text (insert mode)',
    description: 'Supports text, date, color, and number dynamic values',
    dynamic: true,
  }
}

/**
 * Read-only text field with dynamic values in insert mode
 */
export const TextInsertReadOnly: Story = {
  args: {
    type: 'text',
    label: 'Text (read-only, insert mode)',
    value: '[[post-title]]',
    readOnly: true,
    dynamic: true,
  }
}

/**
 * Text field with dynamic values in replace mode — fully replaces
 * the field value with a single dynamic value
 */
export const TextReplace: Story = {
  args: {
    type: 'text',
    label: 'Text (replace mode)',
    description: 'Fully replaces value with a dynamic value',
    dynamic: {
      mode: 'replace',
    },
  }
}

/**
 * Read-only text field with dynamic values in replace mode
 */
export const TextReplaceReadOnly: Story = {
  args: {
    type: 'text',
    label: 'Text (read-only, replace mode)',
    value: '[[post-title]]',
    readOnly: true,
    dynamic: {
      mode: 'replace',
    },
  }
}

/**
 * Number field with dynamic values (replace mode only)
 */
export const Number: Story = {
  args: {
    type: 'number',
    label: 'Number',
    description: 'Only number dynamic values available',
    dynamic: true,
  }
}

/**
 * Color field with dynamic values (replace mode only)
 */
export const Color: Story = {
  args: {
    type: 'color-picker',
    label: 'Color',
    description: 'Only color dynamic values available',
    dynamic: true,
  }
}

/**
 * Date field with dynamic values (replace mode only)
 */
export const DatePicker: Story = {
  args: {
    type: 'date-picker',
    label: 'Date',
    description: 'Only date dynamic values available',
    dynamic: true,
  }
}

/**
 * The size of the field applies to the picker and to the pills
 */
export const Sizes: Story = {
  name: 'Sizes (sm / md / lg)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 480 }}>
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Field
          key={`insert-${size}`}
          type="text"
          label={`Text ${size} (insert)`}
          name={`sized-insert-${size}`}
          size={size}
          dynamic={true}
        />
      ))}
      {(['sm', 'md', 'lg'] as const).map(size => (
        <Field
          key={`replace-${size}`}
          type="text"
          label={`Text ${size} (replace)`}
          name={`sized-replace-${size}`}
          size={size}
          value="[[post-title]]"
          dynamic={{ mode: 'replace', types: ['text'] }}
        />
      ))}
    </div>
  ),
}

/**
 * Dynamic values restricted to a specific category
 */
export const RestrictedCategories: Story = {
  args: {
    type: 'text',
    label: 'Text (post category only)',
    description: 'Only values from the post category are available',
    dynamic: {
      categories: ['post'],
    },
  }
}

/**
 * The settings dialog opened from a consumer's own button, without a host
 * field: both modes, every category, default strings
 */
export const CustomIntegration: Story = {
  name: 'Custom integration',
  render: () => <IntegrationExample />,
  parameters: {
    docs: {
      source: {
        transform: code => code,
        code: `const { DynamicFieldSettings, dynamicValues } = window.tangibleFields

<DynamicFieldSettings
  open={ open }
  onOpenChange={ setOpen }
  dynamic={ dynamicValues.createAPI() }
  onSubmit={ (token, meta) => insert(token, meta.label) }
/>`
      }
    }
  }
}

/**
 * Built-in values only, narrowed to one category: the Field Type toggle is
 * hidden and only the post category is listed
 */
export const CustomIntegrationBuiltin: Story = {
  name: 'Custom integration (built-in, one category)',
  render: () => <IntegrationExample modes={ ['builtin'] } categories={ ['post'] } />,
  parameters: {
    docs: {
      source: {
        transform: code => code,
        code: `<DynamicFieldSettings
  open={ open }
  onOpenChange={ setOpen }
  dynamic={ dynamicValues.createAPI({ categories: ['post'] }) }
  modes={ ['builtin'] }
  onSubmit={ (token, meta) => insert(token, meta.label) }
/>`
      }
    }
  }
}

/**
 * Every string of the dialog overridden
 */
export const CustomIntegrationLabels: Story = {
  name: 'Custom integration (custom labels)',
  render: () => (
    <IntegrationExample
      modes={ ['builtin'] }
      labels={{
        title: 'Insert a field',
        select: 'Field',
        selectPlaceholder: 'Search fields…',
        cancel: 'Never mind',
        add: 'Insert',
      }}
    />
  ),
  parameters: {
    docs: {
      source: {
        transform: code => code,
        code: `<DynamicFieldSettings
  open={ open }
  onOpenChange={ setOpen }
  dynamic={ dynamicValues.createAPI() }
  modes={ ['builtin'] }
  labels={{
    title: 'Insert a field',
    select: 'Field',
    selectPlaceholder: 'Search fields…',
    cancel: 'Never mind',
    add: 'Insert',
  }}
  onSubmit={ (token, meta) => insert(token, meta.label) }
/>`
      }
    }
  }
}

/**
 * Editing an existing token: the value is preselected, its settings are
 * prefilled and the submit button reads Update
 */
export const CustomIntegrationEditing: Story = {
  name: 'Custom integration (editing a token)',
  render: () => <IntegrationExample modes={ ['builtin'] } editingRaw="post-meta::field=subtitle::format=rendered" />,
  parameters: {
    docs: {
      source: {
        transform: code => code,
        code: `<DynamicFieldSettings
  open={ open }
  onOpenChange={ setOpen }
  dynamic={ dynamicValues.createAPI() }
  modes={ ['builtin'] }
  editingId="my-token"
  editingRaw="post-meta::field=subtitle::format=rendered"
  onSubmit={ (token, meta) => replace(token, meta.label) }
/>`
      }
    }
  }
}
