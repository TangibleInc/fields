import { 
  useRef, 
  useState,
  useMemo
} from 'react'

import { 
  useListBox, 
  useFilter,
} from 'react-aria'

import { Item, useListState } from 'react-stately'

import { 
  Label,
  Description
} from '../../base'

import EnhancedOption from './EnhancedOption'
import SearchField from './SearchField'

const SingleChoices = (props) => {

  const [filterValue, setFilterValue] = useState('')
  const { contains } = useFilter({ sensitivity: 'base' })

  // Initialize visibility state
  const [visibility, setVisibility] = useState(props.value?.visibility ?? {})

  const filteredItems = useMemo(() => {
    return props.items.filter(item => 
      contains(item.label, filterValue)
    ).map(item => ({
      ...item,
      key: item.value,
      rendered: item.label
    }))
  }, [props.items, filterValue])

  const state = useListState({
    ...props,
    items: filteredItems,
    selectionMode: 'single',
    disallowEmptySelection: true,
    selectedKeys: props.value?.selected ? [props.value.selected] : (props.value && typeof props.value === 'string' ? [props.value] : []),
    onSelectionChange: (keys) => {
      const selected = Array.from(keys)[0]
      props.onChange && props.onChange({
        selected,
        visibility
      })
    }
  })

  const selectedCount = state.selectionManager.selectedKeys.size;

  // console.log('state:', state );

  const onToggleVisibility = (key) => {
    const newVisibility = {
      ...visibility,
      [key]: visibility[key] === false ? true : false
    }
    setVisibility(newVisibility)
    
    // Trigger change with updated visibility
    props.onChange && props.onChange({
      selected: Array.from(state.selectedKeys)[0],
      visibility: newVisibility
    })
  }

  const listBoxRef = useRef()
  const { listBoxProps, labelProps, descriptionProps } = useListBox(
    {
      ...props,
      'aria-label': props.label || 'Choices'
    }, 
    state, 
    listBoxRef
  )

  const handleSearchChange = (event) => {
    setFilterValue(event.target.value);
  }

  return (
    <div className="tf-enhanced-choice-single">
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
      <span className="tf-enhanced-choice__value">
        {selectedCount} selected
      </span>
      <div className="tf-enhanced-choice-search">
        <SearchField value={filterValue} onChange={setFilterValue} />
      </div>

      <ul
        { ...listBoxProps }
        ref={ listBoxRef }
        className="tf-enhanced-choice-list"
      >
        {state.collection.size === 0 ? (
           <li className="tf-enhanced-choice-no-results">No results found</li>
        ) : (
          [...state.collection].map(item => (
            <EnhancedOption 
              key={item.key} 
              item={item} 
              state={state} 
              visibility={visibility}
              onToggleVisibility={onToggleVisibility}
            />
          ))
        )}
      </ul>

    </div>
  )
}

export default SingleChoices
