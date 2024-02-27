import { 
	useRef,
	useState,
	useEffect
} from 'react'

import { 
	Description, 
	Label 
} from '../../base'

import { 
	today, 
	getLocalTimeZone,
	CalendarDate
} from '@internationalized/date'

import DateRangePicker from './DateRangePicker'
import { FieldWrapper } from '../../dynamic'
import { useDateRangePickerState } from 'react-stately'
import { useDateRangePicker } from 'react-aria'
import { formatValue } from './format'
import { initJSON } from '../../../utils'

const DateRange = (props) => {

	const [ value, setValue ] = useState( initJSON( props.value ) ?? '')

	useEffect(() => props.onChange && props.onChange(value), [value])

	const hasFutureOnly = props.futureOnly && props.futureOnly === true
	const dateToday = today(getLocalTimeZone())
	const minValue = hasFutureOnly 
		? dateToday 
		: new CalendarDate('AD', '1', '1', '1') 

	
	const state = useDateRangePickerState({
		...props,
		/**
		 * useDateRangePickerState only accept a CalendarDate instance as a value 
		 */
		value: {
			start: formatValue( props.value.start, dateToday),
			end:   formatValue( props.value.end, dateToday),
		}
	})
	
    const ref = useRef()

	/**
	 * https://react-spectrum.adobe.com/react-aria/useDateRangePicker.html
	 */
    const {
		labelProps,
		descriptionProps,
		...dateRangePickerProps
    } = useDateRangePicker({...props, minValue: minValue }, state, ref)

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
				minValue={ minValue }
				value={ value }
				hasFutureOnly={ hasFutureOnly }
				onChange={ setValue }
				onFocusChange={ props.onFocusChange ?? false }
				state={ state }
				multiMonth = { props.multiMonth ?? 1 }
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