import Tooltip from './Tooltip'
import Button from '../button/Button'

const TooltipTrigger = props => {

  const layout = props.layout ?? 'button'
  const label = props.label ?? 'Open tooltip'

  return (
    <div className='tf-tooltip-trigger'>
      <div className='tf-tooltip-trigger-content'>
        {
          layout === 'button'
            ? <Button
                type="action"
                isDisabled={ props.isDisabled }
                { ...(props.buttonProps ?? {}) }
              >
                { label }
              </Button>
            : <span>{ label }</span>
        }
        <Tooltip { ...props }/>
      </div>
    </div>
  )
}

export default TooltipTrigger
