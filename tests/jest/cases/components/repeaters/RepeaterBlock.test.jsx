import '../../../../../assets/src/index.jsx'
import { commonRepeaterTests } from './common.js'

const fields = window.tangibleFields

describe('Repeater with a block layout', () => {
  
  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('block')
})
