#### Register category

Each category represents a group of dynamic values.
Use the `register_dynamic_value_category` function to define a new category:

```php
$fields = tangible_fields();

$fields->register_dynamic_value_category('post', [
  'label' => 'Post',
]);
```

#### Register dynamic values

Use the `register_dynamic_value` function to register each dynamic value under the desired category.

```php
$fields = tangible_fields();

$fields->register_dynamic_value([
  'category'    => 'post',
  'name'        => 'post_id',
  'label'       => 'Post ID',
  'type'        => 'text',
  'description' => 'Return the current post ID, if any',
  'callback'    => function($settings, $config) {
    return $config['context']['current_post_id'];
  },
  'permission_callback' => '__return_true'
]);
```

The function takes an array of options as a parameter. Here are all the possible values:

- category (required): Slug of the associated category
- name (required): Slug of the dynamic value
- label: If not defined, name will be use as the label
- description: Optional description that will be used both in the documentation and in the dynamic setting form (if there is one for this dynamic value)
- type: The type of data returned by the callback, possible values:
  - color
  - date
  - number
  - text
    
- callback: Function used to render the dynamic value
- permission_callback: Used to evaluate if the current user can save/parse the dynamic value (see permission section below)
- fields: Used to define settings associated to the dynamic value (see fields section below)

#### Register dynamic values - Permissions

There are two types of permissions that needs to be set:

- permission_callback_store: Callback to evaluate if the current user is alowed to save the dynamic value
- permission_callback_parse: Callback to evaluate if the current user is alowed to parse the dynamic value

```php
$fields = tangible_fields();

$fields->register_dynamic_value([
  // ...etc
  'permission_callback_store' => function() {
    return in_array('administrator', wp_get_current_user()->roles ?? []);
  },
  'permission_callback_parse' => '__return_true'
]);
```

If the permission callback is the same for both the store and parse action, 
we can pass only one callback by using `permission_callback` instead:

```php
$fields = tangible_fields();

$fields->register_dynamic_value([
  // ...etc
  'permission_callback' => function() {
    return is_user_logged_in();
  }
]);
```

#### Register dynamic values - Fields

It's possible to add settings on a dynamic value by passing an array of fields. 
The user will be able to set the value for each setting on the dynamic value insertion.

The values are then passed as parameter of the callback function (as an array), and can be used to modify the render.

The syntax to define the fields is the same than for regular fields (any exising field type can be used and visibility conditions are supported).

```php
$fields = tangible_fields();

$fields->register_dynamic_value([
  'category' => 'post',
  'name'     => 'post_title',
  'label'    => 'Post title',
  'type'     => 'text',
  'fields'   => [
    [
      'type'    => 'select',
      'name'    => 'format',
      'label'   => 'Format',
      'choices' => [
        'none'      => 'None',
        'lowercase' => 'Lowercase',
        'uppercase' => 'Uppercase'
      ]
    ]
  ],
  'callback' => function($settings, $config) {

    $format = $settings['format'] ?? 'none';
    $post_title = get_the_title(
      $config['context']['current_post_id']
    );

    if( $format === 'lowercase' ) return strtolower($post_title);
    if( $format === 'uppercase' ) return strtoupper($post_title);

    return $post_title; 
  },
  'permission_callback' => '__return_true'
]);
```
