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
 *  'type',
 *  ...tangible_fields()->_store_callbacks['memory']()
 *  'permission_callback' => '__return_true',
 * ];
 *
 * Available callbacks and their parameters:
 *
 *  - memory: an ephemeral (request lifetime) store
 *    mostly used for testing. Parameters: none.
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
];
