import type { CSSProperties, MouseEvent, ReactNode } from 'react'
import { forwardRef, useEffect, useRef } from 'react'
import type { Ref } from 'react'
import { Button as TuiButton } from '@tangible/ui'
import type { ButtonProps as TuiButtonProps } from '@tangible/ui'

import { isDev } from '../../../utils/is-dev'
import { triggerEvent } from '../../../events'
import LegacyButton from './LegacyButton'

type MappedLayout =
  | 'primary'
  | 'action'
  | 'danger'
  | 'text-action'
  | 'text-primary'
  | 'text-danger'

interface LayoutConfig {
  theme: TuiButtonProps['theme']
  variant: TuiButtonProps['variant']
}

const layoutMap: Record<MappedLayout, LayoutConfig> = {
  primary: { theme: 'primary', variant: 'solid' },
  action: { theme: 'secondary', variant: 'outline' },
  danger: { theme: 'danger', variant: 'solid' },
  'text-action': { theme: 'secondary', variant: 'ghost' },
  'text-primary': { theme: 'primary', variant: 'ghost' },
  'text-danger': { theme: 'danger', variant: 'ghost' }
}

const isMappedLayout = (value: string): value is MappedLayout => value in layoutMap

type ForwardedTuiProps = Omit<
  TuiButtonProps,
  | 'children'
  | 'theme'
  | 'variant'
  | 'size'
  | 'fullWidth'
  | 'loading'
  | 'leftIconName'
  | 'rightIconName'
  | 'leftIcon'
  | 'rightIcon'
  | 'iconSize'
  | 'href'
  | 'target'
  | 'rel'
  | 'type'
  | 'disabled'
  | 'onClick'
  | 'className'
  | 'content'
>

export interface FieldsButtonProps extends ForwardedTuiProps {
  size?: TuiButtonProps['size']
  theme?: TuiButtonProps['theme']
  variant?: TuiButtonProps['variant']
  fullWidth?: TuiButtonProps['fullWidth']
  loading?: TuiButtonProps['loading']
  leftIconName?: TuiButtonProps['leftIconName']
  rightIconName?: TuiButtonProps['rightIconName']
  leftIcon?: TuiButtonProps['leftIcon']
  rightIcon?: TuiButtonProps['rightIcon']
  iconSize?: TuiButtonProps['iconSize']
  href?: TuiButtonProps['href']
  target?: TuiButtonProps['target']
  rel?: TuiButtonProps['rel']
  children?: ReactNode
  content?: ReactNode
  layout?: string
  type?: string
  buttonType?: 'button' | 'submit' | 'reset'
  context?: string
  className?: string
  style?: CSSProperties
  name?: string
  disabled?: boolean
  isDisabled?: boolean
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  onPress?: () => void
  testId?: string
  'data-testid'?: string
  'data-test-id'?: string
  'aria-label'?: string
  contentVisuallyHidden?: boolean
  changeTag?: 'button' | 'span'
  data?: unknown
  wrapper?: unknown
  visibility?: unknown
  itemType?: unknown
  afterInitialization?: unknown
  element?: unknown
  condition?: unknown
  portalContainer?: unknown
  onChange?: unknown
}

const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement | HTMLSpanElement, FieldsButtonProps>(
  (props: FieldsButtonProps, ref) => {
  const {
    size,
    fullWidth,
    loading,
    leftIconName,
    rightIconName,
    leftIcon,
    rightIcon,
    iconSize,
    href,
    target,
    rel,
    children,
    content,
    layout,
    type,
    buttonType = 'button',
    testId,
    'data-testid': dataTestId,
    'data-test-id': dataTestIdDashed,
    'aria-label': ariaLabelProp,
    context: _context,
    data: _data,
    wrapper: _wrapper,
    visibility: _visibility,
    itemType: _itemType,
    afterInitialization: _afterInitialization,
    element: _element,
    condition: _condition,
    portalContainer: _portalContainer,
    onChange: _onChange,
    theme,
    variant,
    className,
    style,
    name,
    disabled,
    isDisabled,
    onClick,
    onPress,
    contentVisuallyHidden,
    changeTag,
    ...tuiProps
  } = props

  const hasWarnedSpan = useRef(false)
  const hasWarnedMissingLabel = useRef(false)
  const hasWarnedOnChange = useRef(false)

  useEffect(() => {
    if (!hasWarnedOnChange.current && isDev() && props.onChange !== undefined) {
      console.warn(
        '[Fields Button] `onChange` prop is not supported on Button and will be ignored. ' +
        'Use `onClick` for click handling.'
      )
      hasWarnedOnChange.current = true
    }
  }, [])

  const resolvedLayout = String(layout || type || 'action')
  const resolvedTestId = testId ?? dataTestId ?? dataTestIdDashed

  if (!isMappedLayout(resolvedLayout)) {
    return <LegacyButton ref={ref} {...props} testId={resolvedTestId} />
  }

  const mapped = layoutMap[resolvedLayout]
  const label: ReactNode = content ?? children
  const stringLabel = typeof label === 'string' ? label : undefined
  const computedAriaLabel = contentVisuallyHidden ? stringLabel : undefined
  const ariaLabel = ariaLabelProp ?? computedAriaLabel
  const renderedContent = contentVisuallyHidden ? null : label
  const resolvedDisabled = Boolean(disabled || isDisabled)
  const rawTheme = theme ?? mapped.theme
  const resolvedTheme = rawTheme === 'destructive' ? 'danger' : rawTheme
  const resolvedVariant = variant ?? mapped.variant
  const resolvedSize = size ?? 'md'
  const resolvedLoading = Boolean(loading)

  const handleClick = (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    onClick?.(event)
    onPress?.()
    triggerEvent('buttonPressed', {
      name: name ?? false,
      props,
      event
    })
  }

  if (
    !hasWarnedMissingLabel.current &&
    isDev() &&
    renderedContent == null &&
    !ariaLabel
  ) {
    hasWarnedMissingLabel.current = true
    console.warn(
      '[Fields Button] Button has no visible label and no aria-label. Provide `content`, `children`, or an accessible label.'
    )
  }

  if (changeTag === 'span') {
    if (!hasWarnedSpan.current && isDev()) {
      hasWarnedSpan.current = true
      console.warn(
        '[Fields Button] `changeTag=\"span\"` is supported for backward compatibility but discouraged. Prefer semantic <button> or <a> usage.'
      )
    }

    /**
     * @fragile This span branch manually replicates TUI Button's class contract.
     * If TUI changes its class naming (tui-button, is-size-*, is-theme-*, is-style-*),
     * this branch must be updated to match. There is no automated check for drift.
     * Consider removing changeTag="span" support when legacy callers are migrated.
     */
    const spanClasses = [
      'tui-button',
      `is-size-${resolvedSize}`,
      `is-theme-${resolvedTheme}`,
      resolvedVariant !== 'solid' ? `is-style-${resolvedVariant}` : '',
      fullWidth ? 'is-width-full' : '',
      resolvedDisabled || resolvedLoading ? 'is-disabled' : '',
      className ?? ''
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <span
        ref={ref as Ref<HTMLSpanElement>}
        {...tuiProps}
        className={spanClasses}
        style={style}
        data-testid={resolvedTestId}
        data-test-id={resolvedTestId}
        data-name={name}
        data-loading={resolvedLoading || undefined}
        role="button"
        tabIndex={resolvedDisabled || resolvedLoading ? -1 : 0}
        aria-disabled={resolvedDisabled || resolvedLoading || undefined}
        aria-busy={resolvedLoading || undefined}
        {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
        onClick={event => {
          if (resolvedDisabled || resolvedLoading) return
          handleClick(event as unknown as MouseEvent<HTMLButtonElement | HTMLAnchorElement>)
        }}
        onKeyDown={event => {
          if (resolvedDisabled || resolvedLoading) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            ;(event.currentTarget as HTMLSpanElement).click()
          }
        }}
      >
        {renderedContent}
      </span>
    )
  }

  return (
    <TuiButton
      {...tuiProps}
      ref={ref as Ref<HTMLButtonElement | HTMLAnchorElement>}
      theme={resolvedTheme}
      variant={resolvedVariant}
      size={resolvedSize}
      fullWidth={fullWidth}
      loading={resolvedLoading}
      leftIconName={leftIconName}
      rightIconName={rightIconName}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      iconSize={iconSize}
      href={href}
      target={target}
      rel={rel}
      type={buttonType}
      disabled={resolvedDisabled}
      onClick={handleClick as TuiButtonProps['onClick']}
      className={className}
      style={style}
      data-testid={resolvedTestId}
      data-test-id={resolvedTestId}
      data-name={name}
      {...(ariaLabel ? { 'aria-label': ariaLabel } : {})}
    >
      {renderedContent}
    </TuiButton>
  )
}
)

Button.displayName = 'Button'

export default Button
