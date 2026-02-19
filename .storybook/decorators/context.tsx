import { useEffect, useLayoutEffect, useState } from 'react'
import type { Decorator } from '@storybook/react-vite'

type Mode = 'light' | 'dark' | 'auto'

type ContextFrameProps = {
  Story: any
  contextClass: string
  modeClass: string
  themeAttr?: 'dark'
  colorScheme?: 'light' | 'dark'
  isDocsView: boolean
}

const ContextFrame = ({
  Story,
  contextClass,
  modeClass,
  themeAttr,
  colorScheme,
  isDocsView
}: ContextFrameProps) => {
  useLayoutEffect(() => {
    if (isDocsView) return

    document.body.classList.add('tui-interface')
    if (themeAttr) {
      document.body.setAttribute('data-theme', themeAttr)
    } else {
      document.body.removeAttribute('data-theme')
    }
    document.body.style.backgroundColor = 'var(--tui-color-bg)'
    document.body.style.color = 'var(--tui-color-fg)'

    return () => {
      document.body.classList.remove('tui-interface')
      document.body.removeAttribute('data-theme')
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
    }
  }, [themeAttr, isDocsView])

  return (
    <div className={`${contextClass} ${modeClass}`} style={colorScheme ? { colorScheme } : undefined}>
      <div className="tui-interface" data-theme={themeAttr}>
        <Story />
      </div>
    </div>
  )
}

export const withContext: Decorator = (Story, { globals, viewMode }) => {
  const contextClass = `tf-context-${globals.context || 'default'}`
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

    setSystemMode(media.matches ? 'dark' : 'light')
    if ('addEventListener' in media) {
      media.addEventListener('change', onChange)
    } else {
      media.addListener(onChange)
    }

    return () => {
      if ('removeEventListener' in media) {
        media.removeEventListener('change', onChange)
      } else {
        media.removeListener(onChange)
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

  return (
    <ContextFrame
      Story={Story}
      contextClass={contextClass}
      modeClass={modeClass}
      themeAttr={themeAttr}
      colorScheme={colorScheme}
      isDocsView={isDocsView}
    />
  )
}
