import { useRef } from 'react'
import { useDateSegment } from 'react-aria'

const Segment = ({ segment, state }) => {

  const ref = useRef()
  const { segmentProps } = useDateSegment(segment, state, ref)

  let classes = 'tf-date-segment'
  if( segment.isPlaceholder ) classes += ' tf-date-segment-placeholder'

  return (
    <div
      class={ classes }
      { ...segmentProps }
      ref={ ref }
    >
      { segment.text }
    </div>
  )
}

export default Segment
