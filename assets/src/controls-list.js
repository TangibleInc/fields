// import { DatePicker } from '@react-spectrum/datepicker'

import Repeater from './components/repeater/table/Repeater'

import {
  ComboBox,
  DynamicText,
  Select,
  Text,
  Number
} from './components/field/'

export default {
  'text'            : Text,
  'number'          : Number,
  // 'date'            : DatePicker,
  'repeater-table'  : Repeater,
  'select'          : Select,
  'combo-box'       : ComboBox,
  'text-suggestion' : DynamicText,
}
