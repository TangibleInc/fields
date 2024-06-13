<?php

defined('ABSPATH') or die();

if ( ! function_exists( 'tangible_fields' ) ) :
  function tangible_fields( $arg = false ) {
    static $o;
    return $arg === false ? $o : ( $o = $arg );
  }
endif;

new class extends stdClass {

  public $name = 'tangible_fields';

  // Remember to update the version - Expected format: YYYYMMDD
  public $version = '20240322';

  function __construct() {

    $name     = $this->name;
    $priority = 99999999 - absint( $this->version );

    remove_all_filters( $name, $priority );
    add_action( $name, [ $this, 'load' ], $priority );

    $ensure_action = function() use ( $name ) {
      if ( ! did_action( $name ) ) do_action( $name );
    };

    add_action('plugins_loaded', $ensure_action, 0);
    add_action('after_setup_theme', $ensure_action, 0);
  }

  // Dynamic methods
  function __call( $method = '', $args = [] ) {
    if ( isset( $this->$method ) ) {
      return call_user_func_array( $this->$method, $args );
    }
    $caller = current( debug_backtrace() );
    trigger_error("Undefined method \"$method\" for {$this->name}, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b><br>", E_USER_WARNING);
  }
  
  function load() {

    remove_all_filters( $this->name ); // First one to load wins

    if (!class_exists('tangible\\date')) {
      $module_path = defined('FIELDS_IS_PLUGIN')
        ? __DIR__ . '/vendor/tangible/'
        : __DIR__ . '/../';
    
      require_once $module_path . 'date/index.php';
    }
    
    $fields = $this;
    tangible_fields( $fields );

    require_once __DIR__ . '/dynamic-values/index.php';
    require_once __DIR__ . '/fields/index.php';
    require_once __DIR__ . '/elements/index.php';
    require_once __DIR__ . '/enqueue.php';
    require_once __DIR__ . '/context.php';

    do_action('tangible_fields_loaded', $fields);
  }

};
