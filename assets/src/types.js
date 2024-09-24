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
  Text,
  TextArea
} from './components/field/'

import {
  Button,
  Label,
  Description,
  ModalTrigger,
  Wrapper,
  TooltipTrigger,
} from './components/base'

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
  'text'              : Text,
  'text-suggestion'   : DynamicText,
  'wysiwyg'           : Editor,
  'editor'            : Editor, // alias of wysiwyg
  'textarea'          : TextArea
}

const elements = {
  'button'            : Button,
  'description'       : Description,
  'label'             : Label,
  'modal'             : ModalTrigger,
  'wrapper'           : Wrapper,
  'tooltip'           : TooltipTrigger
}

export default {
  _types : {
    control : controls,
    element : elements
  },
  get(name, type = 'control') {
    return this._types[ type ]?.[ name ] ?? false
  },
  add(name, Component, type = 'control') {
    this._types[ type ][ name ] = Component
  }
}
