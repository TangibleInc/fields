import Repeater from './components/repeater/Repeater'
import ConditonalPanel from './components/conditional/ConditonalPanel'

import {
  Accordion,
  AlignmentMatrix,
  Border,
  ButtonGroup,
  Checkbox,
  Color,
  ComboBox,
  Date,
  Dimensions,
  DynamicText,
  Editor,
  FieldGroup,
  File,
  Gradient,
  Gallery,
  InputHidden,
  Number,
  Radio,
  Select,
  SimpleDimension,
  Switch,
  Text,
  TextArea
} from './components/field/'

const types = {
  'accordion'         : Accordion,
  'alignment-matrix'  : AlignmentMatrix,
  'border'            : Border,
  'button-group'      : ButtonGroup,
  'checkbox'          : Checkbox,
  'color-picker'      : Color,
  'conditional-panel' : ConditonalPanel,
  'combo-box'         : ComboBox,
  'date-picker'       : Date,
  'dimensions'        : Dimensions,
  'field-group'       : FieldGroup,
  'file'              : File,
  'gradient'          : Gradient,
  'gallery'           : Gallery,
  'hidden'            : InputHidden,
  'number'            : Number,
  'repeater'          : Repeater,
  'radio'             : Radio,
  'select'            : Select,
  'simple-dimension'  : SimpleDimension,
  'switch'            : Switch,
  'text'              : Text,
  'text-suggestion'   : DynamicText,
  'wysiwyg'           : Editor,
  'textarea'          : TextArea
}

export default {
  _types: types,
  get(type) {
    return this._types[type] ?? false
  },
  add(type, Component) {
    this._types[type] = Component
  }
}
