import React from 'react'

const Tooltip = props => {

  const content = props.content ?? children
  const placement = props.placement ?? 'top'
  const theme = props.theme && props.theme === 'dark' ? 'dark' : 'light'
  const [ isOpen, setIsOpen ] = React.useState(true)

  return (
    <>
    {
      isOpen &&
      ( <div className={`tf-tooltip tf-tooltip-${placement}`}>
        <div className={`tf-tooltip-content tf-tooltip-content-${placement} ${theme}`}>
          { content }
        </div> 
      </div> )
    }
    </>
  )
}

export default Tooltip
