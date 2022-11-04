import { TextField } from '@react-spectrum/textfield'
import { NumberField } from '@react-spectrum/numberfield'
import { DatePicker } from '@react-spectrum/datepicker'

import Repeater from './components/repeater/table/Repeater'

import {
  Select,
  DynamicText
} from './components/field/'


export default {
  'text'            : TextField,
  'number'          : NumberField,
  'date'            : DatePicker,
  'repeater-table'  : Repeater,
  'select'          : Select,
  'text-suggestion' : DynamicText,
}
