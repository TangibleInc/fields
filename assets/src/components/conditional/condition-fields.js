export default function getDefaultFields( dynamic, operators ) {
  return [
    {
      'label'   : 'Text',
      'type'    : 'text',
      'name'    : 'left_value',
      'dynamic' : {
        'mode'       : dynamic.getMode ? dynamic.getMode() : 'replace',
        'types'      : dynamic.getTypes ? dynamic.getTypes() : [ 'text', 'date', 'color', 'number' ],
        'categories' : dynamic.getCategories ? dynamic.getCategories() : Object.keys(TangibleFields.dynamics.categories)
      },
      'labelVisuallyHidden' : true
    },
    {
      'label'   : 'Operator',
      'type'    : 'select',
      'name'    : 'operator',
      'choices' :  operators != null ? operators : {
        _eq        : 'Is',
        _neq       : 'Is not',
        _lt        : 'Less than',
        _gt        : 'Greater than',
        _lte       : 'Less than or equal',
        _gte       : 'Greater than or equal',
        _in        : 'In array',
        _nin       : 'Not in array',
        _contains  : 'Contains',
        _ncontains : 'Not contain',
        _re        : 'Regex'
      },
      'labelVisuallyHidden' : true
    },
    {
      'label'   : 'Text',
      'type'    : 'text',
      'name'    : 'right_value',
      'dynamic' : {
        'mode'       : dynamic.getMode ? dynamic.getMode() : 'replace',
        'types'      : dynamic.getTypes ? dynamic.getTypes() : [ 'text', 'date', 'color', 'number' ],
        'categories' : dynamic.getCategories ? dynamic.getCategories() : Object.keys(TangibleFields.dynamics.categories)
      },
      'labelVisuallyHidden' : true
    },
  ]
}
