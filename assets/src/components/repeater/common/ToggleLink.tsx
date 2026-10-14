import { useAccordionItem } from '@tangible/ui'
import { Button } from '../../base'

/**
 * Second way to toggle a repeater row, next to the accordion trigger. Must
 * render inside the row's Accordion.Item so it can point aria-controls at the
 * item's panel
 */
const ToggleLink = ({ index, string, ...buttonProps }) => {
  const { isOpen, panelId, toggle } = useAccordionItem()
  return (
    <Button
      type="text-primary"
      { ...buttonProps }
      aria-expanded={ isOpen }
      aria-controls={ panelId }
      aria-label={ string(isOpen ? 'closeItem' : 'editItem', { index }) }
      onPress={ toggle }
    >
      { string(isOpen ? 'close' : 'edit') }
    </Button>
  )
}

export default ToggleLink
