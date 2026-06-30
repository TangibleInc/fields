import { useEffect, useMemo, useState } from 'react'
import type { Decorator } from '@storybook/react-vite'

type GlobalCssMode =
  | 'auto'
  | 'none'
  | 'basic'
  | 'wordpress'
  | 'elementor'
  | 'beaver-builder'

type Direction = 'ltr' | 'rtl'
type ColorMode = 'light' | 'dark' | 'auto'

const WORDPRESS_STYLES = [
  'https://wordpress.org/gutenberg/wp-admin/css/common.min.css',
  'https://wordpress.org/gutenberg/wp-admin/css/forms.min.css',
  'https://wordpress.org/gutenberg/wp-includes/css/dashicons.min.css'
]

const resolveMode = (globals: Record<string, unknown>): Exclude<GlobalCssMode, 'auto'> => {
  const selected = (globals.css as GlobalCssMode | undefined) ?? 'auto'
  if (selected !== 'auto') return selected

  const context = (globals.context as string | undefined) ?? 'default'
  if (context === 'wp') return 'wordpress'
  if (context === 'elementor') return 'elementor'
  if (context === 'beaver-builder') return 'beaver-builder'

  return 'basic'
}

const getElementorMedia = (mode: ColorMode) => {
  if (mode === 'dark') return 'all'
  if (mode === 'light') return 'none'
  return '(prefers-color-scheme: dark)'
}

const getBodyClasses = (
  mode: Exclude<GlobalCssMode, 'auto'>,
  direction: Direction,
  resolvedColorMode: 'light' | 'dark'
) => {
  const classes: string[] = []

  if (mode === 'wordpress') classes.push('wp-admin', 'wp-core-ui')
  if (mode === 'elementor') classes.push('elementor-editor-active')
  if (mode === 'beaver-builder') {
    classes.push('fl-builder', 'fl-builder-admin')
    classes.push(resolvedColorMode === 'dark' ? 'fl-builder-ui-skin--dark' : 'fl-builder-ui-skin--light')
  }
  if (direction === 'rtl') classes.push('rtl')

  return classes
}

export const withGlobalCss: Decorator = (Story, context) => {
  const globals = context.globals as Record<string, unknown>
  const isDocsView = context.viewMode === 'docs'
  const mode = resolveMode(globals)
  const direction = ((globals.direction as Direction | undefined) ?? 'ltr') as Direction
  const colorMode = ((globals.colorMode as ColorMode | undefined) ?? 'light') as ColorMode
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

  const resolvedColorMode = colorMode === 'auto' ? systemMode : colorMode

  const externalStyles = !isDocsView && mode === 'wordpress' ? WORDPRESS_STYLES : []
  const wrapperClasses = useMemo(() => {
    if (isDocsView) return []
    if (mode === 'wordpress') return ['wp-admin', 'wp-core-ui']
    if (mode === 'elementor') return ['elementor-editor-active']
    if (mode === 'beaver-builder') {
      return [resolvedColorMode === 'dark' ? 'fl-builder-ui-skin--dark' : 'fl-builder-ui-skin--light']
    }
    return []
  }, [isDocsView, mode, resolvedColorMode])

  useEffect(() => {
    if (isDocsView) return

    const { body } = document
    const bodyClasses = getBodyClasses(mode, direction, resolvedColorMode)
    body.classList.add('tui-interface', `tf-color-mode-${resolvedColorMode}`)
    if (resolvedColorMode === 'dark') {
      body.setAttribute('data-theme', 'dark')
    } else {
      body.removeAttribute('data-theme')
    }
    bodyClasses.forEach((className) => body.classList.add(className))

    let elementorMarker: HTMLStyleElement | null = null
    if (mode === 'elementor') {
      elementorMarker = document.createElement('style')
      elementorMarker.id = 'e-theme-ui-dark-css'
      elementorMarker.media = getElementorMedia(colorMode)
      body.appendChild(elementorMarker)
    }

    return () => {
      body.classList.remove('tui-interface', 'tf-color-mode-light', 'tf-color-mode-dark')
      bodyClasses.forEach((className) => body.classList.remove(className))
      body.removeAttribute('data-theme')
      if (elementorMarker && elementorMarker.parentElement) {
        elementorMarker.parentElement.removeChild(elementorMarker)
      }
    }
  }, [isDocsView, mode, direction, resolvedColorMode, colorMode])

  return (
    <div className={wrapperClasses.join(' ')}>
      {externalStyles.map((stylesheet) => (
        <link key={stylesheet} rel="stylesheet" href={stylesheet} />
      ))}
      <Story />
    </div>
  )
}
