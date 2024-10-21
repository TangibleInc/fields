import { 
    useState,
    useRef, 
    useEffect,
    useCallback,
    useMemo
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
import { getAsyncProps } from './async'
import { getOptions } from '../../../utils'

  
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

    const itemProps = { ...(props.isAsync
        ? getAsyncProps(props)
        : {
          defaultItems: getOptions(props.choices ?? {})
        })
    }

    const [oldValues, setOldValues] = useState( values )
    const [searchValue, setSearchValue ] = useState('')
    const [selectionLabel, setSelectionLabel] = useState('')
    const [view, setView] = useState({
        isOpen: false,
        isViewMode: false,
        isConfirmed: false
    })

    const initialSelectedKeys = new Set(values.map( item => item.value))
    const [selected, setSelected] = useState(initialSelectedKeys)
    const selectionMode = props.multiple ? 'multiple' : 'single'

    const inputRef   = useRef()
    const listBoxRef = useRef()
    const wrapperRef = useRef()
    const accordionRef = useRef()

    /**
     * Needed to filter item results according to input value
     * 
     * @see https://react-spectrum.adobe.com/react-aria/useFilter.html
     */
    const { contains } = useFilter({ sensitivity: 'base' })

    const matchedItems = useMemo(() => {
        return view.isViewMode 
            ? values.filter((item) => contains(item.label, searchValue )) 
            : (itemProps.items ?? []).filter((item) => contains(item.label, searchValue ))
    }, [view.isViewMode, searchValue, values, itemProps.items, contains])

    console.log({
        matchedItems: matchedItems,
        view: view
    })

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
        descriptionProps,
        listBoxProps
    } = useComboBox({
        ...props,
        inputRef,
        listBoxRef,
        menuTrigger: 'input'
    }, state)

    useEffect(() => {
        props.onChange && props.onChange(values)
    }, [values.length])
   
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
        
        const commonValidation = view.isOpen
       
        const children = commonValidation ? (
            <input
                {...inputProps}
                ref={inputRef}
                type="search"
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value)
                }}
                name={''}
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
    }, [ view, searchValue, values ])

    useEffect(() => {
        if (props.onChange) {
            props.onChange(values) 
        }

        setSelected(new Set(values.map(item => item.value)))
        
        if (values.length === 0) {
            setView({
                isOpen: false,
                isConfirmed: false,
                isViewMode: false
            });
        }
    }, [ values ])

    useEffect(() => {
        const selectedCount = selected.size
        setSelectionLabel(`View Selected (${selectedCount})`)

        if( view.isViewMode ){
            setView(prev=>({
                 ...prev,
                 isOpen: true,
            }))

            setSelectionLabel(`Selected (${selectedCount})`)
         }

    }, [ selected, view.isViewMode ])

    const remove = ( i, fromList = false ) => {
        if (fromList) {
            setValues(prevValues => {
                const index = prevValues.findIndex(item => item.value === i);
                if (index !== -1) {
                    return prevValues.filter(item => item.value !== i); // Remove by value
                }
                return prevValues // Return unchanged values if item not found
            })

            return
        }

        setValues([
          ...values.slice(0, i),
          ...values.slice(i + 1)
        ])
    }
   
    const handleSelectConfirmation = ( action = false ) => {
  
        if( !action ){
            setSelected( new Set(oldValues.map( item => item.value)) )
            setValues(oldValues.map(item => ({
                ...item,         
                [item.value]: item.label 
            })))
        }

        setView(prev=>({
            ...prev,
            isConfirmed: false,
            isOpen: false,
            isViewMode: false
        }))

        setSearchValue('')
        setOldValues( values )
    }

    useEffect(() => {
        if (view.isOpen && inputRef.current ) {
            document.addEventListener('mousedown', onClickOutside)
            inputRef.current.focus()
        }

        if( view.isOpen && wrapperRef.current ){
            document.addEventListener('mousedown', onClickOutside)
        }
    
        return () => {
          document.removeEventListener('mousedown', onClickOutside)
        }

    }, [view.isOpen])
    
    const onClickOutside = event => {
        const tempRef = accordionRef.current ?? false
    
        if ( ! tempRef ) return;
        if ( tempRef.contains(event.target) ) {
          return;
        }
        
        if( view.isConfirmed ) setView(prev=>({
            ...prev,
            isConfirmed: false,
            isViewMode: false,
            isOpen: false
        }))
        
        if( !view.isConfirmed ) setView(prev=>({
            ...prev,
            isViewMode: true,
        }))
    }

    useEffect(() => props.onChange && props.onChange(values), [itemProps.selectedKeys])

    return(
        <div className="tf-combo-box">
            { props.label &&
            <Label labelProps={ labelProps } parent={ props }>
                { props.label }
            </Label> }

            { props.description &&
            <Description descriptionProps={ descriptionProps } parent={ props }>
                { props.description }
                <Button 
                        type="text-action"
                        isDisabled={  !selected.size }
                        onClick={()=>setView(prev=> ({...prev, isViewMode: !prev.isViewMode}))}
                        >
                        { selectionLabel }
                </Button>
            </Description> }

            <ExpandablePanel
                ref={ accordionRef }
                key={ props.name ?? '' } 
                className="tf-repeater-block-item"
                headerLeft={ headerLeft() }
                hasSearchBox={ true }
                isOpen ={ view.isOpen }
                onPress={()=>setView((prev) =>({...prev, isOpen: !prev.isOpen}))}
            > 
                { view.isOpen && !view.isConfirmed && !searchValue && !view.isViewMode && ( 
                    <label className='tf-list-box-option tf-list-box-option-has-checkbox'>
                        <input 
                            type="checkbox"
                            onChange={handleSelectAllChange}
                            checked={matchedItems.length > 0 && matchedItems.every(item => selected.has(item.value))}
                        />
                        Select All
                </label> )}
                {
                    view.isOpen && !view.isConfirmed && !view.isViewMode ?
                    ( <ListBox 
                        selectionMode={ selectionMode }
                        items={ matchedItems }
                        ref={ listBoxRef }
                        selectedKeys={Array.from(selected)}
                        onSelectionChange={handleSelectionChange}
                        type={ 'checkbox' }
                        focusWithinProps
                        shouldUseVirtualFocus
                        {...listBoxProps}
                    >
                        {(item) => <Item key={item.value} hasCheckBox={true}>{item.label}</Item>}
                    </ListBox> ) 
                    :( <>
                        <ListBox 
                            selectionMode={ selectionMode }
                            items={ matchedItems }
                            ref={ listBoxRef }
                            selectedKeys={Array.from(values.map(item => item.value))}
                            type={ 'view-mode' }
                            focusWithinProps
                            shouldUseVirtualFocus
                        >
                            {(item) => (
                                <Item key={item.value} isViewMode={true} >
                                    {item.label}
                                    <Button onPress={() => remove(item.value, true)}>x</Button>
                                </Item>
                            )}
                        </ListBox>
                        {
                            searchValue === '' && (
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
                                </div> )
                            }
                    </> ) 
                }
               
            </ExpandablePanel>

        </div>
    )
}

export default ComboBoxCheckboxLayout