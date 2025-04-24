import '../../../../../assets/src/index.jsx'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription
} from '../../../utils/fields.js'

const fields = window.tangibleFields

describe('Time Picker component', () => {

  it('renders with minimal config', () =>
    rendersWithMinimal({ type: 'time-picker' })
  )

  it('renders when no label but throws a warning', () =>
    rendersWithoutLabelThrowWarning({ type: 'time-picker' })
  )

  it('renders label and description', () =>
    rendersLabelAndDescription({ type: 'time-picker' })
  )

  test('TimePicker allows changing time via keyboard', () => {

    const { container } = render(
      fields.render({
        type: 'time-picker',
        label: 'Pick a time',
        name: 'time-field',
        value: '14:30',
      })
    )

    const input = container.querySelector('input[name="time-field"]');
    expect(input.value).toBe('14:30:00');
    const segments = screen.getAllByRole('spinbutton');

    fireEvent.keyDown(segments[0], { key: 'ArrowUp' });
    fireEvent.keyDown(segments[1], { key: 'ArrowUp' });

    expect(input.value).not.toBe('14:30:00');
    expect(input.value).toBe('15:31:00');
  });

})
