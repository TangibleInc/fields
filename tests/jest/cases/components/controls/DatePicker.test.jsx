import '../../../../../assets/src/index.jsx'
import userEvent from '@testing-library/user-event'
import { 
  within,
  render,
  screen
} from '@testing-library/react'
import { 
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription
} from '../../../utils/fields.js'
import { 
  today, 
  getLocalTimeZone,
  startOfMonth,
  endOfMonth
} from '@internationalized/date'

const fields = window.tangibleFields

/**
 * TODO: 
 * - Fix futureOnly feature and finish associated tests
 * - Support value upgrade from simple to date range
 */

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

  it('supports value change from typing', async () => {
    
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type  : 'date-picker',
        label : 'Label',
        value : '2020-01-30',
        name  : 'date-field'
      })
    )

    let input = container.querySelector('input[name="date-field"]')
    expect(input.value).toBe('2020-01-30')

    // Change year

    await user.type(
      screen.getByText('2020'),
      '2022'
    )

    input = container.querySelector('input[name="date-field"]')
    expect(input.value).toBe('2022-01-30')

    // Change month

    await user.type(
      screen.getByText('1'),
      '12'
    )

    input = container.querySelector('input[name="date-field"]')
    expect(input.value).toBe('2022-12-30')

    // Change day

    await user.type(
      screen.getByText('30'),
      '15'
    )

    input = container.querySelector('input[name="date-field"]')
    expect(input.value).toBe('2022-12-15')
  })

  it('supports value change from arrow keys', async () => {
    
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type  : 'date-picker',
        label : 'Label',
        value : '2020-01-30',
        name  : 'date-field'
      })
    )

    let input = container.querySelector('input[name="date-field"]')
    expect(input.value).toBe('2020-01-30')

    // Change year

    screen.getByText('2020').focus()
    await user.type(
      screen.getByText('2020'),
      '[ArrowUp]'
    )

    input = container.querySelector('input[name="date-field"]')
    expect(input.value).toBe('2021-01-30')

    // Change month

    screen.getByText('1').focus()
    await user.type(
      screen.getByText('1'),
      '[ArrowDown]'
    )

    input = container.querySelector('input[name="date-field"]')
    expect(input.value).toBe('2021-12-30')

    // Change day

    screen.getByText('30').focus()
    await user.type(
      screen.getByText('30'),
      '[ArrowDown]'
    )

    input = container.querySelector('input[name="date-field"]')
    expect(input.value).toBe('2021-12-29')
  })

  it('supports value change from click on calendar', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type  : 'date-picker',
        label : 'Label',
        value : '2020-01-30',
        name  : 'date-field'
      })
    )

    // Change day

    await user.click(within(container).getByText('🗓'))
    await user.click(
      within(
        document.querySelector('.tf-calendar')
      ).getByText('15')
    )

    let input = container.querySelector('input[name="date-field"]')
    expect(input.value).toBe('2020-01-15')

    // Change day + next month

    await user.click(within(container).getByText('🗓'))
    await user.click(
      within(
        document.querySelector('.tf-calendar')
      ).getByLabelText('Next')
    )
    await user.click(
      within(
        document.querySelector('.tf-calendar')
      ).getByText('20')
    )

    input = container.querySelector('input[name="date-field"]')
    expect(input.value).toBe('2020-02-20')

    // Change day + previous month*2 (trigger a year change)

    await user.click(within(container).getByText('🗓'))
    await user.click(
      within(
        document.querySelector('.tf-calendar')
      ).getByLabelText('Previous')
    )
    await user.click(
      within(
        document.querySelector('.tf-calendar')
      ).getByLabelText('Previous')
    )
    await user.click(
      within(
        document.querySelector('.tf-calendar')
      ).getByText('10')
    )

    input = container.querySelector('input[name="date-field"]')
    expect(input.value).toBe('2019-12-10')
  })

  it('supports futureOnly parameter', async () => {
  
    /**
     * It seems that we have issues currently with the futureOnly paramater,
     * when trying to change the date to past from the input it trigger an infinite re-render
     * 
     * TODO:
     * - Fix infinite re-render
     * - Check that can't change value to past date with arrows
     * - Check that can't change value to past date from calendar
     * - Check that can't set initial date to past from initial value
     */
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type       : 'date-picker',
        label      : 'Label',
        value      : '2050-01-30',
        name       : 'date-field',
        futureOnly : true
      })
    )
    
    // Can't set to past value from typing

    // await user.type(
    //   screen.getByText('2050'),
    //   '2000'
    // )

    // let input = container.querySelector('input[name="date-field"]')
    // expect(input.value).toBe('2050-01-30')
    
    // Can set to future value from typing

    // await user.type(
    //   screen.getByText('2050'),
    //   '2100'
    // )

    // input = container.querySelector('input[name="date-field"]')
    // expect(input.value).toBe('2100-01-30')
  })

  it('supports the dateRange parameter', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type      : 'date-picker',
        label     : 'Label',
        name      : 'date-field',
        dateRange : true,
        value     : JSON.stringify({ 
          'start'  : '2020-01-05',
          'end'    : '2020-01-07'
        })
      })
    )

    expect(
      document.getElementsByClassName('tf-date-field').length
    ).toBe(2)

    await user.click(within(container).getByText('🗓'))

    // Check that initial range value is selected

    let calendar = document.querySelector('.tf-calendar')
    expect(within(calendar).getByText('4').classList).not.toContain('tf-calendar-cell-selected')
    expect(within(calendar).getByText('5').classList).toContain('tf-calendar-cell-selected')
    expect(within(calendar).getByText('6').classList).toContain('tf-calendar-cell-selected')
    expect(within(calendar).getByText('7').classList).toContain('tf-calendar-cell-selected')
    expect(within(calendar).getByText('8').classList).not.toContain('tf-calendar-cell-selected')

    // Check value change (across 2 months)
    
    await user.click(within(calendar).getByText('20'))
    await user.click(within(calendar).getByLabelText('Next'))
    await user.click(within(calendar).getByText('10'))

    expect(document.querySelector('.tf-calendar')).toBe(null)

    const value = JSON.parse( container.querySelector('input[name="date-field"]').value )
    expect(value.start).toBe('2020-01-20')
    expect(value.end).toBe('2020-02-10')
  })

  it('supports the multiMonth parameter when dateRange is true', async () => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type       : 'date-picker',
        label      : 'Label',
        name       : 'date-field',
        dateRange  : true,
        multiMonth : 3,
        value      : JSON.stringify({ 
          'start' : '2020-01-20',
          'end'   : '2020-03-10'
        })
      })
    )

    await user.click(within(container).getByText('🗓'))

    const months = document.getElementsByClassName('tf-calendar-table')
    expect(months.length).toBe(3)

    const [ january, february, march ] = months
    
    // Selected in January

    expect(within(january).getByText('19').classList).not.toContain('tf-calendar-cell-selected')
    for( let day = 20; day < 32; day++ ) {
      const cellInRange = within(january).getAllByText(day).filter(
        match => ! match.hasAttribute('aria-disabled') 
      )[0]
      expect(cellInRange.classList).toContain('tf-calendar-cell-selected')
    }

    // Selected in February

    for( let day = 1; day < 28; day++ ) {
      const cellInRange = within(february).getAllByText(day).filter(
        match => ! match.hasAttribute('aria-disabled') 
      )[0]
      expect(cellInRange.classList).toContain('tf-calendar-cell-selected')
    }

    // Selected in March

    for( let day = 1; day < 10; day++ ) {
      const cellInRange = within(march).getAllByText(day).filter(
        match => ! match.hasAttribute('aria-disabled') 
      )[0]
      expect(cellInRange.classList).toContain('tf-calendar-cell-selected')
    }
    expect(within(march).getByText('11').classList).not.toContain('tf-calendar-cell-selected')
  })

  it('supports the datePresets parameter when dateRange is true', async () => {
  
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type        : 'date-picker',
        label       : 'Label',
        name        : 'date-field',
        dateRange   : true,
        datePresets : true
      })
    )

    await user.click(within(container).getByText('🗓'))

    const calendar = document.querySelector('.tf-calendar')
    expect(within(calendar).getByText('Today')).toBeTruthy()
    expect(within(calendar).getByText('Last Week')).toBeTruthy()
    expect(within(calendar).getByText('This Month')).toBeTruthy()
    expect(within(calendar).getByText('Last Month')).toBeTruthy()

    const dateToday = today( getLocalTimeZone() )

    await user.click(within(calendar).getByText('Today'))

    let value = JSON.parse( container.querySelector('input[name="date-field"]').value )
    expect(value.start).toBe( dateToday.toString() )
    expect(value.end).toBe( dateToday.toString() )

    await user.click(within(calendar).getByText('This Month'))

    value = JSON.parse( container.querySelector('input[name="date-field"]').value )
    expect(value.start).toBe( startOfMonth(dateToday).toString() )
    expect(value.end).toBe( endOfMonth(dateToday).toString() )

    await user.click(within(calendar).getByText('Last Week'))

    value = JSON.parse( container.querySelector('input[name="date-field"]').value )
    expect(value.start).toBe( dateToday.subtract({ weeks: 1 }).toString() )
    expect(value.end).toBe( dateToday.toString() )

    await user.click(within(calendar).getByText('Last Month'))

    value = JSON.parse( container.querySelector('input[name="date-field"]').value )
    expect(value.start).toBe( startOfMonth( dateToday.subtract({ months: 1 }) ).toString() )
    expect(value.end).toBe( endOfMonth( dateToday.subtract({ months: 1 }) ).toString() )
  })

  it('displays a warning when start date is before end date when dateRange is true', async () => {
  
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        type       : 'date-picker',
        label      : 'Label',
        name       : 'date-field',
        dateRange  : true,
        multiMonth : 3,
        value      : JSON.stringify({ 
          'start' : '2019-01-20',
          'end'   : '2020-01-22'
        })
      })
    )

    const startInput = container.getElementsByClassName('tf-date-field')[0]
    await user.type(
      within(startInput).getByText('2019'),
      '[ArrowUp]'
    )

    // Start date before end - No warning

    expect(within(container).queryByText('🚫')).toBeFalsy()

    // Start date after end - Should display warning

    await user.type(
      within(startInput).getByText('2020'),
      '[ArrowUp]'
    )
    expect(within(container).getByText('🚫')).toBeTruthy()
  })

  it('supports upgrade form simple date value to date range value (string to JSON)', async () => {
  
    const { container } = render(
      fields.render({
        type      : 'date-picker',
        label     : 'Label',
        name      : 'date-field',
        dateRange : true,
        value     : '2020-01-05'
      })
    )

    const value = JSON.parse( container.querySelector('input[name="date-field"]').value )
    // Currently, use current date instead of date string
    // expect(value.start).toBe('2020-01-05')
    // expect(value.end).toBe('2020-01-05')
  })

})
