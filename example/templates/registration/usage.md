#### Description

Registration is required if you render your field from `php`.

To register a field, the `$fields->register_field()` function is used. It takes 2 arguments:
- The field name
- An array with the configuration of the field that can contain: 
  - The configuration needed for the save/load feature (it has to be set if you want to rely on the fields built-in save/load feature)
  - The configuration needed for field render (field type, label etc). If the render configuration is defined in the registration, you don't need to set it again when calling `$fields->render_field()`

```php
$fields = tangible_fields();

$fields->register_field('field-name', [
  'type'  => 'text',
  'label' => 'My text field'
]);

echo $fields->render_field('field-name');
```

More information on the save/load configuration in the next page.


