import { useRef } from 'react'
import { useDateSegment } from 'react-aria'

const DateSegment = ({ segment, state }) => {
  
  const ref = useRef()
  const { segmentProps } = useDateSegment(segment, state, ref)

  let classes = 'tf-date-segment'
  if( segment.isPlaceholder ) classes += ' tf-date-segment-placeholder'

  return (
    <div class={ classes } { ...segmentProps } ref={ ref }>
      {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
      <span aria-hidden="true">      
        { segment.placeholder }
      </span>
      { segment.isPlaceholder ? '' : segment.text }
    </div>
  )
}

export default DateSegment
