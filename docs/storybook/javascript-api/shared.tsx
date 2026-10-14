import type { Meta } from '@storybook/react-vite'

/**
 * Shared story settings of the JavaScript API pages
 */
const column = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 16,
  maxWidth: 520
}

const output = {
  margin: 0,
  padding: 12,
  fontSize: 12,
  background: 'var(--tui-color-bg-subtle, #f6f7f7)',
  borderRadius: 4,
  whiteSpace: 'pre-wrap' as const
}

const parameters: Meta['parameters'] = {
  layout: 'padded',
  docs: {
    toc: {
      headingSelector: 'h2, h3',
      title: 'Contents'
    }
  }
}

const decorators: Meta['decorators'] = [
  Story => (
    <div style={{ minWidth: '500px' }}>
      <Story />
    </div>
  )
]

export { column, output, parameters, decorators }
