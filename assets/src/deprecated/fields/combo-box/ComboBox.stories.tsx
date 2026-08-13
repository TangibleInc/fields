import { forwardRef } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

const posts = [
  { id: '1', title: 'First post' },
  { id: '2', title: 'Second post' },
  { id: '3', title: 'An example: third post' },
  { id: '4', title: 'The last post (4)' },
]

const search = (items, term, getText = item => item.title) => (
  items.filter(item => (
    getText(item).toLowerCase().includes((term ?? '').toLowerCase())
  ))
)

/**
 * Async results normally come from a REST endpoint, here the search parameter
 * is read from the url and matched against the example posts
 */
const mockSearchUrl = (items = posts, getText) => () => {

  const { fetch } = window

  window.fetch = url => Promise.resolve({
    ok: true,
    json: () => Promise.resolve(
      search(items, new URL(url, location.origin).searchParams.get('search'), getText)
    )
  })

  return () => { window.fetch = fetch }
}

/**
 * With an ajax action the request goes through the framework ajax module
 * instead of a fetch url
 *
 * @see https://docs.tangible.one/modules/plugin-framework/ajax/
 */
const mockAjaxAction = () => {

  window.Tangible = {
    ...(window.Tangible ?? {}),
    ajax: (action, data) => Promise.resolve(search(posts, data.search))
  }

  return () => { delete window.Tangible.ajax }
}

const simpleChoices = {
  test1: 'Test1',
  test2: 'Test2',
  test3: 'Test3',
  test4: 'Test4',
}

const categoryChoices = [
  {
    name: 'Category 1',
    choices: {
      test1: 'Test1',
      test2: 'Test2',
    }
  },
  {
    name: 'Category 2',
    choices: {
      test3: 'Test3',
      test4: 'Test4',
    }
  }
]

const meta = {
  title: 'Fields (Deprecated)/ComboBox',
  component: Field,
  decorators: [
    Story => (
      <div style={{ minWidth: '500px' }}>
        <Story />
      </div>
    )
  ],
  parameters: {
    layout: 'padded'
  },
  args: {
    type: 'deprecated-combo-box',
    label: 'ComboBox',
    placeholder: 'Example placeholder',
    description: 'Example description',
    choices: simpleChoices,
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Multiple: Story = {
  args: {
    multiple: true,
  }
}

export const WithCategories: Story = {
  args: {
    choices: categoryChoices,
  }
}

export const MultiplWithCategories: Story = {
  args: {
    multiple: true,
    choices: categoryChoices,
  }
}

/**
 * With isAsync the choices are loaded from searchUrl, asyncArgs are sent
 * alongside the search term, and the value is saved as a JSON object with the
 * value and its label
 */
export const AsyncFromUrl: Story = {
  beforeEach: mockSearchUrl(),
  args: {
    label: 'Posts combobox',
    isAsync: true,
    searchUrl: '/wp-json/wp/v2/search',
    asyncArgs: {
      subtype: 'post',
    },
    choices: undefined,
  }
}

/**
 * The results are requested with the ajax module when ajaxAction is used
 */
export const AsyncFromAjaxAction: Story = {
  beforeEach: mockAjaxAction,
  args: {
    label: 'Posts combobox',
    isAsync: true,
    ajaxAction: 'tangible_field_select_post',
    asyncArgs: {
      post_type: 'post,page',
    },
    choices: undefined,
  }
}

export const AsyncMultiple: Story = {
  beforeEach: mockAjaxAction,
  args: {
    label: 'Posts combobox',
    isAsync: true,
    multiple: true,
    ajaxAction: 'tangible_field_select_post',
    choices: undefined,
  }
}

/**
 * debounceTime is the delay before a new request is sent while typing, it is
 * 200ms by default
 */
export const AsyncWithDebounce: Story = {
  beforeEach: mockSearchUrl(),
  args: {
    label: 'Posts combobox',
    isAsync: true,
    searchUrl: '/wp-json/wp/v2/search',
    debounceTime: 1500,
    choices: undefined,
  }
}

/**
 * Endpoints returning something else than id and title keys are converted
 * with mapResults, an object value is read with key and attribute
 */
export const AsyncWithMappedResults: Story = {
  beforeEach: mockSearchUrl(
    [
      { uuid: '1', data: { label: 'First post' } },
      { uuid: '2', data: { label: 'Second post' } },
    ],
    item => item.data.label
  ),
  args: {
    label: 'Posts combobox',
    isAsync: true,
    searchUrl: '/wp-json/wp/v2/search',
    mapResults: {
      id: 'uuid',
      title: {
        key: 'data',
        attribute: 'label',
      },
    },
    choices: undefined,
  }
}

/**
 * A custom react component can be used to render the field, it receives the
 * combobox state and the multiple API (add, remove, values)
 */
const CustomLayout = forwardRef((props, ref) => (
  <div className="tf-combo-box tf-deprecated-control">
    <div className="tf-combo-box-text tui-input-group">
      <input
        { ...props.inputProps }
        className="tui-input tui-input-reset"
        ref={ ref.current.input }
      />
    </div>
    <ul style={{ listStyle: 'none', margin: '0.5rem 0 0', padding: 0 }}>
      { [ ...props.state.collection ].map(item => {

        const isSelected = props.multiple.values.includes(item.key)

        return (
          <li key={ item.key }>
            <button
              type="button"
              onClick={ () => (
                isSelected
                  ? props.multiple.remove(props.multiple.values.indexOf(item.key))
                  : props.multiple.add(item.key)
              ) }
              style={{
                display: 'flex',
                gap: '0.5rem',
                width: '100%',
                padding: '0.25rem 0',
                border: 0,
                background: 'none',
                cursor: 'pointer',
                color: 'inherit',
                font: 'inherit',
                fontWeight: isSelected ? 600 : 400
              }}
            >
              { item.textValue }
              { isSelected && <span aria-hidden="true">✓</span> }
            </button>
          </li>
        )
      }) }
    </ul>
  </div>
))

export const CustomRender: Story = {
  args: {
    label: 'Custom combobox',
    multiple: true,
    layout: CustomLayout,
    choices: {
      value1: 'Example value 1',
      value2: 'Second example value',
      value3: 'An example: third part',
      value4: 'The last example (4)',
    },
  }
}
