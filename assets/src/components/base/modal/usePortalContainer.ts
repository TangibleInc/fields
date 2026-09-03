import { useContext, useEffect, useState } from 'react'
import { ControlContext } from '../../../context'

/**
 * TUI Modal portals itself to the end of <body>, which lands it outside the
 * global context class (tf-context-{name}) that scopes our styles. Recreate
 * the wrapper the react-aria overlay used to provide: a container carrying
 * the context classes (control.wrapper already includes tui-interface),
 * appended to the configured portal container.
 *
 * The container only exists while `active` is true, so a page with many
 * potential dialogs (one per repeater row) does not litter <body> with
 * empty wrappers.
 *
 * @see renderField() in ./src/index.tsx
 * @see ./Modal.tsx for the legacy react-aria equivalent
 */
const usePortalContainer = (active = true): HTMLElement | null => {

  const control = useContext(ControlContext)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!active) return

    const host: Element = control?.portalContainer ?? document.body
    const el = document.createElement('div')
    el.className = control?.wrapper ?? 'tui-interface'
    host.appendChild(el)
    setContainer(el)

    return () => {
      host.removeChild(el)
      setContainer(null)
    }
  }, [active])

  return active ? container : null
}

export default usePortalContainer
