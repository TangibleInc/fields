import { useCallback, useMemo, useRef, useState, useEffect } from "react";
import { ItemLayoutConfig } from "./ItemLayoutRegistry";

export interface ChoicesItem {
  value:        string;
  label:        string;
  description?: string;
  category?:    string;
  viewLink?:    string;
  badge?:       string;
  [key: string]: unknown;
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
    return { value, ...item };
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
  items?:        ChoicesItem[];
  choices?:      RawChoices;
  label?:        string;
  name?:         string;
  description?:  string;
  placeholder?:  string;
  isViewable?:   boolean;
  itemLayout?:   ItemLayoutConfig   // new
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
  if (props.mode === 'single') {
    return {
      selectedKey:  props.value ?? null,
      selectedKeys: [] as string[],
      pendingKey:   null as string | null,
      pendingKeys:  [] as string[],
    };
  }

  let keys: string[] = [];
  if (props.value) {
    try {
      const parsed = JSON.parse(props.value as unknown as string);
      keys = Array.isArray(parsed) ? parsed : [];
    } catch { }
  }
  return {
    selectedKey:  null,
    selectedKeys: keys,
    pendingKey:   null as string | null,
    pendingKeys:  keys,
  };
};

export const useEnhancedChoices = (props: UseEnhancedChoicesProps) => {
  const inputRef   = useRef<HTMLInputElement>(null);
  const listBoxRef = useRef<HTMLUListElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  const initial = useMemo(() => parseInitial(props), []);

  const [selectedKey,   setSelectedKey]   = useState<string | null>(initial.selectedKey);
  const [selectedKeys,  setSelectedKeys]  = useState<string[]>(initial.selectedKeys);
  const [pendingKey,    setPendingKey]    = useState<string | null>(initial.pendingKey);
  const [pendingKeys,   setPendingKeys]   = useState<string[]>(initial.pendingKeys);
  const [isOpen,        setIsOpen]        = useState(false);
  const [focusedIndex,  setFocusedIndex]  = useState(-1);

  const isSingle  = props.mode === 'single';
  const ariaLabel = props.label ?? props.name ?? 'Select';

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!fieldRef.current?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || focusedIndex < 0) return;
    const el = document.getElementById(`${ariaLabel}-option-${focusedIndex}`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, focusedIndex, ariaLabel]);

  const baseItems = useMemo<ChoicesItem[]>(() => {
    if (props.choices) return flattenChoices(props.choices);
    return props.items ?? [];
  }, [props.choices, props.items]);

  const normalizedGroups = useMemo<GroupedChoiceItem[] | null>(() => {
    if (props.choices && Array.isArray(props.choices) && props.choices.length > 0) {
      const normalized = normalizeChoices(props.choices);
      if ('items' in normalized[0]) return normalized as GroupedChoiceItem[];
    }
    return null;
  }, [props.choices]);

  // Seeded on mount if the saved value isn't found in the base list, so a
  // previously-confirmed custom value still shows its label correctly.
  const [extraItems, setExtraItems] = useState<ChoicesItem[]>(() => {
    if (props.mode === 'single' && props.value) {
      const foundInBase = baseItems.find(i => i.value === props.value);
      if (!foundInBase) {
        return [{ value: props.value, label: props.value }];
      }
    }
    return [];
  });

  const normalizedItems = useMemo<ChoicesItem[]>(() =>
    [...baseItems, ...extraItems],
    [baseItems, extraItems]
  );

  const [inputValue, setInputValue] = useState(() => {
    if (props.mode === 'single' && props.value) {
      const items = [...baseItems, ...extraItems];
      return items.find(i => i.value === props.value)?.label ?? props.value;
    }
    return '';
  });

  const filteredItems = useMemo(() =>
    normalizedItems.filter(item => item.label.toLowerCase().includes(inputValue.toLowerCase())),
    [normalizedItems, inputValue]
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
  }, [isSingle, pendingKey, pendingKeys, normalizedItems, props.onChange]);

  // Custom value confirm adds a real item to extraItems, then selects it
  // This makes the custom value behave exactly like any other list item:
  // it shows up in filteredItems, gets a radio, and isItemSelected works on it.
  const handleConfirmCustom = useCallback((value: string) => {
    if (!isSingle) return;

    setExtraItems(prev =>
      prev.some(i => i.value === value) ? prev : [...prev, { value, label: value }]
    );
    setSelectedKey(value);
    setInputValue(value);
    setPendingKey(null);
    (props as SingleProps).onChange?.(value);
    setIsOpen(false);
  }, [isSingle, props.onChange]);

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

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex(i => (i + 1) > filteredItems.length - 1 ? 0 : i + 1);
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(i => (i - 1) < 0 ? filteredItems.length - 1 : i - 1);
    }
    if (e.key === 'Enter' && focusedIndex >= 0) {
      e.preventDefault();
      onSelectionChange(filteredItems[focusedIndex].value);
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
    if (isSingle) return selectedKey ?? '';
    return JSON.stringify(selectedKeys);
  }, [isSingle, selectedKey, selectedKeys]);

  const inputAriaProps = {
    role:                'combobox' as const,
    'aria-expanded':     isOpen,
    'aria-haspopup':     'listbox' as const,
    'aria-autocomplete': 'list' as const,
    'aria-label':        ariaLabel,
    'aria-controls':     `${ariaLabel}-listbox`,
    'aria-activedescendant':
      focusedIndex >= 0 ? `${ariaLabel}-option-${focusedIndex}` : undefined,
  };

  const listBoxAriaProps = {
    role:         'listbox' as const,
    id:           `${ariaLabel}-listbox`,
    'aria-label': ariaLabel,
  };

  const getOptionAriaProps = (key: string, index: number) => ({
    role:            'option' as const,
    id:              `${ariaLabel}-option-${index}`,
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

    // derived
    filteredItems,
    hiddenValue,
    isConfirmed,
    isNotSelected,
    hasPending,

    // selection helpers
    isItemSelected,
    isItemPending,

    // handlers
    onInputChange,
    onSelectionChange,
    handleConfirm,
    handleConfirmCustom,
    handleClear,
    handleRemoveChip,
    handleKeyDown,

    // aria props
    inputAriaProps,
    listBoxAriaProps,
    getOptionAriaProps,

    // refs
    inputRef,
    listBoxRef,
    popoverRef,
    fieldRef,

    // helpers
    ariaLabel,
    findItem: (val: string) => normalizedItems.find(i => i.value === val),
    normalizedGroups,
  };
};
