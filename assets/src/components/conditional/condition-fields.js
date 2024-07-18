/**
 * Used when props.operator and props.fields are both undefined
 */
const defaultOperator = {
  _eq         : 'Is',
  _neq        : 'Is not',
  _lt         : 'Less than',
  _gt         : 'Greater than',
  _lte        : 'Less than or equal',
  _gte        : 'Greater than or equal',
  _in         : 'In array',
  _nin        : 'Not in array',
  _contains   : 'Contains',
  _ncontains  : 'Not contain',
  _re         : 'Regex'
}

/**
 * When using default operator, initial value is going to be _eq,
 * but that's not going to be the case when using custom operators
 * or custom fields
 *
 * When using custom operators, we attempt to get the first choice as
 * the default value, but default to an empty string if it's not a control
 * that support choices
 */
const getInitialOperator = fields => {

  const operatorField = fields.filter(
    field => field.name === 'operator'
  )[0] ?? false

  if( ! operatorField ) return '';
  if ( typeof operatorField.choices !== 'object' ) return '';

  const choices = Object.keys(operatorField.choices)

  return choices[0] ?? ''
}

const getFields = ({
  dynamic,
  operators = undefined,
  fields = undefined
}) => {

  if ( fields && fields.length > 0 ) {
    return fields
  }

  return [
    {
      'label'   : 'Text',
      'type'    : 'text',
      'name'    : 'left_value',
      'dynamic' : dynamic
        ? {
            'mode'        : dynamic.getMode(),
            'types'       : dynamic.getTypes(),
            'categories'  : dynamic.getCategories()
          }
        : {
            'mode' : 'replace'
          },
      'labelVisuallyHidden': true
    },
    {
      'label'               : 'Operator',
      'type'                : 'select',
      'name'                : 'operator',
      'choices'             : operators ?? defaultOperator,
      'labelVisuallyHidden' : true
    },
    {
      'label'   : 'Text',
      'type'    : 'text',
      'name'    : 'right_value',
      'dynamic' : dynamic
        ? {
            'mode'        : dynamic.getMode(),
            'types'       : dynamic.getTypes(),
            'categories'  : dynamic.getCategories()
          }
        : {
            'mode' : 'replace'
          },
      'labelVisuallyHidden': true
    }
  ]
}

export {
  getFields,
  getInitialOperator
}
