<?php

defined('ABSPATH') or die();

/**
 * For each control type, convert $args to props expected the react component 
 * associated
 * 
 * @see ./assets/src/controls-list.js
 */
$fields->format_args = function(
  string $name, 
  array $args, 
  bool $element = true
) use($fields) : array {

  $type = $args['type'] ?? '';

  if( $element ) {  
    $args['element'] = uniqid( 'tangible-field-' . $name .'-' );
  }
  
  switch($type) {

    case 'number':
      $args = $fields->format_value($args, 'min', 'minValue');
      $args = $fields->format_value($args, 'max', 'maxValue');
      break;

    case 'combo-box':
    case 'text-suggestion':
      $args = $fields->format_value($args, 'is_async', 'isAsync');
      $args = $fields->format_value($args, 'async_args', 'asyncArgs');
      $args = $fields->format_value($args, 'search_url', 'searchUrl');
      // Fall through
    case 'select': 
      $args = $fields->format_value($args, 'options', 'items');
      break;
    
    case 'file-upload':
      $args = $fields->format_value($args, 'allowed_types', 'allowedTypes');
      $args = $fields->format_value($args, 'max_upload', 'maxUpload');
      break;
      
    case 'repeater-list':
    case 'repeater-table':

      if( empty($args['value']) ) $args['value'] = '[]';

      $args['fields'] = array_map(function($args) use($fields) {
        return $fields->format_args( 
          $args['name'] ?? '',
          $args,
          false
        );
      }, $args['fields'] ?? []);

      break;
  }

  if( isset($args['value']) && $args['value'] === false ) {
    $args['value'] = '';
  }

  return $args;
};

$fields->format_value = function(
  array $args,
  string $old_name,
  string $new_name
) use($fields) : array {
  
  if( ! isset($args[ $old_name ]) ) return $args;
  
  $args[$new_name] = $args[$old_name];
   
  unset($args[$old_name]);

  return $args;
};
