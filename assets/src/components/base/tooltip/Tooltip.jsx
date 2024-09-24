const Tooltip = props => {

  const content = props.content ?? props.children
  const placement = props.placement ?? 'top'
  const theme = props.theme && props.theme === 'dark' ? 'dark' : 'light'

  return (
    <div className={`tf-tooltip tf-tooltip-${placement}`}>
      <div className={`tf-tooltip-content tf-tooltip-content-${placement} ${theme}`}>
        { content }
      </div> 
    </div>
  )
}

export default Tooltip
