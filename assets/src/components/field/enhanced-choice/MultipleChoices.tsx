import { useCallback, useMemo } from "react";
import { useEnhancedChoices } from "./useEnhancedChoices";
// import Checkbox from "../checkbox/Checkbox";
import { Checkbox as TuiCheckbox } from '@tangible/ui';
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

// interface FilterCategory {
//   value: string;
//   label: string;
// }

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
  // filterCategories?:    FilterCategory[];
  // actionLabel?:         string;
}

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 7L5.5 10.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
    <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
);

const MultipleChoices = (props: MultipleChoicesProps) => {

  // console.log('MultipleChoices props:', props);
  // const [activeCategory, setActiveCategory] = useState('');

  const flatItems = useMemo<FlatItem[]>(() => {
    if (!props.isGrouped) return props.items as FlatItem[];
    return (props.items as GroupedItem[]).flatMap(g => g.items);
  }, [props.items, props.isGrouped]);

  // const categoryFilteredItems = useMemo<FlatItem[]>(() => {
  //   if (!activeCategory) return flatItems;
  //   return flatItems.filter(item => item.category === activeCategory);
  // }, [flatItems, activeCategory]);

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
    buttonRef,
    listBoxRef,
    ariaLabel,
    normalizedGroups,
  } = useEnhancedChoices({ ...props, items: flatItems, mode: 'multiple' });

  // console.log('MultipleChoices state:', {
  //   inputValue,
  //   selectedKeys,
  //   pendingKeys,
  //   isOpen,
  //   focusedIndex,
  //   filteredItems,});

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
          // && (!activeCategory || item.category === activeCategory)
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
  const isNotSelected_ = selectedKeys.length === 0 && !isOpen;

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
        <EyeIcon />
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
            {/* <Checkbox isSelected={isPending} isDisabled={false} /> */}
            <Checkbox checked={isPending} disabled={false} />
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
            <button
              type="button"
              className="tf-enhanced-choice-view-selected-btn"
              onMouseDown={handleViewSelected}
            >
              View Selected ({pendingKeys.length})
            </button>
          )}

          {selectedKeys.length > 0 && !isOpen && (
            <span className="tf-enhanced-choice-selected-badge">
              {selectedKeys.length} Selected
            </span>
          )}

          {isNotSelected_ && (
            <span className="tf-enhanced-choice-not-selected-badge">
              0 Selected
            </span>
          )}
        </div>
      </div>

      <input type="hidden" name={props.name} value={hiddenValue} />

      <div
        className="tf-enhanced-choice-input-group tf-enhanced-choice-input-group--multi"
        style={{ position: 'relative' }}
        onMouseDown={() => inputRef.current?.focus()}
      >
          <span className="tf-enhanced-choice-search-icon" aria-hidden="true">
            {isConfirmed ? <CheckIcon /> : <SearchIcon />}
          </span>

          {selectedKeys.map(key => {
            const item = findItem(key);
            if (!item) return null;
            return (
              <span key={key} className="tf-enhanced-choice-chip">
                {item.label}
                <button
                  type="button"
                  className="tf-enhanced-choice-chip-remove"
                  aria-label={`Remove ${item.label}`}
                  onMouseDown={(e) => { e.preventDefault(); handleRemoveChip(key); }}
                >
                  ×
                </button>
              </span>
            );
          })}

          <input
            {...inputAriaProps}
            id={`${ariaLabel}-input`}
            ref={inputRef}
            className="tf-enhanced-choice-input tf-enhanced-choice-input--inline"
            style={{ flex: 1, minWidth: 80, height: 32, boxSizing: 'border-box' }}
            placeholder={selectedKeys.length === 0 ? (props.placeholder ?? 'Search...') : ''}
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsOpen(true)}
          />

          {selectedKeys.length > 0 ? (
            <button
              type="button"
              className="tf-enhanced-choice-clear-btn"
              aria-label="Clear all"
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
              onMouseDown={(e) => { e.preventDefault(); setIsOpen(o => !o); }}
            >
              {/* {props.actionLabel
                ? props.actionLabel
                : <span aria-hidden="true" className="tf-enhanced-choice-chevron">{isOpen ? '▲' : '▼'}</span>
              } */}
              <span aria-hidden="true" className="tf-enhanced-choice-chevron">{isOpen ? '▲' : '▼'}</span>
            </button>
          )}

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
                        <button
                          type="button"
                          className="tf-enhanced-choice-review-remove"
                          aria-label={`Remove ${item.label}`}
                          onClick={() => handleReviewRemove(key)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                  <div className="tf-enhanced-choice-review-footer">
                    <span className="tf-enhanced-choice-review-question">Are you sure?</span>
                    <button type="button" className="tf-enhanced-choice-cancel-btn" onClick={handleCancelReview}>
                      Cancel
                    </button>
                    <button type="button" className="tf-enhanced-choice-confirm-selected-btn" onClick={handleConfirmSelected}>
                      Confirm Selected
                    </button>
                  </div>
                </div>

              ) : (

                <>
                  
                  {/* {props.filterCategories?.length && (
                    <div className="tf-enhanced-choice-popover-header">
                      <select
                        className="tf-enhanced-choice-category-select"
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        aria-label="Filter by category"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <option value="">All</option>
                        {props.filterCategories.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )} */}

                  <ul
                    {...listBoxAriaProps}
                    ref={listBoxRef}
                    className="tf-enhanced-choice-list"
                  >
                    {filteredItems.length === 0 && (
                      <li className="tf-enhanced-choice-empty">No results found.</li>
                    )}

                    {/* Global Select All — only when not grouped */}
                    {!props.isGrouped && filteredItems.length > 0 && (
                      <li
                        role="presentation"
                        className="tf-enhanced-choice-option tf-enhanced-choice-select-all"
                        onMouseDown={(e) => { e.preventDefault(); handleGlobalSelectAll(); }}
                      >
                        <div className="tf-enhanced-choice-option-content">
                          <div className="tf-enhanced-choice-selection-indicator" style={{ pointerEvents: 'none' }}>
                            {/* <Checkbox
                              isSelected={globalSelectAllState === 'all'}
                              isIndeterminate={globalSelectAllState === 'some'}
                              isDisabled={false}
                            /> */}
                            <Checkbox
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
                                    <Checkbox
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
