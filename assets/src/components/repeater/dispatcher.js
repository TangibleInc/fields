import { uniqid } from '../../utils'

const repeaterDispatcher = (emptyItem, maxLength) => (items, action) => {
  if( action.callback ) setTimeout(action.callback) // Trigger callback after state change
  switch (action.type) {
    case 'add':
      return items.length >= maxLength
        ? items
        : [
            ...items,
            {
              key: uniqid(),
              ...(action.data ?? emptyItem),
            },
          ]
    case 'remove':
      return [...items.slice(0, action.item), ...items.slice(action.item + 1)]
    case 'update':
      items[action.item][action.control] = action.value
      return [...items]
    case 'clone':
      return items.length >= maxLength
        ? items
        : [
            ...items,
            {
              ...(action.item),
              key: uniqid(),
            },
          ]
    case 'clear':
      return []
    /**
     * Bulk actions are only supported by the Block layout for now, but
     * should be implemented into the Table layout as well at some point
     * 
     * @see ./common/BulkActions.jsx
     */
    case 'bulkCheck':
      return items.map(item => ({...item, _bulkCheckbox: true}))
    case 'bulkUncheck':
      return items.map(item => ({...item, _bulkCheckbox: false}))
    case 'bulkUpdate':
      return items.map(item => (
        item._bulkCheckbox === true
          ? {
              ...item,
              [action.control]: action.value
            }
          : item
      ))
    case 'bulkRemove':
      return items.filter(item => (item._bulkCheckbox !== true))
    default:
      return items
  }
}

const initDispatcher = value => {
  try {
    const initialItems = Array.isArray(value) ? value : JSON.parse(value)
    return Array.isArray(initialItems) ? initialItems : [{}]
  } catch (err) {
    return [{}]
  }
}

export { repeaterDispatcher, initDispatcher }
