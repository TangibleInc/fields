import {
  useListBoxSection, 
  useSeparator
} from 'react-aria'

import Option from './Option'

/**
 * @see https://react-spectrum.adobe.com/react-aria/useListBox.html#sections 
 */

const Section = ({ section, state }) => {

  const { 
    itemProps, 
    headingProps, 
    groupProps 
  } = useListBoxSection({
    'heading': section.rendered,
    'aria-label': section['aria-label']
  })

  const { separatorProps } = useSeparator({
    elementType: 'li'
  })

  const isFirst = section.key === state.collection.getFirstKey()

  return (
    <>
      { ! isFirst && <li className="tf-list-box-section-separator" {...separatorProps} /> }
      <li className="tf-list-box-section" { ...itemProps }>
        { section.rendered &&
          <span { ...headingProps }>
            { section.rendered }
          </span> }
        <ul { ...groupProps }>
          {[ ...section.childNodes ].map(item => (
            <Option
              key={ item.key ?? item.name }
              item={ item }
              state={ state }
            />
          )) }
        </ul>
      </li>
    </>
  )
}

export default Section
