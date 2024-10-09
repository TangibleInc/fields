import { 
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
} from '../../base'

import CheckboxListBox from '../../base/list-box/CheckboxListBox'
  
const ComboBoxCheckboxLayout = props => {

    /**
     * The value is different according to if we get the item list in async mode or not
     * 
     * If it's the case, the initial value will be an array of object, that contains the
     * value and the label for each item selected
     * 
     * Otherwise, it's a comma separated string with each value
     */
    const [values, setValues] = React.useState(
        props.value && Array.isArray(props.value)
        ? props.value
        : (props.value && ! props.isAsync ? props.value.split(',') : [])
    )

    /**
     * Needed to filter item results according to input value
     * 
     * @see https://react-spectrum.adobe.com/react-aria/useFilter.html
     */
    const { contains } = useFilter({ sensitivity: 'base' })
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


    inputProps.name = '' // We're using input as search box for items, so we're not going to save it there

    // State for selected items
    const initialSelectedKeys = new Set(values.map( item => item.value))
    const [selected, setSelected] = React.useState(initialSelectedKeys)
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

    useEffect(() => props.onChange && props.onChange(values), [values.length])
    
    return(
        <div className="tf-combo-box">
            { props.label &&
            <Label labelProps={ labelProps } parent={ props }>
                { props.label }
            </Label> }
            <div className="tf-combo-box-text" ref={ wrapperRef }>
                <input { ...inputProps } ref={ inputRef } readOnly={ props.readOnly } />
            </div>
            <CheckboxListBox 
                selectionMode={ selectionMode }
                items={ props.items }
                ref={ listBoxRef }
                selectedKeys={Array.from(selected)}
                onSelectionChange={handleSelectionChange}
            >
                {(item) => <Item key={item.value}>{item.label}</Item>}
            </CheckboxListBox>
            { props.description &&
            <Description descriptionProps={ descriptionProps } parent={ props }>
                { props.description }
            </Description> }
        </div>
    )
}

export default ComboBoxCheckboxLayout