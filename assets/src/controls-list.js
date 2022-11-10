import Repeater from './components/repeater/table/Repeater'

import {
  ComboBox,
  Date,
  DynamicText,
  Select,
  Text,
  Number
} from './components/field/'

export default {
  'text'            : Text,
  'number'          : Number,
  'date'            : Date,
  'repeater-table'  : Repeater,
  'select'          : Select,
  'combo-box'       : ComboBox,
  'text-suggestion' : DynamicText,
}
