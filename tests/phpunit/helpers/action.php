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
