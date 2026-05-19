import { 
  useRef, 
  useState,
  useMemo,
  useEffect
} from 'react'

import { 
  useListBox, 
  useFilter,
} from 'react-aria'

import { Item, useListState } from 'react-stately'

import { 
  Label,
  Description,
  Button,
  Popover
} from '../../base'


import EnhancedOption from './EnhancedOption'
import SearchField from './SearchField'
// import { initJSON } from '../../../utils'

const SingleChoices = (props) => {

  const { initialKey, initialVisibility } = useMemo(() => {
    let val = props.value;

    if( typeof val === 'string' && val.trim() !== '' ) {
      try {
        const parsed = JSON.parse(val);
        if(parsed && typeof parsed === 'object') val = JSON.parse(val);
      } catch (e) {
        // Not a JSON string, keep as is
      }
    }

    if (!val) return { initialKey: null, initialVisibility: {} };
    
    if (typeof val === 'string') {
      return { initialKey: val, initialVisibility: {} };
    }
    
    if (typeof val === 'object' && val.selected) {
      return {
        initialKey: val.selected,
        initialVisibility: { [val.selected]: val.visibility !== false }
      }
    }
    
    return { initialKey: null, initialVisibility: {} };
  }, [props.value]);

  const initialItem = useMemo(() => 
    (props.items || []).find(item => item.value === initialKey),
    [props.items, initialKey]
  );

  const inputRef = useRef();
  const containerRef = useRef();
  const [filterValue, setFilterValue] = useState(initialItem?.label || ''); // for search input
  const [searchTerm, setSearchTerm] = useState(''); // for search filtering
  const [selectedKey, setSelectedKey] = useState(initialKey); // Local state for selection
  const { contains } = useFilter({ sensitivity: 'base' });
  const [isConfirmed, setIsConfirmed] = useState(!!initialKey);
  const [visibility, setVisibility] = useState(initialVisibility)
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return (props.items || []).filter(item => 
      contains(item.label, searchTerm)
    ).map(item => ({
      ...item,
      key: item.value,
      rendered: item.label
    }))
  }, [props.items, searchTerm])

  const state = useListState({
    ...props,
    items: filteredItems,
    selectionMode: 'single',
    disallowEmptySelection: false,
    // children: (item) => <Item key={item.key}>{item.rendered}</Item>,
    selectedKeys: selectedKey ? [selectedKey] : [],
    onSelectionChange: (keys) => {
      const nextKey = Array.from(keys)[0] || null;
      setSelectedKey(nextKey);
      setIsConfirmed(false);
      
      const selectedItem = (props.items || []).find(item => item.value === nextKey);

      if (selectedItem) {
        setFilterValue(selectedItem.label);
        setSearchTerm('');
        setIsOpen(false);
      }

      props.onChange && props.onChange({
        selected: nextKey,
        visibility: nextKey ? visibility[nextKey] !== false : true
      })
    }
  })

  useEffect(() => {
    if (initialItem && filterValue === '') {
      setFilterValue(initialItem.label);
      setSearchTerm('');
      setIsConfirmed(true);
      // setSelectedKey(initialKey);
    }
  }, [initialItem]);

  const selectedCount = state.selectionManager.selectedKeys.size;

  const handleConfirmSelection = () => {
    const currentKey = state.selectionManager.firstSelectedKey;
    const items = props.items || [];
    const selectedItem = items.find(item => item.value === currentKey);

    if(selectedItem){
      setFilterValue(selectedItem.label);
      setSearchTerm('');
      setIsConfirmed(true);
    }
    else {
      setFilterValue('');
      setSearchTerm('');
      setIsConfirmed(false);
    }

    props.onChange && props.onChange({
      selected: currentKey,
      visibility: currentKey ? visibility[currentKey] !== false : true
    })
  }

  const handleSearchChange = (value) => {
    setFilterValue(value);
    setSearchTerm(value);

    if (value === '') {
      setSelectedKey(null);
      // state.selectionManager.clearSelection();
      setIsConfirmed(false);
    }
  }

  const handleSearchBlur = () => {
    if(filterValue === '' && isConfirmed){
      const currentKey = state.selectionManager.firstSelectedKey;
      const selectedItem = (props.items || []).find(item => item.value === currentKey);
      if (selectedItem) {
        setFilterValue(selectedItem.label);
        setSearchTerm('');
      }
    }
  }

  const onToggleVisibility = (key) => {
    const newVisibility = {
      ...visibility,
      [key]: visibility[key] === false ? true : false
    }
    setVisibility(newVisibility)
    
    const currentKey = Array.from(state.selectionManager.selectedKeys)[0];
    props.onChange && props.onChange({
      selected: currentKey,
      visibility: currentKey ? newVisibility[currentKey] !== false : true
    })
  }

  const listBoxRef = useRef();
  const { listBoxProps, labelProps, descriptionProps } = useListBox(
    {
      ...props,
      'aria-label': props.label || 'Choices'
    }, 
    state, 
    listBoxRef
  )

  const hiddenValue = useMemo(() => {
    const currentKey = state.selectionManager.firstSelectedKey;
    if (!currentKey || !isConfirmed) return '';

    if (props.isVisibilityEnabled) {
      // const selectedItem = props.items?.find(item => item.value === currentKey);
      return JSON.stringify({
        selected: currentKey,
        visibility: visibility[currentKey] !== false,
      });
    }

    return currentKey;
  }, [state.selectionManager.selectedKeys, visibility, props.items, props.isVisibilityEnabled, isConfirmed])

  return (
    <div className="tf-enhanced-choice-single" ref={containerRef}>
      <input type="hidden" name={ props.name ?? '' } value={hiddenValue} />
      { props.label &&
        <Label labelProps={ labelProps } parent={ props }>
          { props.label }
        </Label> }
      { props.description &&
        <Description descriptionProps={ descriptionProps } parent={ props }>
          { props.description }
        </Description> }
      <span className="tf-enhanced-choice__value">
        {selectedCount === 0 ? (
          'Not selected'
        ) : isConfirmed ? (
          'Selected' 
        ) : (
          <Button onPress={handleConfirmSelection}>Confirm selected</Button>
        )}
      </span>
      <div className="tf-enhanced-choice-search">
        {/* we passing filterValue handleSearchChange and handleSearchBlur */}
        <SearchField inputRef={inputRef} value={filterValue} onChange={handleSearchChange} onBlur={handleSearchBlur} isOpen={isOpen} setIsOpen={setIsOpen}/>
      </div>
        {
          isOpen &&
          <Popover
            state={{ isOpen: isOpen, close: () => setIsOpen(false) }}
            triggerRef={inputRef}
            placement="bottom start"
            style={{ width: containerRef?.current?.offsetWidth }}
          >
          <ul
            { ...listBoxProps }
            ref={ listBoxRef }
            className="tf-enhanced-choice-list"
          >
            {state.collection.size === 0 ? (
              <li className="tf-enhanced-choice-no-results">No results found</li>
            ) : (
              [...state.collection].map(item => (
                <EnhancedOption 
                  key={item.key}
                  item={item}
                  state={state}
                  name={props.name}
                  visibility={visibility}
                  isVisibilityEnabled={props.isVisibilityEnabled}
                  onToggleVisibility={onToggleVisibility}
                />
              ))
            )}
          </ul>
          </Popover>
        }
    </div>
  )
}

export default SingleChoices
