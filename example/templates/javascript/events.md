Tangible Fields include an event/trigger system that you can use from the `tangibleFields` object.

#### Summary

- [Listen to en event](#listen)
- [Stop listening to an event](#remove)
- [Trigger an event](#trigger)
- [Event list](#events)
  - [initField](#init-field)
  - [valueChange](#value-change)
  - [buttonPressed](#button-pressed)

#### Listen to en event {#listen}

To listen to a fields event, you can use the `event` method from `tangibleFields`.

It take two arguments:

- `eventName`: The name of the event
- `eventCallback`: A callback function that will be executed when the specified event is triggered. It receives two parameters:
  - `eventData`: An object containing any additional data or arguments passed when triggering the event
  - `event`: The event object itself

```javascript
// The callback will be called each time any value change
tangibleFields.event('valueChange', (field, event) => {
  
  if( field.name !== 'field-name' ) return;

  console.log('field-name value is now ' + field.value)
})
```

#### Stop listening to an event {#remove}

The event method returns a function that can be used to remove the event listener when it's no longer needed:

```javascript
const deleteEvent = tangibleFields.event('eventName', callback)

// Stop listening after 10 seconds
setTimeout(() => {
  deleteEvent()
}, 10000)
```

#### Trigger an event {#trigger}

To trigger a fields event, you can use the `trigger` method from `tangibleFields`.

It take two arguments:
- `eventName`: The name of the event
- `args`: (optional) Arguments to pass to the triggered event

```javascript
tangibleFields.trigger('myCustomEvent', args)
```

#### Event list {#events}

  - ##### initField {#init-field}
  Triggered when a field is initialized:
  ```javascript
  tangibleFields.event('initField', field => {
      field.name // Field name
      field.props // Configuration passed when creating the field (type, label ...etc)
  })
  ```         
      
  - ##### valueChange {#value-change}    
  Triggered each time a field value change. Is also triggered for subfields from repeaters and field-groups:
  ```javascript
  tangibleFields.event('valueChange', field => {

      field.name // Field name, or false if no name (it will be the case for subfields)
      field.props // Configuration passed when creating the field (type, label ...etc)
      field.value // New field value

      // Note: You can check if the change happened in a subfield with this condition:
      const isSubfield = field.props?.controlType === 'subfield'
  })
  ```

  - ##### buttonPressed {#button-pressed}    
  Triggered each time a button is pressed:
  ```javascript
  tangibleFields.event('buttonPressed', button => {
      button.name // Or false if no name
      button.props // Configuration passed when creating the button
      button.event
  })
  ```
