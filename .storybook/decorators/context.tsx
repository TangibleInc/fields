import { useEffect, useState } from 'react'
import type { Decorator } from '@storybook/react-vite'

type Mode = 'light' | 'dark' | 'auto'

type ContextFrameProps = {
  Story: any
  storyArgs: Record<string, unknown>
  contextClass: string
  modeClass: string
  themeAttr?: 'dark'
  colorScheme?: 'light' | 'dark'
}

const ContextFrame = ({
  Story,
  storyArgs,
  contextClass,
  modeClass,
  themeAttr,
  colorScheme
}: ContextFrameProps) => {
  return (
    <div className={`${modeClass}`} style={colorScheme ? { colorScheme } : undefined}>
      <div className={ `${contextClass} tui-interface` } data-theme={themeAttr}>
        { /* Pass context to the field so portaled content (modals, popovers) re-applies the right wrapper */ }
        <Story args={storyArgs} />
      </div>
    </div>
  )
}

export const withContext: Decorator = (Story, { globals, viewMode, id, args }) => {
  const contextName = globals.context || 'default'
  const contextClass = `tf-context-${contextName}`
  const storyArgs = { ...args, context: contextName }
  const colorMode = (globals.colorMode || 'light') as Mode
  const [systemMode, setSystemMode] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    if (colorMode !== 'auto' || typeof window === 'undefined' || !window.matchMedia) return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (event: MediaQueryListEvent) => {
      setSystemMode(event.matches ? 'dark' : 'light')
    }
    const legacyOnChange = (event: MediaQueryListEvent) => onChange(event)

    setSystemMode(media.matches ? 'dark' : 'light')
    if ('addEventListener' in media) {
      media.addEventListener('change', onChange)
    } else {
      ;(media as MediaQueryList & {
        addListener: (listener: (event: MediaQueryListEvent) => void) => void
      }).addListener(legacyOnChange)
    }

    return () => {
      if ('removeEventListener' in media) {
        media.removeEventListener('change', onChange)
      } else {
        ;(media as MediaQueryList & {
          removeListener: (listener: (event: MediaQueryListEvent) => void) => void
        }).removeListener(legacyOnChange)
      }
    }
  }, [colorMode])

  const resolvedMode = colorMode === 'auto' ? systemMode : colorMode
  const modeClass =
    colorMode === 'auto'
      ? `tf-color-mode-auto tf-color-mode-${resolvedMode}`
      : `tf-color-mode-${resolvedMode}`
  const themeAttr = resolvedMode === 'dark' ? 'dark' : undefined
  const colorScheme = resolvedMode
  const isDocsView = viewMode === 'docs'
  const isDocsPage = typeof id === 'string' && id.endsWith('--docs')

  // Keep docs page chrome (controls/table) unwrapped to avoid style leakage,
  // but still wrap docs story blocks so components render with TUI styles.
  if (isDocsView && isDocsPage) {
    return <Story />
  }

  return (
    <ContextFrame
      Story={Story}
      storyArgs={storyArgs}
      contextClass={contextClass}
      modeClass={modeClass}
      themeAttr={themeAttr}
      colorScheme={colorScheme}
    />
  )
}
