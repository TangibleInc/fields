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
  Description,
  Button
} from '../../base'

import EnhancedOption from './EnhancedOption'
import SearchField from './SearchField'

const SingleChoices = (props) => {

  const [filterValue, setFilterValue] = useState('');
  // const [value, setValue] = useState(props.value || null);
  const { contains } = useFilter({ sensitivity: 'base' })
  const [isConfirmed, setIsConfirmed] = useState(false);

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
    disallowEmptySelection: false,
    children: (item) => <Item key={item.key}>{item.rendered}</Item>,
    selectedKeys: props.value?.selected ? [props.value.selected] : (props.value && typeof props.value === 'string' ? [props.value] : []),
    onSelectionChange: (keys) => {
      setIsConfirmed(false);
      const selectedKey = Array.from(keys)[0]

      if (keys.size === 0) {
       setFilterValue('');
      }

      props.onChange && props.onChange({
        selected: selectedKey,
        visibility
      })
    }
  })

  const selectedCount = state.selectionManager.selectedKeys.size;

  const handleConfirmSelection = () => {
    const selectedKey = state.selectionManager.firstSelectedKey;
    const items = props.items || [];
    const selectedItem = items.find(item => item.value === selectedKey);

    if(selectedItem){
      setFilterValue(selectedItem.label);
      setIsConfirmed(true);
    }
    else
      setFilterValue('');

    props.onChange && props.onChange({
      selected: selectedKey,
      visibility
    })
  }

  const handleSearchBlur = () => {
    if(filterValue === '' && isConfirmed){
      const selectedKey = state.selectionManager.firstSelectedKey;
      const selectedItem = (props.items || []).find(item => item.value === selectedKey);
      if (selectedItem) {
        setFilterValue(selectedItem.label);
      }
    }
  }

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
        {selectedCount === 0 ? (
          'Not selected'
        ) : isConfirmed ? (
          'Selected' 
        ) : (
          <Button onPress={handleConfirmSelection}>Confirm selected</Button>
        )}
      </span>
      <div className="tf-enhanced-choice-search">
        <SearchField value={filterValue} onChange={setFilterValue} onBlur={handleSearchBlur} />
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
