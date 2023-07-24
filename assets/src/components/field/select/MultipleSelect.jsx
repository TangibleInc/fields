import { 
  useEffect,
  useRef, 
  useState 
} from 'react'

import { 
  useListBox, 
  VisuallyHidden 
} from 'react-aria'

import { 
  Item,
  useListState
 } from 'react-stately'

import { 
  Button, 
  ListBox, 
  Popover,
  Label,
  Description
} from '../../base'

import { initSet } from '../../../utils'


const MultipleSelect = props => {
  
  const [selected, setSelected] = useState( 
    props.value ? initSet(props.value) : new Set() 
  )

  const [isOpen, setIsOpen] = useState(false);

  const state = useListState({
    ...props,
    selectionMode: 'multiple',
    onSelectionChange: setSelected,
    selectedKeys: selected
  })

  const buttonRef = useRef();
  const listBoxRef = useRef()
  const PopoverRef = useRef()

  const { 
    listBoxProps, 
    labelProps, 
    descriptionProps
  } = useListBox(props, state, PopoverRef)


  /**
   * We return an array instead of a Set because it works better with JSON.stringify
   */
  useEffect(() => {
    props.onChange && props.onChange([ ...selected ])
  }, [selected])

  const ListBoxComponent =
    <ListBox
      { ...listBoxProps }
      listBoxRef={ listBoxRef }
      state={ state }
      items={ props.items }     
    >
      { item => <Item key={ item.id }>{ item.name }</Item> }
    </ListBox>


  return (
    <>
      <div className="tf-multiple-select">
        <input type="hidden" name={ props.name ?? '' } value={ [...selected].join(',') } />
        { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
        <Button 
          type={ 'select' }
          buttonRef={PopoverRef} 
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="tf-multiple-select__value">
          { selected.size > 0
            ? (selected.size === 1
              ? selected.size + ' item selected'
              : selected.size + ' items selected')
            : (props.placeholder ?? 'Select an option') }
        </span>
        <span aria-hidden="true" className="tf-select-icon">
          ▼
        </span>
        </Button>
        {isOpen ? (
          <Popover
            state={{ isOpen, close: () => setIsOpen(false) }}
            triggerRef={PopoverRef}
          >
            {ListBoxComponent}
          </Popover>
        ) : (
          <VisuallyHidden>{ListBoxComponent}</VisuallyHidden>
        )}
        { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
      </div>
    </>
  );

} 



export default MultipleSelect
