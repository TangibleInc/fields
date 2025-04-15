import Repeater from './components/repeater/Repeater'
import ConditionalPanel from './components/conditional/ConditonalPanel'

import {
  Accordion,
  AlignmentMatrix,
  Border,
  ButtonGroup,
  Checkbox,
  Code,
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
  List,
  Number,
  Radio,
  Select,
  SimpleDimension,
  Switch,
  Tab as TabField,
  Text,
  TextArea,
  TimePicker
} from './components/field/'

import {
  Button,
  Label,
  ListBox,
  Description,
  ModalTrigger,
  Wrapper,
  Title,
  TooltipTrigger
} from './components/base'

import {
  Advanced,
  Bare,
  Block,
  Table,
  Tab
} from './components/repeater/layout'

const controls = {
  'accordion'         : Accordion,
  'alignment-matrix'  : AlignmentMatrix,
  'border'            : Border,
  'button-group'      : ButtonGroup,
  'checkbox'          : Checkbox,
  'code'              : Code,
  'color-picker'      : Color,
  'conditional-panel' : ConditionalPanel,
  'combo-box'         : ComboBox,
  'date-picker'       : Date,
  'dimensions'        : Dimensions,
  'field-group'       : FieldGroup,
  'file'              : File,
  'gradient'          : Gradient,
  'gallery'           : Gallery,
  'list'              : List,
  'hidden'            : InputHidden,
  'number'            : Number,
  'repeater'          : Repeater,
  'radio'             : Radio,
  'select'            : Select,
  'simple-dimension'  : SimpleDimension,
  'switch'            : Switch,
  'tab'               : TabField,
  'text'              : Text,
  'text-suggestion'   : DynamicText,
  'wysiwyg'           : Editor,
  'editor'            : Editor, // alias of wysiwyg
  'textarea'          : TextArea,
  'time-picker'       : TimePicker
}

const elements = {
  'button'            : Button,
  'description'       : Description,
  'label'             : Label,
  'list-box'          : ListBox,
  'modal'             : ModalTrigger,
  'wrapper'           : Wrapper,
  'tooltip'           : TooltipTrigger,
  'title'             : Title
}

const repeaters = {
  'advanced'          : Advanced,
  'bare'              : Bare,
  'block'             : Block,
  'table'             : Table,
  'tab'               : Tab
}

export default {
  _types : {
    control   : controls,
    element   : elements,
    repeater  : repeaters
  },
  get(name, type = 'control') {
    return this._types[ type ]?.[ name ] ?? (type === 'repeater' ? 'table' : false)
  },
  add(name, Component, type = 'control') {
    this._types[ type ][ name ] = Component
  }
}
