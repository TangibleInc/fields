import { useRef } from "react";
// import { Popover } from "../../base";
import { useEnhancedChoices } from "./useEnhancedChoices";

const SingleChoices = (props) => {
  const popoverRef = useRef(null);
  console.log(props);
  const {
    // state
    inputValue,
    selectedKey,
    pendingKey,
    isOpen,
    setIsOpen,
    focusedIndex,
    setFocusedIndex,
    visibility,

    // derived
    filteredItems,
    hiddenValue,
    isConfirmed,
    isNotSelected,
    hasPending,

    // helpers
    isItemSelected,
    isItemPending,
    findItem,

    // handlers
    onInputChange,
    onSelectionChange,
    handleConfirm,
    handleClear,
    onToggleVisibility,
    handleKeyDown,

    // aria
    inputAriaProps,
    listBoxAriaProps,
    getOptionAriaProps,

    // refs
    inputRef,
    buttonRef,
    listBoxRef,

    // label
    ariaLabel,
  } = useEnhancedChoices({ ...props, mode: 'single' });

  const selectedItem = findItem(selectedKey);
  const pendingLabel = pendingKey ? findItem(pendingKey)?.label ?? '' : null;

  const initialInputValue = findItem(selectedKey)?.label ?? '';

  console.log(selectedItem);
  console.log(selectedKey);
  console.log('input value:', inputValue);
  console.log('hidden value:', hiddenValue);
  console.log('pending key:', pendingKey);
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', width: '100%' }}>

      <div className="tf-enhanced-choice-header">
        <div className="tf-enhanced-choice-label-group">
          {props.label && (
            <label
              htmlFor={`${ariaLabel}-input`}
              className="tf-enhanced-choice-label-text"
            >
              {props.label}
            </label>
          )}
          {props.description && (
            <span className="tf-enhanced-choice-description">
              {props.description}
            </span>
          )}
        </div>

        <div className="tf-enhanced-choice-status">
          {hasPending && (
            <button
              type="button"
              className="tf-enhanced-choice-confirm-btn"
              onMouseDown={handleConfirm}
            >
              Confirm Selected
            </button>
          )}
          {isConfirmed && (
            <span className="tf-enhanced-choice-selected-badge">
              Selected
            </span>
          )}
          {isNotSelected && (
            <span className="tf-enhanced-choice-not-selected-badge">
              Not Selected
            </span>
          )}
        </div>
      </div>

      <input type="hidden" name={props.name} value={hiddenValue} />

      <div className="tf-enhanced-choice-input-group" style={{ position: 'relative' }}>

        <span className="tf-enhanced-choice-search-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </span>

        <input
          {...inputAriaProps}
          id={`${ariaLabel}-input`}
          ref={inputRef}
          className="tf-enhanced-choice-input"
          style={{ height: 32, boxSizing: 'border-box' }}
          placeholder={props.placeholder ?? 'Search...'}
          value={pendingLabel ?? initialInputValue}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => !isConfirmed && setIsOpen(true)}
        />

        {isConfirmed ? (
          <button
            type="button"
            className="tf-enhanced-choice-clear-btn"
            aria-label="Clear selection"
            onMouseDown={handleClear}
          >
            ×
          </button>
        ) : (
          <button
            ref={buttonRef}
            type="button"
            className="tf-enhanced-choice-chevron-btn"
            aria-label="Toggle options"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsOpen(o => !o);
            }}
          >
            <span aria-hidden="true" className="tf-enhanced-choice-chevron">
              {isOpen ? '▲' : '▼'}
            </span>
          </button>
        )}

        {isOpen && (
          <div
            ref={popoverRef}
            className="tf-enhanced-choice-popover"
            onMouseDown={(e) => e.preventDefault()}
          >
            <ul
              {...listBoxAriaProps}
              ref={listBoxRef}
              className="tf-enhanced-choice-list"
            >
              {filteredItems.length === 0 && (
                <li className="tf-enhanced-choice-empty">
                  No results found.
                </li>
              )}

              {filteredItems.map((item, index) => {
                const isSelected = isItemSelected(item.value);
                const isPending  = isItemPending(item.value);
                const isFocused  = index === focusedIndex;
                const isMarked   = isSelected || isPending;

                let classes = 'tf-enhanced-choice-option';
                if (isMarked)  classes += ' is-selected';
                if (isFocused) classes += ' is-focused';

                return (
                  <li
                    {...getOptionAriaProps(item.value, index)}
                    key={item.value}
                    className={classes}
                    onMouseEnter={() => setFocusedIndex(index)}
                    onMouseLeave={() => setFocusedIndex(-1)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      onSelectionChange(item.value);
                    }}
                  >
                    <div className="tf-enhanced-choice-option-content">

                      <div
                        className="tf-enhanced-choice-selection-indicator"
                        style={{ pointerEvents: 'none' }}
                      >
                        <span
                          aria-hidden="true"
                          className={`tf-enhanced-choice-radio${isMarked ? ' is-checked' : ''}`}
                        />
                      </div>

                      <div className="tf-enhanced-choice-label">
                        {item.label}
                      </div>

                      {props.isVisibilityEnabled && (
                        <button
                          type="button"
                          className="tf-enhanced-choice-visibility-toggle"
                          aria-label={visibility[item.value] !== false ? 'Hide item' : 'Show item'}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleVisibility(item.value);
                          }}
                        >
                          {visibility[item.value] !== false ? (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                              <line x1="1" y1="1" x2="23" y2="23"/>
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleChoices;
