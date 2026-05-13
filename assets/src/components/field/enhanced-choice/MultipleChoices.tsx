import { 
  useEffect,
  useRef, 
  useState,
  useMemo
} from 'react'

import { 
  useListBox, 
  useOption,
  useFilter,
  mergeProps,
  useFocusRing,
  VisuallyHidden
} from 'react-aria'

import { Item, useListState } from 'react-stately'

import { 
  Button,
  Popover,
  Label,
  Description
} from '../../base'

import { initSet } from '../../../utils'
import EnhancedOption from './EnhancedOption'

const MultipleChoices = (props) => {
  
  const [filterValue, setFilterValue] = useState('')
  const { contains } = useFilter({ sensitivity: 'base' })
  const [isOpen, setOpen] = useState(false)

  const inputRef = useRef()
  const containerRef = useRef()
  const listBoxRef = useRef()

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
    selectionMode: 'multiple',
    children: (item) => <Item key={item.key}>{item.rendered}</Item>,
    selectedKeys: initSet(props.value?.selected ?? props.value ?? []),
    onSelectionChange: (keys) => {
      const selected = Array.from(keys)
      props.onChange && props.onChange({
        selected,
        visibility
      })
    }
  })

  const onToggleVisibility = (key) => {
    const newVisibility = {
      ...visibility,
      [key]: visibility[key] === false ? true : false
    }
    setVisibility(newVisibility)
    
    props.onChange && props.onChange({
      selected: Array.from(state.selectionManager.selectedKeys),
      visibility: newVisibility
    })
  }

  const { listBoxProps, labelProps, descriptionProps } = useListBox(
    {
      ...props,
      'aria-label': props.label || 'Choices'
    }, 
    state, 
    listBoxRef
  )

  const selectedItems = useMemo(() => {
    return props.items.filter(item => state.selectionManager.selectedKeys.has(item.value))
  }, [state.selectionManager.selectedKeys, props.items])

  const removeKey = (key) => {
    state.selectionManager.toggleSelection(key)
  }

  const selectedCount = state.selectionManager.selectedKeys === 'all' 
    ? props.items.length 
    : state.selectionManager.selectedKeys.size

  return (
    <div className="tf-enhanced-choice-multiple" ref={containerRef}>
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      
      <div className="tf-enhanced-choice-search-row">
        <input 
          ref={inputRef}
          type="text"
          value={filterValue}
          onChange={e => {
            setFilterValue(e.target.value)
            if (!isOpen) setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder={props.placeholder ?? 'Search...'}
          className="tf-enhanced-choice-search-input"
        />
        <Button
          type="action"
          onPress={() => setOpen(!isOpen)}
          className="tf-enhanced-choice-toggle-btn"
        >
          <span aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
        </Button>
      </div>

      { isOpen && (
        <Popover
          state={{ isOpen: isOpen, close: () => setOpen(false) }}
          triggerRef={inputRef}
          placement="bottom start"
          style={{ width: containerRef?.current?.offsetWidth }}
        >
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
        </Popover>
      )}

      {selectedItems.length > 0 && (
        <div className="tf-enhanced-choice-tags">
          {selectedItems.map(item => (
            <div 
              key={item.value} 
              className={`tf-enhanced-choice-tag ${visibility[item.value] === false ? 'is-hidden' : ''}`}
            >
              <span className="tf-enhanced-choice-tag-label">{item.label}</span>
              <button 
                type="button" 
                onClick={() => removeKey(item.value)}
                className="tf-enhanced-choice-tag-remove"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
    </div>
  )
}

export default MultipleChoices
