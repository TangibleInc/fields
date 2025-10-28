import '../../../../../assets/src/index.jsx'
import { commonRepeaterTests } from './common.js'
import { bulkActionsRepeaterTests } from './bulkActions.js'

describe('Repeater with a block layout', () => {
  
  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('block')

  /**
   * Common tests for the bulk actions (shared with advanced layout)
   */
  bulkActionsRepeaterTests('block')
})
