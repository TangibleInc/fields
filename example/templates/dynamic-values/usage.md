#### Activate on a field

To add support for dynamic values on a field, we need to add `'dynamic' => true` in the field definition.

It will only works with the supported field types (more to come):
- color_picker
- date_picker
- number
- text

```php
$fields = tangible_fields();
    
$fields->render_field('text-with-dynamic-values', [
  'label'   => 'Text field with dynamic values',
  'type'    => 'text',
  'value'   => $fields->fetch_value('text-with-dynamic-values'),
  'dynamic' => true
]);
```

The `text` field type support dynamic values in 2 ways (there is an example of each on the example page):
- `insert` - This is the default behavior, it allows to insert multiple dynamic value alongside regular text
- `replace` - It allows to either set one dynamic value, or to use regular text (can't mix both)

If you need to set one type, you can use `mode` parameter like in the following code:
```php
$fields->render_field('text-with-dynamic-values', [
  // ...
  'dynamic' => [
    'mode' => 'insert'
  ]
]);

$fields->render_field('text-with-dynamic-values', [
  // ...
  'dynamic' => [
    'mode' => 'replace'
  ]
]);
```

#### Render a dynamic value

##### General

Dynamic values are stored as a string, that looks like this: `[[dynamic_value_name::setting=value::setting2=value2]]`

To render a string that contains a dynamic value, we use the `render_value` function:
```php
$fields = tangible_fields();
$value = 'User ID: [[user_id]]'

// Will output something like "User ID: 1"
$output = $fields->render_value($value);
```

For registered fields, it needs to be applied manually after fetching the value:
```php
$fields = tangible_fields();

$output = $fields->render_value(
  $fields->fetch_value('field_name')
);
```

##### Advanced case

If you want to customize the rendering behavior of dynamic values, you can provide a custom `$config` array as a second parameter.
The `$config` array allows you to set context-specific data or additional options that can influence how dynamic values are rendered.

```php
// Assuming that current user id is 1, will returns "User ID: 1"
$fields->render_value('User ID: [[user_id]]');

// While this will return "User ID: 2"
$fields->render_value('User ID: [[user_id]]', [
  'context' => [
    'current_user_id' => 2
  ]
]);
```
The `$config` parameter is available in dynamic value render callbacks. 
When a dynamic value is rendered, the callback function can access the `$config` array, which provides additional contextual information and customization options.

In your dynamic value render callback function, you can define the `$config` parameter to access the provided configuration. 
For example:

```php
$fields = tangible_fields();
    
$fields->register_dynamic_value([
  'category' => 'user',
  'name'     => 'user_id',
  // ...etc
  'callback' => function($settings, $config) {
    return $config['context']['current_user_id'];
  }
]);
```
   
_Note: More info about dynamic value registration in the next section._
