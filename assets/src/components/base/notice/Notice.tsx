import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { Notice as TuiNotice } from '@tangible/ui'
import type { NoticeProps as TuiNoticeProps } from '@tangible/ui'

type TuiNoticeTheme = NonNullable<TuiNoticeProps['theme']>

export interface FieldsNoticeProps {
  message?: ReactNode
  type?: 'success' | 'error' | 'warning' | 'info'
  onDismiss?: () => void
  className?: string
}

const typeToTheme: Record<string, TuiNoticeTheme> = {
  error: 'danger',
  success: 'success',
  warning: 'warning',
  info: 'info',
}

const Notice = forwardRef<HTMLElement, FieldsNoticeProps>(function Notice(
  { message, type, onDismiss, className },
  ref
) {
  const theme = type ? (typeToTheme[type] ?? 'info') : undefined
  const classes = ['tf-notice', className].filter(Boolean).join(' ')

  return (
    <TuiNotice
      ref={ref as never}
      theme={theme}
      dismissible={!!onDismiss}
      onDismiss={onDismiss}
      className={classes}
    >
      <TuiNotice.Body>{message}</TuiNotice.Body>
    </TuiNotice>
  )
})

export default Notice
