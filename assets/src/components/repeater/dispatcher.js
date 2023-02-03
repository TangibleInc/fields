import { uniqid } from '../../utils'

const repeaterDispatcher = emptyItem => (
  (items, action) => {
    switch (action.type) {
      case 'add':
        return [ 
          ...items, 
          { 
            key: uniqid(), 
            ...(action.data ?? emptyItem) 
          } 
        ]
      case 'remove':
        return [
          ...items.slice(0, action.item),
          ...items.slice(action.item + 1)
        ]  
      case 'update':
        items[ action.item ][ action.control ] = action.value
        return [ 
          ...items
        ]
      case 'clear': return []
      default: return items
    }
  }
)

const initDispatcher = value => {

  const initialItems = value !== '' ? JSON.parse(value) : false

  return Array.isArray(initialItems) 
    ? initialItems
    : [ {} ] 
}

export {
  repeaterDispatcher,
  initDispatcher
}
