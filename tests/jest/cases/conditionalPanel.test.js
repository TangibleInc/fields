import '../../../assets/src/index.jsx'
import { uniqid } from '../../../assets/src/utils.js'
import { userEvent } from '@testing-library/user-event'
import { 
  render, 
  within,
} from '@testing-library/react'

const fields = window.tangibleFields

describe('conditional panel', () => {
  
  it('renders', () => {

    const { container } = render(
      fields.render({
        type  : 'conditional-panel',
        name  : 'conditional-panel-name' 
      })
    )

    expect(document.querySelectorAll('.tf-conditional-panel').length).toBe(1)
    expect(document.querySelectorAll('.tf-repeater-bare-row').length).toBe(1)
    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(1)
    
    expect(within(container).getByText('And')).toBeTruthy()
    expect(within(container).getByText('Delete condition')).toBeTruthy()
    expect(within(container).getByText('Add group')).toBeTruthy()
  })

  it('can add and remove conditions', async () => {
    
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type  : 'conditional-panel',
        name  : 'conditional-panel-name' 
      })
    )

    expect(document.querySelectorAll('.tf-repeater-bare-row').length).toBe(1)
    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(1)

    await user.click(within(container).getByText('And'))

    expect(document.querySelectorAll('.tf-repeater-bare-row').length).toBe(2)
    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(0)

    await user.click(within(container).getAllByText('Delete condition')[0])

    expect(document.querySelectorAll('.tf-repeater-bare-row').length).toBe(1)
    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(1)

    await user.click(within(container).getByText('Delete condition'))

    expect(document.querySelectorAll('.tf-repeater-bare-row').length).toBe(1)
    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(1)
  })

  it('can add condition groups', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type  : 'conditional-panel',
        name  : 'conditional-panel-name' 
      })
    )

    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(1)

    await user.click(within(container).getByText('Add group'))

    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(0)
    expect(document.querySelectorAll('.tf-conditional-group').length).toBe(2)
  })

  it('automatically removes condition group when no condition', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type  : 'conditional-panel',
        name  : 'conditional-panel-name' 
      })
    )

    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(1)

    await user.click(within(container).getByText('Add group'))

    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(0)
    expect(document.querySelectorAll('.tf-conditional-group').length).toBe(2)

    await user.click(within(container).getAllByText('Delete condition')[0])

    expect(document.querySelectorAll('.tf-conditional-group').length).toBe(1)
    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(1)
  })

  it('can load value', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type  : 'conditional-panel',
        name  : 'conditional-panel-name',
        value : [
          { 
            key: uniqid(), 
            data: [
              { key: uniqid() }
            ] 
          },
          { 
            key: uniqid(), 
            data: [
              { key: uniqid() },
              { key: uniqid() }
            ] 
          },
          { 
            key: uniqid(), 
            data: [
              { key: uniqid() },
              { key: uniqid() },
              { key: uniqid() }
            ] 
          },
        ] 
      })
    )

    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(0)
    expect(document.querySelectorAll('.tf-conditional-group').length).toBe(3)
    expect(within(container).getAllByText('Add group').length).toBe(3)
    expect(document.querySelectorAll('.tf-repeater-bare-row').length).toBe(6)

    await user.click(within(document.querySelectorAll('.tf-conditional-group')[1]).getAllByText('Delete condition')[1])
    await user.click(within(document.querySelectorAll('.tf-conditional-group')[1]).getAllByText('Delete condition')[0])

    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(0)
    expect(document.querySelectorAll('.tf-conditional-group').length).toBe(2)
    expect(within(container).getAllByText('Add group').length).toBe(2)
    expect(document.querySelectorAll('.tf-repeater-bare-row').length).toBe(4)

    await user.click(within(document.querySelectorAll('.tf-conditional-group')[1]).getAllByText('Delete condition')[2])
    await user.click(within(document.querySelectorAll('.tf-conditional-group')[1]).getAllByText('Delete condition')[1])
    await user.click(within(document.querySelectorAll('.tf-conditional-group')[1]).getAllByText('Delete condition')[0])

    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(1)
    expect(document.querySelectorAll('.tf-conditional-group').length).toBe(1)
    expect(within(container).getAllByText('Add group').length).toBe(1)
    expect(document.querySelectorAll('.tf-repeater-bare-row').length).toBe(1)
  })

  it('can be rendered inside a modal, and save only when modal is closed with save button', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type     : 'conditional-panel',
        name     : 'conditional-panel-name', 
        useModal : true
      })
    )

    expect(within(container).getByText('Open conditional panel'))

    expect(document.querySelectorAll('.tf-conditional-panel').length).toBe(0)
    expect(document.querySelectorAll('.tf-repeater-bare-row').length).toBe(0)
    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(0)
    
    expect(within(container).queryByText('And')).toBeFalsy()
    expect(within(container).queryByText('Delete condition')).toBeFalsy()
    expect(within(container).queryByText('Add group')).toBeFalsy()
    
    await user.click(within(container).getByText('Open conditional panel'))
    
    expect(document.querySelectorAll('.tf-conditional-panel').length).toBe(1)
    expect(document.querySelectorAll('.tf-repeater-bare-row').length).toBe(1)
    expect(document.querySelectorAll('.tf-button-danger[disabled=""]').length).toBe(1)
    
    const cancelModal = document.querySelector('.tf-modal-container')
    
    expect(within(cancelModal).getByText('And')).toBeTruthy()
    expect(within(cancelModal).getByText('Delete condition')).toBeTruthy()
    expect(within(cancelModal).getByText('Add group')).toBeTruthy()
    expect(within(cancelModal).getByText('Save')).toBeTruthy()
    expect(within(cancelModal).getByText('Cancel')).toBeTruthy()

    await user.click(within(cancelModal).getByText('And'))
    await user.click(within(cancelModal).getByText('Add group'))

    expect(within(cancelModal).getAllByText('And').length).toBe(3)
    expect(within(cancelModal).getAllByText('Add group').length).toBe(2)

    await user.click(within(cancelModal).getByText('Cancel'))

    expect(document.querySelector('.tf-modal-container')).toBeFalsy()

    await user.click(within(container).getByText('Open conditional panel'))

    const saveModal = document.querySelector('.tf-modal-container')

    expect(saveModal).toBeTruthy()

    expect(within(saveModal).getAllByText('And').length).toBe(1)
    expect(within(saveModal).getAllByText('Add group').length).toBe(1)

    await user.click(within(saveModal).getByText('And'))
    await user.click(within(saveModal).getByText('Add group'))

    expect(within(saveModal).getAllByText('And').length).toBe(3)
    expect(within(saveModal).getAllByText('Add group').length).toBe(2)

    await user.click(within(saveModal).getByText('Save'))

    expect(document.querySelector('.tf-modal-container')).toBeFalsy()

    await user.click(within(container).getByText('Open conditional panel'))

    const savedModal = document.querySelector('.tf-modal-container')

    expect(savedModal).toBeTruthy()

    expect(within(savedModal).getAllByText('And').length).toBe(3)
    expect(within(savedModal).getAllByText('Add group').length).toBe(2)
  })

})
