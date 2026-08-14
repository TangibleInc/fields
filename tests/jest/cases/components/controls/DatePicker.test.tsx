import * as fields from '../../../../../assets/src/index.tsx'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  getFieldElement,
  rendersWithMinimal,
  rendersLabelAndDescription
} from '../../../utils/fields.ts'

/**
 * TODO:
 * - Test the month select (its listbox is not reachable from the popover)
 * - Test dynamic values
 */

/**
 * TUI renders the popover inside #tui-portal-root, which carries an inline
 * pointer-events: none re-enabled by .tui-popover in the stylesheet. jsdom
 * doesn't load it, so the pointer-events check is a false positive here
 */
const setup = (config = {}) => {

  const user = userEvent.setup({ pointerEventsCheck: 0 })
  const { container } = render(
    fields.render({
      type  : 'date-picker',
      label : 'Label',
      name  : 'date-field',
      ...config
    })
  )

  return {
    user,
    container,
    trigger : () => container.querySelector('.tui-date-picker__trigger'),
    value   : () => container.querySelector('input[name="date-field"]').value
  }
}

/** Day cells are keyed by TUI as `YYYY-M-D`, with a zero-based month */
const dayKey = date => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`

const getDay = key => document.querySelector(`.tui-calendar__day[data-day="${key}"]`)

const getCalendar = () => document.querySelector('.tui-calendar')

const getToday = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

const formatValue = date => (
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0')
  ].join('-')
)

describe('DatePicker component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'date-picker' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'date-picker' }))

  it('renders when no label, falling back to a default aria-label', () => {

    const { container } = render(fields.render({ type: 'date-picker' }))

    expect(getFieldElement(container).classList.contains('tf-date-picker')).toEqual(true)
    expect(container.querySelector('.tui-date-picker__trigger').getAttribute('aria-label')).toBe('Date')
  })

  it('renders the value in the hidden input and the trigger', () => {

    const { trigger, value } = setup({ value: '2020-01-30' })

    expect(value()).toBe('2020-01-30')
    expect(trigger().textContent).toContain('Jan 30, 2020')
  })

  it('renders a placeholder when there is no value', () => {

    const { trigger, value } = setup()

    expect(value()).toBe('')
    expect(trigger().textContent).toContain('Select date')
  })

  it('opens and closes the calendar', async () => {

    const { user, trigger } = setup({ value: '2020-01-30' })

    expect(getCalendar()).toBe(null)

    await user.click(trigger())

    expect(getCalendar()).toBeTruthy()

    await user.click(document.querySelector('.tui-date-picker__close'))

    expect(getCalendar()).toBe(null)
  })

  it('supports value change from click on calendar', async () => {

    const { user, trigger, value } = setup({ value: '2020-01-30' })

    await user.click(trigger())
    await user.click(getDay('2020-0-15'))

    expect(value()).toBe('2020-01-15')
  })

  it('supports value change across months', async () => {

    const { user, trigger, value } = setup({ value: '2020-01-30' })

    await user.click(trigger())

    // Next month

    await user.click(document.querySelector('.tui-calendar__next'))
    await user.click(getDay('2020-1-20'))

    expect(value()).toBe('2020-02-20')

    // Previous month, twice to trigger a year change

    await user.click(document.querySelector('.tui-calendar__prev'))
    await user.click(document.querySelector('.tui-calendar__prev'))
    await user.click(getDay('2019-11-10'))

    expect(value()).toBe('2019-12-10')
  })

  it('supports value change from the day and year fields', async () => {

    const { user, trigger, value } = setup({ value: '2020-01-30' })

    await user.click(trigger())

    // Both fields only commit on blur

    const day = document.querySelector('.tui-date-picker__day-field')

    await user.clear(day)
    await user.type(day, '5')

    expect(value()).toBe('2020-01-30')

    await user.tab()

    expect(value()).toBe('2020-01-05')

    const year = document.querySelector('.tui-date-picker__year-field')

    await user.clear(year)
    await user.type(year, '2022')
    await user.tab()

    expect(value()).toBe('2022-01-05')
  })

  it('reports every value change to onChange', async () => {

    const changes = []
    const { user, trigger } = setup({
      value    : '2020-01-30',
      onChange : value => changes.push(value)
    })

    await user.click(trigger())
    await user.click(getDay('2020-0-15'))

    expect(changes).toEqual([
      '2020-01-30',
      '2020-01-15'
    ])
  })

  it('disables past dates in the calendar when futureOnly is true', async () => {

    const dateToday = getToday()
    const { user, trigger } = setup({
      value      : formatValue(dateToday),
      futureOnly : true
    })

    await user.click(trigger())

    /**
     * The grid also contains the days of the previous and next months
     */
    const days = [ ...getCalendar().querySelectorAll('.tui-calendar__day') ]
    expect(days.length).not.toBe(0)

    days.forEach(day => {
      const [ year, month, date ] = day.dataset.day.split('-').map(Number)
      const isPast = new Date(year, month, date) < dateToday

      expect(day.getAttribute('aria-disabled')).toBe( isPast ? 'true' : null )
    })
  })

  it('ignores a click on a past date when futureOnly is true', async () => {

    const dateToday = getToday()
    const { user, trigger, value } = setup({
      value      : formatValue(dateToday),
      futureOnly : true
    })

    await user.click(trigger())

    const pastDay = getCalendar().querySelector('.tui-calendar__day[aria-disabled="true"]')
    expect(pastDay).toBeTruthy()

    await user.click(pastDay)

    expect(value()).toBe( formatValue(dateToday) )
  })

  it('sets the initial value to today when it is in the past and futureOnly is true', () => {

    const { value } = setup({
      value      : '2000-01-30',
      futureOnly : true
    })

    expect(value()).toBe( formatValue(getToday()) )
  })

  /**
   * The date range is not migrated to TUI yet
   *
   * @see src/deprecated/fields/date
   */
  it('routes the date range to the deprecated control', () => {

    const { container } = setup({
      dateRange : true,
      value     : JSON.stringify({ start: '2020-01-05', end: '2020-01-07' })
    })

    expect(container.querySelector('.tui-date-picker__trigger')).toBe(null)
    expect(container.querySelector('.tf-date-picker.tf-deprecated-control')).toBeTruthy()
    expect(container.getElementsByClassName('tf-date-field').length).toBe(2)
  })

  it('supports readOnly', () => {

    expect(setup({ value: '2020-01-30' }).trigger().disabled).toBe(false)
    expect(setup({ value: '2020-01-30', readOnly: true }).trigger().disabled).toBe(true)
  })
})
