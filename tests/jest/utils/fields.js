import { 
  render,
  screen
} from '@testing-library/react'

const fields = window.tangibleFields

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
  
  const classes = container.firstChild.firstChild.classList
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
  
  const classes = container.firstChild.firstChild.classList

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

  const classes = container.firstChild.firstChild.classList

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
  rendersWithMinimal,
  rendersWithoutLabelThrowWarning,
  rendersLabelAndDescription,
  renderHasElement,
  renderHasNotElement
}
