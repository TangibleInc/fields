<?php

defined('ABSPATH') or die();

$fields->render_field = function(
  string $name, 
  array $args
) use($fields) : string {

  $args = $fields->format_args( $name, $args );

  $fields->enqueue_field( $name, $args );

  return '<div id="' . $args['element'] . '" ></div>';
};

