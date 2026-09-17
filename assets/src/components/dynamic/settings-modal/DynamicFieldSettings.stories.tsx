import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'

import { setConfig } from '../../../index'
import { createDynamicValuesAPI } from '../../../dynamic-values'
import DynamicFieldSettings, {
  type DynamicFieldSettingsProps,
  type DynamicFieldSettingsSubmitMeta,
} from './DynamicFieldSettings'

/**
 * A registry, as PHP would inline it in TangibleFieldsConfig
 */
setConfig({
  dynamics: {
    categories: {
      'post': {
        label: 'Post',
        name: 'post',
        values: ['post-title', 'post-meta'],
      },
      'user': {
        label: 'User',
        name: 'user',
        values: ['user-id', 'user-meta'],
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
      'post-meta': {
        category: 'post',
        name: 'post-meta',
        label: 'Post meta',
        type: 'text',
        description: 'A custom field value from the current post',
        fields: [
          { type: 'text', name: 'field', label: 'Field name' },
        ],
      },
      'user-id': {
        category: 'user',
        name: 'user-id',
        label: 'User ID',
        type: 'text',
        description: 'The current user ID',
        fields: [],
      },
      'user-meta': {
        category: 'user',
        name: 'user-meta',
        label: 'User meta',
        type: 'text',
        description: 'A meta value of the current user',
        fields: [
          {
            type: 'select',
            name: 'source',
            label: 'Source',
            choices: { current: 'Current user' },
          },
          { type: 'text', name: 'meta_name', label: 'Meta name' },
        ],
      },
    },
  },
})

type HarnessProps = Omit<DynamicFieldSettingsProps, 'open' | 'onOpenChange' | 'onSubmit' | 'dynamic'> & {
  /** Categories the picker offers; every registered one when omitted */
  categories?: string[]
}

/**
 * A consumer with its own UI: a button opens the dialog, and what the
 * dialog submits is shown underneath — the raw reference (what a consumer
 * stores, without the [[ ]] delimiters) and the pick behind it
 */
const Harness = ({ categories, editingRaw, ...props }: HarnessProps) => {
  const [open, setOpen] = useState(false)
  const [last, setLast] = useState<{ raw: string; meta: DynamicFieldSettingsSubmitMeta } | null>(null)
  const dynamic = createDynamicValuesAPI({ categories })

  return (
    <div className="tf-interface tui-interface" style={{ minWidth: '500px' }}>
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

/**
 * The dynamic-value settings dialog, driven by a consumer that has no host
 * field — a page builder's own dialog, a block editor's toolbar.
 *
 * ```jsx
 * const { DynamicFieldSettings, dynamicValues } = window.tangibleFields
 *
 * <DynamicFieldSettings
 *   open={ open }
 *   onOpenChange={ setOpen }
 *   dynamic={ dynamicValues.createAPI({ categories: ['user'] }) }
 *   modes={ ['builtin'] }
 *   extraGroups={ [{ name: 'doc', label: 'This document', choices: { title: 'Title' } }] }
 *   labels={ { title: 'Insert a field' } }
 *   onSubmit={ (raw, meta) => insert(raw, meta.label) }
 * />
 * ```
 *
 * - `dynamicValues.createAPI({ types, categories, mode })` narrows the
 *   registry without a field
 * - `modes` — `['builtin']` hides the Field Type toggle
 * - `extraGroups` — consumer-provided groups listed after the registry;
 *   their keys are submitted unchanged, they carry no settings
 * - `labels` — every string of the dialog
 * - `container` — where the dialog mounts; it receives the interface
 *   wrapper classes while open
 * - `onSubmit(raw, meta)` — the raw reference plus what was picked
 *   (`value`, `label`, `group`, `settings`, `extra`)
 *
 * Inside a field this dialog is opened by the field's own dynamic-value
 * button; see the Dynamic Values stories.
 */
const meta = {
  title: 'Dynamic Values/Settings dialog',
  component: Harness,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Harness>

export default meta

type Story = StoryObj<typeof meta>

/**
 * Both modes, every category, default strings — what a field's own button opens
 */
export const Default: Story = {
  args: {},
}

/**
 * Built-in only, narrowed to one category, with a consumer group listed after
 * the registry — a builder listing its document's own fields
 */
export const BuiltinWithExtraGroups: Story = {
  args: {
    modes: ['builtin'],
    categories: ['user'],
    extraGroups: [
      {
        name: 'document',
        label: 'This document',
        choices: {
          'custom.title': 'Title',
          'custom.signature': 'Signature',
        },
      },
    ],
  },
}

/**
 * Every string overridden
 */
export const CustomLabels: Story = {
  args: {
    modes: ['builtin'],
    labels: {
      title: 'Insert a field',
      select: 'Field',
      selectPlaceholder: 'Search fields…',
      cancel: 'Never mind',
      add: 'Insert',
    },
  },
}

/**
 * Editing an existing reference: the value is preselected and its settings
 * prefilled; the button reads Update
 */
export const EditingReference: Story = {
  args: {
    modes: ['builtin'],
    editingRaw: 'user-meta::meta_name=nickname',
  },
}

/**
 * Editing a reference from a consumer group preselects it too
 */
export const EditingExtraReference: Story = {
  args: {
    modes: ['builtin'],
    editingRaw: 'custom.title',
    extraGroups: [
      { name: 'document', label: 'This document', choices: { 'custom.title': 'Title' } },
    ],
  },
}
