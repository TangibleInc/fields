import { useCallback, useState } from "react";
import { useEnhancedChoices } from "./useEnhancedChoices";
import { TextInput, IconButton, Icon, Button } from "@tangible/ui";

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
            <Button 
              label="Confirm Selected" 
              variant="ghost" 
              theme="primary" 
              onClick={handleConfirm}
              size="xs"
            />
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

      <div style={{ position: 'relative' }}>

        {isCustomMode ? (
          <>
            <TextInput
              {...inputAriaProps}
              id={`${ariaLabel}-input`}
              placeholder="Enter custom value..."
              value={customDraft}
              onChange={(e) => setCustomDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter')  { e.preventDefault(); handleConfirmCustomVal(); }
                if (e.key === 'Escape') { e.preventDefault(); handleCancelCustomMode(); }
              }}
              autoFocus
              prefix={<Icon name="lms/edit-externally" size="xxl" />}
              suffix={<IconButton label="Clear selection" icon="system/close" onClick={handleCancelCustomMode} />}
            />
          </>
        ) : (
          <>
            <TextInput
              {...inputAriaProps}
              id={`${ariaLabel}-input`}
              ref={inputRef}
              // className="tf-enhanced-choice-input"
              prefix={showConfirmedUI ? <Icon name="system/check" size="xxl" /> : <Icon name="system/search" size="xxl" /> }
              suffix={showConfirmedUI
                ? <IconButton size="xs" label="Clear selection" icon="system/close" onClick={handleClear} />
                : <IconButton size="xs" ref={buttonRef} label="Toggle options" icon={isOpen ? 'system/chevron-up' : 'system/chevron-down'} onClick={() => setIsOpen(o => !o)} />
              }
              placeholder={props.placeholder ?? 'Search...'}
              value={pendingLabel ?? inputValue}
              onChange={onInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => !isConfirmed && setIsOpen(true)}
            />
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
                           <Icon name="lms/visible" size="md" aria-hidden="true" />
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
                  <Button 
                    label="Custom Value" 
                    variant="primary" 
                    size="sm"
                    onClick={handleCustomModeToggle} 
                  />
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
