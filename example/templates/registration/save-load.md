#### Summary

- [Save/load configuration](#save-load)
- [Fetch and store callbacks](#store-and-fetch)
  - [Register callbacks](#register-store-and-fetch)
  - [Helpers](#store-and-fetch-helpers)
- [Permissions callbacks](#permissions)
  - [Register callbacks](#register-permissions)
  - [Helpers](#permissions-helpers)
- [Validation callbacks](#validation)
- [Full registration example](#full-registration-example)

#### Save/load configuration {#save-load}

Using the save/load feature will allow you to easily access and update field value by using the following functions:
```php
$value = $fields->fetch_value('field-name');
```
```php
$fields->store_value('field-name', $updated_value);
```

In order to use `$fields->fetch_value()` and `$fields->store_value()`, the following callbacks needs to be set during the field registration:
- [Store and fetch callbacks](#store-and-fetch)
- [Permissions callbacks](#permissions)
- [Validation callbacks](#validation)

#### Store and fetch callbacks {#store-and-fetch}

##### Register callbacks {#register-store-and-fetch}

To determine how data are stored, we need to set 2 parameters:
- `store_callback` - Function used to update field value. It takes the `$field_name` and the `$field_value` as parameters. It returns `true` if the value is successfully updated and `false` otherwise.
- `fetch_callback` - Function that takes the `$field_name` as a parameter.

Here is an example of callbacks that will store a field value as a cookie:
```php
$fields->register_field('field-name', [
  // ....
  'store_callback' => function($name, $value) {
    return setcookie(`tf-{$name}`, $value);
  },
  'fetch_callback' => function() {
    return $_COOKIE[`tf-{$name}`] ?? '';
  },
  // ....
]);
```

##### Helpers {#store-and-fetch-helpers}

Some helpers are available for common cases:
- Field stored in the `wp_options` table 
- Field stored in the `wp_{object}meta` table (works for `post`, `comment`, `term` and `user` metas) 
- Field stored in the php `memory` 

Here is an example of how to use each of them:
```php

/**
 * Stored in `wp_options` table:
 * - $prefix: optional - if no set 'tf-' will be used
 */
$fields->register_field('field-name', [
  // ....
  ...$fields->_store_callbacks['options']('prefix_'),
  // ....
]);

/**
 * Stored in `wp_{object}meta` table:
 * - $object_type: `post`, `comment`, `term` or `user`
 * - $object_id
 * - $prefix: optional - if no set 'tf-' will be used
 */ 
$fields->register_field('field-name', [
  // ....
  ...$fields->_store_callbacks['meta']('post', $post_id, 'prefix_'),
  // ....
]);

/**
 * Stored in php memory:
 */ 
$fields->register_field('field-name', [
  // ....
  ...$fields->_store_callbacks['memory'](),
  // ....
]);
```

#### Permissions callbacks {#permissions}

##### Register callbacks {#register-permissions}

To determine if the current user is allowed to store or fetch the field's value, we need to set 2 parameters:
- `permission_callback_store` - Function that returns `true` if user is allowed to update the field value, `false` otherwise. Takes `$fields_name` as a parameter.
- `permission_callback_fetch` - Function that returns `true` if user is allowed to read the field value, `false` otherwise. Takes `$fields_name` as a parameter.

If the both read and write require the same permission, you can use a single callback called `permission_callback` instead. 

_Note: If the permission callbacks are not defined, fields will always assume that the current user is not allowed to update or read the field value._

Here is an example of how to define permissions:
```php

/**
 * Different permissions for read and write
 */ 
$fields->register_field('field-name', [
  // ....
  'permission_callback_store' => function($field_name) {
    return is_user_logged_in();
  },
  'permission_callback_fetch' => function($field_name) {
    return true;
  },
  // ....
]);

/**
 * Same permissions for read and write
 */ 
$fields->register_field('field-name', [
  // ....
  'permission_callback' => function($field_name) {
    return is_user_logged_in();
  },
  // ....
]);
```

##### Helpers {#permissions-helpers}

Some helpers are available for common cases:

- Always allows
- Allows if user has one or multiple [wordpress capabilities](https://wordpress.org/documentation/article/roles-and-capabilities/#capabilities)

Here is an example of how to use both:
```php

/**
 * Permissions according to capabilities - Only if user has manage_options capability 
 */ 
$fields->register_field('field-name', [
  // ....
 $fields->_permission_callbacks([
    'store' => ['user_can', 'manage_options']  
    'fetch' => ['user_can', 'manage_options']
  ])
  // ....
]);

/**
 * Always allows
 */ 
$fields->register_field('field-name', [
  // ....
 $fields->_permission_callbacks([
    'store' => ['always_allow']  
    'fetch' => ['always_allow']
  ])
  // ....
]);
```

#### Validation callbacks {#validation}

Validation callbacks are called before a value is saved.

A field can have multiple validation callbacks, and each one must return true in order to save the value.

Here is an example with a number field that must both be an integer and be less than 5:
```php
$fields->register_field('field-name', [
  // ....
  'validation_callbacks' = [
    function($name, $value) {
      return is_int($value);
    },
    function($name, $value) {
      return $value < 5;
    }
  ]
  // ....
]);
```

#### Full registration example {#full-registration-example}

```php
/**
* @see https://bitbucket.org/tangibleinc/tangible-fields-module/src/main/store.php
*/
$fields->register_field('field-name', [
  ...$args,
  'store_callback' => function($name, $value) {
    return setcookie(`tf-{$name}`, $value);
  },
  'fetch_callback' => function() {
    return $_COOKIE[`tf-{$name}`] ?? '';
  },
  // Permissions
  'permission_callback_store' => function($field_name) {
    return is_user_logged_in();
  },
  'permission_callback_fetch' => function($field_name) {
    return true;
  },
  // Validation
  'validation_callbacks' = [
    function($name, $value) {
      return is_int($value);
    },
    function($name, $value) {
      return $value < 5;
    }
  ]
]);
```

