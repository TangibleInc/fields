import { 
  useState, 
  useEffect 
} from 'react'

const ExpandablePanel = props => {

  const [showItem, setShowItem] = useState(true)

  useEffect(() => {
    if( props.isOpen !== showItem ) {
      setShowItem( props.isOpen )
    } 
  }, [props.isOpen])


  const toggle = () => {
    setShowItem( ! showItem )
    props.onChange && props.onChange( ! showItem )
  }

  let classes = 'tf-panel'
  classes += ` tf-panel-${ showItem ? 'open' : 'closed' }`
  classes += props.className ? ` ${props.className}` : ''
  classes += props.class ? ` ${props.class}` : ''
  
  return ( 
    <div class={ classes } data-status={ showItem ? 'open' : 'closed' }>
      <div class="tf-panel-header" onClick={ toggle }>
        <div class="tf-panel-header-left">
          { props.headerLeft 
            ? <div class="tf-panel-header-before-title">
                { props.headerLeft }
              </div>
            : null }
          { props.title 
            ? <div class="tf-panel-header-title">
                <strong>{ props.title }</strong>
              </div>
            : null }
        </div>
        <div class="tf-panel-header-right">
          { props.headerRight 
            ? <div class="tf-panel-header-before-title">
                { props.headerRight }
              </div>
            : null }
          <span class="tf-panel-arrow" />
        </div>
      </div>
      { showItem || props?.behavior === 'hide'
        ? <div class='tf-panel-content'>
            { props.children }
          </div> 
        : null }
      { props.footer 
        ? <div class='tf-panel-footer'>
            { props.footer }
          </div> 
        : null }
    </div>
  )
}

export default ExpandablePanel
