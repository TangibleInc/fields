/**
 * Allow the use of dynmics props for a <Control /> component, where the value of a props
 * will depends of the value of another fields
 * 
 * This has to be used in a context where a group of control is defined (a repeater row, a 
 * popup, a form ...etc)
 * 
 * @see ./dynamic-values.php
 */
const applyDynamicValues = (
  element  = false,
  controls = [],
  values   = []
) => {

  const { dynamics } = TangibleFields
  
  const context = dynamics[ element ] ?? []

  if( context.length === 0 ) return controls;

  controls.map(control => {
    
    if( ! context[ control.name ?? '' ] ) {
      return control 
    }

    const dynamicKeys = Object.keys(context[control.name])
    
    dynamicKeys.forEach(key => {
      const valueKey = context[control.name][key]
      control[key] = values[ valueKey ]
    })

    return control
  })

  return controls
}

export { applyDynamicValues }
