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
  /**
   * A stored-but-untouched field and an emptied one would both post `''`, and a
   * handler storing what it receives erases the secret on every save. Leaving
   * the name off makes "untouched" a missing key instead.
   */
  describe('submission', () => {

    it('is left out of the submission while stored and untouched', () => {

      const { container } = render(
        fields.render({ type: 'password', name: 'api_key', label: 'API Key', isSet: true })
      )

      expect(container.querySelector('input').hasAttribute('name')).toBe(false)
    })

    it('submits once typed into, and drops out again when cleared', async () => {

      const { container } = render(
        fields.render({ type: 'password', name: 'api_key', label: 'API Key', isSet: true })
      )

      const user = userEvent.setup()
      const input = container.querySelector('input')

      await user.type(input, 'new-key')
      expect(input.name).toBe('api_key')

      // Clearing is not "erase the stored value" — that stays an explicit action.
      await user.clear(input)
      expect(input.hasAttribute('name')).toBe(false)
    })

    it('is never submitted when locked', () => {

      // No isSet, so this is locked alone keeping it out — not the set state.
      const { container } = render(
        fields.render({
          type   : 'password',
          name   : 'api_key',
          label  : 'API Key',
          locked : true
        })
      )

      expect(container.querySelector('input').hasAttribute('name')).toBe(false)
    })
  })

  describe('placeholder', () => {

    it('shows when nothing is stored', () => {

      const { container } = render(
        fields.render({ type: 'password', name: 'api_key', label: 'API Key', placeholder: 'Paste your key' })
      )

      expect(container.querySelector('input').placeholder).toBe('Paste your key')
    })

    it('gives way to the set state once a value is stored', () => {

      const { container } = render(
        fields.render({
          type        : 'password',
          name        : 'api_key',
          label       : 'API Key',
          placeholder : 'Paste your key',
          isSet       : true,
          labels      : { valueSet: '•••••••• Saved' }
        })
      )

      expect(container.querySelector('input').placeholder).toBe('•••••••• Saved')
    })
  })

  /**
   * Inside a parent that stores its subfields as one JSON value there is no
   * key to leave out, so saving the parent would erase the secret. The parent
   * drops the field, so it draws no label, column or row for it either.
   */
  describe('as a subfield', () => {

    const subfield = { type: 'password', name: 'api_key', label: 'API Key', isSet: true }

    it('is dropped from a repeater, with no orphaned column header, and says why', () => {

      console.warn = jest.fn()

      const { container } = render(
        fields.render({
          type   : 'repeater',
          name   : 'keys_table',
          layout : 'table',
          value  : [ { key: 1 } ],
          fields : [ { type: 'text', name: 'label', label: 'Label' }, subfield ]
        })
      )

      expect(container.querySelector('input[type="password"]')).toBeNull()
      expect(container.textContent).not.toContain('API Key')
      expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('was dropped from a repeater'))
    })

    it('is dropped from a controlled field group', () => {

      console.warn = jest.fn()

      const { container } = render(
        fields.render({ type: 'field-group', name: 'group', fields: [ subfield ] })
      )

      expect(container.querySelector('input[type="password"]')).toBeNull()
      expect(container.textContent).not.toContain('API Key')
    })

    it('is dropped from an uncontrolled group inside a repeater', () => {

      console.warn = jest.fn()

      const { container } = render(
        fields.render({
          type   : 'repeater',
          name   : 'keys_nested',
          layout : 'block',
          value  : [ { key: 1 } ],
          fields : [ { type: 'field-group', name: 'group', uncontrolled: true, fields: [ subfield ] } ]
        })
      )

      expect(container.querySelector('input[type="password"]')).toBeNull()
    })

    it('renders, and submits under its own name, inside an uncontrolled field group', async () => {

      const { container } = render(
        fields.render({ type: 'field-group', name: 'group', uncontrolled: true, fields: [ subfield ] })
      )

      const input = container.querySelector('input[type="password"]')
      expect(input).not.toBeNull()

      const user = userEvent.setup()
      await user.type(input, 'new-key')
      expect(input.name).toBe('api_key')
    })

    it('is dropped from dynamic value settings', () => {

      console.warn = jest.fn()

      const values = fields.getConfig().dynamics.values
      values['test-password-setting'] = {
        fields: [ { type: 'text', name: 'label', label: 'Label' }, subfield ]
      }

      try {
        const { container } = render(
          <fields.DynamicValueSettings
            valueName="test-password-setting"
            settings={ {} }
            onChange={ () => {} }
          />
        )
        expect(container.querySelector('input[type="password"]')).toBeNull()
        expect(container.textContent).not.toContain('API Key')
      }
      finally {
        delete values['test-password-setting']
      }
    })
  })
})
