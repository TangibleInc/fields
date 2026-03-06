import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Notice from '../../../../../assets/src/components/base/notice/Notice'

describe('Notice TUI path', () => {

  it('renders .tf-notice class', () => {
    const { container } = render(<Notice message="Test message" />)
    expect(container.querySelector('.tf-notice')).toBeTruthy()
  })

  it('renders message content', () => {
    render(<Notice message="Something went wrong" />)
    expect(screen.getByText('Something went wrong')).toBeTruthy()
  })

  it('maps error type to danger theme', () => {
    const { container } = render(<Notice message="Error" type="error" />)
    const notice = container.querySelector('.tf-notice')
    expect(notice.classList.contains('is-theme-danger')).toBe(true)
  })

  it('uses info theme by default when no type given', () => {
    const { container } = render(<Notice message="Info" />)
    const notice = container.querySelector('.tf-notice')
    expect(notice.classList.contains('is-theme-info')).toBe(true)
  })

  it('renders dismiss button when onDismiss is provided', () => {
    const onDismiss = jest.fn()
    const { container } = render(<Notice message="Test" onDismiss={onDismiss} />)
    expect(container.querySelector('button')).toBeTruthy()
  })

  it('does not render dismiss button without onDismiss', () => {
    const { container } = render(<Notice message="Test" />)
    expect(container.querySelector('button')).toBeFalsy()
  })

  it('calls onDismiss when dismiss button clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = jest.fn()
    const { container } = render(<Notice message="Test" onDismiss={onDismiss} />)
    await user.click(container.querySelector('button'))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
