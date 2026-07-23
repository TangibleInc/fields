import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import * as fields from '../../../../../assets/src/index.tsx'

describe('File component', () => {

  /**
   * Used to simlulate real request response during tests
   *
   * @see assets/src/requests/index.ts
   */
  beforeEach(() =>
    fields.config.fetchResponse = {
      source_url: 'https://example.org/test.png',
      media_type: 'image',
      alt_text: '',
      title: { rendered: 'test' }
    }
  )

  it('does not disable the field below the limit', async () => {
    const { container } = render(
      fields.render({
        name      : 'field-name',
        type      : 'file',
        label     : 'Label',
        maxUpload : 2,
        value     : [1]
      })
    )

    await screen.findAllByRole('button', { name: 'Remove' })

    const row = container.querySelector('.tf-file-field')

    expect(row.querySelector('button').disabled).toBe(false)
    expect(row.classList.contains('is-disabled')).toBe(false)
  })

  it('disables the choose button when the limit is reached', async () => {
    const { container } = render(
      fields.render({
        name      : 'field-name',
        type      : 'file',
        label     : 'Label',
        maxUpload : 2,
        value     : [1, 2]
      })
    )

    await screen.findAllByRole('button', { name: 'Remove' })

    const row = container.querySelector('.tf-file-field')

    expect(row.querySelector('button').disabled).toBe(true)
    expect(row.classList.contains('is-disabled')).toBe(true)
  })

  it('renders a tooltip explaining the limit on hover', async () => {
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        name      : 'field-name',
        type      : 'file',
        label     : 'Label',
        maxUpload : 0
      })
    )

    await user.hover(container.querySelector('.tf-file-field'))

    const tooltip = await screen.findByRole('tooltip', {}, { timeout: 2000 })

    expect(tooltip.textContent)
      .toContain('Maximum number of files reached, delete one to add more')
  })

  it('supports maxUploadText', async () => {
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        name          : 'field-name',
        type          : 'file',
        label         : 'Label',
        maxUpload     : 0,
        maxUploadText : 'Remove a file before adding another one'
      })
    )

    await user.hover(container.querySelector('.tf-file-field'))

    const tooltip = await screen.findByRole('tooltip', {}, { timeout: 2000 })

    expect(tooltip.textContent).toContain('Remove a file before adding another one')
  })

  it('sets aria-describedby on the trigger when the tooltip is open', async () => {
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        name      : 'field-name',
        type      : 'file',
        label     : 'Label',
        maxUpload : 2,
        value     : [1, 2]
      })
    )

    await screen.findAllByRole('button', { name: 'Remove' })

    const row = container.querySelector('.tf-file-field')
    await user.hover(row)

    const tooltip = await screen.findByRole('tooltip', {}, { timeout: 2000 })

    expect(row.parentElement.getAttribute('aria-describedby')).toBe(tooltip.getAttribute('id'))
  })

  it('renders no tooltip below the limit', async () => {
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        name      : 'field-name',
        type      : 'file',
        label     : 'Label',
        maxUpload : 2,
        value     : [1]
      })
    )

    await screen.findAllByRole('button', { name: 'Remove' })

    await user.hover(container.querySelector('.tf-file-field'))
    // Past TUI's 400ms open delay
    await new Promise(resolve => setTimeout(resolve, 600))

    expect(screen.queryByRole('tooltip')).toBeNull()
  })

  it('renders no tooltip when no limit is set', async () => {
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        name  : 'field-name',
        type  : 'file',
        label : 'Label',
        value : [1, 2, 3]
      })
    )

    await screen.findAllByRole('button', { name: 'Remove' })

    const row = container.querySelector('.tf-file-field')
    await user.hover(row)
    await new Promise(resolve => setTimeout(resolve, 600))

    expect(screen.queryByRole('tooltip')).toBeNull()
    expect(row.querySelector('button').disabled).toBe(false)
  })

  it('appends the extension when the title omits it', async () => {
    fields.config.fetchResponse = {
      source_url: 'https://example.org/photo.png',
      media_type: 'image',
      alt_text: '',
      title: { rendered: 'photo' }
    }

    const { container } = render(
      fields.render({
        name  : 'field-name',
        type  : 'file',
        label : 'Label',
        value : [1]
      })
    )

    await screen.findAllByRole('button', { name: 'Remove' })

    expect(container.querySelector('.tf-file-item span').textContent).toBe('photo.png')
  })

  it('does not repeat the extension when the title already ends with it', async () => {
    fields.config.fetchResponse = {
      source_url: 'https://example.org/report.csv',
      media_type: 'text',
      alt_text: '',
      title: { rendered: 'report.csv' }
    }

    const { container } = render(
      fields.render({
        name  : 'field-name',
        type  : 'file',
        label : 'Label',
        value : [1]
      })
    )

    await screen.findAllByRole('button', { name: 'Remove' })

    expect(container.querySelector('.tf-file-item span').textContent).toBe('report.csv')
  })

  it('re-enables the field when a file is removed', async () => {
    const user = userEvent.setup()
    const { container } = render(
      fields.render({
        name      : 'field-name',
        type      : 'file',
        label     : 'Label',
        maxUpload : 2,
        value     : [1, 2]
      })
    )

    const removeButtons = await screen.findAllByRole('button', { name: 'Remove' })
    await user.click(removeButtons[0])

    const row = container.querySelector('.tf-file-field')

    expect(row.querySelector('button').disabled).toBe(false)
    expect(row.classList.contains('is-disabled')).toBe(false)

    await user.hover(row)
    await new Promise(resolve => setTimeout(resolve, 600))

    expect(screen.queryByRole('tooltip')).toBeNull()
  })
})
