#### What is "Context" in Tangible Fields?

"Context" in Tangible Fields is a way to define a specific styling context for your fields. You can switch between different styling contexts to adapt the appearance of your form fields to the specific needs of your project or platform. The library provides a list of predefined contexts, and you can select the one that best fits your requirements.

Multiple contextes can be used on the same page without conflicts.

#### Predefined Contexts

Tangible Fields comes with the following predefined contexts:

- default - The default styling context, with minimal styling
- wp - Styling for the WordPress admin environments
- elementor - Styling for use with the Elementor page builder
- beaver-builder - Styling for use with the Beaver Builder page builder

#### Usage - PHP

If no context is set, the default context will be used.

However it's recommanded to always explicitly set the context even if it uses the default, as if a context is set somewhere else and you don't set it the defined context will be used for you fields as well.

You can set the desired context for your fields by calling the `set_context` function before rendering your fields. Here's how you can use it:
```php
$fields->set_context('context_name');

echo $fields->render_field( 'name-1', [
  'label'       => 'Text field',
  'type'        => 'text',
  'value'       => $fields->fetch_value('name-1'),
  'placeholder' => 'Example placeholder',
  'description' => 'Example description'
]);

echo $fields->render_field( 'name-2', [
  'label'       => 'Text field',
  'type'        => 'text',
  'value'       => $fields->fetch_value('name-2'),
  'placeholder' => 'Example placeholder',
  'description' => 'Example description'
]);
```

Replace `context_name` with the name of the context you want to use ('wp', 'elementor', 'beaver-builder', or 'default').

#### Usage - JavaScript

When creating fields dynamically using JavaScript, you need to manually enqueue the stylesheet for the associated context since it won't be automatically added to the page.
```php
// If not specified, will load default context
$fields->enqueue();

// Will load default and WP context
$fields->enqueue([
  'context' => ['default', 'wp']
]);
```

Here's how you can set the context on a field created from JavaScript:
```javascript
tangibleFields.render({
  type    : 'text',
  label   : 'Text',
  name    : 'field-name',
  context : 'wp'
})
```
