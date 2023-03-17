<?php

defined('ABSPATH') or die();

$fields->fetch_value = function (
  string $name
) use ($fields) : mixed {
  if ( ! $field = $fields->get_field( $name ) ) {
    return null;
  }

  if ( empty( $field['fetch_callback'] ) ) {
    return null;
  }

  if ( ! ($field['permission_callback'] ?? '__return_false')($name, 'fetch') ) {
    return null;
  }

  return $field['fetch_callback']($name);
};

$fields->store_value = function (
  string $name,
  string $value,
) use ($fields) : bool {
  if ( ! $field = $fields->get_field( $name ) ) {
    return false;
  }

  if ( empty( $field['store_callback'] ) ) {
    return false;
  }

  if ( ! ($field['permission_callback'] ?? '__return_false')($name, 'store') ) {
    return null;
  }

  return (bool)$field['store_callback']($name, $value);
};

/**
 * A collection of reusable store/fetch callbacks.
 *
 * @usage tangible_fields()->register_field('name', [
 *  'type' => 'text',
 *  ...tangible_fields()->_store_callbacks['memory']()
 *  ...tangible_fields()->_permission_callback['user_can']('manage_options'),
 * ];
 *
 * Available callbacks and their parameters:
 *
 *  - memory: an ephemeral (request lifetime) store
 *    mostly used for testing. Parameters: none.
 *  - options: use the wp_options table. Parameters:
 *    - $prefix - the option name prefix
 */
$fields->_store_callbacks = [
  'memory' => function () {
    static $_value;
    return [
      'store_callback' => function ($name, $value) use (&$_value) {
        $_value = $value;
        return true;
      },
      'fetch_callback' => function ($name) use (&$_value) {
        return $_value;
      }
    ];
  },
  'options' => function ($prefix = 'tanbile_fields_') {
    return [
      'store_callback' => function ($name, $value) use ($prefix) {
        return update_option( "{$prefix}{$name}", $value );
      },
      'fetch_callback' => function ($name) use ($prefix) {
        return get_option( "{$prefix}{$name}" );
      },
    ];
  },
];

/**
 * A collection of reusable permissions callbacks.
 *
 * @usage tangible_fields()->register_field('name', [
 *  'type' => 'text',
 *  ...tangible_fields()->_store_callbacks['memory'](),
 *  ...tangible_fields()->_permission_callback['user_can']('manage_options'),
 * ];
 *
 * Available callbacks and their parameters:
 *
 *  - user_can: uses the `current_user_can` WordPress function
 *    to verify current user permissions. Parameters:
 *    - $permission - the permission name
 *    - $args - arguments to pass to the function
 *      (if callable will be called and spread instead)
 */
$fields->_permission_callbacks = [
  'user_can' => function ($permission, $args = null) {
    return current_user_can( $permission, ...(is_callable( $args ) ? $args() : ($args ?? [])) );
  }
];
