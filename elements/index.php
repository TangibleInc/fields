<?php

defined('ABSPATH') or die();

$fields->registered_elements = [];

/**
 * Register an element
 */
$fields->register_element = function(
  string $name,
  array $args
) use ($fields) : void {

  if ( ! empty( $fields->registered_elements[ $name ] ) ) {
    $backtrace = debug_backtrace();
    $caller = array_shift( $backtrace );
    $caller = array_shift( $backtrace );
    trigger_error("Element {$name} is already registered, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>. Will overwrite.", E_USER_WARNING);
  }

  if ( empty( $args ) ) {
    $backtrace = debug_backtrace();
    $caller = array_shift( $backtrace );
    $caller = array_shift( $backtrace );
    trigger_error("Element {$name} can't be registered with empty args, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>.", E_USER_WARNING);
    return;
  }

  $fields->registered_elements[ $name ] = $args;
};

/**
 * Get a registered field or null.
 */
$fields->get_element = function(
  string $name
) use ($fields) {
  return $this->registered_elements[ $name ] ?? null;
};

$fields->is_element = function(string $type) : bool {
  return in_array($type, [
    'button',
    'description',
    'label',
    'modal'
  ]);
};

/**
 * Render a registered element
 */
$fields->render_element = function(
  string $name,
  array $args = []
) use($fields) : string {

  if ( ! $field = $fields->get_element( $name ) ) {
    $caller = current( debug_backtrace() );
    trigger_error("Element {$name} is not registered, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>. Permissions, storage, validation callbacks are inert.", E_USER_WARNING);

    $fields->register_element( $name, $args );
    return $fields->render_element( $name );
  }

  $field = array_merge( $field, $args );

  $args = $fields->format_element_args( $name, $field );

  $fields->enqueue_item( $name, 'elements', $args );

  return '<div id="' . $args['element'] . '" ></div>';
};

/**
 * For each control type, convert $args to props expected the react component 
 * associated
 * 
 * @see ./assets/src/types.js
 */

$fields->format_element_args = function(
  string $name, 
  array $args
) use($fields) {

  $type = $args['type'] ?? '';

  $args['element'] = uniqid( 'tangible-element-' . $name .'-' );

  switch($type) {

    case 'modal':
      $args = $fields->format_value($args, 'cancel_text', 'cancelText');
      $args = $fields->format_value($args, 'confirm_text', 'confirmText');
      break;

    case 'button':
      $args = $fields->format_value($args, 'button_type', 'buttonType');
      break;
  }

  return $args;
};
