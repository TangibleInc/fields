<?php

defined('ABSPATH') or die();

$fields->strip_unauthorized_dynamic_values = function(
  string $value, 
  string $action
) use($fields) : string {
  return preg_replace_callback(
    $fields->dynamic_value_regex,
    function($matches) use($fields, $action) {
      return $fields->maybe_strip_unauthorized_dynamic_value($matches, $action);
    },
    $value
  );
};

$fields->maybe_strip_unauthorized_dynamic_value = function(
  array $matches,
  string $action
) use($fields) : string {

  $data = $fields->parse_dynamic_value_string($matches[1]);
  
  if( empty($data) ) return '';
  
  $dynamic_value = $fields->dynamic_values[ $data['name'] ] ?? false;

  if( empty($dynamic_value) ) return '';
  
  return $fields->is_dynamic_value_action_allowed($dynamic_value, $action)
    ? $matches[0]
    : '';
};

$fields->is_dynamic_value_action_allowed = function(
  array $dynamic_value, 
  string $action
) : bool {

  if( $action === 'evaluate' ) return true;

  $permission = $dynamic_value["permission_callback_$action"] ?? false;
  
  if( ! is_callable($permission) ) {
    $permission = $dynamic_value['permission_callback'] ?? false;
  }

  return is_callable($permission) && $permission() === true;
};
