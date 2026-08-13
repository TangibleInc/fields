import { 
  render,
  screen
} from '@testing-library/react'
import * as fields from '../../../assets/src/index.tsx'

/**
 * TUI renders its portal root as the first child of the interface wrapper,
 * the field itself is the next element
 */
const getFieldElement = container => (
  [ ...container.firstChild.children ].find(element => element.id !== 'tui-portal-root')
)

const rendersWithMinimal = ({
  type,
  expectedClass
}) => {

  const { container } = render(
    fields.render({
      type  : type,
      label : `Label for ${type}`
    }
  ))
  
  const classes = getFieldElement(container).classList
  expect(classes.contains(expectedClass ?? `tf-${type}`)).toEqual(true)
}

const rendersWithoutLabelThrowWarning = ({
  type,
  expectedClass
}) => {

  console.warn = jest.fn()
  
  const { container } = render(
    fields.render({
      type : type
    }
  ))
  
  const classes = getFieldElement(container).classList

  expect(classes.contains(expectedClass ?? `tf-${type}`)).toEqual(true)
  expect(console.warn).toHaveBeenCalled()
}

const rendersLabelAndDescription = ({
  type,
  expectedClass
}) => {

  const { container } = render(
    fields.render({
      type        : type,
      label       : `Label for ${type}`,
      description : `Description for ${type}`
    }
  ))

  const classes = getFieldElement(container).classList

  expect(classes.contains(expectedClass ?? `tf-${type}`)).toEqual(true)

  const label = screen.getByText(`Label for ${type}`)
  const description = screen.getByText(`Description for ${type}`)

  expect(label).toBeTruthy()
  expect(description).toBeTruthy()
}

const renderHasElement = (config, getElement) => {

  const { container } = render(fields.render(config))
  const element = getElement(container)

  expect(element).toBeTruthy()
}

const renderHasNotElement = (config, getElement) => {

  const { container } = render(fields.render(config))
  const element = getElement(container)

  expect(element).toBeFalsy()
} 

export {
  getFieldElement,
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription,
  renderHasElement,
  renderHasNotElement
}
