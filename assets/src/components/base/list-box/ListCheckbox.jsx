import { useRef } from 'react'
import { useGridListSelectionCheckbox } from 'react-aria'
import { useCheckbox } from 'react-aria'
import { useToggleState } from 'react-stately'

const ListCheckbox = ({ item, state }) => {
    let inputRef = useRef()
    let { checkboxProps } = useGridListSelectionCheckbox( { key: item.key }, state )
    let { inputProps } = useCheckbox( checkboxProps, useToggleState( checkboxProps ), inputRef )

    return <input {...inputProps} ref={inputRef} />
}

export default ListCheckbox