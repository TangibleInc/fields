import { useCallback, useState } from "react";
import { useEnhancedChoices } from "./useEnhancedChoices";
import { TextInput, IconButton, Icon } from "@tangible/ui";

// const SearchIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//     <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
//     <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
//   </svg>
// );

// const PencilIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//     <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
//     <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
//   </svg>
// );

// const CheckIcon = () => (
//   <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
//     <path d="M2 7L5.5 10.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
//   </svg>
// );

const SingleChoices = (props) => {

  const {
    // state
    inputValue,
    selectedKey,
    pendingKey,
    isOpen,
    setIsOpen,
    focusedIndex,
    setFocusedIndex,

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
    handleConfirmCustom,
    handleKeyDown,

    // aria
    inputAriaProps,
    listBoxAriaProps,
    getOptionAriaProps,

    // refs
    inputRef,
    buttonRef,
    listBoxRef,
    popoverRef,

    // label
    ariaLabel,
  } = useEnhancedChoices({ ...props, mode: 'single' });

  const pendingLabel = pendingKey ? findItem(pendingKey)?.label ?? '' : null;

  const isCustomModeEnabled = props.isCustomModeEnabled ?? false;
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customDraft,  setCustomDraft]  = useState('');

  const handleCustomModeToggle = useCallback(() => {
    setIsOpen(false);
    setIsCustomMode(true);
    setCustomDraft('');
  }, [setIsOpen]);

  const handleCancelCustomMode = useCallback(() => {
    setIsCustomMode(false);
    setCustomDraft('');
    setIsOpen(true);
  }, [setIsOpen]);

  const handleConfirmCustomVal = useCallback(() => {
    if (customDraft.trim() === '') return;
    handleConfirmCustom(customDraft.trim());
    setIsCustomMode(false);
    setCustomDraft('');
  }, [customDraft, handleConfirmCustom]);

  // handleConfirmCustom now adds the value as a real item to the list (via
  // extraItems in the hook), so reopening the dropdown afterward will show
  // it as a normal checked radio option — not just a raw string.
  const showConfirmedUI = isConfirmed && !isCustomMode;

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', width: '100%' }}>

      {/* ── Header ── */}
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
          {hasPending && !isCustomMode && (
            <button
              type="button"
              className="tf-enhanced-choice-confirm-btn"
              onMouseDown={handleConfirm}
            >
              Confirm Selected
            </button>
          )}
          {showConfirmedUI && (
            <span className="tf-enhanced-choice-selected-badge">
              Selected
            </span>
          )}
          {isNotSelected && !isCustomMode && (
            <span className="tf-enhanced-choice-not-selected-badge">
              Not Selected
            </span>
          )}
        </div>
      </div>

      <input type="hidden" name={props.name} value={hiddenValue} />

      <div className="tf-enhanced-choice-input-group-container" style={{ position: 'relative' }}>

        {isCustomMode ? (
          <>
            {/* <span className="tf-enhanced-choice-search-icon" aria-hidden="true">
              <PencilIcon />   
            </span> */}

            <TextInput
              className="tf-enhanced-choice-input"
              style={{ height: 32, boxSizing: 'border-box', flex: 1 }}
              placeholder="Enter custom value..."
              value={customDraft}
              onChange={(e) => setCustomDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter')  { e.preventDefault(); handleConfirmCustomVal(); }
                if (e.key === 'Escape') { e.preventDefault(); handleCancelCustomMode(); }
              }}
              autoFocus
              prefix={<Icon name="system/edit-externally" size="xxl" />}
              suffix={<IconButton label="Clear selection" icon="system/close" onClick={handleCancelCustomMode} />}
            />

            {/* <button
              type="button"
              className="tf-enhanced-choice-cancel-btn"
              onMouseDown={(e) => { e.preventDefault(); handleCancelCustomMode(); }}
            >
              ×
            </button> */}
          </>
        ) : (
          <>
            {/* <span className="tf-enhanced-choice-search-icon" aria-hidden="true">
              {showConfirmedUI ? <CheckIcon /> : <SearchIcon />}
            </span> */}

            {/* <input
              {...inputAriaProps}
              id={`${ariaLabel}-input`}
              ref={inputRef}
              className="tf-enhanced-choice-input"
              style={{ height: 32, boxSizing: 'border-box' }}
              placeholder={props.placeholder ?? 'Search...'}
              value={pendingLabel ?? inputValue}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => !isConfirmed && setIsOpen(true)}
            /> */}
            <TextInput
              {...inputAriaProps}
              id={`${ariaLabel}-input`}
              ref={inputRef}
              // className="tf-enhanced-choice-input"
              prefix={showConfirmedUI ? <Icon name="system/check" size="xxl" /> : <Icon name="system/search" size="xxl" /> }
              suffix={showConfirmedUI
                ? <IconButton label="Clear selection" icon="system/close" onClick={handleClear} />
                : <IconButton ref={buttonRef} label="Toggle options" icon={isOpen ? 'system/chevron-up' : 'system/chevron-down'} onClick={() => setIsOpen(o => !o)} />
              }
              placeholder={props.placeholder ?? 'Search...'}
              value={pendingLabel ?? inputValue}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => !isConfirmed && setIsOpen(true)}
            />

            {/* {showConfirmedUI ? (
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
            )} */}
          </>
        )}

        {isOpen && !isCustomMode && (
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

                      {props.isViewable && item.viewLink && (
                        <a
                          href={item.viewLink}
                          className="tf-enhanced-choice-view-link"
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`View ${item.label}`}
                          onMouseDown={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </li>
                );
              })}

              {isCustomModeEnabled && (
                <li
                  className="tf-enhanced-choice-custom-value-footer"
                  role="presentation"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <div className="tf-enhanced-choice-custom-value-text">
                    <span className="tf-enhanced-choice-custom-value-label">
                      Can't find what you're looking for?
                    </span>
                    <span className="tf-enhanced-choice-custom-value-sub">
                      Create your own.
                    </span>
                  </div>
                  <button
                    type="button"
                    className="tf-enhanced-choice-custom-value-btn"
                    onClick={handleCustomModeToggle}
                  >
                    Custom Value
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleChoices;
