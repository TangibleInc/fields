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
    case 'button_group':
      $args['type'] = 'button-group';
      break;

    case 'number':
      $args = $fields->format_value($args, 'min', 'minValue');
      $args = $fields->format_value($args, 'max', 'maxValue');
      break;

    case 'wysiwyg':
      wp_enqueue_editor();
      break;

    case 'combo_box':
    case 'text_suggestion':
      // We use kebab-case for control types in js
      $args['type'] = $type === 'combo_box' ? 'combo-box' : 'text-suggestion';
      $args = $fields->format_value($args, 'is_async', 'isAsync');
      $args = $fields->format_value($args, 'async_args', 'asyncArgs');
      $args = $fields->format_value($args, 'search_url', 'searchUrl');
      $args = $fields->format_value($args, 'ajax_action', 'ajaxAction');
      // Fall through
    case 'select':  
      $args = $fields->convert_legacy_options($args);
      break;
    
    case 'file':
      $args = $fields->format_value($args, 'mime_types', 'mimeTypes');
      $args = $fields->format_value($args, 'max_upload', 'maxUpload');
      break;
      
    // Legacy: Only one repeater control with different layout now  
    case 'repeater-list':
    case 'repeater-table':
      $args['type'] = 'repeater';
      $args['layout'] = $type === 'repeater-list' ? 'block' : 'table';
      // Fall through
    case 'repeater':
      if( empty($args['value']) ) $args['value'] = '[]';
      $args = $fields->format_value($args, 'sub_fields', 'fields');
    case 'field_group':

      // We use kebab-case for control types in js
      $args['type'] = $type === 'field_group' ? 'field-group' : $args['type'];
      
      // Title can be an alias of label (to be compatible with ACF)
      if( ! empty($args['title']) ) $args['label'] = $args['title'];
      
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

/**
 * Legacy: Structure and naming has changes to be compatible with ACF, this function
 * convert the old structure into the new one (Temporary functions, will disapear soon)
 */
$fields->convert_legacy_options = function(array $args) use($fields): array {

  $has_legacy_options = isset($args['options']) || isset($args['items']);

  if( ! $has_legacy_options || ! empty($args['choices']) ) {
    return $args;
  }
  
  $choices = $args['options'] ?? $args['items'];
  
  unset($args['options']);
  unset($args['items']);
  
  $has_categories = array_reduce(
    $choices ?? [],
    function($has_categories, $choice) {
      return $has_categories || isset($choice['children']);
    },
    false
  );
  
  if( $has_categories ) {
    $args['choices'] = array_map(
      function($category) {

        foreach( $category['children'] as $choice ) {
          $category['choices'][ $choice['id'] ] = $choice['name'];
        }

        unset($category['children']);

        return $category;
      },
      $choices
    );
  }
  else {
    foreach( $choices as $choice ) {
      $args['choices'][ $choice['id'] ] = $choice['name'];
    }
  }

  return $args;
};
