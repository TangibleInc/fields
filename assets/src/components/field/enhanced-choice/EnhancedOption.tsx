import { 
  useRef, 
} from 'react'

import { 
  useOption,
  mergeProps,
  useFocusRing
} from 'react-aria'

import Checkbox from '../checkbox/Checkbox';

const EnhancedOption = ({ item, state, visibility, isVisibilityEnabled, onToggleVisibility, name }) => {
  const ref = useRef()
  const { 
    optionProps, 
    isSelected, 
    isFocused,
    isDisabled 
  } = useOption({ key: item.key }, state, ref)

  const { isFocusVisible, focusProps } = useFocusRing();

  const isVisible = visibility[item.key] !== false
  const isSingle = state.selectionManager.selectionMode === 'single'

  const handleEyeClick = (e) => {
    e.stopPropagation()
    e.preventDefault()
    onToggleVisibility(item.key)
  }

  // Prevent selection logic from firing when clicking the toggle
  const preventSelection = (e) => {
    e.stopPropagation()
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
      data-focus-visible={isFocusVisible}
      className={classes}
    >
      <div className="tf-enhanced-choice-option-content">
        <div className="tf-enhanced-choice-selection-indicator" style={{ pointerEvents: 'none' }}>
          { isSingle ? (
            <input 
              type="radio" 
              name={name ? `${name}_radio_group` : 'enhanced_choice_radio'}
              checked={isSelected} 
              onChange={() => {}} // Controlled by state
              disabled={isDisabled}
              className="tf-enhanced-choice-radio"
            />
          ) : (
            <Checkbox 
              isSelected={isSelected}
              isDisabled={isDisabled}
            />
          )}
        </div>
        <div className="tf-enhanced-choice-label">
          {item.rendered}
        </div>
        <button 
          className="tf-enhanced-choice-visibility-toggle"
          onClick={handleEyeClick}
          onPointerDown={preventSelection}
          onMouseDown={preventSelection}
          aria-label={isVisible ? 'Hide item' : 'Show item'}
          type="button"
        >
          {isVisibilityEnabled && (isVisible ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ))}
        </button>
      </div>
    </li>
  )
}

export default EnhancedOption
