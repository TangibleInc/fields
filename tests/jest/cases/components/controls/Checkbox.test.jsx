import '../../../../../assets/src/index.jsx'
import userEvent from '@testing-library/user-event'
import { 
  render, 
  within 
} from '@testing-library/react'
import { 
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription
} from '../../../utils/fields.js'

const fields = window.tangibleFields

describe('Checkbox component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'checkbox' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'checkbox' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'checkbox' }))

  it('triggers checked change if label is clicked', async () => {
    
    const user = userEvent.setup()
    const { container } = render( 
      fields.render({
        label   : 'Click on label',
        name    : 'checkbox-name',
        type    : 'checkbox',
      })
    )

    const input = container.querySelector('input[type="checkbox"]')
    expect(input.checked).toBe(false)

    await user.click(within(container).getByText('Click on label'))

    expect(input.checked).toBe(true)
  })
})
