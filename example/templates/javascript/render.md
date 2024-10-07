
#### Summary

- [Render](#render)
- [onChange event](#on-change)
- [Style context](#style-context)
- [Attribute names](#attribute-names)

#### Render method {#render}

To interact with fields from the JavaScript side, we rely on the `tangibleFields` object, which is available globally when fields is enqueue.

To render fields from the JavaScript directly, we can use the `render` method of the `tangibleFields` object:

```javascript
tangibleFields.render({
  type  : 'text',
  label : 'Text'
  name  : 'field-name'
})
```

As the returned value of `render` is React component, it has to be rendered inside a React app or inside an existing React component.

Example inside a react app:
```javascript
import { createRoot } from 'react-dom'

const component = tangibleFields.render({
  type  : 'text',
  label : 'Text'
  name  : 'field-name'
})

const container = document.getElementById('container-id')
createRoot(container).render(component)
```

#### onChange event {#on-change}

It's possible to add an `onChange` callback on a created field and get the new value each time it's updated:
```javascript
tangibleFields.render({
  ...attributes,
  onChange: newValue => {
    console.log('Field value is now ' + newValue)
  }
})
```

#### Style context {#style-context}

_Note: This feature exists in PHP as well but is currently undocumented._

You can chose the style context of the curent field by setting a `context` prop, however you will have to make sure that the associated stylesheet has been enqueued on the page:
```javascript
tangibleFields.render({
  ...attributes,
  context: 'wp'
})
```

#### Attribute names {#attribute-names}

Every field type is supported, and will support the same arguments that fields rendered from PHP. 

The only difference is that in PHP attributes will use `snake_case`, while in JS it will use `camelCase`.

Example of a color field rendered from PHP
```php
$fields = tangible_fields();
$color_picker = $fields->render_field('color', [
  'type'            => 'color_picker',
  'enable_opacity'  => true
  'value'           => $value,
  'label'           => 'Color'
]);
```

Same field rendered in JS
```javascript
const colorPicker = tangibleFields.render({
  name          : 'color',
  type          : 'colorPicker',
  enableOpacity : true,
  label         : 'Color'
})
```




