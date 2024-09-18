import React from 'react'
import Tooltip from './Tooltip'
import Button from '../button/Button'

const TooltipTrigger = props => {

  return (
    <div className='tf-tooltip-trigger'>
      <div className='tf-tooltip-trigger-content'>
        <Button>{ props.label ?? 'Open tooltip' }</Button>
        <Tooltip { ...props }/>
      </div>
    </div>
  )
}

export default TooltipTrigger
