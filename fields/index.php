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

  /**
   * A password field's stored value must never reach the browser, so it is not
   * fetched for rendering at all — the client is told only whether a value
   * exists, via "value_is_set". See the "password" case in ./format.php, which
   * strips a value passed explicitly as a backstop.
   */
  $is_secret = ( $field['type'] ?? '' ) === 'password';

  if( ! $is_secret && ! isset($field['value']) && isset($field['fetch_callback']) ) {
    $field['value'] = $fields->fetch_value( $name, $render_args );
  }

  $args = $fields->format_args( $name, $field );

  /**
   * format_args() strips a password field's value from the enqueued payload,
   * but the render callback below is handed the raw field as well — keep the
   * secret out of that copy too, or a custom callback can still echo it.
   */
  if( $is_secret ) unset( $field['value'] );

  $fields->enqueue_item( $name, 'fields', $args );

  if ( ! empty ( $field['render_callback'] ) ) {
    return $field['render_callback']( $args, $field );
  }

  return '<div id="' . $args['element'] . '" ></div>';
};
