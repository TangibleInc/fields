import {
  useEffect,
  useRef,
  useState
} from 'react'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Field } from '../../../index'

/**
 * One attribute per line, easier to read than the outerHTML one liner
 */
const formatMarkup = input => {

  if ( ! input ) return ''

  const attributes = [ ...input.attributes ].map(
    attribute => `  ${attribute.name}="${attribute.value}"`
  )

  return `<input\n${attributes.join('\n')}\n>`
}

/**
 * The field has no interface, only the markup it outputs is displayed here
 */
const Markup = ({ children }) => {

  const wrapper = useRef(null)
  const [markup, setMarkup] = useState('')

  /**
   * The control is rendered once its visibility is evaluated, so we watch the
   * wrapper instead of reading it on mount
   */
  useEffect(() => {

    const update = () => setMarkup(
      formatMarkup( wrapper.current?.querySelector('input') )
    )

    const observer = new MutationObserver(update)
    observer.observe(wrapper.current, { childList: true, subtree: true, attributes: true })
    update()

    return () => observer.disconnect()
  }, [])

  return (
    <div style={{ minWidth: '500px' }}>
      <div ref={ wrapper }>
        { children }
      </div>
      <p style={{ margin: '0 0 0.75rem', opacity: 0.7 }}>
        The field has no interface, it only outputs a hidden input
      </p>
      <pre style={{
        margin: 0,
        padding: '0.75rem 1rem',
        border: '1px solid rgba(128, 128, 128, 0.3)',
        borderRadius: '4px',
        background: 'rgba(128, 128, 128, 0.08)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word'
      }}>
        <code>{ markup }</code>
      </pre>
    </div>
  )
}

const meta = {
  title: 'Fields (Legacy)/Hidden',
  component: Field,
  decorators: [
    Story => (
      <Markup>
        <Story />
      </Markup>
    )
  ],
  parameters: {
    layout: 'padded'
  },
  args: {
    type: 'hidden',
    name: 'hidden-field',
    value: 'Example value',
  }
} satisfies Meta<typeof Field>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

/**
 * Attributes are added to the input, a class defined here is ignored as the
 * field sets its own className
 */
export const WithAttributes: Story = {
  args: {
    attributes: {
      'data-foo': 'bar',
    },
  }
}

/**
 * The className parameter is merged with the field own class, note that a
 * class parameter is removed before reaching the control
 */
export const WithClass: Story = {
  args: {
    className: 'baz-class',
    class: 'ignored-class',
  }
}
