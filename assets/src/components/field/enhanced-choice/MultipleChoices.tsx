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

/**
 * Custom Option component with Checkbox and Visibility (Eye) icon
 */
const EnhancedOption = ({ item, state, visibility, onToggleVisibility }) => {
  const ref = useRef()
  const { 
    optionProps, 
    isSelected, 
    isFocused,
    isDisabled 
  } = useOption({ key: item.key }, state, ref)
  
  const { focusProps } = useFocusRing()
  
  const isVisible = visibility[item.key] !== false

  const handleEyeClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onToggleVisibility(item.key)
  }

  let classes = 'tf-enhanced-choice-option'
  if (isSelected) classes += ' is-selected'
  if (isFocused) classes += ' is-focused'
  if (isDisabled) classes += ' is-disabled'
  if (!isVisible) classes += ' is-hidden'

  return (
    <li
      { ...mergeProps(optionProps, focusProps) }
      ref={ref}
      className={classes}
    >
      <div className="tf-enhanced-choice-option-content">
        <div className="tf-enhanced-choice-checkbox">
          <input 
            type="checkbox" 
            checked={isSelected} 
            readOnly 
            tabIndex={-1}
            aria-hidden="true" 
          />
        </div>
        <div className="tf-enhanced-choice-label">
          {item.rendered}
        </div>
        <button 
          className="tf-enhanced-choice-visibility-toggle"
          onClick={handleEyeClick}
          aria-label={isVisible ? 'Hide item' : 'Show item'}
          type="button"
        >
          {isVisible ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          )}
        </button>
      </div>
    </li>
  )
}

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
