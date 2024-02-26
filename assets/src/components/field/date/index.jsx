import React from 'react'
import Date from './Date'
import DateRange from './DateRange'

export default props => {

    if( props.dateRange ){
        return <DateRange {...props} />
    }

    return (
        <Date {...props} />
    )
}