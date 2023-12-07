export default [
  {
    'label'   : 'Text',
    'type'    : 'text',
    'name'    : 'left_value',
    'dynamic' : { 
      'mode'  : 'replace', 
      'types' : [    
        'text', 
        'date', 
        'color', 
        'number'
      ]
    },
    'labelVisuallyHidden' : true
  }, 
  {
    'label'   : 'Operator',
    'type'    : 'select',
    'name'    : 'operator',
    'choices' :   {
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
      'mode'  : 'replace', 
      'types' : [    
        'text', 
        'date', 
        'color', 
        'number'
      ]
    },
    'labelVisuallyHidden' : true
  },
]
