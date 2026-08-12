import { useCallback, useMemo } from "react";
import { useEnhancedChoices } from "./useEnhancedChoices";
import { Button, Chip, Icon, IconButton, TextInput, Checkbox as TuiCheckbox } from '@tangible/ui';
import { useState } from "react";

interface FlatItem {
  value:        string;
  label:        string;
  description?: string;
  category?:    string;
  viewLink?:    string;
}

interface GroupedItem {
  label: string;
  items: FlatItem[];
}

interface MultipleChoicesProps {
  items:                FlatItem[] | GroupedItem[];
  value?:               string[];
  label?:               string;
  name?:                string;
  description?:         string;
  placeholder?:         string;
  isGrouped?:           boolean;
  isViewable?:          boolean;
  onChange?:            (value: string[]) => void;
}

const MultipleChoices = (props: MultipleChoicesProps) => {

  const flatItems = useMemo<FlatItem[]>(() => {
    if (!props.isGrouped) return props.items as FlatItem[];
    return (props.items as GroupedItem[]).flatMap(g => g.items);
  }, [props.items, props.isGrouped]);

  const {
    inputValue,
    selectedKeys,
    pendingKeys,
    isOpen,
    setIsOpen,
    focusedIndex,
    setFocusedIndex,
    filteredItems,
    hiddenValue,
    isConfirmed,
    isNotSelected,
    isItemPending,
    findItem,
    onInputChange,
    onSelectionChange,
    handleConfirm,
    handleClear,
    handleRemoveChip,
    handleKeyDown,
    inputAriaProps,
    listBoxAriaProps,
    getOptionAriaProps,
    inputRef,
    listBoxRef,
    ariaLabel,
    normalizedGroups,
  } = useEnhancedChoices({ ...props, items: flatItems, mode: 'multiple' });

  const [reviewMode, setReviewMode] = useState(false);

  const handleViewSelected = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setReviewMode(true);
  }, []);

  const handleCancelReview = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setReviewMode(false);
  }, []);

  const handleConfirmSelected = useCallback((e: React.MouseEvent) => {
    handleConfirm(e);
    setReviewMode(false);
  }, [handleConfirm]);

  const handleReviewRemove = useCallback((key: string) => {
    onSelectionChange(key);
  }, [onSelectionChange]);

  const groupedItems = useMemo<GroupedItem[]>(() => {
    if (!props.isGrouped) {
      return [{ label: '', items: filteredItems as FlatItem[] }];
    }
    // Use normalizedGroups from hook if choices was a grouped PHP format
    const source = normalizedGroups
      ? normalizedGroups.map(g => ({ label: g.label, items: g.items as FlatItem[] }))
      : props.items as GroupedItem[];

    return source
      .map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.label.toLowerCase().includes(inputValue.toLowerCase())
        ),
      }))
      .filter(group => group.items.length > 0);
  }, [props.isGrouped, props.items, filteredItems, inputValue, normalizedGroups]);

  const getGroupSelectAllState = useCallback((groupItems: FlatItem[]) => {
    const keys    = groupItems.map(i => i.value);
    const checked = keys.filter(k => pendingKeys.includes(k));
    if (checked.length === 0)           return 'none';
    if (checked.length === keys.length) return 'all';
    return 'some';
  }, [pendingKeys]);

  const handleSelectAll = useCallback((groupItems: FlatItem[]) => {
    const keys  = groupItems.map(i => i.value);
    const state = getGroupSelectAllState(groupItems);
    if (state === 'all') {
      keys.forEach(k => { if (pendingKeys.includes(k))  onSelectionChange(k); });
    } else {
      keys.forEach(k => { if (!pendingKeys.includes(k)) onSelectionChange(k); });
    }
  }, [getGroupSelectAllState, pendingKeys, onSelectionChange]);

  const hasPending     = isOpen && pendingKeys.length > 0;

  // Global Select All
  const globalSelectAllState = useMemo(() => {
    const checked = filteredItems.filter(i => pendingKeys.includes(i.value));
    if (checked.length === 0)                  return 'none';
    if (checked.length === filteredItems.length) return 'all';
    return 'some';
  }, [filteredItems, pendingKeys]);

  const handleGlobalSelectAll = useCallback(() => {
    if (globalSelectAllState === 'all') {
      filteredItems.forEach(i => { if (pendingKeys.includes(i.value))  onSelectionChange(i.value); });
    } else {
      filteredItems.forEach(i => { if (!pendingKeys.includes(i.value)) onSelectionChange(i.value); });
    }
  }, [globalSelectAllState, filteredItems, pendingKeys, onSelectionChange]);

  const renderViewLink = (item: FlatItem) => {
    if (!props.isViewable || !item.viewLink) return null;
    return (
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
    );
  };

  const renderOptionRow = (item: FlatItem, index: number) => {
    const isPending = isItemPending(item.value);
    const isFocused = index === focusedIndex;

    let classes = 'tf-enhanced-choice-option';
    if (isPending) classes += ' is-selected';
    if (isFocused) classes += ' is-focused';

    return (
      <li
        {...getOptionAriaProps(item.value, index)}
        key={item.value}
        className={classes}
        onMouseEnter={() => setFocusedIndex(index)}
        onMouseLeave={() => setFocusedIndex(-1)}
        onMouseDown={(e) => { e.preventDefault(); onSelectionChange(item.value); }}
      >
        <div className="tf-enhanced-choice-option-content">
          <div className="tf-enhanced-choice-selection-indicator" style={{ pointerEvents: 'none' }}>
            <TuiCheckbox checked={isPending} disabled={false} />
          </div>
          <div className="tf-enhanced-choice-label">{item.label}</div>
          {renderViewLink(item)}
        </div>
      </li>
    );
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', width: '100%' }}>

      <div className="tf-enhanced-choice-header">
        <div className="tf-enhanced-choice-label-group">
          {props.label && (
            <label htmlFor={`${ariaLabel}-input`} className="tf-enhanced-choice-label-text">
              {props.label}
            </label>
          )}
          {props.description && (
            <span className="tf-enhanced-choice-description">{props.description}</span>
          )}
        </div>

        <div className="tf-enhanced-choice-status">
          {hasPending && !reviewMode && (
            <Button
              label={`View Selected (${pendingKeys.length})`}
              variant="link"
              size="xs"
              theme="primary"
              onClick={handleViewSelected}
            />
          )}

          {selectedKeys.length > 0 && !isOpen && (
            <Chip size="xs" theme="primary">{selectedKeys.length} Selected</Chip>
          )}

          {isNotSelected && (
            <Chip size="xs" theme="secondary">0 Selected</Chip>
          )}
        </div>
      </div>

      <input type="hidden" name={props.name} value={hiddenValue} />

      <div
        className="tf-enhanced-choice-input-group tf-enhanced-choice-input-group--multi"
        style={{ position: 'relative' }}
      >

        <TextInput
          {...inputAriaProps}
          id={`${ariaLabel}-input`}
          ref={inputRef}
          className="tf-enhanced-choice-input--inline"
          placeholder={selectedKeys.length === 0 ? (props.placeholder ?? 'Search...') : ''}
          value={inputValue}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          prefix={
              <>
                {isConfirmed ? 
                  <Icon name="system/check" size="xxl" /> : 
                  <Icon name="system/search" size="xxl" />
                }
                {selectedKeys.length > 0 && (
                <span style={{display: 'flex', flexWrap: 'wrap', gap: 'var(--tui-spacing-xxs)'}}>
                  {selectedKeys.map(key => {
                    const item = findItem(key);
                    if (!item) return null;
                    return (
                      <Chip key={key} size="xs" theme="primary" onRemove={() => handleRemoveChip(key)} removeLabel={`Remove ${item.label}`}>
                        {item.label}
                      </Chip>
                    );
                  })}
                </span>
                )}
              </>
            }
            suffix={
              selectedKeys.length > 0 ? (
                <IconButton label="Clear all" icon="system/close" onClick={handleClear} size="xs" />
              ) : (
                <IconButton
                  label="Toggle options"
                  icon={isOpen ? 'system/chevron-up' : 'system/chevron-down'}
                  onClick={() => setIsOpen(o => !o)}
                  size="xs"
                />
              )
            }
        />

          {isOpen && (
            <div
              className="tf-enhanced-choice-popover"
              onMouseDown={(e) => e.preventDefault()}
            >
              {reviewMode ? (

                <div className="tf-enhanced-choice-review">
                  {pendingKeys.map(key => {
                    const item = findItem(key);
                    if (!item) return null;
                    return (
                      <div key={key} className="tf-enhanced-choice-review-row">
                        <span className="tf-enhanced-choice-review-label">{item.label}</span>
                        <IconButton
                          icon="system/close"
                          label={`Remove ${item.label}`}
                          variant="ghost"
                          size="xs"
                          onClick={() => handleReviewRemove(key)}
                        />

                      </div>
                    );
                  })}
                  <div className="tf-enhanced-choice-review-footer">
                    <span className="tf-enhanced-choice-review-question">Are you sure?</span>
                    <Button label="Cancel" variant="ghost" size="xs" onClick={handleCancelReview} />
                    <Button label="Confirm Selected" variant="solid" theme="primary" size="xs" onClick={handleConfirmSelected} />
                  </div>
                </div>

              ) : (

                <>
                  <ul
                    {...listBoxAriaProps}
                    ref={listBoxRef}
                    className="tf-enhanced-choice-list"
                  >
                    {filteredItems.length === 0 && (
                      <li className="tf-enhanced-choice-empty">No results found.</li>
                    )}

                    {/* Global Select All only when not grouped */}
                    {!props.isGrouped && filteredItems.length > 0 && (
                      <li
                        role="presentation"
                        className="tf-enhanced-choice-option tf-enhanced-choice-select-all"
                        onMouseDown={(e) => { e.preventDefault(); handleGlobalSelectAll(); }}
                      >
                        <div className="tf-enhanced-choice-option-content">
                          <div className="tf-enhanced-choice-selection-indicator" style={{ pointerEvents: 'none' }}>
                            <TuiCheckbox
                              checked={globalSelectAllState === 'all'}
                              indeterminate={globalSelectAllState === 'some'}
                              disabled={false}
                            />
                          </div>
                          <div className="tf-enhanced-choice-label">Select All</div>
                        </div>
                      </li>
                    )}

                    {groupedItems.map((group) => {
                      const selectAllState = getGroupSelectAllState(group.items);
                      let optionIndex = 0;

                      return (
                        <li key={group.label || '__default'} role="presentation">
                          {props.isGrouped && (
                            <div className="tf-enhanced-choice-group-header">
                              <span className="tf-enhanced-choice-group-label">
                                {group.label}
                              </span>
                              <div
                                className="tf-enhanced-choice-option tf-enhanced-choice-select-all"
                                onMouseDown={(e) => { e.preventDefault(); handleSelectAll(group.items); }}
                              >
                                <div className="tf-enhanced-choice-option-content">
                                  <div className="tf-enhanced-choice-selection-indicator" style={{ pointerEvents: 'none' }}>
                                    <TuiCheckbox
                                      checked={selectAllState === 'all'}
                                      indeterminate={selectAllState === 'some'}
                                      disabled={false}
                                    />
                                  </div>
                                  <div className="tf-enhanced-choice-label">Select All</div>
                                </div>
                              </div>                    
                            </div>
                          )}

                          <ul role="group" aria-label={group.label} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {group.items.map((item) => {
                              const index = optionIndex++;
                              return renderOptionRow(item, index);
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
          )}
      </div>
    </div>
  );
};

export default MultipleChoices;
