<?php

defined('ABSPATH') or die();

/**
 * Structure to define a context is the following:
 * 
 * [
 *   '{{element_key}}' => [
 *     '{{target_field_name}}' => [
 *       '{{target_field_attribute_name}}' => '{{value_field_name}}'
 *        // Other Attribtues
 *      ]
 *     // Other fields
 *   ]
 *   // Other context (= repeater, popup... etc)
 * ]
 */

$fields->get_dynamic_contexts = function(array $contexts) use($fields) : array {

  $dynamic_fields = [];

  foreach( $contexts as $context ) {

    // Currenly, we only support dynamic value inside a repeater
    if(  ! in_array($context['type'], ['repeater-list', 'repeater-table']) ) {
      continue;
    }

    $dynamic_fields[ $context['element'] ] = $fields->get_repeater_dynamic_values($context);    
  }

  return $dynamic_fields;
};

$fields->get_repeater_dynamic_values = function(array $repeater) use($fields) : array {
  
  $config = [];

  if( empty($repeater['fields']) ) return $config;

  // For every repeater field check check if dynamic
  
  foreach( $repeater['fields'] as $field ) {
    $config = array_merge(
      $fields->get_dynamic_config($field),
      $config
    );
  }
  
  return $config;
};

$fields->get_dynamic_config = function(array $field) use($fields) : array {

  $config = [];
  $name = $field['name'] ?? false;
  
  if( ! $name ) return $config;

  $dynamic_keys = [
    'description',
    'label',
    'placeholder'
  ];
  
  foreach( $dynamic_keys as $key ) {
    
    if( ! $fields->is_dynamic_value($field[ $key ] ?? '') ) {
      continue;
    }

    $value = $field[ $key ];
    $trigger_field = $fields->get_dynamic_name($value);

    if( ! isset($config[ $name ]) ) $config[ $name ] = [];
    
    $config[ $name ][ $key ] = $trigger_field; 
  }
  
  return $config;
};

$fields->is_dynamic_value = function(string $value) : bool {
          
  if( ! is_string($value) ) return false;

  $is_dynamic = substr($value, 0, 2 ) === '[['; 
  $is_dynamic = $is_dynamic && substr($value, strlen($value) - 2, strlen($value)) === ']]'; 

  return $is_dynamic;
};

$fields->get_dynamic_name = function(string $name) : string {
  return substr($name, 2, strlen($name) - 4);
};
