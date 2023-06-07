<?php

defined('ABSPATH') or die();

$fields->register_dynamic_value = function(array $dynamic_value) use($fields) : void {
  
  $name = $dynamic_value['name'] ?? false;

  if( empty($name) ) {
    $backtrace = debug_backtrace();
    $caller = array_shift( $backtrace );
    $caller = array_shift( $backtrace );
    trigger_error("Missing name for dynamic value registration in <b>{$caller['file']}</b> on line <b>{$caller['line']}</b>", E_USER_WARNING);
    return;
  }

  if( ! empty($fields->dynamic_values[ $name ]) ) {
    $backtrace = debug_backtrace();
    $caller = array_shift( $backtrace );
    $caller = array_shift( $backtrace );
    trigger_error("Dynamic value {$name} is already registered, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>. Will overwrite.", E_USER_WARNING);
  }

  $dynamic_value['fields'] = array_map(function($args) use($fields) {
    return $fields->format_args( 
      $args['name'] ?? '',
      $args,
      false
    );
  }, $dynamic_value['fields'] ?? []);

  $fields->dynamic_values[ $name ] = $dynamic_value;
  $fields->set_dynamic_value_category($name, $dynamic_value['category'] ?? '');
};

$fields->set_dynamic_value_category = function(
  string $name,
  string $category
) use($fields) : void {

  $categories = array_keys($fields->dynamic_values_categories);

  if( ! in_array($category, $categories) ) {
    $backtrace = debug_backtrace();
    $caller = $backtrace[3];
    trigger_error("Unknown {$category} category, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>.", E_USER_WARNING);
    return;
  }

  $fields->dynamic_values_categories[ $category ]['values'] []= $name; 
};

$fields->register_dynamic_value_category = function(
  string $name, 
  array $args
) use($fields) : void {
  
  if( isset($fields->dynamic_values_categories[ $name ]) ) {
    $backtrace = debug_backtrace();
    $caller = array_shift( $backtrace );
    $caller = array_shift( $backtrace );
    trigger_error("Category {$name} is already registered, called from <b>{$caller['file']}</b> in <b>{$caller['line']}</b>. Will overwrite.", E_USER_WARNING);
  }

  $fields->dynamic_values_categories[ $name ] = [
    'label'  => $args['label'],
    'values' => [],
  ] + $args;
};
