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
      const panelOf = (toggle: Element) => document.getElementById(toggle.getAttribute('aria-controls'))
      return { user, container, toggles, openFields, panelOf }
    }

    it('wires the chevron as the accordion trigger', async () => {
      const { user, toggles, panelOf } = setup()
      const toggle = toggles()[0]
      const panel = panelOf(toggle)

      expect(toggle.tagName).toBe('BUTTON')
      expect(toggle.getAttribute('aria-expanded')).toBe('false')
      expect(toggle.getAttribute('aria-label')).toBe('Open item 1')
      expect(panel.getAttribute('aria-hidden')).toBe('true')
      expect(within(panel).queryByRole('textbox')).toBeNull()

      await user.click(toggle)

      expect(toggle.getAttribute('aria-expanded')).toBe('true')
      expect(toggle.getAttribute('aria-label')).toBe('Close item 1')
      expect(panel.getAttribute('data-state')).toBe('open')
      expect(panel.getAttribute('aria-hidden')).toBe('false')
      expect(within(panel).getByDisplayValue('Text 1')).toBeTruthy()
    })

    it('exposes state on the Edit/Close link with a row-specific name', async () => {
      const { user, container } = setup()
      const overview = container.querySelectorAll('.tf-repeater-advanced-overview')[1]
      const link = within(overview).getByText('Edit')

      expect(link.getAttribute('aria-expanded')).toBe('false')
      expect(link.getAttribute('aria-label')).toBe('Edit item 2')

      await user.click(link)

      expect(link.getAttribute('aria-expanded')).toBe('true')
      expect(link.getAttribute('aria-label')).toBe('Close item 2')
      expect(link).toHaveTextContent('Close')
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
      const { user, toggles, panelOf } = setup()
      await user.click(toggles()[0])
      await user.click(toggles()[1])
      expect(toggles()[0].getAttribute('aria-expanded')).toBe('false')
      expect(toggles()[1].getAttribute('aria-expanded')).toBe('true')
      expect(within(panelOf(toggles()[0])).queryByRole('textbox')).toBeNull()
      expect(within(panelOf(toggles()[1])).getByDisplayValue('Text 2')).toBeTruthy()
    })

    it('moves between chevrons with the arrow keys', async () => {
      const { user, toggles } = setup(3)
      ;(toggles()[0] as HTMLElement).focus()
      await user.keyboard('{ArrowDown}')
      expect(document.activeElement).toBe(toggles()[1])
      await user.keyboard('{End}')
      expect(document.activeElement).toBe(toggles()[2])
      await user.keyboard('{ArrowDown}')
      expect(document.activeElement).toBe(toggles()[0])
    })

    it('toggles on double-click of the overview, but not of its controls', async () => {
      const { user, container, openFields } = setup()
      const overview = container.querySelectorAll('.tf-repeater-advanced-overview')[0]

      await user.dblClick(overview.querySelector('.tf-repeater-advanced-label-row-index'))
      expect(openFields()).toBe(1)

      await user.dblClick(overview.querySelector('.tf-repeater-advanced-label-row-index'))
      expect(openFields()).toBe(0)

      // A control's own clicks are its own business; the row handler stays out
      await user.dblClick(within(overview).getByText('Duplicate'))
      expect(openFields()).toBe(0)
      expect(container.querySelectorAll('.tf-repeater-advanced-item').length).toBe(4)
    })

    it('keeps the same row open when a row above it is removed', async () => {
      const { user, toggles, container } = setup(3)
      await user.click(toggles()[1])
      expect(within(container).getByDisplayValue('Text 2')).toBeTruthy()

      const firstOverview = container.querySelectorAll('.tf-repeater-advanced-overview')[0]
      await user.click(within(firstOverview).getByText('Delete'))
      await user.click(within(document.querySelector('.tf-confirm-dialog')).getByText('Delete'))

      expect(container.querySelectorAll('.tf-repeater-advanced-item').length).toBe(2)
      expect(within(container).getByDisplayValue('Text 2')).toBeTruthy()
    })

    it('assigns keys to rows hydrated without one', () => {
      const { container: c2 } = render(
        fields.render({
          type   : 'repeater',
          layout : 'advanced',
          name   : 'keyless-test',
          value  : JSON.stringify([{ text: 'A' }, { text: 'B' }, { text: 'C' }]),
          fields : [{ type: 'text', label: 'Text', name: 'text' }]
        })
      )
      const saved = JSON.parse(c2.querySelector('input[name=keyless-test]').getAttribute('value'))
      const keys = saved.map(row => row.key)
      expect(keys.every(k => typeof k === 'string' && k.length > 0)).toBe(true)
      expect(new Set(keys).size).toBe(3)
    })

    it('hands focus to the next row after a delete, and to the footer when empty', async () => {
      const { user, toggles, container } = setup(2)

      const firstOverview = container.querySelectorAll('.tf-repeater-advanced-overview')[0]
      await user.click(within(firstOverview).getByText('Delete'))
      await user.click(within(document.querySelector('.tf-confirm-dialog')).getByText('Delete'))
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(container.querySelectorAll('.tf-repeater-advanced-item').length).toBe(1)
      expect(document.activeElement).toBe(toggles()[0])
      expect(document.activeElement.getAttribute('aria-label')).toBe('Open item 1')

      await user.click(within(container).getByText('Remove all'))
      await user.click(within(document.querySelector('.tf-confirm-dialog')).getByText('Remove all'))
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(container.querySelectorAll('.tf-repeater-advanced-item').length).toBe(0)
      expect(document.activeElement).toBe(within(container).getByText('Add item'))
    })
  })

  describe('sortable', () => {

    const setup = (sortable = true) => {
      const user = userEvent.setup()
      const { container } = render(
        fields.render({
          type     : 'repeater',
          layout   : 'advanced',
          name     : 'sortable-test',
          sortable : sortable,
          value    : JSON.stringify([
            { key: 'a', text: 'A' },
            { key: 'b', text: 'B' },
            { key: 'c', text: 'C' }
          ]),
          fields   : [{ type: 'text', label: 'Text', name: 'text' }]
        })
      )
      const order = () => JSON.parse(
        container.querySelector('input[name=sortable-test]').getAttribute('value')
      ).map(row => row.text)
      const handles = () => container.querySelectorAll('.tui-move-handle')
      const live = () => container.querySelector('[aria-live]')
      return { user, container, order, handles, live }
    }

    it('renders the plain index when not sortable', () => {
      const { handles, live, container } = setup(false)
      expect(handles().length).toBe(0)
      expect(live()).toBeNull()
      expect(container.querySelectorAll('.tf-repeater-advanced-overview .tf-repeater-advanced-label-row-index')[1]).toHaveTextContent('2')
    })

    it('renders a labelled MoveHandle per row with boundary arrows disabled', () => {
      const { handles } = setup()
      expect(handles().length).toBe(3)

      const first = handles()[0]
      expect(first.getAttribute('aria-label')).toBe('Reorder item 1')
      expect(within(first).getByLabelText('Move item 1 up')).toBeDisabled()
      expect(within(first).getByLabelText('Move item 1 down')).not.toBeDisabled()
      expect(first).toHaveTextContent('1')

      const last = handles()[2]
      expect(within(last).getByLabelText('Move item 3 down')).toBeDisabled()
    })

    it('moves a row, announces it, and keeps focus on the moved row', async () => {
      const { user, order, handles, live } = setup()
      expect(order()).toEqual(['A', 'B', 'C'])

      await user.click(within(handles()[0]).getByLabelText('Move item 1 down'))
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(order()).toEqual(['B', 'A', 'C'])
      expect(live()).toHaveTextContent('Item moved to position 2 of 3')
      expect(document.activeElement).toBe(within(handles()[1]).getByLabelText('Move item 2 down'))

      await user.click(within(handles()[2]).getByLabelText('Move item 3 up'))
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(order()).toEqual(['B', 'C', 'A'])
      expect(live()).toHaveTextContent('Item moved to position 2 of 3')
    })

    it('moving to the end falls back to the up arrow for focus', async () => {
      const { user, order, handles } = setup()

      await user.click(within(handles()[1]).getByLabelText('Move item 2 down'))
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(order()).toEqual(['A', 'C', 'B'])
      expect(document.activeElement).toBe(within(handles()[2]).getByLabelText('Move item 3 up'))
    })

    it('keeps the open row open across a move', async () => {
      const { user, container, handles } = setup()
      const toggles = container.querySelectorAll('.tf-button-repeater-overview-open')
      await user.click(toggles[0])
      expect(within(container).getByDisplayValue('A')).toBeTruthy()

      await user.click(within(handles()[0]).getByLabelText('Move item 1 down'))

      expect(within(container).getByDisplayValue('A')).toBeTruthy()
      expect(container.querySelectorAll('.tf-repeater-advanced-item')[1].getAttribute('data-state')).toBe('open')
    })
  })
})
