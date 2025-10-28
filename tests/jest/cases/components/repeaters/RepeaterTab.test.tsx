import '../../../../../assets/src/index.tsx'
import { commonRepeaterTests } from './common.ts'
import { within } from '@testing-library/react'

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
