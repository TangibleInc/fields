/**
 * Helper to handle dynamic values in a Control component
 * 
 * @see ../Control.jsx 
 * @see ../dispatcher.jx 
 */
const dynamicValuesAPI = (data, dispatch) => ({
  setMode: mode => {
    dispatch({ type: 'setDynamicValueMode', mode: mode })
  },
  getAll: () => (
    data.dynamicValues.values ?? {}
  ),
  get: key => (
    data.dynamicValues.values[ key ] ?? false
  ),
  delete: key => dispatch({ 
    type: 'deleteDynamicValue', 
    key: key 
  }),
  clear: () => dispatch({ 
    type: 'clearDynamicValue' 
  }),
  add: (id, settings) => dispatch({ 
    type: 'addDynamicValue', 
    id: id, 
    settings: settings 
  }),
  hasDynamicValues: () => (
    Object.keys(data.dynamicValues.values).length !== 0 
    && data.dynamicValues.mode !== 'none' 
  )
}) 

export { 
  dynamicValuesAPI
}
