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

let _types = null

const getTypes = () => {
  if (_types) return _types
  _types = {
    control: {
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
    },
    element: {
      'button'            : Button,
      'description'       : Description,
      'label'             : Label,
      'list-box'          : ListBox,
      'modal'             : ModalTrigger,
      'wrapper'           : Wrapper,
      'tooltip'           : TooltipTrigger,
      'title'             : Title
    },
    repeater: {
      'advanced'          : Advanced,
      'bare'              : Bare,
      'block'             : Block,
      'table'             : Table,
      'tab'               : Tab
    }
  }
  return _types
}

export default {
  get _types() { return getTypes() },
  get(name, type = 'control') {
    return getTypes()[ type ]?.[ name ] ?? (type === 'repeater' ? 'table' : false)
  },
  add(name, Component, type = 'control') {
    getTypes()[ type ][ name ] = Component
  }
}
