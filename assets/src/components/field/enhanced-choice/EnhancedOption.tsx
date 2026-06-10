import { useRef } from 'react';
import { useOption, mergeProps, useFocusRing } from 'react-aria';
import Checkbox from '../checkbox/Checkbox';

const EnhancedOption = ({ item, state, isVisibilityEnabled, name, visibility = {}, onToggleVisibility, isPending }) => {
  const ref = useRef(null);

  const {
    optionProps,
    isSelected,
    isFocused,
    isDisabled,
  } = useOption({ key: item.key }, state, ref);

  const { isFocusVisible, focusProps } = useFocusRing();

  const isVisible = visibility ? visibility[item.key] !== false : true;
  const isSingle  = state.selectionManager.selectionMode === 'single';

  const handleEyeClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleVisibility?.(item.key);
  };

  const preventSelection = (e) => {
    e.stopPropagation();
  };

  const isMarked = isSelected || isPending;
 
  let classes = 'tf-enhanced-choice-option';
  if (isMarked)   classes += ' is-selected';
  if (isFocused)  classes += ' is-focused';
  if (isDisabled) classes += ' is-disabled';
  if (isPending && !isSelected) classes += ' is-pending';

  return (
    <li
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      className={classes}
      data-focus-visible={isFocusVisible}
    >
      <div className="tf-enhanced-choice-option-content">
        <div
          className="tf-enhanced-choice-selection-indicator"
          style={{ pointerEvents: 'none' }}
        >
          {isSingle ? (
            <span
              aria-hidden="true"
              className={`tf-enhanced-choice-radio${isMarked ? ' is-checked' : ''}`}
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

        {isVisibilityEnabled && (
          <button
            type="button"
            className="tf-enhanced-choice-visibility-toggle"
            onClick={handleEyeClick}
            onPointerDown={preventSelection}
            onMouseDown={preventSelection}
            aria-label={isVisible ? 'Hide item' : 'Show item'}
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
        )}
      </div>
    </li>
  );
};

export default EnhancedOption;
