<?php
/**
 * Plugin Name: Tangible Fields
 * Description: React-based custom fields library
 */

define('TANGIBLE_FIELDS_IS_PLUGIN', true);

require_once __DIR__ . '/index.php';

add_action('plugins_loaded', function() {

  $fields = tangible_fields();

  require_once __DIR__ . '/example/index.php';  
});
