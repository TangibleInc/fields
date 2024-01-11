<?php

defined('ABSPATH') or die();

/**
 * For each control type, convert $args to props expected the react component 
 * associated
 * 
 * @see ./assets/src/types.js
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
      $args = $fields->format_value($args, 'read_only', 'isDisabled');
      break;

    case 'color_picker':
      $args['type'] = 'color-picker';
      $args = $fields->format_value($args, 'enable_opacity', 'hasAlpha');
      $args = $fields->format_dynamic_types($args, 'replace', ['color']);
      break;

    case 'conditional_panel':
      $args['type'] = 'conditional-panel';
      $args = $fields->format_value($args, 'use_modal', 'useModal');
      break;
    
    case 'date_picker':
      $args['type'] = 'date-picker';
      $args = $fields->format_value($args, 'future_only', 'futureOnly');
      $args = $fields->format_dynamic_types($args, 'replace', ['date']);
      break;

    case 'number':
      $args['value'] = !empty( $args['value'] ) ? $args['value'] : $args['min'] ?? 0;
      $args = $fields->format_value($args, 'min', 'minValue');
      $args = $fields->format_value($args, 'max', 'maxValue');
      $args = $fields->format_dynamic_types($args, 'replace', ['number']);
      break;

    case 'simple_dimension':
      $args['type'] = 'simple-dimension';
      break;

    case 'wysiwyg':
      if( isset($args['editor']) && $args['editor'] === 'tinymce' ) wp_enqueue_editor();
      break;
    
    case 'gallery':
      wp_enqueue_media();
      break;
      
    case 'combo_box':
    case 'text_suggestion':
      // We use kebab-case for control types in js
      $args['type'] = $type === 'combo_box' ? 'combo-box' : 'text-suggestion';
      $args = $fields->format_value($args, 'is_async', 'isAsync');
      $args = $fields->format_value($args, 'map_results', 'mapResults');
      $args = $fields->format_value($args, 'async_args', 'asyncArgs');
      $args = $fields->format_value($args, 'search_url', 'searchUrl');
      $args = $fields->format_value($args, 'ajax_action', 'ajaxAction');
      break;
    
    case 'file':
      if( !isset( $args['wp_media'] ) || $args['wp_media'] ) wp_enqueue_media();
      $args = $fields->format_value($args, 'mime_types', 'mimeTypes');
      $args = $fields->format_value($args, 'max_upload', 'maxUpload');
      break;
    
    case 'repeater':
      if( empty($args['value']) ) $args['value'] = '';
      $args = $fields->format_groups($type, $args);
      $args = $fields->format_value($args, 'use_switch', 'useSwitch');
      $args = $fields->format_value($args, 'use_bulk', 'useBulk');
      $args = $fields->format_value($args, 'section_title', 'sectionTitle');
      break;
    
    case 'field_group':
      $args['type'] = 'field-group';
      $args = $fields->format_groups($type, $args);
      break;

    case 'accordion':
      $args = $fields->format_groups($type, $args);
      $args = $fields->format_value($args, 'use_switch', 'useSwitch');
      break;

    case 'select':
      $args = $fields->format_value($args, 'read_only', 'isDisabled');
      break;

    case 'switch':
      $args = $fields->format_value($args, 'value_on', 'valueOn');
      $args = $fields->format_value($args, 'value_off', 'valueOff');        
      break;

    case 'text':
      $args = $fields->format_value($args, 'read_only', 'readOnly');
      $args = $fields->format_dynamic_types($args);
      break;
  }

  if( isset($args['value']) && $args['value'] === false ) {
    $args['value'] = '';
  }

  if( ! empty($args['label_visually_hidden']) ) {
    $args = $fields->format_value($args, 'label_visually_hidden', 'labelVisuallyHidden');
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

$fields->format_dynamic_types = function(
  array $args, 
  string $default_mode = 'insert',
  array $default_types = [
    'text', 
    'date', 
    'color', 
    'number'
  ]
) : array {

  if( empty($args['dynamic']) ) {
    $args['dynamic'] = false;
    return $args;
  }

  /**
   * If dynamic value but no config, default all types + insert mode
   */
  $mode = $args['dynamic']['mode'] ?? $default_mode;
  $types = ! empty($args['dynamic']['types'])
    ? [ ...array_intersect($args['dynamic']['types'], $default_types) ]
    : $default_types;
  
  $args['dynamic'] = [
    'types' => $types,
    'mode'  => $mode
  ];

  return $args;
};
