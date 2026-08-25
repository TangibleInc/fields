import * as fields from '../../../../../assets/src/index.tsx'
import {
  render,
  screen
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import {
  rendersWithMinimal,
  rendersLabelAndDescription
} from '../../../utils/fields.ts'

/**
 * The password field exists to keep stored secrets out of the browser, so most
 * of what is worth testing is what the markup does NOT contain.
 */

describe('Password component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'password' }))

  it('renders label and description', () => rendersLabelAndDescription({ type: 'password' }))

  it('masks by default and submits under its name', () => {

    const { container } = render(
      fields.render({ type: 'password', name: 'api_key', label: 'API Key' })
    )

    const input = container.querySelector('input')
    expect(input.type).toBe('password')
    expect(input.name).toBe('api_key')
  })

  it('never renders a value it was given', () => {

    console.warn = jest.fn()

    const { container } = render(
      fields.render({
        type  : 'password',
        name  : 'api_key',
        label : 'API Key',
        value : 'super-secret-key'
      })
    )

    const input = container.querySelector('input')
    expect(input.value).toBe('')
    // Controlled input, so React writes the attribute — what matters is that
    // it is empty and the secret appears nowhere in the rendered markup.
    expect(input.getAttribute('value') ?? '').toBe('')
    expect(container.innerHTML).not.toContain('super-secret-key')
    expect(console.warn).toHaveBeenCalled()
  })

  it('shows the set state without holding a value', () => {

    const { container } = render(
      fields.render({
        type  : 'password',
        name  : 'api_key',
        label : 'API Key',
        isSet : true
      })
    )

    const input = container.querySelector('input')
    expect(input.value).toBe('')
    expect(input.placeholder).toBeTruthy()
  })

  it('does not warn about a value the user typed', async () => {

    console.warn = jest.fn()

    const { container } = render(
      fields.render({ type: 'password', name: 'api_key', label: 'API Key', isSet: true })
    )

    const user = userEvent.setup()
    await user.type(container.querySelector('input'), 'typed-key')

    expect(container.querySelector('input').value).toBe('typed-key')
    expect(console.warn).not.toHaveBeenCalled()
  })

  it('reveals only what was typed', async () => {

    const { container } = render(
      fields.render({ type: 'password', name: 'api_key', label: 'API Key' })
    )

    const input = container.querySelector('input')
    const user = userEvent.setup()

    await user.type(input, 'typed-key')
    expect(input.type).toBe('password')

    await user.click(screen.getByRole('button', { name: 'Show value' }))
    expect(container.querySelector('input').type).toBe('text')
  })

  it('locked is read-only, has no reveal toggle, and explains itself', () => {

    const { container } = render(
      fields.render({
        type          : 'password',
        name          : 'api_key',
        label         : 'API Key',
        isSet         : true,
        locked        : true,
        lockedMessage : 'Defined in wp-config.php.'
      })
    )

    const input = container.querySelector('input')
    expect(input.readOnly).toBe(true)
    // readOnly, not disabled — the field must stay in the tab order for AT.
    expect(input.disabled).toBe(false)
    expect(screen.queryByRole('button', { name: 'Show value' })).toBeNull()
    expect(screen.getByText('Defined in wp-config.php.')).toBeTruthy()
  })

  it('accepts translated labels', async () => {

    const { container } = render(
      fields.render({
        type   : 'password',
        name   : 'api_key',
        label  : 'Clé API',
        labels : { reveal: 'Afficher la valeur', valueSet: '•••••••• Enregistrée' }
      })
    )

    expect(screen.getByRole('button', { name: 'Afficher la valeur' })).toBeTruthy()
    expect(container.querySelector('input').placeholder).toBe('')

    const { container: setContainer } = render(
      fields.render({
        type   : 'password',
        name   : 'api_key_2',
        label  : 'Clé API',
        isSet  : true,
        labels : { valueSet: '•••••••• Enregistrée' }
      })
    )

    expect(setContainer.querySelector('input').placeholder).toBe('•••••••• Enregistrée')
  })
})
