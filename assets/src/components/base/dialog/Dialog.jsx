import { useRef } from 'react'
import { useDialog } from 'react-aria'
import { Title } from '../../base'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useDialog.html 
 */

const Dialog = ({ title, children, ...props }) => {

  const ref = useRef()
  const { dialogProps } = useDialog(props, ref)

  return(
    <div className='tf-dialog' { ...dialogProps } ref={ ref }>
      { title && 
        <Title level={4}>
          { title }
        </Title> }
      <div className='tf-dialog-content'>
        { children }
      </div>
    </div>
  )
}

export default Dialog
