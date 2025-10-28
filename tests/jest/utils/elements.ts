import { render } from '@testing-library/react'
import * as fields from '../../../assets/src/index.tsx'

const renderHasElement = (config, getElement) => {

  const { container } = render(fields.render(config, 'element'))
  const element = getElement(container)

  expect(element).toBeTruthy()
}

export {
  renderHasElement
}
