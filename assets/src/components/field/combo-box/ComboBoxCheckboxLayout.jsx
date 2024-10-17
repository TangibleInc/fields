import { 
    useState,
    useRef, 
    useEffect,
    useCallback
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
    Button,
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
        
    const inputRef   = useRef()
    const listBoxRef = useRef()
    const wrapperRef = useRef()
    const accordionRef = useRef()

    const [searchValue, setSearchValue ] = useState('')
    const [selectionLabel, setSelectionLabel] = useState('')
    const [ isConfirmed, setIsConfirmed ] = useState( false )
    const [isOpen, setIsOpen] = useState(false)

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

    useEffect(() => {
        props.onChange && props.onChange(values)
    }, [values.length])

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

    const headerLeft = useCallback(() => {
        
        const commonValidation =  !isConfirmed && isOpen

        const children = commonValidation ? (
            <input
                {...inputProps}
                ref={inputRef}
                type="search"
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value)
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current.focus();
                }}
            />
        ) : (
            values.length === 0 ? (
                <span>{props.placeholder ?? 'No item selected'}</span>
            ) : (
                values.map((value, i) => (
                    <span key={value.key ?? i} className="tf-combo-box-item">
                        <span>{props.isAsync ? value.label : props.choices[value] ?? ''}</span>
                        {props.readOnly !== true && (
                            <Button onPress={() => remove(i)}>x</Button>
                        )}
                    </span>
                ))
            )
        )

        return (
            <div
                className={ commonValidation ? 'tf-combo-box-text tf-combo-box-text-search' : "tf-multiple-combobox-values tf-multiple-combobox-values-full-width" }
                ref={wrapperRef}
            >
                { children }
            </div>
        )
    }, [ isConfirmed, searchValue, isOpen, values ])

    useEffect(() => {
        props.onChange && props.onChange(values)
        setSelected( new Set(values.map( item => item.value)) )
    }, [values.length])

    useEffect(() => {
        const selectedCount = selected.size
        setSelectionLabel(`${selectedCount} selected`)
    }, [ selected ])

    const remove = i => {
        setValues([
          ...values.slice(0, i),
          ...values.slice(i + 1)
        ])
    }
   
    
    const handleSelectConfirmation = ( action = false ) => {
  
        if( !action ){
            setSelected(new Set())
            setValues([])
        }

        setIsConfirmed( false )
        setIsOpen( false )
    }

    const handleClickOutside = (event) => {
        if (accordionRef.current && !accordionRef.current.contains(event.target)) {
            if( !isConfirmed ) setIsConfirmed( true )
        }
    }

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside)
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            setIsConfirmed( false )
        }
    }, [])

    return(
        <div className="tf-combo-box">
            { props.label &&
            <Label labelProps={ labelProps } parent={ props }>
                { props.label }
            </Label> }

            { props.description &&
            <Description descriptionProps={ descriptionProps } parent={ props } key={Object.keys( selected ).length}>
                { props.description }
                <Button 
                    type="text-action"
                    isDisabled={ !Object.keys( selected ).length }>
                    { selectionLabel }
                </Button>
            </Description> }

            <ExpandablePanel
                ref={ accordionRef }
                key={ props.name ?? '' } 
                className="tf-repeater-block-item"
                headerLeft={ headerLeft() }
                hasSearchBox={ true }
                isOpen ={ isOpen }
                onPress={()=>setIsOpen((prev) => !prev)}
            > 
                { isOpen && !isConfirmed && ( 
                    <label className='tf-list-box-option tf-list-box-option-has-checkbox'>
                        <input 
                            type="checkbox"
                            onChange={handleSelectAllChange}
                            checked={matchedItems.length > 0 && matchedItems.every(item => selected.has(item.value))}
                        />
                        Select All
                </label> )}
                {
                    isOpen && !isConfirmed ?
                    ( <ListBox 
                        selectionMode={ selectionMode }
                        items={ matchedItems }
                        ref={ listBoxRef }
                        selectedKeys={Array.from(selected)}
                        onSelectionChange={handleSelectionChange}
                        type={ 'checkbox' }
                    >
                        {(item) => <Item key={item.value}>{item.label}</Item>}
                    </ListBox> ) 
                    : (
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                        <span>Are you sure? </span>
                        <div style={{ display: 'flex', gap:'.5rem' }}>
                        <Button type='danger'
                            onClick={()=>handleSelectConfirmation(false)}>
                            Cancel
                        </Button>
                        <Button type='action'
                                onClick={()=>handleSelectConfirmation(true)}>
                            Confirm Selected
                        </Button>
                        </div>
                    </div>
                    )
                }
               
            </ExpandablePanel>

        </div>
    )
}

export default ComboBoxCheckboxLayout