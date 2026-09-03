import type { MouseEvent, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Accordion, useAccordionItem } from '@tangible/ui'

/**
 * Clicking the header row toggles the item for pointer users, unless the
 * click landed on something with its own behaviour (the trigger handles
 * itself; switches and checkboxes in the header must not toggle the panel)
 */
const INTERACTIVE = 'button, a, input, select, textarea, label, [role="button"], [role="link"], [role="switch"], [role="checkbox"]'

export interface PanelItemProps {
  /** Accordion item value; unique within the parent Accordion */
  value: string
  title?: ReactNode
  headerLeft?: ReactNode
  headerRight?: ReactNode
  footer?: ReactNode
  /**
   * 'remove' (default) unmounts the content while closed; 'hide' keeps it
   * mounted and lets TUI hide it (aria-hidden + inert)
   */
  behavior?: 'remove' | 'hide'
  className?: string
  children?: ReactNode
}

const PanelItemBody = ({
  title,
  headerLeft,
  headerRight,
  footer,
  behavior = 'remove',
  children
}: Omit<PanelItemProps, 'value' | 'className'>) => {

  const { isOpen, toggle } = useAccordionItem()

  const onHeaderClick = (event: MouseEvent<HTMLDivElement>) => {
    if ((event.target as Element).closest(INTERACTIVE)) return
    toggle()
  }

  return (
    <>
      <div className="tf-panel-header" onClick={ onHeaderClick }>
        { headerLeft &&
          <div className="tf-panel-header-left">
            { headerLeft }
          </div> }
        <Accordion.Trigger className="tf-panel-header-trigger">
          <span className="tf-panel-header-title">
            { title }
          </span>
        </Accordion.Trigger>
        { headerRight &&
          <div className="tf-panel-header-right">
            { headerRight }
          </div> }
      </div>
      <Accordion.Panel>
        { (isOpen || behavior === 'hide') &&
          <div className="tf-panel-content">
            { children }
          </div> }
      </Accordion.Panel>
      { footer &&
        <div className="tf-panel-footer">
          { footer }
        </div> }
    </>
  )
}

/**
 * One collapsible row inside a TUI Accordion: header row (side slots around
 * the trigger), content panel, optional always-visible footer.
 *
 * Used by the Block repeater layout (many items in one accordion) and by
 * ExpandablePanel (one item on its own)
 */
const PanelItem = ({ value, className, ...body }: PanelItemProps) => (
  <Accordion.Item
    value={ value }
    className={ ['tf-panel-item', className].filter(Boolean).join(' ') }
  >
    <PanelItemBody { ...body } />
  </Accordion.Item>
)

export interface ExpandablePanelProps extends Omit<PanelItemProps, 'value'> {
  isOpen?: boolean
  onChange?: (open: boolean) => void
  /** Legacy alias of className, from PHP config */
  class?: string
}

const ITEM = 'panel'

/**
 * Standalone collapsible panel. Semi-controlled like before: `isOpen`
 * changes are followed, user toggles are kept locally and reported through
 * `onChange`
 */
const ExpandablePanel = ({
  isOpen = true,
  onChange,
  className,
  class: legacyClass,
  ...item
}: ExpandablePanelProps) => {

  const [open, setOpen] = useState(isOpen)

  useEffect(() => {
    if (isOpen !== open) setOpen(isOpen)
  }, [isOpen])

  const change = (value: string | undefined) => {
    const next = value === ITEM
    setOpen(next)
    onChange?.(next)
  }

  const classes = [
    'tf-panel',
    open ? 'tf-panel-open' : 'tf-panel-closed',
    className,
    legacyClass
  ].filter(Boolean).join(' ')

  return (
    <div className={ classes } data-status={ open ? 'open' : 'closed' }>
      <Accordion
        type="single"
        collapsible
        value={ open ? ITEM : null }
        onValueChange={ change }
      >
        <PanelItem value={ ITEM } { ...item } />
      </Accordion>
    </div>
  )
}

export { PanelItem }
export default ExpandablePanel
