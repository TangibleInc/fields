import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field, setConfig } from '../../index'

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

/**
 * Dynamic values allow fields to use values resolved at render time from PHP.
 *
 * Supported field types: `text`, `number`, `color-picker`, `date-picker`
 *
 * #### Activate on a field
 *
 * PHP:
 * ```php
 * $fields->render_field('text-with-dynamic-values', [
 *   'label'   => 'Text field',
 *   'type'    => 'text',
 *   'dynamic' => true
 * ]);
 * ```
 *
 * JS:
 * ```jsx
 * const { Field } = window.tangibleFields
 *
 * <Field
 *   type="text"
 *   name="text-with-dynamic-values"
 *   label="Text field"
 *   dynamic={true}
 * />
 * ```
 *
 * #### Register a category and value
 *
 * ```php
 * $fields->register_dynamic_value_category('post', [
 *   'label' => 'Post',
 * ]);
 *
 * $fields->register_dynamic_value([
 *   'category' => 'post',
 *   'name'     => 'post_title',
 *   'label'    => 'Post title',
 *   'type'     => 'text',
 *   'fields'   => [
 *     [
 *       'type'    => 'select',
 *       'name'    => 'format',
 *       'label'   => 'Format',
 *       'choices' => [
 *         'none'      => 'None',
 *         'lowercase' => 'Lowercase',
 *         'uppercase' => 'Uppercase'
 *       ]
 *     ]
 *   ],
 *   'callback' => function($settings, $config) {
 *     $format = $settings['format'] ?? 'none';
 *     $post_title = get_the_title($config['context']['current_post_id']);
 *     if( $format === 'lowercase' ) return strtolower($post_title);
 *     if( $format === 'uppercase' ) return strtoupper($post_title);
 *     return $post_title;
 *   },
 *   'permission_callback' => '__return_true'
 * ]);
 * ```
 *
 * #### Render a dynamic value
 *
 * Dynamic values are stored as `[[dynamic_value_name::setting=value]]`.
 * To render:
 *
 * ```php
 * $output = $fields->render_value(
 *   $fields->fetch_value('field_name')
 * );
 * ```
 *
 * Text supports two modes:
 * - `insert` (default) — mix regular text and multiple dynamic values
 * - `replace` — fully replace the field value with a single dynamic value
 */
const meta = {
  title: 'Dynamic Values',
  component: Field,
  tags: ['autodocs'],
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
    value: '[[post_title]]',
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
    value: '[[post_title]]',
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
