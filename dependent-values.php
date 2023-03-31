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

$fields->get_dependent_contexts = function(array $contexts) use($fields) : array {

  $dependent_fields = [];

  foreach( $contexts as $context ) {

    // Currenly, we only support dependent value inside repeaters and field-groups
    if( ! in_array($context['type'], [
      'repeater', 
      'field-group'
    ]) ) {
      continue;
    }

    $dependent_fields[ $context['element'] ] = $fields->get_repeater_dependent_values($context);    
  }

  return $dependent_fields;
};

$fields->get_repeater_dependent_values = function(array $repeater) use($fields) : array {
  
  $config = [];

  if( empty($repeater['fields']) ) return $config;

  // For every repeater field check check if dependent
  
  foreach( $repeater['fields'] as $field ) {
    $config = array_merge(
      $fields->get_dependent_config($field),
      $config
    );
  }
  
  return $config;
};

$fields->get_dependent_config = function(array $field) use($fields) : array {

  $config = [];
  $name = $field['name'] ?? false;
  
  if( ! $name ) return $config;

  $dependent_keys = [
    'description',
    'label',
    'placeholder',
    'asyncArgs'
  ];
  
  foreach( $dependent_keys as $key ) {

    if( is_array($field[ $key ] ?? '') ) {
      foreach( $field[ $key ] as $subkey => $value ) {

        if( ! $fields->is_dependent_value($value) ) continue;

        $trigger_field = $fields->get_dependent_name($value);

        if( ! isset($config[ $name ]) ) $config[ $name ] = [];
        if( ! isset($config[ $name ][ $key ]) ) $config[ $name ][ $key ] = [];

        $config[ $name ][ $key ][ $subkey ] = $trigger_field; 
      }
      continue;
    }
    
    if( ! $fields->is_dependent_value($field[ $key ] ?? '') ) {
      continue;
    }

    $value = $field[ $key ];
    $trigger_field = $fields->get_dependent_name($value);

    if( ! isset($config[ $name ]) ) $config[ $name ] = [];
    
    $config[ $name ][ $key ] = $trigger_field; 
  }
  
  return $config;
};

$fields->is_dependent_value = function(string $value) : bool {
          
  $is_dependent = strpos($value, '{{') !== false; 
  $is_dependent = $is_dependent && strpos($value, '}}') !== false; 

  return $is_dependent;
};

$fields->get_dependent_name = function(string $name) : string {
  return substr($name, 2, strlen($name) - 4);
};
