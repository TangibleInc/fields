import * as fields from '../../../../../assets/src/index.tsx'
import userEvent from '@testing-library/user-event'
import {
  render,
  within
} from '@testing-library/react'
import {
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription
} from '../../../utils/fields.ts'

/**
 * TODO: Add tests to check is value correctly set from both visual and raw views
 */
describe('WYSIWYG component', () => {

  it('renders with minimal config', () => rendersWithMinimal({ type: 'editor' }))
  it('renders when no label but throws a warning', () => rendersWithoutLabelThrowWarning({ type: 'editor' }))
  it('renders label and description', () => rendersLabelAndDescription({ type: 'editor' }))

  test.each([
    'default',
    'rawView set to true'
  ])('renders both visual and raw editor - %p', async config => {

    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        name  : 'field-name',
        type  : 'editor',
        label : 'Label',
        value : 'test',
        ...(
          config !== 'default'
            ? { rawView : true }
            : {}
        )
      })
    )

    const visualToggle = within(container).getByText('Visual')
    const rawToggle = within(container).getByText('Raw')

    expect(visualToggle).toBeTruthy()
    expect(rawToggle).toBeTruthy()

    expect(visualToggle.classList.contains('tf-button-group-option-selected')).toBeTruthy()
    expect(rawToggle.classList.contains('tf-button-group-option-selected')).toBeFalsy()

    expect(container.querySelector('.tf-editor-visual-view')).toBeTruthy()
    expect(container.querySelector('.tf-code')).toBeFalsy()

    await user.click(rawToggle)

    expect(visualToggle.classList.contains('tf-button-group-option-selected')).toBeFalsy()
    expect(rawToggle.classList.contains('tf-button-group-option-selected')).toBeTruthy()

    expect(container.querySelector('.tf-editor-visual-view')).toBeFalsy()
    expect(container.querySelector('.tf-code')).toBeTruthy()

    await user.click(visualToggle)

    expect(visualToggle).toBeTruthy()
    expect(rawToggle).toBeTruthy()

    expect(visualToggle.classList.contains('tf-button-group-option-selected')).toBeTruthy()
    expect(rawToggle.classList.contains('tf-button-group-option-selected')).toBeFalsy()

    expect(container.querySelector('.tf-editor-visual-view')).toBeTruthy()
    expect(container.querySelector('.tf-code')).toBeFalsy()
  })

  it('renders only visual mode when rawView is false', async () => {

    const { container } = render(
      fields.render({
        name    : 'field-name',
        type    : 'editor',
        label   : 'Label',
        value   : 'test',
        rawView : false
      })
    )

    expect(within(container).queryByText('Visual')).toBe(null)
    expect(within(container).queryByText('Raw')).toBe(null)

    expect(container.querySelector('.tf-editor-visual-view')).toBeTruthy()
    expect(container.querySelector('.tf-code')).toBeFalsy()
  })
})
