<?php

namespace Tangible\Fields\Tests;

/**
 * Check if a callback was registered with a given WordPress action hook
 * @see wp-includes/class-wp-hook.php, add_filter()
 */
function action_hook_has_callback(
  string $action_name,
  callable $callback
): bool {

  global $wp_filter;

  if (!isset($wp_filter[ $action_name ])) return false;

  foreach ($wp_filter[ $action_name ]->callbacks as $priority => $indexes) {
    foreach ($indexes as $index => $definition) {
      if ($definition['function'] === $callback) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Mock WP action hook is called already
 * @see /wp-includes/plugin.php, did_action()
 */
function mock_did_action($hook_name, $count = 1) {
	global $wp_actions;
  if (isset($wp_actions[ $hook_name ])) {
    $wp_actions[ $hook_name ] = $count;
  }
}

/**
 * Unmock did_action
 */
function unmock_did_action($hook_name) {
	global $wp_actions;
  $wp_actions[ $hook_name ] = 0;
}

/**
 * Mock WP action hook is being called
 * @see /wp-includes/plugin.php, doing_filter()
 */
function mock_doing_action($hook_name) {
	global $wp_current_filter;

  if ( ! in_array( $hook_name, $wp_current_filter, true ) ) {
    $wp_current_filter []= $hook_name;
  }
}

/**
 * Unmock doing_action
 */
function unmock_doing_action($hook_name) {
	global $wp_current_filter;

  if (($key = array_search($hook_name, $wp_current_filter)) !== false) {
    unset($wp_current_filter[ $key ]);
  }
}
