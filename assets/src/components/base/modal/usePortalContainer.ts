import { useContext, useLayoutEffect, useState } from 'react'
import { ControlContext } from '../../../context'

/**
 * Gives a TUI Modal a container inside our interface wrapper.
 *
 * Left alone, TUI resolves its own portal root from the trigger's nearest
 * .tui-interface, which is usually our field wrapper. We still hand it a
 * container for two reasons:
 *
 * - Page builders (Elementor, Beaver Builder) set control.portalContainer so
 *   overlays land inside their panel, and TUI can't know about that
 * - TUI's shared portal root is a fixed, z-indexed stacking context; a plain
 *   wrapper lets the modal's own z-index (see modal/index.scss) clear the WP
 *   admin bar
 *
 * The wrapper is created on first activation and kept until unmount, rather
 * than torn down on every close: the Modal must render once with open=false
 * to restore focus to its trigger, and TUI indexes .tui-interface nodes for
 * its portal roots, so churning them is best avoided.
 *
 * @see renderField() in ./src/index.tsx
 * @see ./Modal.tsx for the legacy react-aria equivalent
 */
const usePortalContainer = (active = true): HTMLElement | null => {

  const control = useContext(ControlContext)
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useLayoutEffect(() => {
    if (!active || container) return

    const host: Element = control?.portalContainer ?? document.body
    const el = document.createElement('div')
    el.className = control?.wrapper ?? 'tf-interface tui-interface'
    host.appendChild(el)
    setContainer(el)
  }, [active, container, control])

  useLayoutEffect(() => () => {
    container?.remove()
  }, [container])

  return container
}

export default usePortalContainer
