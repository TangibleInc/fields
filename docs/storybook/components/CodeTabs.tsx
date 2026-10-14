import { Children, isValidElement, useState } from 'react'
import { Source } from '@storybook/addon-docs/blocks'

const labels = {
  php: 'PHP',
  jsx: 'JS',
  js: 'JS'
}

/**
 * PHP is registered on the highlighter, @see .storybook/preview.ts
 */
const languages = {
  php: 'php',
  jsx: 'jsx',
  js: 'jsx'
}

/**
 * Each child is a fenced code block, and becomes a tab named after its language
 *
 * <CodeTabs>
 *   ```php
 *   ...
 *   ```
 *
 *   ```jsx
 *   ...
 *   ```
 * </CodeTabs>
 */
const getProps = (node): any => (
  isValidElement(node) ? node.props : {}
)

const getTabs = children => (
  Children.toArray(children).flatMap(child => {

    const block = getProps(child).children
    const code = getProps(block).children

    if (typeof code !== 'string') return []

    const language = (getProps(block).className ?? '').replace('language-', '')

    return [{
      language,
      label: labels[language] ?? language.toUpperCase(),
      code: code.replace(/\n$/, '')
    }]
  })
)

const CodeTabs = ({ children }) => {

  const tabs = getTabs(children)
  const [current, setCurrent] = useState(0)

  if (!tabs.length) return null

  const selected = tabs[current] ?? tabs[0]

  return (
    <div className="tf-code-tabs">
      <div className="tf-tabs-header" role="tablist">
        { tabs.map(({ label }, index) => (
          <button
            key={ label }
            type="button"
            role="tab"
            aria-selected={ index === current }
            onClick={ () => setCurrent(index) }
          >
            { label }
          </button>
        )) }
      </div>
      <Source
        code={ selected.code }
        language={ languages[ selected.language ] ?? 'text' }
        format={ false }
      />
    </div>
  )
}

export default CodeTabs
