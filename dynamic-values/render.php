<?php

defined('ABSPATH') or die();

$fields->render_value = function(string $raw_value, array $config = []) use($fields) : string {
  return preg_replace_callback(
    $fields->dynamic_value_regex,
    function(array $matches) use($fields, $config): string {
      return $fields->render_dynamic_value($matches, $config);
    },
    $fields->strip_unauthorized_dynamic_values($raw_value, $config['action'] ?? 'parse')
  );
};

$fields->render_dynamic_value = function(array $matches, array $config = []) use($fields) : string {

  $data = $fields->parse_dynamic_value_string($matches[1]);

  if( empty($data) ) return $matches[0];
  
  // @see ./config
  $config = $fields->get_dynamic_value_config($config);
  $render = $fields->dynamic_values[ $data['name'] ]['callback'];

  return is_callable($render) 
    ? $render( $data['settings'], $config ) 
    : $matches[0];
};

$fields->parse_dynamic_value_string = function(string $string) use($fields) : array {

  $response = [];
  $data = explode('::', $string);

  $has_valid_name = count($data) !== 0; 
  $has_valid_name = $has_valid_name && ! empty($fields->dynamic_values[ $data[0] ]);

  if( ! $has_valid_name ) return $response;

  $response['name'] = $data[0];
  $response['settings'] = [];

  $registered_fields = $fields->dynamic_values[ $data[0] ]['fields'] ?? false;

  if( empty($registered_fields) ) return $response;

  // Make sure to set empty value in case not set from string
  foreach( $registered_fields as $field ) $response['settings'][ $field['name'] ] = '';

  if( count($data) === 1 ) return $response;

  return array_reduce(
    array_slice($data, 1),
    $fields->parse_dynamic_value_settings,
    $response
  );
};

$fields->parse_dynamic_value_settings = function(array $response, string $string) use($fields) : array {

  $setting = explode('=', $string);
  $dynamic_value = $fields->dynamic_values[ $response['name'] ];
  
  $setting_keys = array_map(
    function($field) {
      return $field['name'];
    }, 
    $dynamic_value['fields']
  );

  $is_valid_setting = count($setting) === 2;
  $is_valid_setting = $is_valid_setting && in_array($setting[0], $setting_keys);

  if( $is_valid_setting ) {
    $response['settings'][ $setting[0] ] = $setting[1];
  }

  return $response; 
};
