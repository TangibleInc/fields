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

  // To be compatible with ACF, instructions can be used as an alias of description
  if( ! empty($args['instructions']) ) {
    $args['description'] = $args['instructions'];
  }
  
  switch($type) {

    // We use kebab-case for control types in js
    
    case 'alignment_matrix': 
      $args['type'] = 'alignment-matrix';
      break;

    case 'border': 
      $args = $fields->format_value($args, 'enable_opacity', 'hasAlpha');
      break;
      
    case 'button_group':
      $args['type'] = 'button-group';
      break;

    case 'color_picker':
      $args['type'] = 'color-picker';
      $args = $fields->format_value($args, 'enable_opacity', 'hasAlpha');
      break;
    
    case 'date_picker':
      $args['type'] = 'date-picker';
      $args = $fields->format_value($args, 'future_only', 'futureOnly');
      break;

    case 'number':
      $args = $fields->format_value($args, 'min', 'minValue');
      $args = $fields->format_value($args, 'max', 'maxValue');
      break;

    case 'simple_dimension':
      $args['type'] = 'simple-dimension';
      break;

    case 'wysiwyg':
      wp_enqueue_editor();
      break;
    
    case 'gallery':
      add_action( 'admin_enqueue_scripts', $fields->enqueue_wp_media );
      break;
      
    case 'combo_box':
    case 'text_suggestion':
      // We use kebab-case for control types in js
      $args['type'] = $type === 'combo_box' ? 'combo-box' : 'text-suggestion';
      $args = $fields->format_value($args, 'is_async', 'isAsync');
      $args = $fields->format_value($args, 'async_args', 'asyncArgs');
      $args = $fields->format_value($args, 'search_url', 'searchUrl');
      $args = $fields->format_value($args, 'ajax_action', 'ajaxAction');
      break;
    
    case 'file':
      if( isset( $args['wp_media'] ) && $args['wp_media'] )  add_action( 'admin_enqueue_scripts', $fields->enqueue_wp_media );
      $args = $fields->format_value($args, 'mime_types', 'mimeTypes');
      $args = $fields->format_value($args, 'max_upload', 'maxUpload');
      break;
    
    case 'repeater':
      if( empty($args['value']) ) $args['value'] = '';
      $args = $fields->format_groups($type, $args);
      break;
    
    case 'field_group':
      $args['type'] = 'field-group';
      $args = $fields->format_groups($type, $args);
      break;

    case 'accordion':
      $args = $fields->format_groups($type, $args);
      $args = $fields->format_value($args, 'use_switch', 'useSwitch');
      break;

    case 'switch':
      $args = $fields->format_value($args, 'value_on', 'valueOn');
      $args = $fields->format_value($args, 'value_off', 'valueOff');        
      break;
  }

  if( isset($args['value']) && $args['value'] === false ) {
    $args['value'] = '';
  }

  return $args;
};

/**
 * Common format for fields that implement subfields
 */
$fields->format_groups = function(string $type, array $args) use($fields) : array {

  // Title can be an alias of label (to be compatible with ACF)
  if( ! empty($args['title']) ) $args['label'] = $args['title']; 
  
  // Alias to be compatible with ACF
  $args = $fields->format_value($args, 'sub_fields', 'fields'); 

  $args['fields'] = array_map(function($args) use($fields) {
    return $fields->format_args( 
      $args['name'] ?? '',
      $args,
      false
    );
  }, $args['fields'] ?? []);

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
