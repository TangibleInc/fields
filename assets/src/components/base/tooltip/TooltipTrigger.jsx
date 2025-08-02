import Tooltip from './Tooltip'
import { Button } from '../../base'

const TooltipTrigger = props => {

  const layout = props.layout ?? 'button'
  const label = props.label ?? 'Open tooltip'
  const children = props.children ?? false

  /**
   * Call only when no children are passed
   */
  const renderContent = () => (
    layout === 'button'
      ? <Button
          type="action"
          isDisabled={ props.isDisabled }
          { ...(props.buttonProps ?? {}) }
        >
          { label }
        </Button>
      : <span>{ label }</span>
  )

  return (
    <div className='tf-tooltip-trigger'>
      <div className='tf-tooltip-trigger-content'>
        { children
          ? children
          : renderContent() }
        <Tooltip { ...props }/>
      </div>
    </div>
  )
}

export default TooltipTrigger
