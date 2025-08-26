<?php

namespace Tangible\Fields\Tests;

/**
 * @see wp-includes/load.php is_login()
 */
function login_set_state(bool $new_state) {

  static $initial_state = false;

  if( $new_state === true && $initial_state === false ) {
    $initial_state = $_SERVER['SCRIPT_NAME'];
    $_SERVER['SCRIPT_NAME'] = '/wp-login.php';
  }
  elseif( $new_state === false && $initial_state !== false ) {
    $_SERVER['SCRIPT_NAME'] = $initial_state;
    $initial_state = false;
  }
}

/**
 * Mock is_login() to return true or false for testing purpose
 *
 * Must call unmock_is_login() afterward.
 */
function mock_is_login($state = true) {
  login_set_state(true);
}

/**
 * Restore original state
 */
function unmock_is_login() {
  login_set_state(false); 
}
