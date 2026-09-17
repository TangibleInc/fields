import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  DynamicFieldSettings,
  DynamicValueSettings,
  dynamicValues,
} from '../../../../assets/src/index.tsx'
import { createDynamicValuesAPI } from '../../../../assets/src/dynamic-values'

/**
 * The dynamic-values surface a consumer with its own UI relies on: an API
 * that needs no host field, the settings modal driven by props (modes,
 * extra groups, labels, container), and the settings sub-form on its own.
 * The registry is the one tests/jest/setup/config.ts installs.
 */
describe('dynamic values feature - consumer API', () => {

  describe('createDynamicValuesAPI', () => {

    test('defaults to every category and every registered type', () => {
      const api = createDynamicValuesAPI()

      expect(api.getCategories()).toStrictEqual(['test-category', 'test-category-2'])
      expect(api.getTypes().sort()).toStrictEqual(['number', 'text'])
      expect(api.getMode()).toBe('replace')
      expect(api.getLabel('test-value-settings')).toBe('Test value settings')
      expect(api.getLabel('nope')).toBe('nope')
      expect(api.hasValues()).toBe(false)
      expect(api.getAll()).toStrictEqual([])
    })

    test('narrows to the given categories and types, and builds grouped choices', () => {
      const api = createDynamicValuesAPI({ categories: ['test-category-2'], types: ['number'] })

      expect(api.getCategories()).toStrictEqual(['test-category-2'])
      expect(dynamicValues.buildGroupedChoices(api, configDynamics())).toStrictEqual([
        { name: 'Test category 2', choices: { 'test-value-2-settings': 'Test value 2 settings' } },
      ])
    })

    test('round-trips the token grammar', () => {
      const raw = dynamicValues.stringify('test-value-settings', { 'dynamic-value-setting': 'x' })
      expect(raw).toBe('[[test-value-settings::dynamic-value-setting=x]]')
      expect(dynamicValues.parse(raw)).toMatchObject({ type: 'test-value-settings' })
    })
  })

  describe('DynamicFieldSettings as a standalone picker', () => {

    const setup = (props: Record<string, any> = {}) => {
      const onSubmit = jest.fn()
      const onOpenChange = jest.fn()
      const container = document.createElement('div')
      // Deliberately bare: the dialog must add the wrapper classes itself
      container.className = 'consumer-host'
      document.body.appendChild(container)
      const utils = render(
        <DynamicFieldSettings
          open
          onOpenChange={ onOpenChange }
          dynamic={ createDynamicValuesAPI() }
          container={ container }
          onSubmit={ onSubmit }
          { ...props }
        />
      )
      // TUI's portal root declares pointer-events: none inline and re-enables it
      // on the panel through CSS jsdom never loads — skip the check like the
      // other picker tests do.
      return { ...utils, onSubmit, onOpenChange, container, user: userEvent.setup({ pointerEventsCheck: 0 }) }
    }

    /** SearchSelect's trigger: a button labelled by the field label. */
    const trigger = () =>
      document.querySelector('.tf-dynamic-settings-dialog .tui-search-select__trigger') as HTMLElement

    afterEach(() => {
      document.body.innerHTML = ''
    })

    test('mounts into the given container and uses the given labels', () => {
      const { container } = setup({
        labels: { title: 'Insert a field', select: 'Field', add: 'Insert' },
      })

      expect(container.querySelector('.tf-dynamic-settings-dialog')).toBeTruthy()
      // The wrapper classes the module's styles and TUI's portal roots key on
      expect(container.classList.contains('tf-interface')).toBe(true)
      expect(container.classList.contains('tf-context-default')).toBe(true)
      expect(screen.getByText('Insert a field')).toBeInTheDocument()
      expect(screen.getByText('Field')).toBeInTheDocument()
      expect(screen.getByText('Insert')).toBeInTheDocument()
    })

    test('a single mode hides the Field Type toggle', () => {
      setup({ modes: ['builtin'] })

      expect(screen.queryByText('Field Type')).not.toBeInTheDocument()
      expect(screen.queryByText('Custom')).not.toBeInTheDocument()
      expect(screen.getByText('Select Type & Meta Key')).toBeInTheDocument()
    })

    test('lists extra groups after the registry and submits their keys unchanged', async () => {
      const { user, onSubmit, onOpenChange } = setup({
        modes: ['builtin'],
        extraGroups: [
          { name: 'doc', label: 'This document', choices: { 'custom.title': 'Title', 'custom.sig': 'Signature' } },
        ],
      })

      await user.click(trigger())
      const options = await screen.findAllByRole('option')
      const texts = options.map(option => option.textContent)
      expect(texts.slice(-2)).toStrictEqual(['Title', 'Signature'])
      expect(screen.getByText('This document')).toBeInTheDocument()

      await user.click(screen.getByRole('option', { name: 'Title' }))
      await user.click(screen.getByText('Add Field'))

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
      expect(onSubmit).toHaveBeenCalledWith('custom.title', {
        mode: 'builtin',
        value: 'custom.title',
        label: 'Title',
        group: 'This document',
        settings: {},
        extra: true,
      })
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })

    test('a registry value with settings submits the token inside and the pick', async () => {
      const { user, onSubmit } = setup({ modes: ['builtin'] })

      await user.click(trigger())
      await user.click(await screen.findByRole('option', { name: 'Test value settings' }))

      const setting = await screen.findByLabelText('Dynamic value setting')
      await user.type(setting, 'abc')
      await user.click(screen.getByText('Add Field'))

      await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1))
      const [raw, meta] = onSubmit.mock.calls[0]
      expect(raw).toBe('test-value-settings::dynamic-value-setting=abc')
      expect(meta).toMatchObject({
        mode: 'builtin',
        value: 'test-value-settings',
        label: 'Test value settings',
        group: 'Test category',
        extra: false,
      })
      expect(meta.settings).toStrictEqual({ 'dynamic-value-setting': 'abc' })
    })

    test('editing an extra-group reference preselects it', () => {
      setup({
        modes: ['builtin'],
        editingId: 'chip-1',
        editingRaw: 'custom.title',
        extraGroups: [{ name: 'doc', label: 'This document', choices: { 'custom.title': 'Title' } }],
      })

      expect(trigger()).toHaveTextContent('Title')
      expect(screen.getByText('Update Field')).toBeInTheDocument()
    })
  })

  describe('DynamicValueSettings on its own', () => {

    test('renders the value\'s declared fields and reports the whole settings object', async () => {
      const onChange = jest.fn()
      const user = userEvent.setup()
      render(
        <DynamicValueSettings
          valueName="test-value-settings"
          settings={ {} }
          onChange={ onChange }
        />
      )

      await user.type(screen.getByLabelText('Dynamic value setting'), 'x')
      expect(onChange).toHaveBeenLastCalledWith({ 'dynamic-value-setting': 'x' })
    })

    test('renders nothing for a value without settings', () => {
      const { container } = render(
        <DynamicValueSettings valueName="test-value-no-settings" settings={ {} } onChange={ () => {} } />
      )
      expect(container).toBeEmptyDOMElement()
    })
  })
})

const configDynamics = () => ({
  values: {
    'test-value-2-settings': { type: 'number', label: 'Test value 2 settings' },
    'test-value-2-no-settings': { type: 'text', label: 'Test value 2 no settings' },
  },
  categories: {
    'test-category-2': {
      label: 'Test category 2',
      values: ['test-value-2-no-settings', 'test-value-2-settings'],
    },
  },
})
