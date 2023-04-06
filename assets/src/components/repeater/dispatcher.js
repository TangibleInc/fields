import { uniqid } from '../../utils'

const repeaterDispatcher = (emptyItem, maxLength) => (items, action) => {
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
