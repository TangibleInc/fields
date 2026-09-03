/**
 * Ideally, all the strings used inside the repeater should belongs here,
 * so that they can be overriden by the user
 *
 * Strings can carry {placeholders}, filled by string(name, params)
 *
 * @see string() in ./Repeater.tsx
 */
export default {

  common: {
    add                         : 'Add item',
    clone                       : 'Clone',
    delete                      : 'Remove',
    cloneItem                   : 'Clone item {index}',
    deleteItem                  : 'Remove item {index}',
    edit                        : 'Edit',
    close                       : 'Close',
    editItem                    : 'Edit item {index}',
    closeItem                   : 'Close item {index}',
    reorderItem                 : 'Reorder item {index}',
    moveItemUp                  : 'Move item {index} up',
    moveItemDown                : 'Move item {index} down',
    dragItem                    : 'Drag to reorder item {index}',
    movedAnnouncement           : 'Item moved to position {position} of {count}',
    selectItem                  : 'Select item {index}',
    enableItem                  : 'Enable item {index}',
    rowOrder                    : 'Order',
    rowSelect                   : 'Select',
    rowActions                  : 'Actions',
    expandItem                  : 'Open item {index}',
    collapseItem                : 'Close item {index}',
    removeAll                   : 'Remove all',
    confirmDelete               : 'Remove this item?',
    confirmDeleteDescription    : 'Item {index} will be removed.',
    confirmRemoveAll            : 'Remove all items?',
    confirmRemoveAllDescription : 'Every item in this list will be removed.',
    bulkApply                   : 'Apply',
    bulkDelete                  : 'Delete',
    confirmBulkDelete           : 'Delete selected items?',
    confirmBulkDeleteDescription: 'The selected items will be deleted.'
  },

  layoutOveride: {
    advanced  : {
      clone                     : 'Duplicate',
      delete                    : 'Delete',
      cloneItem                 : 'Duplicate item {index}',
      deleteItem                : 'Delete item {index}',
      confirmDelete             : 'Delete this item?',
      confirmDeleteDescription  : 'Item {index} will be deleted.'
    },
    tab       : {
      add                       : '+ Add Item'
    }
  }

}
