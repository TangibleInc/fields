/**
 * Ideally, all the strings used inside the repeater should belongs here, 
 * so that they can be overriden by the user
 * 
 * @see string() in ./Repeater.jsx 
 */
export default {
  
  common: {
    add              : 'Add item',
    clone            : 'Clone',
    delete           : 'Remove',
    removeAll        : 'Remove all',
    confirmDelete    : 'Remove this item?',
    confirmRemoveAll : 'Remove all items?',
    /**
     * Body copy for the confirm dialogs. %d is the 1-based item index
     */
    confirmDeleteDescription    : 'Item %d will be removed.',
    confirmRemoveAllDescription : 'Every item in this list will be removed.'
  },
  
  layoutOveride: {
    advanced  : {
      clone     : 'Duplicate',
      delete    : 'Delete'
    },
    tab       : {
      add       : '+ Add Item'
    }
  }
  
}
