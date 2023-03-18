<?php

defined('ABSPATH') or die();

$fields->registered_fields = [];

/**
 * Register a field.
 *
 * @todo Validation.
 */
$fields->register_field = function(
  string $name,
  array $args
) use ($fields) : void {
  if ( !empty( $fields->registered_fields[ $name ] ) ) {
    $backtrace = debug_backtrace();
    $caller = array_shift( $backtrace );
    $caller = array_shift( $backtrace );
    trigger_error("Field {$name} is already registered, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>.", E_USER_WARNING);
  }
  $fields->registered_fields[ $name ] = $args;
};

/**
 * Get a registered field or null.
 */
$fields->get_field = function(
  string $name
) use ($fields) : array|null {
  return $this->registered_fields[ $name ] ?? null;
};

/**
 * Render a registered field.
 *
 * @todo Move to a rendering submodule.
 */
$fields->render_field = function(
  string $name,
  array $args = []
) use($fields) : string {

  if ( ! $field = $fields->get_field( $name ) ) {
    $caller = current( debug_backtrace() );
    trigger_error("Field {$name} is not registered, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>.", E_USER_WARNING);
    return '';
  }

  $field = array_merge( $field, $args );

  $args = $fields->format_args( $name, $field );

  $fields->enqueue_field( $name, $args );

  return '<div id="' . $args['element'] . '" ></div>';
};
