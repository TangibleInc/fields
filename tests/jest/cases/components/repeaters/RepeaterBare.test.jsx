import '../../../../../assets/src/index.jsx'
import { commonRepeaterTests } from './common.js'
import { within, render } from '@testing-library/react'

const fields = window.tangibleFields

describe('Repeater with a bare layout', () => {
  
  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('bare')
})
