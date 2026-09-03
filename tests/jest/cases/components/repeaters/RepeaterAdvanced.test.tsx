import * as fields from '../../../../../assets/src/index.tsx'
import { commonRepeaterTests } from './common.ts'
import { bulkActionsRepeaterTests } from './bulkActions.ts'
import { within, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Repeater with an advanced layout', () => {

  /**
   * Common tests that must work regardless of the layout used
   */
  commonRepeaterTests('advanced', {
    cloneText   : 'Duplicate',
    removeText  : 'Delete'
  })

  /**
   * Common tests for the bulk actions (shared with block layout)
   */
  bulkActionsRepeaterTests('advanced', {
    cloneText   : 'Duplicate',
    removeText  : 'Delete'
  })

  it('renders all field labels in the headers by default', () => {

    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : 'advanced',
        fields : [
          {
            name  : 'test',
            label : 'Test 1',
            type  : 'text'
          },
          {
            name  : 'test2',
            label : 'Test 2',
            type  : 'text'
          }
        ]
      })
    )

    const header = container.querySelector('.tf-repeater-advanced-header')
    const overview = container.querySelector('.tf-repeater-advanced-overview-item-container')

    expect(within(overview).queryByText('Duplicate')).toBeTruthy()
    expect(within(header).getByText('Test 1')).toBeTruthy()
    expect(within(header).getByText('Test 2')).toBeTruthy()
  })

  it('renders only defined field labels in the headers when headerFields is used', () => {

    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : 'advanced',
        fields : [
          {
            name  : 'test',
            label : 'Test 1',
            type  : 'text'
          },
          {
            name  : 'test2',
            label : 'Test 2',
            type  : 'text'
          }
        ],
        headerFields : [
          'test2'
        ],
      })
    )

    const header = container.querySelector('.tf-repeater-advanced-header')

    expect(within(header).queryByText('Test 1')).toBeFalsy()
    expect(within(header).getByText('Test 2')).toBeTruthy()
  })

  it('renders object.label inside headers', () => {

    const { container } = render(
      fields.render({
        type   : 'repeater',
        layout : 'advanced',
        fields : [
          {
            name      : 'test',
            label     : 'Test 1',
            type      : 'text'
          },
          {
            name      : 'test2',
            label     : 'Test 2',
            type      : 'combo-box',
            isAync    : true,
            searchUrl : 'test.json',
          },
          {
            name      : 'test3',
            label     : 'Test 3',
            type      : 'field-group'
          }
        ],
        value : JSON.stringify([
          {
            test  : 'test',
            test2 : { value: 'value', label: 'Name 1' },
            test3 : { random: 'object' }
          }
        ])
      })
    )

    const header = container.querySelector('.tf-repeater-advanced-header')

    expect(within(header).queryByText('Test 1')).toBeTruthy()
    expect(within(header).queryByText('Test 2')).toBeTruthy()
    expect(within(header).queryByText('Test 3')).toBeTruthy()

    const itemOverview = container.querySelector('.tf-repeater-advanced-overview')

    expect(within(itemOverview).queryByText('test')).toBeTruthy()
    expect(within(itemOverview).queryByText('Name 1')).toBeTruthy()

    const overviewValues = itemOverview.querySelectorAll('.tf-repeater-advanced-label-row-item')
    expect(overviewValues.length).toBe(3)
    expect(overviewValues[2].textContent).toBe('')
  })

  it('renders value with callback header previews', async () => {

    const { container } = render(
      fields.render({
        type         : 'repeater',
        layout       : 'advanced',
        headerFields : [
          {
            name      : 'test2',
            callback  : config => (`custom render with value ${config.value.label}`)
          }
        ],
        fields : [
          {
            name      : 'test',
            label     : 'Test 1',
            type      : 'text'
          },
          {
            name      : 'test2',
            label     : 'Test 2',
            type      : 'combo-box',
            isAync    : true,
            searchUrl : 'test.json',
          },
          {
            name      : 'test3',
            label     : 'Test 3',
            type      : 'field-group'
          }
        ],
        value : JSON.stringify([
          {
            test  : 'test',
            test2 : { value: 'value', label: 'Name 1' },
            test3 : { random: 'object' }
          }
        ])
      })
    )

    const header = container.querySelector('.tf-repeater-advanced-header')

    expect(within(header).queryByText('Test 1')).toBeFalsy()
    expect(within(header).queryByText('Test 2')).toBeTruthy()
    expect(within(header).queryByText('Test 3')).toBeFalsy()

    const itemOverview = container.querySelector('.tf-repeater-advanced-overview')
    expect(within(itemOverview).queryByText('custom render with value Name 1')).toBeTruthy()
  })

  it('renders value in header previews with a separatly registered callback', async () => {

    fields.fields.repeater.registerCallback(
      'custom_callback_name',
      config => (`custom render with value ${config.value.label}`)
    )

    const { container } = render(
      fields.render({
        type         : 'repeater',
        layout       : 'advanced',
        headerFields : [
          {
            name      : 'test2',
            callback  : 'custom_callback_name'
          }
        ],
        fields : [
          {
            name      : 'test',
            label     : 'Test 1',
            type      : 'text'
          },
          {
            name      : 'test2',
            label     : 'Test 2',
            type      : 'combo-box',
            isAync    : true,
            searchUrl : 'test.json',
          },
          {
            name      : 'test3',
            label     : 'Test 3',
            type      : 'field-group'
          }
        ],
        value : JSON.stringify([
          {
            test  : 'test',
            test2 : { value: 'value', label: 'Name 1' },
            test3 : { random: 'object' }
          }
        ])
      })
    )

    const header = container.querySelector('.tf-repeater-advanced-header')

    expect(within(header).queryByText('Test 1')).toBeFalsy()
    expect(within(header).queryByText('Test 2')).toBeTruthy()
    expect(within(header).queryByText('Test 3')).toBeFalsy()

    const itemOverview = container.querySelector('.tf-repeater-advanced-overview')
    expect(within(itemOverview).queryByText('custom render with value Name 1')).toBeTruthy()
  })

  describe('accordion trigger', () => {

    const setup = (count = 2) => {
      const user = userEvent.setup()
      const { container } = render(
        fields.render({
          type   : 'repeater',
          layout : 'advanced',
          name   : 'accordion-test',
          value  : JSON.stringify(
            Array.from({ length: count }, (_, i) => ({ key: `k${i}`, text: `Text ${i + 1}` }))
          ),
          fields : [{ type: 'text', label: 'Text', name: 'text' }]
        })
      )
      const toggles = () => container.querySelectorAll('.tf-button-repeater-overview-open')
      const openFields = () => container.querySelectorAll('.tf-text').length
      return { user, container, toggles, openFields }
    }

    it('wires the chevron as the accordion trigger', async () => {
      const { user, toggles, openFields, container } = setup()
      const toggle = toggles()[0]

      expect(toggle.tagName).toBe('BUTTON')
      expect(toggle.getAttribute('aria-expanded')).toBe('false')
      expect(toggle.getAttribute('aria-label')).toBe('Open item 1')

      await user.click(toggle)

      expect(openFields()).toBe(1)
      expect(toggle.getAttribute('aria-expanded')).toBe('true')
      expect(toggle.getAttribute('aria-label')).toBe('Close item 1')
      const panel = document.getElementById(toggle.getAttribute('aria-controls'))
      expect(panel).toBeTruthy()
      expect(panel.getAttribute('data-state')).toBe('open')
    })

    it('toggles exactly once per key press', async () => {
      const { user, toggles, openFields } = setup()
      const toggle = toggles()[0] as HTMLElement

      toggle.focus()
      await user.keyboard(' ')
      expect(openFields()).toBe(1)
      await user.keyboard(' ')
      expect(openFields()).toBe(0)
      await user.keyboard('{Enter}')
      expect(openFields()).toBe(1)
      await user.keyboard('{Enter}')
      expect(openFields()).toBe(0)
    })

    it('opens one row at a time', async () => {
      const { user, toggles, openFields } = setup()
      await user.click(toggles()[0])
      await user.click(toggles()[1])
      expect(openFields()).toBe(1)
      expect(toggles()[0].getAttribute('aria-expanded')).toBe('false')
      expect(toggles()[1].getAttribute('aria-expanded')).toBe('true')
    })

    it('toggles on double-click of the overview, but not of its controls', async () => {
      const { user, container, openFields } = setup()
      const overview = container.querySelectorAll('.tf-repeater-advanced-overview')[0]

      await user.dblClick(overview.querySelector('.tf-repeater-advanced-label-row-index'))
      expect(openFields()).toBe(1)

      await user.dblClick(overview.querySelector('.tf-repeater-advanced-label-row-index'))
      expect(openFields()).toBe(0)

      // Double-clicking the Edit link toggles through the link itself: open, close
      await user.dblClick(within(overview).getByText('Edit'))
      expect(openFields()).toBe(0)
    })

    it('keeps the same row open when a row above it is removed', async () => {
      const { user, toggles, container } = setup(3)
      await user.click(toggles()[1])
      expect(container.querySelector('.tf-text input').getAttribute('value')).toBe('Text 2')

      const firstOverview = container.querySelectorAll('.tf-repeater-advanced-overview')[0]
      await user.click(within(firstOverview).getByText('Delete'))
      await user.click(within(document.querySelector('.tf-confirm-dialog')).getByText('Delete'))

      expect(container.querySelectorAll('.tf-repeater-advanced-item').length).toBe(2)
      expect(container.querySelector('.tf-text input').getAttribute('value')).toBe('Text 2')
    })
  })
})
