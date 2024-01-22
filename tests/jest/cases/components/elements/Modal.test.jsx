import '../../../../../assets/src/index.jsx'
import { renderHasElement } from '../../../utils/elements.js'
import { 
  render,
  screen,
  within
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

const fields = window.tangibleFields

describe('Modal component', () => {

  it('renders', () => {
    renderHasElement({ type: 'modal' }, container => container.getElementsByTagName('button')[0])
  })

  it('can set modal title from title parameter', async () => {
    
    const user = userEvent.setup()

    const { container } = render(
      fields.render({
        type    : 'modal',
        label   : 'Modal label',
        title   : `Modal text`,
      }, 'element')
    )

    await user.click(within(container).getByText('Modal label'))

    const modal = screen.getByText('Modal text')
    expect(modal).toBeTruthy()
  })

  it('can set confirm text button from confirmText parameter', async () => {
    
    const user = userEvent.setup()

    const { container } = render(
      fields.render({
        type    : 'modal',
        label   : 'Modal label',
        title   : `Modal text`,
        confirmText : 'Confirm'
      }, 'element')
    )

    await user.click(within(container).getByText('Modal label'))

    const modal = screen.getByText('Confirm')
    expect(modal).toBeTruthy()
  })

  it('can set cancel text button from cancelText parameter', async () => {
    
    const user = userEvent.setup()

    const { container } = render(
      fields.render({
        type    : 'modal',
        label   : 'Modal label',
        title   : `Modal text`,
        cancelText : 'Exit'
      }, 'element')
    )

    await user.click(within(container).getByText('Modal label'))

    const modal = screen.getByText('Exit')
    expect(modal).toBeTruthy()
  })

  it('can set children from children parameter', async () => {
    
    const user = userEvent.setup()

    const { container } = render(
      fields.render({
        type    : 'modal',
        label   : 'Modal label',
        title   : `Modal text`,
        children : <div>Modal Children</div>
      }, 'element')
    )

    await user.click(within(container).getByText('Modal label'))

    const modal = screen.getByText('Modal Children')
    expect(modal).toBeTruthy()
  })

})
