export default {
  values: {},
  getAll() {
    return this.values
  },
  getValue(name) {
    return this.values[name] ?? ''
  },
  setValue(name, value) {
    this.values[name] = value
  }
}
