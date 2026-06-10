import { Item, useComboBoxState } from "react-stately";
import { Button, Popover } from "../../base";
import { useCallback, useMemo, useRef, useState } from "react";
import { useComboBox, useFilter } from "react-aria";
import EnhancedListBox from "./EnhancedListBox";

const renderItem = (item) => (
  <Item key={item.key} textValue={item.label}>
    {item.label}
  </Item>
);

const SingleChoices = (props) => {
  console.log('SingleChoices props:', props);
  const { contains } = useFilter({ sensitivity: 'base' });

  const buttonRef  = useRef(null);
  const inputRef   = useRef(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);

  const findItem = useCallback(
    (val) => (props.items || []).find(item => item.value === val),
    [props.items]
  );

const [fieldState, setFieldState] = useState(() => {
  if (props.isVisibilityEnabled && props.value) {
    const parsed = JSON.parse(props.value);
    return {
      selectedKey: parsed.selected ?? null,
      inputValue:  findItem(parsed.selected)?.label ?? '',
      pendingKey:  null,
    };
  }

  return {
    selectedKey: props.value ?? null,
    inputValue:  findItem(props.value)?.label ?? '',
    pendingKey:  null,
  };
});

const [visibility, setVisibility] = useState(() => {
  if (props.isVisibilityEnabled && props.value) {
    const parsed = JSON.parse(props.value);
    return parsed.visibility ?? {};
  }
  return {};
});

  const [isOpen, setIsOpen] = useState(false);

  const { inputValue, selectedKey, pendingKey } = fieldState;

  const filteredItems = useMemo(() =>
    (props.items || [])
      .filter(item => contains(item.label, inputValue))
      .map(item => ({
        ...item,
        key:      item.value,
        rendered: item.label,
      })),
    [props.items, inputValue, contains]
  );

  const pendingLabel = useMemo(
    () => pendingKey ? findItem(pendingKey)?.label ?? '' : null,
    [pendingKey, findItem]
  );  

  const onSelectionChange = useCallback((key) => {
      setFieldState(prev => ({ ...prev, pendingKey: key }));
  }, [findItem, props.onChange]);

  const onInputChange = useCallback((value) => {
    setFieldState(prev => ({
      ...prev,
      selectedKey: value === '' ? null : prev.selectedKey,
      pendingKey:  value === '' ? null : prev.pendingKey,
      inputValue:  value,
    }));
    if (value !== '') setIsOpen(true);
  }, []);

  const handleConfirm = useCallback((e) => {
    e.preventDefault();
    if (!pendingKey) return;
    const selectedItem = findItem(pendingKey);
    setFieldState({
      inputValue:  selectedItem?.label ?? '',
      selectedKey: pendingKey,
      pendingKey:  null,
    });
    props.onChange?.(pendingKey);
    setIsOpen(false); 

  }, [pendingKey, findItem, props.onChange]);


  const handleClear = useCallback((e) => {
    e.preventDefault();
    setFieldState({ selectedKey: null, inputValue: '', pendingKey: null });
    props.onChange?.(null);
    inputRef.current?.focus();
  }, [props.onChange]);

  const ariaLabel = props.label ?? props.name ?? 'Select';

  const state = useComboBoxState({
    label:            ariaLabel,
    items:            filteredItems,
    inputValue,
    selectedKey,
    onInputChange,
    onSelectionChange,
    children:         renderItem,
    isOpen,
    onOpenChange:     setIsOpen,
    shouldCloseOnBlur: false,
  });

  const { buttonProps, inputProps, listBoxProps, labelProps } = useComboBox(
    {
      label: ariaLabel,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state
  );

  const isConfirmed   = !!selectedKey && !state.isOpen;
  const hasPending    = !!pendingKey && state.isOpen;
  const isNotSelected = !selectedKey && !state.isOpen;

  const onToggleVisibility = useCallback((key: string) => {
    setVisibility(prev => ({
      ...prev,
      [key]: prev[key] === false ? true : false,
    }));
  }, []);
  console.log(state);

  const hiddenValue = useMemo(() => {
    if (props.isVisibilityEnabled) {
      return JSON.stringify({
        selected: selectedKey,
        visibility
      });
    }

    return selectedKey;

  }, [selectedKey, visibility, props.items, props.isVisibilityEnabled, isConfirmed])

  console.log(visibility);
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', width: '100%' }}>
      
      <div className="tf-enhanced-choice-header">
        <div className="tf-enhanced-choice-label-group">
          {props.label && (
            <label {...labelProps} className="tf-enhanced-choice-label-text">
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

      <input type="hidden" name={props.name} value={hiddenValue ?? ''} />

      <div className="tf-enhanced-choice-input-group">

        <span className="tf-enhanced-choice-search-icon" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M10 10L13 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        </span>

        <input
          {...inputProps}
          ref={inputRef}
          placeholder={props.placeholder ?? 'Search...'}
          className="tf-enhanced-choice-input"
          style={{ height: 32, boxSizing: 'border-box' }}
          value={pendingLabel ?? inputProps.value}
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

          <Button
            {...buttonProps}
            // type="button"
            buttonRef={buttonRef}
            style={{ height: 32 }}
          >
            <span aria-hidden="true" className="tf-enhanced-choice-chevron">
              {state.isOpen ? '▲' : '▼'}
            </span>
          </Button>
        )}

        {state.isOpen && (
          <Popover
            state={state}
            triggerRef={inputRef}
            popoverRef={popoverRef}
            isNonModal
            placement="bottom start"
          >
            <EnhancedListBox
              {...listBoxProps}
              listBoxRef={listBoxRef}
              state={state}
              name={props.name}
              pendingKey={pendingKey}
              isVisibilityEnabled={props.isVisibilityEnabled}
              onToggleVisibility={onToggleVisibility}
              visibility={visibility}
            />
          </Popover>
        )}
      </div>
    </div>
  );
};

export default SingleChoices;
