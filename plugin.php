<?php
/**
 * Plugin Name: Tangible Fields
 * Description: React-based custom fields library
 * Version: 2024.10.24
 */
use tangible\framework;
use tangible\updater;

define('TANGIBLE_FIELDS_IS_PLUGIN', true);

$module_path = is_dir(
  ($path = __DIR__ . '/vendor/tangible')
) ? $path : __DIR__ . '/..';

require_once $module_path . '/framework/index.php';
require_once $module_path . '/updater/index.php';
require_once __DIR__ . '/index.php';

add_action('plugins_loaded', function() {

  $fields = tangible_fields();

  updater\register_plugin([
    'name' => 'tangible-fields',
    'file' => __FILE__,
  ]);

  require_once __DIR__ . '/example/index.php';  
});
