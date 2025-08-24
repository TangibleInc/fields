<?php

namespace Tangible\Fields\Tests;

/**
 * Mock is_admin() to return true or false for testing purpose
 *
 * Must call unmock_is_admin() afterward.
 *
 * @see wp-includes/load.php is_admin()
 * @see wp-admin/includes/class-wp-screen.php WP_Screen::in_admin()
 */
function mock_is_admin($state = true) {

  global $current_screen;

  // Only once
  if (!empty($current_screen) && property_exists($current_screen, 'original_screen')) {
    return;
  }

  $screen = new class {
    public $state;
    public $original_screen;

    function in_admin() {
      return $this->state;
    }
  };

  $screen->state = $state;
  $screen->original_screen = $current_screen;

  $current_screen = $screen;
}

/**
 * Restore original screen and free the mock screen object
 */
function unmock_is_admin() {

  global $current_screen;

  if (!property_exists($current_screen, 'original_screen')) {
    return;
  }

  $current_screen = $current_screen->original_screen;
}
