import { uniqid } from '../../utils'

const repeaterDispatcher = (emptyItem, maxLength, props) => (items, action) => {
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
    case 'insert':
      return items.length >= maxLength
        ? items
        : [
            ...items.slice(0, action.position),
            {
              key: uniqid(),
              ...(action.data ?? emptyItem),
            },
            ...items.slice(action.position),
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
              ...(formatClone(action.item, props)),
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

/**
 * If props.clone.exclude is set on a repeater, some fields
 * value won't be cloned
 *
 * Syntax is the following:
 * {
 *     clone: {
 *         exclude: {
 *             'fields-name-1': true,
 *             'fields-name-2': { 'sub-value': true },
 *         }
 *     }
 * }
 */
const formatClone = (initial, props) => {
  if ( typeof props?.clone?.exclude !== 'object' ) return initial
  const item = { ...initial }
  Object.keys(props.clone.exclude)
    .map(name => {
      const value = props.clone.exclude[ name ]
      if ( value === true ) delete item[ name ]
      if ( typeof value === 'object' ) item[ name ] = Array.isArray(item[ name ])
        ? item[ name ].map(
            subItem => formatClone(subItem, { clone : { exclude : value } })
          )
        : formatClone(item[ name ], { clone : { exclude : value } })
    })
  return item
}

const initDispatcher = (value, emptyItem) => {
  try {
    const initialItems = Array.isArray(value) ? value : JSON.parse(value)
    return Array.isArray(initialItems) ? initialItems : [ emptyItem ]
  } catch (err) {
    return [ emptyItem ]
  }
}

export { repeaterDispatcher, initDispatcher }
