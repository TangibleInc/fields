<?php

defined('ABSPATH') or die();

$fields->fetch_value = function (
  string $name
) use ($fields) {
  if ( ! $field = $fields->get_field( $name ) ) {
    return new WP_Error( 'tf-unknown-field', sprintf( __( 'Unknown field %1$s' ), $name ) );
  }

  if ( empty( $field['fetch_callback'] ) ) {
    return new WP_Error( 'tf-unknown-callback', sprintf( __( 'Unknown fetch callback for %1$s' ), $name ) );
  }

  if ( ! ($field['permission_callback_fetch'] ?? '__return_false')($name) ) {
    if ( ! ($field['permission_callback'] ?? '__return_false')($name) ) {
      return new WP_Error( 'tf-no-permission', sprintf( __( 'Access denied to fetch value for %1$s' ), $name ) );
    }
  }

  return $field['fetch_callback']($name);
};

$fields->store_value = function (
  string $name,
  $value
) use ($fields) {
  if ( ! $field = $fields->get_field( $name ) ) {
    return new WP_Error( 'tf-unknown-field', sprintf( __( 'Unknown field %1$s' ), $name ) );
  }

  if ( empty( $field['store_callback'] ) ) {
    return new WP_Error( 'tf-unknown-callback', sprintf( __( 'Unknown store callback for %1$s' ), $name ) );
  }

  if ( ! ($field['permission_callback_store'] ?? '__return_false')($name) ) {
    if ( ! ($field['permission_callback'] ?? '__return_false')($name) ) {
      return new WP_Error( 'tf-no-permission', sprintf( __( 'Access denied to store value for %1$s' ), $name ) );
    }
  }

  if ( ! empty( $field['validation_callbacks'] ) ) {
    foreach ( $field['validation_callbacks'] as $callback ) {
      if ( is_wp_error( $error = $callback( $name, $value ) ) ) {
        return $error; // Validation failed.
      }
    }
  }

  if ( is_string($value) ) {
    $value = $fields->strip_unauthorized_dynamic_values($value, 'store');
  }
  
  if ( ! $field['store_callback']($name, $value) ) {
    return new WP_Error( 'tf-error', sprintf( __( 'Could not save value for %1$s' ), $name ) );
  }

  return true;
};

/**
 * AJAX handling.
 *
 * {"success": true, "error": null}
 */
add_action( 'wp_ajax_tangible_fields_store', [ $fields, '_ajax_store_callback' ] );
add_action( 'wp_ajax_nopriv_tangible_fields_store', [ $fields, '_ajax_store_callback' ] );
$fields->_ajax_store_callback = function (
) use ($fields) {
  $name = $_GET['name'] ?? '';

  if ( ! $field = $fields->get_field( $name ) ) {
    return $fields->__send_ajax( [
      'success' => false,
      'error' => sprintf( __( 'Unknown field %1$s' ), $name ),
    ] );
  }

  $value = $_REQUEST['value'] ?? null;

  if ( is_wp_error( $error = $fields->store_value( $name, $value ) ) ) {
    return $fields->__send_ajax( [
      'success' => false,
      'error' => $error->get_error_message(),
    ] );
  }

  return $fields->__send_ajax( [
    'success' => true,
    'error' => null,
  ] );
};

/**
 * {"success": true, "error": null, "value": 42}
 */
add_action( 'wp_ajax_tangible_fields_fetch', [ $fields, '_ajax_fetch_callback' ] );
add_action( 'wp_ajax_nopriv_tangible_fields_fetch', [ $fields, '_ajax_fetch_callback' ] );
$fields->_ajax_fetch_callback = function (
) use ($fields) {
  $name = $_GET['name'] ?? '';

  if ( ! $field = $fields->get_field( $name ) ) {
    return $fields->__send_ajax( [
      'success' => false,
      'error' => sprintf( __( 'Unknown field %1$s' ), $name ),
    ] );
  }

  if ( is_wp_error( $error = $value = $fields->fetch_value( $name ) ) ) {
    return $fields->__send_ajax( [
      'success' => false,
      'error' => $error->get_error_message(),
    ] );
  }

  return $fields->__send_ajax( [
    'success' => true,
    'error' => null,
    'value' => $value,
  ] );
};

/**
 * Internal AJAX exit or return during tests.
 *
 * @internal
 */
$fields->__send_ajax = function ( $data, $return = null ) {
  if ( is_null( $return ) ) {
    $return = defined( 'DOING_TANGIBLE_TESTS' ) && DOING_TANGIBLE_TESTS;
  }

  if ( $return ) {
    return $data;
  }

  echo json_encode( $data );
  exit;
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
 *  - meta: use wp_TYPE_meta table. Parameters:
 *    - $object_type - one of post, term, user, comment
 *    - $object_id - object ID or callback
 *    - $prefix - the meta key prefix
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
  'options' => function ($prefix = 'tf_') {
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
  'meta' => function ($object_type, $object_id, $prefix = 'tf_') {
    return [
      'store_callback' => function ($name, $value) use ($object_type, $object_id, $prefix) {
        if ( is_callable( $object_id ) ) {
          $object_id = $object_id();
        }
        if ( is_null( $value ) ) {
          return delete_metadata( $object_type, $object_id, "{$prefix}{$name}", null, true );
        }
        return (bool)update_metadata( $object_type, $object_id, "{$prefix}{$name}", $value );
      },
      'fetch_callback' => function ($name) use ($object_type, $object_id, $prefix) {
        if ( is_callable( $object_id ) ) {
          $object_id = $object_id();
        }
        return get_metadata( $object_type, $object_id, "{$prefix}{$name}", true );
      },
    ];
  }
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

/**
 * A collection of reusable validation callbacks.
 *
 * @usage tangible_fields()->register_field('name', [
 *  'type' => 'text',
 *  'validation_callbacks' => [
 *    tangible_fields()->_validation_callback('required'),
 *    tangible_fields()->_validation_callback('is_numeric', __('The name field must be a number')),
 *    tangible_fields()->_validation_callback('compares', '!= 42', __('Name can't be 42')),
 *    'custom_validation_callback',
 *  ],
 * ]);
 *
 * Available callbacks:
 *
 *  - required - whether the field is required or not. Parameters: none.
 */
$fields->_validation_callback = function ($callback, $message = '') {
  switch ($callback):
    case 'required':
      return function ($name, $value) use ($message) {
        if ( empty( $value ) ) {
          return new WP_Error( 'tf-validation', $message ?? sprintf( __( '%1$s is required', 'tangible-fields', $name ) ) );
        }
        return true;
      };
  endswitch;
};
