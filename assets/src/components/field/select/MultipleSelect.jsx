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
  
  const [open, isOpen] = useState(false)

  const state = useListState({
    ...props,
    selectionMode: 'multiple',
    onSelectionChange: setSelected,
    selectedKeys: selected
  })

  const listBoxRef = useRef()
  const PopoverRef = useRef()

  const { 
    listBoxProps, 
    labelProps, 
    descriptionProps 
  } = useListBox(props, state, listBoxRef)
  
  /**
   * We return an array instead of a Set because it works better with JSON.stringify
   */
  useEffect(() => {
    props.onChange && props.onChange([ ...selected ])
  }, [selected])

  const ListBoxComponent =
    <ListBox
      listBoxRef={ listBoxRef }
      state={ state }
      items={ props.items }
      { ...listBoxProps }
    >
      { item => <Item key={ item.id }>{ item.name }</Item> }
    </ListBox>

  return(
    <div class="tf-multiple-select">
      <input type="hidden" name={ props.name ?? '' } value={ [...selected].join(',') } />
      { props.label &&
        <Label { ...labelProps }>
          { props.label }
        </Label> }
      <Button
        type={ 'select' }
        onPress={ () => isOpen( ! open ) }
      >
        <span>
          { selected.size > 0
            ? (selected.size === 1
              ? selected.size + ' item selected'
              : selected.size + ' items selected')
            : (props.placeholder ?? 'Select an option') }
        </span>
        <span aria-hidden="true" class="tf-select-icon">
          ▼
        </span>
      </Button>
      { open
        ? <Popover 
            isOpen={ open } 
            onClose={ () => isOpen(false) }
            ref={ PopoverRef }
          >
            { ListBoxComponent }
          </Popover>
        : <VisuallyHidden>
          { ListBoxComponent }
          </VisuallyHidden> }
      { props.description &&
        <Description { ...descriptionProps }>
          { props.description }
        </Description> }
    </div>
  )
} 

export default MultipleSelect
