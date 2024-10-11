import { 
    useState,
    useRef, 
    useEffect 
} from 'react'
  
import { 
    Item,
    useComboBoxState 
} from 'react-stately'

import {  
    useFilter,
    useComboBox,
} from 'react-aria'

import { 
    Label,
    Description,
    ListBox,
    ExpandablePanel,
} from '../../base'

  
const ComboBoxCheckboxLayout = props => {

    /**
     * The value is different according to if we get the item list in async mode or not
     * 
     * If it's the case, the initial value will be an array of object, that contains the
     * value and the label for each item selected
     * 
     * Otherwise, it's a comma separated string with each value
     */
    const [values, setValues] = useState(
        props.value && Array.isArray(props.value)
        ? props.value
        : (props.value && ! props.isAsync ? props.value.split(',') : [])
    )

    const [searchValue, setSearchValue ] = useState('')

    /**
     * Needed to filter item results according to input value
     * 
     * @see https://react-spectrum.adobe.com/react-aria/useFilter.html
     */
    const { contains } = useFilter({ sensitivity: 'base' })

    const matchedItems = props.items.filter((item) =>
        contains( item.label, searchValue )
    )

    const state = useComboBoxState({ 
        ...props, 
        defaultFilter: contains,
        disabledKeys: [ 
            ...(props.disabledKeys ?? []),
            '_noResults'
        ]
    })
    
    const inputRef   = useRef()
    const listBoxRef = useRef()
    const wrapperRef = useRef()

    const {
        inputProps,
        labelProps,
        descriptionProps
    } = useComboBox({
        ...props,
        inputRef,
        listBoxRef,
        menuTrigger: 'input'
    }, state)

    useEffect(() => props.onChange && props.onChange(values), [values.length])

    inputProps.name = '' // We're using input as search box for items, and it will not need name attribute.

    // State for selected items
    const initialSelectedKeys = new Set(values.map( item => item.value))
    const [selected, setSelected] = useState(initialSelectedKeys)
    const selectionMode = props.multiple ? 'multiple' : 'single'
   
    const handleSelectionChange = (keys) => {
        const keysArray = Array.isArray(keys) ? keys : Array.from(keys)

        setSelected(new Set( keysArray ))
        
        const selectedItems = keysArray.map(key => {
            const item = props.items.find(item => item.value === key)
            return item ? { value: item.value, label: item.label } : { value: key, label: key }
        })
        
        setValues(selectedItems)
    }

     const handleSelectAllChange = (e) => {
        const checked = e.target.checked
        const allKeys = matchedItems.map(item => item.value)
        
        if (checked) {
            setSelected(new Set(allKeys))
            setValues(matchedItems)
            return
        }
         
        setSelected(new Set())
        setValues([])
    }

    const headerLeft = <div className='tf-combo-box-text tf-combo-box-text-search' ref={ wrapperRef }>
        <input
            { ...inputProps }
            ref={ inputRef }
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onClick={(e) => {
                e.stopPropagation() 
                inputRef.current.focus()
            }}
        />
    </div> 

    return(
        <div className="tf-combo-box">
            { props.label &&
            <Label labelProps={ labelProps } parent={ props }>
                { props.label }
            </Label> }

            <ExpandablePanel
                key={ props.name ?? '' } 
                isOpen={ true }
                className="tf-repeater-block-item"
                headerLeft={ headerLeft }
                hasSearchBox={ true }
            > 
                { !searchValue && (
                    <label className='tf-list-box-option tf-list-box-option-has-checkbox'>
                        <input 
                            type="checkbox"
                            onChange={ handleSelectAllChange } 
                            checked={ matchedItems.length > 0 && matchedItems.every(item => selected.has( item.value )) }
                        />
                        Select All
                    </label>
                )}
                <ListBox 
                    selectionMode={ selectionMode }
                    items={ matchedItems }
                    ref={ listBoxRef }
                    selectedKeys={Array.from(selected)}
                    onSelectionChange={handleSelectionChange}
                    type={ 'checkbox' }
                >
                    {(item) => <Item key={item.value}>{item.label}</Item>}
                </ListBox>
            </ExpandablePanel>

            { props.description &&
            <Description descriptionProps={ descriptionProps } parent={ props }>
                { props.description }
            </Description> }
        </div>
    )
}

export default ComboBoxCheckboxLayout