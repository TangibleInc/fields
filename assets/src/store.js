import { triggerEvent } from './events'

const getRepeaterStore = (name, store) => ({
  getRow(number) {
    const rows = store.getValue(name)
    return Array.isArray(rows) && rows[number]
      ? rows[number]
      : false
  },
  setRow(number, value) {
    const rows = store.getValue(name)
    if( ! Array.isArray(rows) || ! rows[number] ) return false;
    rows[number] = value
    store.setValue(name, rows)
  },
  getRowValue(number, valueName) {
    const row = this.getRow(number)
    return row ? row[valueName] : false
  },
  setRowValue(number, valueName, value) {
    const row = this.getRow(number)
    if( ! row ) return false;
    row[valueName] = value
    this.setRow(number, row)
  }
})

export default {
  _values: {},
  _setValueFromControl(name, value) {
    this._values[name] = value
  },
  getAllValues() {
    return this._values
  },
  getValue(name) {
    return this._values[name] ?? ''
  },
  setValue(name, value) {
    triggerEvent('refreshFieldValue', {
      name  : name,
      value : value
    })
  },
  getRepeater(name) {
    return getRepeaterStore(name, this)
  }
}
