import { render } from '@testing-library/react'

const fields = window.tangibleFields

const renderHasElement = (config, getElement) => {

  const { container } = render(fields.render(config, 'element'))
  const element = getElement(container)

  expect(element).toBeTruthy()
}

export {
  renderHasElement
}
