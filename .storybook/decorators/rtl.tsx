import { useEffect } from 'react'
import type { Decorator } from '@storybook/react-vite'

type Direction = 'ltr' | 'rtl'

export const withRtl: Decorator = (Story, context) => {
  const direction = ((context.globals.direction as Direction | undefined) ?? 'ltr') as Direction

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('dir', direction)
    return () => {
      root.setAttribute('dir', 'ltr')
    }
  }, [direction])

  return (
    <div dir={direction}>
      <Story />
    </div>
  )
}

