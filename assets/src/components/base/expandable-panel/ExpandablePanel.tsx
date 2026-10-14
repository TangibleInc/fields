import type { MouseEvent, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Accordion, useAccordionItem } from '@tangible/ui'
import { isInteractiveTarget } from '../../../utils/interactive'

/**
 * Gesture: a single click anywhere on the header row toggles the item, the
 * card-header convention. (The Advanced repeater's dense overview row uses
 * double-click instead, so its values stay selectable; see Advanced.tsx.)
 * Clicks that start on a control in the row are left to that control
 */

export interface PanelItemProps {
  /** Accordion item value; unique within the parent Accordion */
  value: string
  /** Wrap the trigger in a heading for screen-reader heading navigation */
  headingLevel?: 2 | 3 | 4 | 5 | 6
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

/**
 * Rendered inside Accordion.Item on purpose: useAccordionItem() reads the
 * item's context, so this cannot be inlined into PanelItem
 */
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
    const target = event.target as Element
    // The side slots are control zones in their entirety (a switch's wrapper
    // padding counts), not just the controls inside them
    if (target.closest('.tf-panel-header-left, .tf-panel-header-right')) return
    if (isInteractiveTarget(target)) return
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
const PanelItem = ({ value, className, headingLevel, ...body }: PanelItemProps) => (
  <Accordion.Item
    value={ value }
    headingLevel={ headingLevel }
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
 * Standalone collapsible panel. Semi-controlled, as before: a *change* in the
 * `isOpen` prop is applied; between changes the user's own toggles win and
 * are reported through `onChange`. Re-passing the same `isOpen` value after
 * the user toggled does not reopen/close the panel.
 *
 * The .tf-panel wrapper with `data-status` and tf-panel-open/closed is the
 * public theming hook for context stylesheets and plugins; TUI's own
 * data-state lives on the item inside
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
    // Only `isOpen` on purpose: this follows prop changes, not local toggles
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
