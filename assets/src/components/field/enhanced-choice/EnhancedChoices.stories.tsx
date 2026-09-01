import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react';
import EnhancedChoices from './index';

const meta = {
  title: 'Field/EnhancedChoices',
  component: EnhancedChoices,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## itemLayout — composable per-item slots

\`itemLayout\` lets PHP configure what renders before (\`prefix\`) and after
(\`suffix\`) each option's label, without hardcoding a fixed set of booleans
like \`isViewable\`. Since PHP can only send data (not real JSX or functions),
each entry picks a registered component **by name** and configures its props.

If \`itemLayout\` isn't provided, the field falls back to legacy \`isViewable\`
behavior — fully backward compatible with existing PHP field configs.

**Shape:**
\`\`\`ts
type ItemLayoutEntry = {
  component: string;                      // required
  props?: Record<string, unknown>;        // static, same for every row
  propsFromItem?: Record<string, string>; // per-row, reads from each item
};

type ItemLayoutConfig = {
  prefix?: ItemLayoutEntry[];
  suffix?: ItemLayoutEntry[];
};
\`\`\`

**Registered components:**

| component | Renders | Valid keys | Notes |
|---|---|---|---|
| \`icon\` | Icon | \`name\`, \`size\` | Decorative, always aria-hidden |
| \`badge\` | Chip | \`children\`, \`theme\`, \`size\`, \`variant\` | \`children\` is the chip's text |
| \`button\` | Button | \`label\`, \`variant\`, \`theme\`, \`size\`, \`href\`, \`target\` | Display/link only — no onClick |
| \`viewLink\` | Anchor + Icon | \`href\`, \`label\` | Migration path from legacy isViewable |

Any prop outside a component's allowed keys is silently dropped. Unknown
\`component\` names log a dev warning and render nothing — never crashes.

**\`props\` vs \`propsFromItem\`:** \`props\` is static (same every row).
\`propsFromItem\` is \`{ targetProp: 'itemFieldName' }\` — reads \`item[fieldName]\`
per row. Both can combine; \`propsFromItem\` wins on conflict.

**Example per-item view link:**
\`\`\`php
'itemLayout' => [
  'suffix' => [
    [ 'component' => 'viewLink', 'propsFromItem' => [ 'href' => 'viewLink' ] ],
  ],
],
\`\`\`

See the \`ItemLayout*\` stories below for more worked examples, including
mixed configs (prefix + suffix together, multiple entries per slot, grouped
mode, custom value mode, and conflict/edge-case handling).
        `,
      },
    },
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
    isViewable: { control: 'boolean', description: 'Shows a view-link icon per option. Ignored when itemLayout is provided.' },
    isCustomModeEnabled: { control: 'boolean', description: 'Allows entering a custom value not in the choices list.' },
    itemLayout: {
      control: 'object',
      description: 'Declarative slot config for per-option content (prefix/suffix). See the component guide above for the full component/props reference.',
    },
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

// Data for the itemLayout stories
const choicesBadged = {
  red:   { label: 'Red',   badge: 'Popular' },
  blue:  { label: 'Blue', badge: 'Oldest'},
  green: { label: 'Green', badge: 'New' },
};

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

export const ItemLayoutStaticIcon: Story = {
  args: {
    label: 'Favorite color',
    placeholder: 'Search colors...',
    choices: sampleChoices,
    multiple: false,
    itemLayout: {
      suffix: [
        { component: 'icon', props: { name: 'lms/edit', size: 'md' } },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Every option gets the same suffix icon, configured once — no per-item data needed.

**PHP:**
\`\`\`php
echo $fields->render_field('enhanced_choice_layout_static', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'choices'     => $choices,
  'placeholder' => 'Search colors...',
  'itemLayout'  => [
    'suffix' => [
      [ 'component' => 'icon', 'props' => [ 'name' => 'lms/edit', 'size' => 'md' ] ],
    ],
  ],
]);
\`\`\`
        `,
      },
    },
  },
};

export const ItemLayoutViewLink: Story = {
  args: {
    label: 'Favorite colors',
    placeholder: 'Search colors...',
    choices: choicesViewable,
    multiple: false,
    itemLayout: {
      suffix: [
        {
          component: 'viewLink',
          propsFromItem: { href: 'viewLink' },
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
Same visual result as \`isViewable: true\`, expressed through itemLayout instead —
each row's link target is read from that item's own \`viewLink\` field.

**PHP:**
\`\`\`php
$choices_viewable = [
    'red'  => [ 'label' => 'Red',  'viewLink' => '/colors/red'  ],
    'blue' => [ 'label' => 'Blue', 'viewLink' => '/colors/blue' ],
];

echo $fields->render_field('enhanced_choice_layout_viewlink', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'choices'     => $choices_viewable,
  'placeholder' => 'Search colors...',
  'itemLayout'  => [
    'suffix' => [
      [
        'component'     => 'viewLink',
        'propsFromItem' => [ 'href' => 'viewLink' ],
      ],
    ],
  ],
]);
\`\`\`
        `,
      },
    },
  },
};

/**
 * Mixed itemLayout — static props (theme/size) combined with a per-item
 * value (the badge text itself) via propsFromItem.
 */
export const ItemLayoutBadge: Story = {
  args: {
    label: 'Favorite colors',
    placeholder: 'Search colors...',
    choices: choicesBadged,
    multiple: false,
    itemLayout: {
      suffix: [
        {
          component: 'badge',
          props: { theme: 'secondary', size: 'xs' },
          propsFromItem: { children: 'badge' },
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
\`theme\`/\`size\` are static (same for every row); \`children\` (the badge text)
comes from each item's own \`badge\` field. Items without a \`badge\` render no chip.

**PHP:**
\`\`\`php
$choices_badged = [
    'red'   => [ 'label' => 'Red',   'badge' => 'Popular' ],
    'blue'  => [ 'label' => 'Blue' ],
    'green' => [ 'label' => 'Green', 'badge' => 'New' ],
];

echo $fields->render_field('enhanced_choice_layout_badge', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'choices'     => $choices_badged,
  'placeholder' => 'Search colors...',
  'itemLayout'  => [
    'suffix' => [
      [
        'component'     => 'badge',
        'props'         => [ 'theme' => 'secondary', 'size' => 'xs' ],
        'propsFromItem' => [ 'children' => 'badge' ],
      ],
    ],
  ],
]);
\`\`\`
        `,
      },
    },
  },
};

export const ItemLayoutBadgeMultiple: Story = {
  args: {
    label: 'Favorite colors',
    placeholder: 'Search colors...',
    choices: choicesBadged,
    multiple: true,
    itemLayout: {
      suffix: [
        {
          component: 'badge',
          props: { theme: 'secondary', size: 'xs' },
          propsFromItem: { children: 'badge' },
        },
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
\`theme\`/\`size\` are static (same for every row); \`children\` (the badge text)
comes from each item's own \`badge\` field. Items without a \`badge\` render no chip.

**PHP:**
\`\`\`php
$choices_badged = [
    'red'   => [ 'label' => 'Red',   'badge' => 'Popular' ],
    'blue'  => [ 'label' => 'Blue' ],
    'green' => [ 'label' => 'Green', 'badge' => 'New' ],
];

echo $fields->render_field('enhanced_choice_layout_badge_multiple', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'choices'     => $choices_badged,
  'placeholder' => 'Search colors...',
  'multiple'    => true,
  'itemLayout'  => [
    'suffix' => [
      [
        'component'     => 'badge',
        'props'         => [ 'theme' => 'secondary', 'size' => 'xs' ],
        'propsFromItem' => [ 'children' => 'badge' ],
      ],
    ],
  ],
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

export const ItemLayoutVSIsViewable: Story = {
  render: function ItemLayoutVSIsViewable() {
    return (
      <div>
        <EnhancedChoices
            choices={choicesViewable}
            multiple
            isViewable={true}
            itemLayout={{
              suffix: [{ component: 'badge', props: { theme: 'primary', size: 'xs' }, propsFromItem: { children: 'label' } }],
            }}
        />
      </div>
    );
  },
};

export const PrefixAndSuffix: Story = {
  render: function PrefixAndSuffix() {
    return (
      <div>
        <EnhancedChoices
          choices={choicesBadged}
          multiple
          itemLayout={{
            prefix: [{ component: 'icon', props: { name: 'lms/edit', size: 'sm' } }],
            suffix: [{ component: 'badge', props: { theme: 'secondary', size: 'xs' }, propsFromItem: { children: 'badge' } }],
          }}
        />
      </div>
    );
  },
};

const choicesPartialBadge = {
  red:   { label: 'Red', badge: 'Popular' },
  blue:  { label: 'Blue',badge: 'Popular' },
};

export const PropFromItem: Story = {
  render: function PropFromItem() {
    return (
      <div>
        <EnhancedChoices
          choices={choicesPartialBadge}
          multiple
          itemLayout={{
            suffix: [{ component: 'badge', propsFromItem: { children: 'badge' } }],
          }}
        />
      </div>
    );
  },
};

const choicesMultipleSuffix = {
  red:   { label: 'Red', badge: 'Popular', viewLink: 'https://example.com/red' },
  blue:  { label: 'Blue',badge: 'Popular', viewLink: 'https://example.com/blue' },
};

export const MutipleSuffixItem: Story = {
  render: function MutipleSuffixItem() {
    return (
      <div>
        <EnhancedChoices
          choices={choicesMultipleSuffix}
          multiple
          itemLayout={{
            suffix: [
              { component: 'badge', props: { theme: 'primary', size: 'xs' }, propsFromItem: { children: 'badge' } },
              { component: 'viewLink', propsFromItem: { href: 'viewLink' } },
              { component: 'viewLink', propsFromItem: { href: 'viewLink' } },
              { component: 'viewLink', propsFromItem: { href: 'viewLink' } },
            ],
          }}
        />
      </div>
    );
  },
};

export const UnknownComponent: Story = {
 render: function UnkownComponent() {
  return (
    <div>
      <EnhancedChoices
        choices={choicesMultipleSuffix}
        multiple
        itemLayout={{
          suffix: [{ component: 'totallyNotReal', props: { name: 'x' } }],
        }}
      />
    </div>
  );
 }
}

const choicesViewGroup = [ 
    {
      items: {
        orange: {
          label: 'Orange',
          viewLink: '/colors/orange'
        },
        red: {
          label: 'Red',
          viewLink: '/colors/red',
          badge: 'Popular'
        },
        yellow: {
          label: 'Yellow',
          viewLink: '/colors/yellow',
          badge: 'Popular'
        }
      },
      label: 'Warm Colors'
    },
    {
      items: {
        blue: {
          label: 'Blue',
          viewLink: '/colors/blue',
          badge: 'Popular'
        },
        green: {
          label: 'Green',
          viewLink: '/colors/green'
        }
      },
      label: 'Cool Colors'
    }
  ]

export const GroupedAndItemLayout: Story = {
  render: function GroupedAndItemLayout() {
    return (
      <div>
        <EnhancedChoices
          choices={choicesViewGroup}
          multiple
          isGrouped
          itemLayout={{
            suffix: [{ component: 'viewLink', propsFromItem: { href: 'viewLink' } }, { component: 'badge', propsFromItem: { children: 'badge' } }],
          }}
        />
      </div>
    );
  },
};

export const CustomModeAndItemLayout: Story = {
  render: function CustomModeAndItemLayout() {
    return (
      <div>
        <EnhancedChoices
          choices={choicesBadged}
          isCustomModeEnabled
          itemLayout={{ suffix: [{ component: 'badge', propsFromItem: { children: 'badge' } }] }}
        />
      </div>
    )
  }
}
