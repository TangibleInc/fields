import {useRef, useState} from 'react'
import { Description, Label } from '../../base'
import { FieldWrapper } from '../../dynamic'
import DateRangePicker from './DateRangePicker'
import { useDateRangePickerState } from 'react-stately'
import { useDateRangePicker } from 'react-aria'

const DateRange = (props) => {
	const [ value, setValue] = useState(props.value ?? '')

	//TODO: Add on change!
	// useEffect(() => props.onChange && props.onChange(value), [value])

	const state = useDateRangePickerState({
		...props,
		value
	})
    const ref = useRef(null)

	/**
	 * https://react-spectrum.adobe.com/react-aria/useDateRangePicker.html
	 */
    const {
		labelProps,
		descriptionProps,
		...dateRangePickerProps
    } = useDateRangePicker(props, state, ref)

	return (
	<div className="tf-date-picker">
		{ props.label &&
		<Label labelProps={ labelProps } parent={ props }>
			{ props.label }
		</Label> }
		<FieldWrapper 
			{ ...props } 
			value={ value }
			onValueSelection={ setValue }
			ref={ ref }
		>
			<DateRangePicker
				ref={ ref }
				name={ props.name ?? '' }
				value={ value }
				onChange={ setValue }
				onFocusChange={ props.onFocusChange ?? false }
				state={ state }
				dateRangePickerProps={{ 
					...dateRangePickerProps
				}}
			/>
		</FieldWrapper>
		{ props.description &&
		<Description descriptionProps={ descriptionProps } parent={ props }>
			{ props.description }
		</Description> }
	</div>
	)
}

export default DateRange