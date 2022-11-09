<?php

defined('ABSPATH') or die();

$fields->render_field = function(string $name, array $args) use($fields) {

  $args = $fields->format_args( $name, $args );

  $fields->enqueue_field( $name, $args );

  return '<span id="' . $args['element'] . '" ></span>';
};

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
) use($fields) {

  $type = $args['type'] ?? '';
  
  if( $element ) {  
    $args['element'] = uniqid( 'tangible-field-' . $name .'-' );
  }

  switch($type) {

    case 'number':
      if( isset($args['min']) ) {
        $args['minValue'] = $args['min'];
        unset($args['min']);
      }
      if( isset($args['max']) ) {
        $args['maxValue'] = $args['max'];
        unset($args['max']);
      }
      break;

    case 'combo-box':
    case 'select':
    case 'text-suggestion':
      if( isset($args['options']) ) {
        $args['items'] = $args['options'];
        unset($args['options']);
      }
      break; 

    case 'repeater-table':
      $args['fields'] = array_map(function($args) use($fields) {
        return $fields->format_args( 
          $args['name'] ?? '',
          $args,
          false
        );
      }, $args['fields'] ?? []);
      break;
  }

  return $args;
};

/**
 * Temporary function
 * 
 * Allows to test direct conversion form block <Contorl /> to react field
 */
$fields->render_control_template = function(string $template) use($fields) {

  if( ! function_exists('tangible_blocks') ) return '';  

  $blocks = tangible_blocks();
  $template_system = tangible_template_system();
  $html = $template_system->html;

  $html->render('<Map _current>' . $template . '</Map>', [
    'local_tags' => &$blocks->block_controls_template_tags
  ]);

  $controls = $html->get_map('_current');
  $html = [];

  if( empty($controls['controls']) ) return $html;

  foreach( $controls['controls'] as $control ) {

    $name = $control['name'] ?? false;
    
    if( empty($name) ) continue;

    unset($control['name']);

    $html[ $name ] = $fields->render_field( $name, $control );
  }
  
  return $html;
};

