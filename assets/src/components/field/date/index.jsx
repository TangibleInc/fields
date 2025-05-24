import Date from './Date'
import DateRange from './DateRange'
import { CalendarContextProvider } from './calendar/DateRangeCalendarContext'

export default props => {
    //for now, we're only using context on DateRange
    if( props.dateRange ) return (
        <CalendarContextProvider value={props.value}>
            <DateRange {...props} /> 
        </CalendarContextProvider>
    )

    return <Date {...props} />
}
