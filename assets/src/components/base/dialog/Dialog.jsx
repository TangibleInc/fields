import { useRef, useId } from 'react'
import { useDialog } from 'react-aria'
import { Title } from '../../base'

/**
 * Accessible Dialog component using ARIA practices.
 * Can optionally render as a native <dialog> element.
 */

const Dialog = ({
  title,
  titleId,
  titleLevel = 4,
  children,
  useNative = false,
  ...props
}) => {
  const ref = useRef()
  const generatedId = useId()
  const headingId = titleId || `tf-dialog-title-${generatedId}`

  const { dialogProps } = useDialog(
    { ...props, 'aria-labelledby': headingId },
    ref
  )

  const Wrapper = useNative ? 'dialog' : 'div'

  return (
    <Wrapper {...dialogProps} ref={ref} className="tf-dialog" open={useNative}>
      {title && (
        <Title id={headingId} level={titleLevel}>
          {title}
        </Title>
      )}
      <div className="tf-dialog-content">
        { children }
      </div>
    </Wrapper>
  )
}

export default Dialog