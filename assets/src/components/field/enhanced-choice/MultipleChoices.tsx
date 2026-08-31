import { useCallback, useEffect, useMemo } from "react";
import { useEnhancedChoices } from "./useEnhancedChoices";
import { Button, Chip, Icon, IconButton, TextInput, Checkbox as TuiCheckbox } from '@tangible/ui';
import { useState } from "react";
import { ItemLayoutConfig, renderItemLayoutSlots } from "./ItemLayoutRegistry";

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
  itemLayout?:          ItemLayoutConfig;
}

type NavSlot =
  | { type: 'global-select-all' }
  | { type: 'group-select-all'; groupItems: FlatItem[] }
  | { type: 'item'; item: FlatItem };

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
    // isNotSelected,
    isItemPending,
    findItem,
    onInputChange,
    onSelectionChange,
    handleConfirm,
    handleClear,
    handleRemoveChip,
    // handleKeyDown,
    inputAriaProps,
    listBoxAriaProps,
    getOptionAriaProps,
    inputRef,
    listBoxRef,
    fieldRef,
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

    const navSlots = useMemo<NavSlot[]>(() => {
    const slots: NavSlot[] = [];

    if (!props.isGrouped) {
      if (filteredItems.length > 0) slots.push({ type: 'global-select-all' });
      filteredItems.forEach(item => slots.push({ type: 'item', item }));
      return slots;
    }

    groupedItems.forEach(group => {
      slots.push({ type: 'group-select-all', groupItems: group.items });
      group.items.forEach(item => slots.push({ type: 'item', item }));
    });

    return slots;
  }, [props.isGrouped, filteredItems, groupedItems]);

  const maxIndex = navSlots.length - 1;

  const handleFieldKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && inputValue === '' && selectedKeys.length > 0) {
      e.preventDefault();
      handleRemoveChip(selectedKeys[selectedKeys.length - 1]);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex(i => (i + 1) > maxIndex ? 0 : i + 1);
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(i => (i - 1) < 0 ? maxIndex : i - 1);
      return;
    }

    if (e.key === 'Enter' && focusedIndex >= 0 && focusedIndex <= maxIndex) {
      e.preventDefault();
      const slot = navSlots[focusedIndex];
      if (slot.type === 'global-select-all') {
        handleGlobalSelectAll();
      } else if (slot.type === 'group-select-all') {
        handleSelectAll(slot.groupItems);
      } else {
        onSelectionChange(slot.item.value);
      }
      return;
    }

    if (e.key === 'Escape') {
      setIsOpen(false);
      setReviewMode(false);
      setFocusedIndex(-1);
    }
  }, [
    inputValue, selectedKeys, handleRemoveChip,
    maxIndex, focusedIndex, navSlots,
    handleGlobalSelectAll, handleSelectAll, onSelectionChange,
    setIsOpen, setFocusedIndex,
  ]);

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
        <Icon name="lms/view" size="md" aria-hidden="true" />
      </a>
    );
  };

  const statusState = hasPending && !reviewMode
  ? 'pending'
  : selectedKeys.length > 0 && !isOpen
    ? 'selected'
    : 'empty';

  const statusConfig = {
    pending: {
      label: `View Selected (${pendingKeys.length})`,
      variant: 'link',
      theme: 'primary',
      disabled: false,
    },
    selected: {
      label: `${selectedKeys.length} Selected`,
      variant: 'solid',
      theme: 'primary',
      disabled: true,
    },
    empty: {
      label: `${pendingKeys.length > 0 ? pendingKeys.length : '0'} Selected`,
      variant: 'ghost',
      theme: 'secondary',
      disabled: true,
    },
  }[statusState];

  useEffect(() => {
    if (!isOpen || reviewMode || focusedIndex < 0) return;
    const el = document.getElementById(`${ariaLabel}-option-${focusedIndex}`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, reviewMode, focusedIndex, ariaLabel]);

  const renderOptionRow = (item: FlatItem, index: number) => {
    const isPending = isItemPending(item.value);
    const isFocused = index === focusedIndex;

    let classes = 'tf-enhanced-choice-option';
    if (isPending) classes += ' is-selected';
    if (isFocused) classes += ' is-focused';

    const suffixContent = props.itemLayout?.suffix
      ? renderItemLayoutSlots(item, props.itemLayout.suffix)
      : renderViewLink(item);  // legacy isViewable fallback, untouched

    const prefixContent = props.itemLayout?.prefix
      ? renderItemLayoutSlots(item, props.itemLayout.prefix)
      : null;

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
          {prefixContent}
          <div className="tf-enhanced-choice-selection-indicator" style={{ pointerEvents: 'none' }}>
            <TuiCheckbox checked={isPending} disabled={false} tabIndex={-1} />
          </div>
          <div className="tf-enhanced-choice-label">{item.label}</div>
          {suffixContent}
        </div>
      </li>
    );
  };

  return (
    <div ref={fieldRef} style={{ display: 'inline-flex', flexDirection: 'column', width: '100%' }}>

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
          <Button
            label={statusConfig.label}
            variant={statusConfig.variant}
            theme={statusConfig.theme}
            size="xs"
            disabled={statusConfig.disabled}
            onClick={handleViewSelected}
          />
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
          onKeyDown={handleFieldKeyDown}
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
                <IconButton 
                label="Clear all" 
                icon="system/close" 
                onClick={handleClear} 
                size="xs" 
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()}/>
              ) : (
                <Icon
                  name={isOpen ? 'system/chevron-up' : 'system/chevron-down'}
                  size="xs"
                  aria-hidden="true"
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
                    <span className="tf-enhanced-choice-review-question">
                      Are you sure?
                    </span>
                    <Button 
                    label="Cancel" 
                    variant="outline" 
                    theme="danger" 
                    size="xs" 
                    onClick={handleCancelReview} />

                    <Button 
                    label="Confirm Selected" 
                    variant="solid" 
                    theme="primary" 
                    size="xs" 
                    onClick={handleConfirmSelected} />
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
                    {(() => {
                      let navIndex = 0;

                      // Global select-all (non-grouped mode only)
                      const globalSelectAllRow = (!props.isGrouped && filteredItems.length > 0) ? (
                        (() => {
                          const idx = navIndex++;
                          const isFocused = idx === focusedIndex;
                          return (
                            <li
                              key="global-select-all"
                              role="option"
                              id={`${ariaLabel}-option-${idx}`}
                              aria-selected={globalSelectAllState === 'all'}
                              className={`tf-enhanced-choice-option tf-enhanced-choice-select-all${isFocused ? ' is-focused' : ''}`}
                              onMouseEnter={() => setFocusedIndex(idx)}
                              onMouseLeave={() => setFocusedIndex(-1)}
                              onMouseDown={(e) => { e.preventDefault(); handleGlobalSelectAll(); }}
                            >
                              <div className="tf-enhanced-choice-option-content">
                                <div className="tf-enhanced-choice-selection-indicator" style={{ pointerEvents: 'none' }}>
                                  <TuiCheckbox
                                    checked={globalSelectAllState === 'all'}
                                    indeterminate={globalSelectAllState === 'some'}
                                    disabled={false}
                                    tabIndex={-1}
                                    onMouseDown={(e) => e.preventDefault()}
                                  />
                                </div>
                                <div className="tf-enhanced-choice-label">Select All</div>
                              </div>
                            </li>
                          );
                        })()
                      ) : null;

                      const groupRows = groupedItems.map((group) => {
                        const selectAllState = getGroupSelectAllState(group.items);
                        const groupSelectAllIndex = props.isGrouped ? navIndex++ : -1;
                        const isGroupSelectAllFocused = groupSelectAllIndex === focusedIndex;

                        return (
                          <li key={group.label || '__default'} role="presentation">
                            {props.isGrouped && (
                              <div className="tf-enhanced-choice-group-header">
                                <span className="tf-enhanced-choice-group-label">{group.label}</span>
                                <div
                                  role="option"
                                  id={`${ariaLabel}-option-${groupSelectAllIndex}`}
                                  aria-selected={selectAllState === 'all'}
                                  className={`tf-enhanced-choice-select-all-inline${isGroupSelectAllFocused ? ' is-focused' : ''}`}
                                  onMouseEnter={() => setFocusedIndex(groupSelectAllIndex)}
                                  onMouseLeave={() => setFocusedIndex(-1)}
                                  onMouseDown={(e) => { e.preventDefault(); handleSelectAll(group.items); }}
                                >
                                  <TuiCheckbox
                                    checked={selectAllState === 'all'}
                                    indeterminate={selectAllState === 'some'}
                                    disabled={false}
                                    tabIndex={-1}
                                    onMouseDown={(e) => e.preventDefault()}
                                  />
                                  <span className="tf-enhanced-choice-select-all-label">Select all</span>
                                </div>
                              </div>
                            )}

                            <ul role="group" aria-label={group.label} style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                              {group.items.map((item) => {
                                const itemIndex = navIndex++;
                                return renderOptionRow(item, itemIndex);
                              })}
                            </ul>
                          </li>
                        );
                      });

                      return (
                        <>
                          {globalSelectAllRow}
                          {groupRows}
                        </>
                      );
                    })()}
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
