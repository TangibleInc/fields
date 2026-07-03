import { useCallback, useMemo, useRef, useState } from "react";
import { useFilter } from "react-aria";

export interface ChoicesItem {
  value:        string;
  label:        string;
  description?: string;
  category?:    string;
  viewLink?:    string;
}

// Raw PHP choices formats:
//   flat:    { red: 'Red', blue: 'Blue' }
//   rich:    { red: { label: 'Red', viewLink: '/colors/red' } }
//   grouped: [ { label: 'Warm Colors', items: { red: 'Red', orange: 'Orange' } } ]

type RawFlatItem = string | { label: string; viewLink?: string; category?: string };
type RawFlatChoices    = Record<string, RawFlatItem>;
type RawGroupedChoices = { label: string; items: RawFlatChoices }[];
type RawChoices        = RawFlatChoices | RawGroupedChoices;

export interface GroupedChoiceItem {
  label: string;
  items: ChoicesItem[];
}

const normalizeFlatChoices = (choices: RawFlatChoices): ChoicesItem[] =>
  Object.entries(choices).map(([value, item]) => {
    if (typeof item === 'string') return { value, label: item };
    return { value, label: item.label, viewLink: item.viewLink, category: item.category };
  });

const normalizeChoices = (choices: RawChoices): ChoicesItem[] | GroupedChoiceItem[] => {
  if (Array.isArray(choices)) {
    return (choices as RawGroupedChoices).map(group => ({
      label: group.label,
      items: normalizeFlatChoices(group.items),
    }));
  }
  return normalizeFlatChoices(choices as RawFlatChoices);
};

// Helper to always get a flat list from either format (used by the hook internally)
const flattenChoices = (choices: RawChoices): ChoicesItem[] => {
  const normalized = normalizeChoices(choices);
  if (Array.isArray(normalized) && normalized.length > 0 && 'items' in normalized[0]) {
    return (normalized as GroupedChoiceItem[]).flatMap(g => g.items);
  }
  return normalized as ChoicesItem[];
};

interface BaseProps {
  items?:       ChoicesItem[];
  choices?:     RawChoices;   // flat, rich, or grouped PHP format
  label?:       string;
  name?:        string;
  description?: string;
  placeholder?: string;
  isViewable?:  boolean;
}

interface SingleProps extends BaseProps {
  mode:      'single';
  value?:    string;
  onChange?: (value: string | null) => void;
}

interface MultipleProps extends BaseProps {
  mode:      'multiple';
  value?:    string[];
  onChange?: (value: string[]) => void;
}

export type UseEnhancedChoicesProps = SingleProps | MultipleProps;

const parseInitial = (props: UseEnhancedChoicesProps) => {
  // console.log('mode',props);
  if (props.mode === 'single') {
    // if (props.isVisibilityEnabled && props.value) {
    //   try {
    //     const parsed = JSON.parse(props.value as string);
    //     return {
    //       selectedKey:  parsed.selected ?? null,
    //       selectedKeys: [] as string[],
    //       pendingKey:   null as string | null,
    //       pendingKeys:  [] as string[],
    //       visibility:   parsed.visibility ?? {},
    //     };
    //   } catch { }
    // }
    return {
      selectedKey:  props.value ?? null,
      selectedKeys: [] as string[],
      pendingKey:   null as string | null,
      pendingKeys:  [] as string[],
      // visibility:   {} as Record<string, boolean>,
    };
  }

  // multiple
  // if (props.mode === 'multiple' && props.value) {
  //   try {
  //     const parsed = JSON.parse(props.value as unknown as string);
  //     console.log('parseInitial for multiple mode, parsed:', parsed);
  //     const keys = Array.isArray(parsed.selected) ? parsed.selected : [];
  //     console.log('parseInitial for multiple mode, keys:', keys);
  //     return {
  //       selectedKey:  null,
  //       selectedKeys: keys as string[],
  //       pendingKey:   null as string | null,
  //       pendingKeys:  keys as string[],
  //       // visibility:   parsed.visibility ?? {},
  //     };
  //   } catch { }
  // }
  const parsed = JSON.parse(props.value as unknown as string);
  const keys = Array.isArray(parsed) ? parsed : [];
  console.log('parseInitial for multiple mode, keys:', keys);
  return {
    selectedKey:  null,
    selectedKeys: keys,
    pendingKey:   null as string | null,
    pendingKeys:  keys,
    // visibility:   {} as Record<string, boolean>,
  };
};

export const useEnhancedChoices = (props: UseEnhancedChoicesProps) => {
  const { contains } = useFilter({ sensitivity: 'base' });

  const inputRef   = useRef<HTMLInputElement>(null);
  const buttonRef  = useRef<HTMLButtonElement>(null);
  const listBoxRef = useRef<HTMLUListElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const initial = useMemo(() => parseInitial(props), []);
  // console.log('checking parseInitial for the multiple mode', parseInitial(props));
// console.log('checking iniitial for the multiple mode', initial);
  const [selectedKey,   setSelectedKey]   = useState<string | null>(initial.selectedKey);
  const [selectedKeys,  setSelectedKeys]  = useState<string[]>(initial.selectedKeys);
  const [pendingKey,    setPendingKey]     = useState<string | null>(initial.pendingKey);
  const [pendingKeys,   setPendingKeys]    = useState<string[]>(initial.pendingKeys);
  const [isOpen,        setIsOpen]         = useState(false);
  const [focusedIndex,  setFocusedIndex]   = useState(-1);
  // const [visibility,    setVisibility]     = useState<Record<string, boolean>>(initial.visibility);

  const isSingle  = props.mode === 'single';
  const ariaLabel = props.label ?? props.name ?? 'Select';

  // Normalize choices from PHP format or use items directly
  const normalizedItems = useMemo<ChoicesItem[]>(() => {
    if (props.choices) return flattenChoices(props.choices);
    return props.items ?? [];
  }, [props.choices, props.items]);

  // Pre-normalized groups, returned so MultipleChoices can use them directly
  const normalizedGroups = useMemo<GroupedChoiceItem[] | null>(() => {
    if (props.choices && Array.isArray(props.choices) && props.choices.length > 0) {
      const normalized = normalizeChoices(props.choices);
      if ('items' in normalized[0]) return normalized as GroupedChoiceItem[];
    }
    return null;
  }, [props.choices]);

  // Initialize inputValue to the saved label when a value is provided
  const [inputValue, setInputValue] = useState(() => {
    if (props.mode === 'single' && props.value) {
      const items = props.choices ? flattenChoices(props.choices) : props.items ?? [];
      return items.find(i => i.value === props.value)?.label ?? '';
    }
    return '';
  });

  const filteredItems = useMemo(() =>
    normalizedItems.filter(item => contains(item.label, inputValue)),
    [normalizedItems, inputValue, contains]
  );

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
    setFocusedIndex(-1);
    if (e.target.value === '') {
      if (isSingle) setPendingKey(null);
      else          setPendingKeys([]);
    }
  }, [isSingle]);

  const onSelectionChange = useCallback((key: string) => {
    if (isSingle) {
      setPendingKey(key);
    } else {
      setPendingKeys(prev =>
        prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
      );
    }
  }, [isSingle]);

  const handleConfirm = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isSingle) {
      if (!pendingKey) return;
      const label = normalizedItems.find(i => i.value === pendingKey)?.label ?? '';
      setSelectedKey(pendingKey);
      setInputValue(label);
      setPendingKey(null);
      (props as SingleProps).onChange?.(pendingKey);
    } else {
      setSelectedKeys(pendingKeys);
      (props as MultipleProps).onChange?.(pendingKeys);
    }
    setIsOpen(false);
  }, [isSingle, pendingKey, pendingKeys, props.items, props.onChange]);

  const handleClear = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setInputValue('');
    setPendingKey(null);
    setPendingKeys([]);
    if (isSingle) {
      setSelectedKey(null);
      (props as SingleProps).onChange?.(null);
    } else {
      setSelectedKeys([]);
      (props as MultipleProps).onChange?.([]);
    }
    inputRef.current?.focus();
  }, [isSingle, props.onChange]);

  const handleRemoveChip = useCallback((key: string) => {
    const next = selectedKeys.filter(k => k !== key);
    setSelectedKeys(next);
    setPendingKeys(next);
    (props as MultipleProps).onChange?.(next);
  }, [selectedKeys, props.onChange]);

  // const onToggleVisibility = useCallback((key: string) => {
  //   setVisibility(prev => ({ ...prev, [key]: prev[key] === false ? true : false }));
  // }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex(i => Math.min(i + 1, filteredItems.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(i => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      onSelectionChange(filteredItems[focusedIndex].value);
      // auto-confirm on Enter in single mode
      if (isSingle) {
        const key   = filteredItems[focusedIndex].value;
        const label = filteredItems[focusedIndex].label;
        setSelectedKey(key);
        setInputValue(label);
        setPendingKey(null);
        (props as SingleProps).onChange?.(key);
        setIsOpen(false);
      }
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  }, [filteredItems, focusedIndex, isSingle, onSelectionChange]);

  const isConfirmed = isSingle
    ? !!selectedKey && !isOpen
    : selectedKeys.length > 0 && !isOpen;

  const isNotSelected = isSingle
    ? !selectedKey && !isOpen
    : selectedKeys.length === 0 && !isOpen;

  const hasPending = isSingle
    ? !!pendingKey && isOpen
    : isOpen;

  const isItemSelected = useCallback((key: string) => {
    if (isSingle) return key === selectedKey;
    return isOpen ? pendingKeys.includes(key) : selectedKeys.includes(key);
  }, [isSingle, selectedKey, selectedKeys, pendingKeys, isOpen]);

  const isItemPending = useCallback((key: string) => {
    if (isSingle) return key === pendingKey;
    return pendingKeys.includes(key);
  }, [isSingle, pendingKey, pendingKeys]);

  const hiddenValue = useMemo(() => {
    if (isSingle) {
      // return props.isVisibilityEnabled
      //   ? JSON.stringify({ selected: selectedKey, visibility })
      //   : (selectedKey ?? '');
      return selectedKey?? '';
    }
    // return props.isVisibilityEnabled
    //   ? JSON.stringify({ selected: selectedKeys })
    //   : JSON.stringify(selectedKeys);

    return JSON.stringify(selectedKeys);
  }, [isSingle, selectedKey, selectedKeys]);

  const inputAriaProps = {
    role:    'combobox' as const,
    'aria-expanded':   isOpen,
    'aria-haspopup':   'listbox' as const,
    'aria-autocomplete': 'list' as const,
    'aria-label':      ariaLabel,
    'aria-controls':   `${ariaLabel}-listbox`,
    'aria-activedescendant':
      focusedIndex >= 0 ? `${ariaLabel}-option-${focusedIndex}` : undefined,
  };

  const listBoxAriaProps = {
    role: 'listbox' as const,
    id:   `${ariaLabel}-listbox`,
    'aria-label': ariaLabel,
  };

  const getOptionAriaProps = (key: string, index: number) => ({
    role:          'option' as const,
    id:            `${ariaLabel}-option-${index}`,
    'aria-selected': isItemSelected(key),
  });

  return {
    // state
    inputValue,
    selectedKey,
    selectedKeys,
    pendingKey,
    pendingKeys,
    isOpen,
    setIsOpen,
    focusedIndex,
    setFocusedIndex,
    // visibility,

    // derived
    filteredItems,
    hiddenValue,
    isConfirmed,
    isNotSelected,
    hasPending,

    // selection helpers (replaces useOption's selectionManager)
    isItemSelected,
    isItemPending,

    // handlers
    onInputChange,
    onSelectionChange,
    handleConfirm,
    handleClear,
    handleRemoveChip,
    // onToggleVisibility,
    handleKeyDown,

    // aria props (spread onto elements directly)
    inputAriaProps,
    listBoxAriaProps,
    getOptionAriaProps,

    // refs
    inputRef,
    buttonRef,
    listBoxRef,
    popoverRef,

    // helpers
    ariaLabel,
    findItem: (val: string) => normalizedItems.find(i => i.value === val),
    normalizedGroups,
  };
};
