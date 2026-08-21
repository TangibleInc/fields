import { Children, isValidElement, useState } from 'react'

/**
 * Shows one story at a time, each child being a <Canvas />
 *
 * Only the selected story is rendered, so switching tab remounts it
 *
 * <StoryTabs labels={['Number', 'Color']}>
 *   <Canvas of={Stories.Number} />
 *   <Canvas of={Stories.Color} />
 * </StoryTabs>
 */
const StoryTabs = ({
  labels = [],
  children
}) => {

  const stories = Children.toArray(children).filter(isValidElement)
  const [current, setCurrent] = useState(0)

  if (!stories.length) return null

  return (
    <div className="tf-story-tabs">
      <div className="tf-tabs-header" role="tablist">
        { stories.map((story, index) => (
          <button
            key={ labels[index] ?? index }
            type="button"
            role="tab"
            aria-selected={ index === current }
            onClick={ () => setCurrent(index) }
          >
            { labels[index] ?? `Story ${index + 1}` }
          </button>
        )) }
      </div>
      { stories[current] ?? stories[0] }
    </div>
  )
}

export default StoryTabs
