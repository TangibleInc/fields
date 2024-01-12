import '../../../../../assets/src/index.jsx'
import userEvent from '@testing-library/user-event'
import { 
  within,
  render 
} from '@testing-library/react'
import { 
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription
} from '../../../utils/fields.js'

const fields = window.tangibleFields

describe('DatePicker component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'date-picker' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'date-picker' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'date-picker' }))
  
  it('opens and closes the calendar on click on the button', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type  : 'date-picker',
        label : 'Label for date_picker'
      }
    ))

    expect(document.querySelector('.tf-calendar')).toBe(null)

    await user.click(within(container).getByText('🗓'))
  
    expect(document.querySelector('.tf-calendar')).toBeTruthy()

    await user.click(within(container).getByText('🗓'))

    expect(document.querySelector('.tf-calendar')).toBe(null)
  })

  it('close the calendar on click outside of the field', async () => {

    const user = userEvent.setup()
    const { container } = render(
      <>
        { fields.render({
          type  : 'date-picker',
          label : 'Label for date_picker'
        }) }
        <div>Test click outside</div>
      </>
    )

    await user.click(within(container).getByText('🗓'))
  
    expect(document.querySelector('.tf-calendar')).toBeTruthy()

    await user.click(within(container).getByText('Test click outside'))

    expect(document.querySelector('.tf-calendar')).toBe(null)
  })

})
