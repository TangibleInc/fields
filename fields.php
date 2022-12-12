<?php

defined('ABSPATH') or die();

$fields->render_field = function(
  string $name, 
  array $args
) use($fields) : string {

  $args = $fields->format_args( $name, $args );

  $fields->enqueue_field( $name, $args );

  return '<span id="' . $args['element'] . '" ></span>';
};

/**
 * Temporary function
 * 
 * Allows to test direct conversion form block <Control /> to react field
 */
$fields->render_control_template = function(string $template) use($fields) : string {

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

