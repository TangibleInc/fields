import '../../../assets/src/index.jsx'
import { uniqid } from '../../../assets/src/utils.js'
import { userEvent } from '@testing-library/user-event'
import {
  render,
  within
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

  it('add label to conditional panel', async () => {

    const { container } = render(
      fields.render({
        type  : 'conditional-panel',
        name  : 'conditional-panel-name',
        label : 'Conditional Panel'
      })
    )

    expect(within(container).getByText('Conditional Panel')).toBeTruthy()
  })

  test.each([
    { props: {} },
    { props: { value: '' } },
    {
      props: { operators : { 'custom'  : 'Custom', 'custom2' : 'Custom 2' } },
      defaultOperator: 'custom'
    },
    {
      props: {
        value: '',
        operators : { 'custom'  : 'Custom', 'custom2' : 'Custom 2'
        }
      },
      defaultOperator: 'custom'
    }
  ])('set correclty the initial value if empty or not set (with %p)', ({
    props,
    defaultOperator = '_eq'
  }) => {

    const { container } = render(
      fields.render({
        type  : 'conditional-panel',
        name  : 'conditional-panel-name',
        ...props
      })
    )

    const input = container.querySelector('input[name="conditional-panel-name"]')

    expect(input).toBeTruthy()

    const initialValue = JSON.parse(input.value)

    expect(Array.isArray(initialValue)).toBe(true)
    expect(initialValue.length).toBe(1)
    expect(initialValue[0].key).toBeTruthy()

    expect(Array.isArray(initialValue[0].data)).toBe(true)
    expect(initialValue[0].data.length).toBe(1)

    expect(initialValue[0].data[0].key).toBeTruthy()
    expect(initialValue[0].data[0].left_value).toBe('')
    expect(initialValue[0].data[0].operator).toBe(defaultOperator)
    expect(initialValue[0].data[0].right_value).toBe('')
  })

  test.each([
    {
      customFields: [],
      defaultOperator: '_eq'
    },
    {
      customFields: [
        { name: 'operator', type: 'text' }
      ],
      defaultOperator: ''
    },
    {
      customFields: [
        { name: 'operator', type: 'select', choices: {} }
      ],
      defaultOperator: ''
    },
    {
      customFields: [
        { name: 'operator', type: 'select', choices: { custom: 'Custom', custom2: 'Custom2' } }
      ],
      defaultOperator: 'custom'
    },
    {
      customFields: [
        { name: 'no-operator-field' }
      ],
      defaultOperator: ''
    },
  ])('attemps to get custom field operator first value as default (with %p)', ({
    customFields,
    defaultOperator
  }) => {

    const { container } = render(
      fields.render({
        type   : 'conditional-panel',
        name   : 'conditional-panel-name',
        fields : customFields
      })
    )

    const input = container.querySelector('input[name="conditional-panel-name"]')

    expect(input).toBeTruthy()

    const initialValue = JSON.parse(input.value)

    expect(Array.isArray(initialValue)).toBe(true)
    expect(initialValue.length).toBe(1)
    expect(initialValue[0].key).toBeTruthy()

    expect(Array.isArray(initialValue[0].data)).toBe(true)
    expect(initialValue[0].data.length).toBe(1)

    expect(initialValue[0].data[0].key).toBeTruthy()
    expect(initialValue[0].data[0].operator).toBe(defaultOperator)
  })

  it('renders with custom subfields defined', () => {

    const { container } = render(
      fields.render({
        type  : 'conditional-panel',
        name  : 'conditional-panel-name',
        fields : [
          {
            'label': 'Text',
            'type': 'date-picker',
            'name': 'date',
            'labelVisuallyHidden': true
          },
          {
            'label': 'Operator',
            'type': 'select',
            'name': 'select',
            'choices': {
              '_eq': 'Is',
              '_neq': 'Is not',
              '_lt': 'Less than',
            },
            'labelVisuallyHidden': true,
          },
          {
            'label': 'Color',
            'type': 'color-picker',
            'name': 'color',
            'labelVisuallyHidden': true,
          },
        ]
      }
      )
    )

    expect(document.querySelectorAll('.tf-repeater-bare-row').length).toBe(1)

    const rowField = document.querySelectorAll('.tf-repeater-bare-row .tf-repeater-bare-item-field')
    expect(rowField[0].querySelector('.tf-date-picker')).toBeTruthy()
    expect(rowField[1].querySelector('.tf-select')).toBeTruthy()
    expect(rowField[2].querySelector('.tf-color')).toBeTruthy()

  }, 10000)
})
