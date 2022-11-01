import { TextField } from '@react-spectrum/textfield'
import { NumberField } from '@react-spectrum/numberfield'
import { DatePicker } from '@react-spectrum/datepicker'

import Select from './components/fields/select/Select'
import DynamicText from './components/fields/dynamic-text/DynamicText'

import Repeater from './components/repeaters/table/Repeater'

export default {
  'text'            : TextField,
  'number'          : NumberField,
  'date'            : DatePicker,
  'repeater-table'  : Repeater,
  'select'          : Select,
  'text-suggestion' : DynamicText,
}
