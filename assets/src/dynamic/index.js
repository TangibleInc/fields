/**
 * Allow the use of dynamics props for a <Control /> component, where the value of a props
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

  controls = controls.map(
    control => replaceDynamicValues(control, values, context)
  )

  return controls
}

const replaceDynamicValues = (
  control,
  values,
  context
) => {

  if( ! context[ control.name ?? '' ] ) {
    return control 
  }

  const dynamicKeys = Object.keys(context[control.name])
  dynamicKeys.forEach(key => {
    
    const valueKey = context[control.name][key]
    
    if( valueKey instanceof Object ) {
      const dynamicSubkeys = Object.keys(valueKey)
      
      dynamicSubkeys.forEach(subkey => {
        const valueSubkey = context[control.name][key][subkey]
        control[key][subkey] = values[ valueSubkey ] ?? ''
      })
      
    } else {
      control[key] = values[ valueKey ]
    }
  })

  return control
}

export { applyDynamicValues }
