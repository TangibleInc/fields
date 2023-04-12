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

  // Set the render_callback for conditional fieldsets.
  if ( 'conditional' === ( $args['type'] ?? '' ) && empty( $args['render_callback'] ) ) {
    if ( is_callable( $callback = [ $fields, '_render_callback_default_conditional_field' ] ) ) {
      $args['render_callback'] = $callback;
    }
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
    trigger_error("Field {$name} is not registered, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>. Permissions, storage, validation callbacks are inert.", E_USER_WARNING);

    $fields->register_field( $name, $args );
    return $fields->render_field( $name );
  }

  $field = array_merge( $field, $args );

  $args = $fields->format_args( $name, $field );

  $fields->enqueue_field( $name, $args );

  if ( ! empty ( $field['render_callback'] ) ) {
    return $field['render_callback']( $args, $field );
  }

  return '<div id="' . $args['element'] . '" ></div>';
};
