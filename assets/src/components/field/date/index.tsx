import Date from './Date'
import DeprecatedDate from '../../../deprecated/fields/date/'

/**
 * The date range is not migrated to TUI yet
 *
 * @see src/deprecated/fields/date
 */
export default props => (
  props.dateRange
    ? <DeprecatedDate { ...props } />
    : <Date { ...props } />
)
