The store object is designed to manage and store field values. It provides methods to interact with the stored data.

To use it, you can access it via the `tangibleFields.store` property. Here's how to use it:

```javascript
const store = tangibleFields.store
```

#### Summary

- [getAllValues()](#getAllValues)
- [getValue()](#getValue)
- [setValue()](#setValue)
- [getRepeater()](#getRepeater)
  - [getRow](#getRow)
  - [setRow](#setRow)
  - [getRowValue](#getRowValue)
  - [setRowValue](#setRowValue)

#### getAllValues {#getAllValues}

If you need to retrieve all values stored in the store, you can use the `getAllValues` method:

```javascript
const store = tangibleFields.store
const allValues = store.getAllValues()
```

This method returns an object containing all the key-value pairs stored in the `store._values` object.

#### getValue {#getValue}

To retrieve the value of a specific field, you can use the getValue method:

```javascript
const store = tangibleFields.store
const storedValue = store.getValue('field-name')
```

The `getValue` method takes a name as an argument and returns the corresponding value stored in the store. If the value does not exist, it returns an empty string by default.

#### setValue {#setValue}

You can change the value of an existing field using the `setValue` method:

```javascript
const store = tangibleFields.store
const storedValue = store.setValue('field-name', 'new-value')
```

#### getRepeater {#getRepeater}

If you need to work with repeater controls, you can use the `getRepeater` method to obtain a repeater store object:

```javascript
const store = tangibleFields.store
const repeater = store.getRepeater('repeater-name')
```

The `repeater` object obtained from `getRepeater` allows you to interact with repeater data using methods like `getRow`, `setRow`, `getRowValue`, and `setRowValue`.

_Note: In the current implementation, changing the value of a given row/field will trigger a complete re-render of the asscoiated repeater. It can be optimized in the future if needed to only re-render the associated row/field._

  - ##### getRow {#getRow}
  ```javascript
  const rowNumber = 0
  const row = repeater.getRow(rowNumber)
  ```

  - ##### setRow {#setRow}
  ```javascript
  const rowNumber = 0
  repeater.setRow(rowNumber, {,
    'repeater-field-1' : 'value-1',
    'repeater-field-2' : 'value-2'
  })
  ```

  - ##### getRowValue {#getRowValue}
  ```javascript
  const rowNumber = 0
  const value = repeater.getRowValue(rowNumber, 'field-name')
  ```

  - ##### setRowValue {#setRowValue}
  ```javascript
  const rowNumber = 0
  repeater.setRowValue(rowNumber, 'field-name', 'new-value')
  ```
