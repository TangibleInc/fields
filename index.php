<?php

if ( ! function_exists( 'tangible_fields' ) ) :
  function tangible_fields( $arg = false ) {
    static $o;
    return $arg === false ? $o : ( $o = $arg );
  }
endif;

new class {

  public $name = 'tangible_fields';

  // Remember to update the version - Expected format: YYYYMMDD
  public $version = '20221219';

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

  function load() {

    remove_all_filters( $this->name ); // First one to load wins
    
    $fields = tangible_object(); // TODO: Should not assume that framework is installed
    $fields->module = $this; 

    $fields = tangible_fields( $fields );
    
    require_once __DIR__ . '/format.php';
    require_once __DIR__ . '/dynamic-value.php';
    require_once __DIR__ . '/fields.php';
    require_once __DIR__ . '/enqueue.php';
  }

};


