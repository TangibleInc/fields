import Simple from './Simple'
import SimpleMultiple from './SimpleMultiple'

const layouts = {
  'simple-multiple' : SimpleMultiple,
  'simple'          : Simple
}

const getLayout = type => {
  
  if ( typeof type === 'string' ) {
    return layouts[ type ]
  }
    
  // Custom component or forwardRef()
  if ( ['function', 'object'].includes(typeof type) ) {
    return type
  }
  
  return layouts[ fallback ]
}

export { getLayout }
