import '../../../../../assets/src/index.jsx'
import { commonRepeaterTests } from './common.js'
import { within } from '@testing-library/react'

/**
 * TODO: Add repeater specific test + check if common test are passing
 * for the right reasons
 */
describe('Repeater with a tab layout', () => {

  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('tab', {
    addText       : '+ Add Item',
    removeElement : async (index, args, config) => {
      await args.user.click(within(args.itemsContainer).getByText('Item ' + (index + 1)))
      await args.user.click(
        within(args.document.querySelector('.tf-repeater-tab-actions'))
          .getByText(config.removeText)
      )
    }
  })
})
