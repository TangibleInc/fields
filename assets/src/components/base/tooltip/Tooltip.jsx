import React from 'react'

const Tooltip = props => {

  const content = props.content ?? children
  const placement = props.placement ?? 'top'
  const [ isOpen, setIsOpen ] = React.useState(true)

  return (
    <>
    {
      isOpen &&
      ( <div className={`tf-tooltip tf-tooltip-${placement}`}>
        <div className={`tf-tooltip-content tf-tooltip-content-${placement}`}>
          { content }
        </div>
      </div> )
    }
    </>
  )
}

export default Tooltip
