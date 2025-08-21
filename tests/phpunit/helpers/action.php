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

  $found_action = false;

  if (isset($wp_filter['admin_enqueue_scripts'])) {
    foreach ($wp_filter['admin_enqueue_scripts']->callbacks as $priority => $indexes) {
      foreach ($indexes as $index => $definition) {
        if ($definition['function']==='wp_enqueue_media') {
          return true;
        }
      }
    }
  }

  return false;
}
