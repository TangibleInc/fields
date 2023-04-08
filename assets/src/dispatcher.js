/**
 * Dispatcher that handles the state of a Control component
 * 
 * @see Control.jsx 
 */
const controlDispatcher = (state, action) => {
  
  switch (action.type) {
    
    /**
     * Value
     */
    case 'updateValue':
      return {
        ...state,
        value: action.value
      }
  
    /**
     * Dynamic values
     */
    case 'deleteDynamicValue':
      delete state.dynamicValues?.values[ action.key ]
      return state
    case 'clearDynamicValue':
      return {
        ...state, 
        dynamicValues: {
          ...state?.dynamicValues,
          values: {}
        }
      }
    case 'addDynamicValue':
      return {
        ...state,
        dynamicValues: {
          ...state.dynamicValues,
          values: {
            ...state.dynamicValues.values,
            [ action.id ]: action.settings  
          }
        }
      }

    /**
     * Mode can be 'replace', 'insert' or 'none'
     * 
     * 'replace' means dynamic value will be used instead and will be used instead of state.value
     * 
     * 'insert' means dynamic value will be use inside state.value (which has to be a string
     * in that case) 
     */
    case 'setDynamicValueMode':
      return {
        ...state,
        dynamicValues: {
          ...state.dynamicValues,
          mode: action.mode
        }
      }
  }
}

export { controlDispatcher }
