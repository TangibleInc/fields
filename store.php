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

  if ( ! ($field['permission_callback_fetch'] ?? '__return_false')($name) ) {
    if ( ! ($field['permission_callback'] ?? '__return_false')($name) ) {
      return null;
    }
  }

  return $field['fetch_callback']($name);
};

$fields->store_value = function (
  string $name,
  mixed $value,
) use ($fields) : bool {
  if ( ! $field = $fields->get_field( $name ) ) {
    return false;
  }

  if ( empty( $field['store_callback'] ) ) {
    return false;
  }

  if ( ! ($field['permission_callback_store'] ?? '__return_false')($name) ) {
    if ( ! ($field['permission_callback'] ?? '__return_false')($name) ) {
      return false;
    }
  }

  return (bool)$field['store_callback']($name, $value);
};

/**
 * A collection of reusable store/fetch callbacks.
 *
 * @usage tangible_fields()->register_field('name', [
 *  'type' => 'text',
 *  ...tangible_fields()->_store_callbacks['memory']()
 * ]);
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
  'options' => function ($prefix = 'tangible_fields_') {
    return [
      'store_callback' => function ($name, $value) use ($prefix) {
        if ( is_null( $value ) ) {
          return delete_option( "{$prefix}{$name}" );
        }
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
 *  ...tangible_fields()->_permission_callbacks([
 *    'store' => ['user_can', 'manage_options'],
 *    'fetch' => ['always_allow'],
 *  ]),
 * ]);
 *
 * Available callbacks and their parameters:
 *
 *  - always_allow: akin to `__return_true`
 *  - user_can: uses the `current_user_can` WordPress function
 *    to verify current user permissions. Parameters:
 *    - $permission - the permission name
 *    - $args - arguments to pass to the function
 *      (if callable will be called and spread instead)
 */
$fields->_permission_callbacks = function ($callbacks) {
  $_return = [
    // Don't allow by default.
    'permission_callback_store' => '__return_false',
    'permission_callback_fetch' => '__return_false',
  ];

  foreach (['store', 'fetch'] as $action) {
    if ( empty( $callbacks[$action] ) ) {
      continue;
    }
    if ( ! is_array( $callbacks[$action] ) ) {
      $callback = $callbacks[$action];
      $args = [];
    } else {
      $callback = array_shift( $callbacks[$action] );
      $args = $callbacks[$action];
    }

    switch ( $callback ):
      case 'always_allow':
        $_return["permission_callback_$action"] = '__return_true';
        break;
      case 'user_can':
        $_return["permission_callback_$action"] = function() use ($args) {
          $args = array_map( function( $arg ) {
            return is_callable( $arg ) ? $arg() : $arg;
          }, $args );
          return current_user_can(...$args);
        };
        break;
      default:
        $backtrace = debug_backtrace();
        $caller = array_shift( $backtrace );
        $caller = array_shift( $backtrace );
        trigger_error("Unknown {$callback} permission callback, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>.", E_USER_WARNING);
    endswitch;
  }

  return $_return;
};

/*
'user_can' => function ($permission, $args = null) {
  'permission_callback_fetch' => function () use ($permission)
    return current_user_can( $permission, ...(is_callable( $args ) ? $args() : ($args ?? [])) );
}
 */
