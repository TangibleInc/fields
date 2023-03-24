/**
 * Allow the use of dependent props for a <Control /> component, where the value of a props
 * will depends of the value of another fields
 * 
 * This has to be used in a context where a group of control is defined (a repeater row, a 
 * popup, a form ...etc)
 * 
 * @see ./dependent-values.php
 */
const applyDependentValues = (
  element  = false,
  controls = [],
  values   = []
) => {

  const { dependents } = TangibleFields
  
  const context = dependents[ element ] ?? []

  if( context.length === 0 ) return controls;

  controls = controls.map(
    control => replaceDependentValues(control, values, context)
  )

  return controls
}

const replaceDependentValues = (
  control,
  values,
  context
) => {

  if( ! context[ control.name ?? '' ] ) {
    return control 
  }

  const dependentKeys = Object.keys(context[control.name])
  dependentKeys.forEach(key => {
    
    const valueKey = context[control.name][key]
    
    if( valueKey instanceof Object ) {
      const dependentSubkeys = Object.keys(valueKey)
      
      dependentSubkeys.forEach(subkey => {
        const valueSubkey = context[control.name][key][subkey]
        control[key][subkey] = values[ valueSubkey ] ?? ''
      })
      
    } else {
      control[key] = values[ valueKey ]
    }
  })

  return control
}

export { applyDependentValues }
