<?php

defined('ABSPATH') or die();

if ( ! function_exists( 'tangible_fields' ) ) :
  function tangible_fields( $arg = false ) {
    static $o;
    return $arg === false ? $o : ( $o = $arg );
  }
endif;

(include __DIR__ . '/module-loader.php')(new class extends StdClass {

  public $name = 'tangible_fields';
  // Remember to update the version - Expected format: YYYYMMDD
  public $version = '20241024';

  // Dynamic methods
  function __call( $method = '', $args = [] ) {
    if ( isset( $this->$method ) ) {
      return call_user_func_array( $this->$method, $args );
    }
    $caller = current( debug_backtrace() );
    trigger_error("Undefined method \"$method\" for {$this->name}, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b><br>", E_USER_WARNING);
  }
  
  function load() {

    // Parent plugin is expected to load framework
    if (!class_exists('tangible\\framework')) return;

    $fields = $this;
    tangible_fields( $fields );

    require_once __DIR__ . '/dynamic-values/index.php';
    require_once __DIR__ . '/fields/index.php';
    require_once __DIR__ . '/elements/index.php';
    require_once __DIR__ . '/enqueue.php';
    require_once __DIR__ . '/context.php';

    do_action('tangible_fields_loaded', $fields);
  }

});
