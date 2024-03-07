import { 
	useRef,
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
import { useCalendarContext } from './calendar/DateRangeCalendarContext'

const DateRange = (props) => {

	const { dateValue, setDateValue } = useCalendarContext()

	useEffect(() => {
		props.onChange && props.onChange(dateValue)
	}, [dateValue])

	useEffect(()=>{
		if(dateValue !== props.value && typeof props.value === 'object') setDateValue(props.value)
	},[props.value])
	
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
		value: dateValue,
	})
	
    const ref = useRef()

	/**
	 * https://react-spectrum.adobe.com/react-aria/useDateRangePicker.html
	 */
    const {
		labelProps,
		descriptionProps,
		...dateRangePickerProps
    } = useDateRangePicker({...props, minValue: minValue}, state, ref)

	return (
	<div className="tf-date-picker">
		{ props.label &&
		<Label labelProps={ labelProps } parent={ props }>
			{ props.label }
		</Label> }
		<FieldWrapper 
			{ ...props } 
			value={ dateValue }
			ref={ ref }
		>
			<DateRangePicker
				ref={ ref }
				name={ props.name ?? '' }
				minValue={ minValue }
				value={ dateValue }
				hasFutureOnly={ hasFutureOnly }
				onChange={ setDateValue }
				onFocusChange={ props.onFocusChange ?? false }
				state={ state }
				multiMonth = { props.multiMonth ?? 1 }
				datePresets = { props.datePresets ?? false }
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