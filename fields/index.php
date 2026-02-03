<?php

defined('ABSPATH') or die();

$fields->registered_fields = [];

require_once __DIR__ . '/conditional.php';
require_once __DIR__ . '/format.php';
require_once __DIR__ . '/media.php';
require_once __DIR__ . '/store.php';

/**
 * Register a field.
 *
 * @todo Validation.
 */
$fields->register_field = function(
  string $name,
  array $args
) use ($fields) : void {
  if ( ! empty( $fields->registered_fields[ $name ] ) ) {
    $backtrace = debug_backtrace();
    $caller = array_shift( $backtrace );
    $caller = array_shift( $backtrace );
    trigger_error("Field {$name} is already registered, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>. Will overwrite.", E_USER_WARNING);
  }

  if ( empty( $args ) ) {
    $backtrace = debug_backtrace();
    $caller = array_shift( $backtrace );
    $caller = array_shift( $backtrace );
    trigger_error("Field {$name} can't be registered with empty args, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>.", E_USER_WARNING);
    return;
  }

  $fields->registered_fields[ $name ] = $args;
};

/**
 * Get a registered field or null.
 */
$fields->get_field = function(
  string $name
) use ($fields) {
  return $this->registered_fields[ $name ] ?? null;
};

/**
 * Render a registered field.
 *
 * @todo Move to a rendering submodule.
 */
$fields->render_field = function(
  string $name,
  array $args = [],
  array $render_args = []
) use($fields) : string {

  if ( ! $field = $fields->get_field( $name ) ) {
    $fields->register_field( $name, $args );
    return $fields->render_field( $name );
  }

  $field = array_merge( $field, $args );

  if( ! isset($field['value']) && isset($field['fetch_callback']) ) {
    $field['value'] = $fields->fetch_value( $name, $render_args );
  }

  $args = $fields->format_args( $name, $field );

  $fields->enqueue_item( $name, 'fields', $args );

  if ( ! empty ( $field['render_callback'] ) ) {
    return $field['render_callback']( $args, $field );
  }

  return '<div id="' . $args['element'] . '" ></div>';
};
