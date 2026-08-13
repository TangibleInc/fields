import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react';
import EnhancedChoices from './index';

const meta = {
  title: 'Field/EnhancedChoices',
  component: EnhancedChoices,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    choices: {
      control: 'object',
      description: 'Options list — flat, rich (with viewLink), or grouped PHP-style object/array.',
    },
    label: { control: 'text', description: 'Field label text.' },
    description: { control: 'text', description: 'Helper text shown under the label.' },
    placeholder: { control: 'text', description: 'Input placeholder text.' },
    multiple: { control: 'boolean', description: 'Enables multi-select mode.' },
    isGrouped: { control: 'boolean', description: 'Renders choices as grouped sections.' },
    isViewable: { control: 'boolean', description: 'Shows a view-link icon per option.' },
    isCustomModeEnabled: { control: 'boolean', description: 'Allows entering a custom value not in the choices list.' },
    name: { control: 'text', description: 'Form field name, used for the hidden input.' },
    value: { control: false, description: 'Controlled value (string for single, string[] for multiple).' },
    onChange: { control: false, action: 'changed', description: 'Fires when the selection changes.' },
  },
} satisfies Meta<typeof EnhancedChoices>;

export default meta; 
type Story = StoryObj<typeof meta>;

const sampleChoices = {
  red: 'Red',
  blue: 'Blue',
  green: 'Green',
};

const choicesViewable = {
  red:    { label: 'Red',    viewLink: '/colors/red'    },
  blue:   { label: 'Blue',   viewLink: '/colors/blue'   },
  green:  { label: 'Green',  viewLink: '/colors/green'  },
  yellow: { label: 'Yellow', viewLink: '/colors/yellow' },
  purple: { label: 'Purple', viewLink: '/colors/purple' },
  orange: { label: 'Orange', viewLink: '/colors/orange' },
};

const choicesGrouped = [
  {
    label: 'Warm Colors',
    items: {
      red:    'Red',
      orange: 'Orange',
      yellow: 'Yellow',
    },
  },
  {
    label: 'Cool Colors',
    items: {
      blue:  'Blue',
      green: 'Green',
    },
  },
  {
    label: 'Other',
    items: {
      purple: 'Purple',
    },
  },
];

const choicesViewAndGroup = [
  {
    label: 'Warm Colors',
    items: {
      red:    { label: 'Red',    viewLink: '/colors/red'    },
      orange: { label: 'Orange', viewLink: '/colors/orange' },
      yellow: 'Yellow',
    },
  },
  {
    label: 'Cool Colors',
    items: {
      blue:  { label: 'Blue',  viewLink: '/colors/blue'  },
      green: { label: 'Green', viewLink: '/colors/green' },
    },
  },
];

export const Single: Story = {
  args: {
    label: 'Favorite color',
    placeholder: 'Search colors...',
    choices: sampleChoices,
    multiple: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
**PHP:**
\`\`\`php
$choices = [
    'red'   => 'Red',
    'blue'  => 'Blue',
    'green' => 'Green',
];

echo $fields->render_field('enhanced_choice', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'description' => 'basic single selection',
  'choices'     => $choices,
  'placeholder' => 'Search colors...',
  'isViewable'  => false, // Optional, defaults to false
]);
\`\`\`
        `,
      },
    },
  },
};

export const BasicSingleSelectionWithViewButton: Story = {
  args: {
    label: 'Favorite colors',
    placeholder: 'Search colors...',
    choices: choicesViewable,
    isViewable: true,
    multiple: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
**PHP:**
\`\`\`php
$choices_viewable = [
    'red'   => [ 'label' => 'Red',   'viewLink' => '/colors/red'   ],
    'blue'  => [ 'label' => 'Blue',  'viewLink' => '/colors/blue'  ],
    'green' => [ 'label' => 'Green', 'viewLink' => '/colors/green' ],
];

echo $fields->render_field('enhanced_choice_visibility', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'description' => 'with view link button',
  'choices'     => $choices_viewable,
  'placeholder' => 'Search colors...',
  'isViewable'  => true, // Optional, defaults to false
]);
\`\`\`
        `,
      },
    },
  },
};

export const BasicSingleSelectionWithCustomValue: Story = {
  args: {
    label: 'Favorite colors',
    placeholder: 'Search colors...',
    choices: choicesViewable,
    isCustomModeEnabled: true,
    multiple: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
**PHP:**
\`\`\`php
echo $fields->render_field('enhanced_choice_custom', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'description' => 'basic single selection',
  'choices'     => $choices,
  'placeholder' => 'Search colors...',
  'isViewable'  => false, // Optional, defaults to false
  'isCustomModeEnabled' => true, // Optional, defaults to false
]);
\`\`\`
        `,
      },
    },
  },
};

export const Multiple: Story = {
  args: {
    label: 'Favorite colors',
    placeholder: 'Search colors...',
    choices: sampleChoices,
    multiple: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
**PHP:**
\`\`\`php
echo $fields->render_field('enhanced_choice_multiple', [
  'type'        => 'enhanced-choice',
  'multiple'    => true,
  'label'       => 'Pick multiple colors',
  'description' => 'multiple selection',
  'choices'     => $choices,
  'placeholder' => 'Search colors...',
  'isViewable'  => true, // Optional, defaults to false
]);
\`\`\`
        `,
      },
    },
  },
};

export const MultipleSelectionWithGroupedItems: Story = {
  args: {
    label: 'Favorite colors',
    placeholder: 'Search colors...',
    choices: choicesGrouped,
    isGrouped: true,
    multiple: true,
    isViewable: false,
  },
  parameters: {
    docs: {
      description: {
        story: `
**PHP:**
\`\`\`php
echo $fields->render_field('enhanced_choice_multiple_group_items', [
  'type'        => 'enhanced-choice',
  'multiple'    => true,
  'label'       => 'Pick multiple colors',
  'description' => 'Grouped items',
  'choices'     => $choices_grouped,
  'placeholder' => 'Search colors...',
  'isViewable'  => true, // Optional, defaults to false
  'isGrouped'   => true, // Optional, defaults to false
]);
\`\`\`
        `,
      },
    },
  },
};

export const MultipleSelectionWithGroupedItemsAndViewLinks: Story = {
  args: {
    label: 'Favorite colors',
    placeholder: 'Search colors...',
    choices: choicesViewAndGroup,
    isGrouped: true,
    multiple: true,
    isViewable: true,
  },
  parameters: {
    docs: {
      description: {
        story: `
**PHP:**
\`\`\`php
echo $fields->render_field('enhanced_choice_multiple_group_and_view', [
  'type'        => 'enhanced-choice',
  'multiple'    => true,
  'label'       => 'Pick multiple colors',
  'description' => 'Grouped items',
  'choices'     => $choices_view_and_group,
  'placeholder' => 'Search colors...',
  'isViewable'  => true, // Optional, defaults to false
  'isGrouped'   => true, // Optional, defaults to false
]);
\`\`\`
        `,
      },
    },
  },
};

export const Controlled: Story = {
  render: function Controlled() {
    const [value, setValue] = useState<string | null>(null);
    return (
      <div>
        <EnhancedChoices
          label="Favorite color"
          choices={sampleChoices}
          value={value}
          onChange={setValue}
        />
        <p style={{ marginTop: 12, fontSize: 14 }}>Selected: {value ?? '(none)'}</p>
      </div>
    );
  },
};
