import { 
  useState, 
  useEffect 
} from 'react'

import { Button } from '../'

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
  classes += ! props.footer ? ' tf-panel-no-footer' : ''
  
  return ( 
    <div className={ classes } data-status={ showItem ? 'open' : 'closed' }>
      <Button className="tf-panel-header" type="action" onPress={ toggle }>
        <div className="tf-panel-header-left">
          { props.headerLeft 
            ? <div className="tf-panel-header-before-title">
                { props.headerLeft }
              </div>
            : null }
          { props.title 
            ? <div className="tf-panel-header-title">
                <strong>{ props.title }</strong>
              </div>
            : null }
        </div>
        <div className="tf-panel-header-right">
          { props.headerRight 
            ? <div className="tf-panel-header-before-title">
                { props.headerRight }
              </div>
            : null }
          <span className="tf-panel-arrow" />
        </div>
      </Button>
      { showItem || props?.behavior === 'hide'
        ? <div className='tf-panel-content'>
            { props.children }
          </div> 
        : null }
      { props.footer 
        ? <div className='tf-panel-footer'>
            { props.footer }
          </div> 
        : null }
    </div>
  )
}

export default ExpandablePanel
