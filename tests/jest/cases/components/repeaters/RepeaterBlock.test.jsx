import '../../../../../assets/src/index.jsx'
import { commonRepeaterTests } from './common.js'
import { within, render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

const fields = window.tangibleFields

describe('Repeater with a block layout', () => {
  
  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('block')
})
