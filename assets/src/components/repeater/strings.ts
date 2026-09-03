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
    edit                        : 'Edit',
    close                       : 'Close',
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
      confirmDelete             : 'Delete this item?',
      confirmDeleteDescription  : 'Item {index} will be deleted.'
    },
    tab       : {
      add                       : '+ Add Item'
    }
  }

}
