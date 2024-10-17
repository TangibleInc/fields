import { 
  useState, 
  useEffect,
  isValidElement,
  forwardRef 
} from 'react'

import { Button } from '../'

/**
 * Note: 
 * 
 * We use onClick on the header otherwise we can't use e.stopPropagation() 
 * in headerLeft/headerRight, however onClick is deprecated for Button and we should use
 * onPress instead (but it won't allow e.stopPropagation() anymore)
 * 
 * Maybe we can't use a <Button /> for the panel header 
 */
const ExpandablePanel = forwardRef((props, ref) => {

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
  classes += ! props.footer ? ' tf-panel-no-footer' : ''
  classes += props?.hasSearchBox ? ' tf-panel-search-box' : ''
  
  return ( 
    <div ref={ref} className={ classes } data-status={ showItem ? 'open' : 'closed' }>
      <Button className="tf-panel-header" type="action" onClick={ props?.onPress ?? toggle }>
        <div className="tf-panel-header-left">
          { props.headerLeft 
            ? <div className="tf-panel-header-before-title">
                { props.headerLeft }
              </div>
            : null }
          { props.title 
            ? <div className="tf-panel-header-title">
                { ! isValidElement(props.title) 
                  ? <strong>{ props.title }</strong>
                  : props.title }
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
})

export default ExpandablePanel
