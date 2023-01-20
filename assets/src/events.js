const prefix = 'tangible/fields/'

const dispatchEvent = (name, args = {}) => {

  const event = new CustomEvent(prefix + name, { detail: args })

  window.dispatchEvent(event)
}

const addEventListener = (name, callback) => {

  window.addEventListener(
    prefix + name, 
    event => callback(event.detail ?? {}, event) 
  )

}

export {
  dispatchEvent,
  addEventListener
}
