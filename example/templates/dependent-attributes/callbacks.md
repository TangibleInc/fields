The callback system allows you to format dependent values before they are used in field attributes. This is particularly useful when you need to transform a field's value based on specific logic before applying it to another field's configuration.

#### JavaScript Usage

When rendering fields directly in JavaScript, callbacks can be defined like the this:

```javascript
const Form = () => (
  <>
    { fields.render({
      'name'        : 'fields-name-1'
      'type'        : 'switch',
      'value_on'    : 'yes',
      'value_off'   : 'no'
    }) }
    { fields.render({
      'name'        : 'fields-name-2'
      'type'        : 'text',
      'description' : '{{fields-name-1}}',
      'dependent'   : {
        'callback' : ({ attribute, value }) => {
          if ( attribute !== 'description' ) return value
          return value === 'on'
            ? 'Switch is enabled, the description will user this text'
            : 'Switch is not enabled, the description will user this text'
        }
      }
    }) }
  </>
)
```

#### PHP Usage

If we register and render fields from the PHP side, we will still need to defined the callback in JavaScript.
  
We can register and name a callback on the JS side like this:
```html
<script>
const { fields: { dependent } } = tangibleFields
dependent.registerCallback(
  'custom-callback-name',
  ({
    attribute,
    value
  }) => {
    if ( attribute !== 'description' ) return value
    return value === 'on'
      ? 'Switch is enabled, the description will user this text'
      : 'Switch is not enabled, the description will user this text'
  }
)
</script>
```

And then, we can use that same name inside the PHP registration to use the callback:

```php
$fields->register_field( 'fields-name-1', [
    // ...
    'type'      => 'switch',
    'value_on'  => 'yes',
    'value_off' => 'no'
    // ...
]);

$fields->register_field( 'fields-name-2', [
    // ...
    'description' => '{{fields-name-1}}',
    'dependent'   => [
        'callback' => 'custom-callback-name'
    ]
    // ...
]);
```
