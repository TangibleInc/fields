import * as fields from '../../../../../assets/src/index.tsx'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'

describe('Repeater layout', () => {
  
  it('uses the table layout by default', () => {

    const { container } = render(
      fields.render({
        type   : 'repeater',
        fields : []
      })
    )

    const repeaters = container.getElementsByClassName('tf-repeater-table')
    expect(repeaters.length).toBe(1)
  })

  it('uses the table layout if layout does not exist', () => {

    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : 'fake',
        fields : []
      })
    )

    const repeaters = container.getElementsByClassName('tf-repeater-table')
    expect(repeaters.length).toBe(1)
  })
})
