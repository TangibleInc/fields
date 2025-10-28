import '../../../../../assets/src/index.tsx'
import { commonRepeaterTests } from './common.ts'
import { bulkActionsRepeaterTests } from './bulkActions.ts'

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
