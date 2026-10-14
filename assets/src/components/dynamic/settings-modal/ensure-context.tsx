import { useContext, type ReactNode } from 'react'

import { ControlContext } from '../../../context'
import store from '../../../store'

/**
 * The context renderField() provides, for a component mounted outside any
 * field — a consumer rendering DynamicFieldSettings from its own React tree.
 */
export const defaultControlContext = (
  context = 'default',
  portalContainer?: Element | null
) => ({
  name            : context,
  wrapper         : `tf-interface tf-context-${context} tui-interface`,
  getValue        : store.getValue.bind(store),
  portalContainer : portalContainer ?? document.body,
})

/**
 * Provides the control context when none is present, so Control and the
 * portal helpers work standalone; inside a field it renders children as is.
 */
export const EnsureControlContext = ({
  context,
  portalContainer,
  children,
}: {
  context?: string
  portalContainer?: Element | null
  children: ReactNode
}) => {
  const existing = useContext(ControlContext)
  if (existing) return <>{children}</>
  return (
    <ControlContext.Provider value={defaultControlContext(context, portalContainer)}>
      {children}
    </ControlContext.Provider>
  )
}
