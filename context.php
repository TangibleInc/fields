<?php

defined('ABSPATH') or die();

$fields->current_context = 'default';
$fields->enqueued_contexts = [];
$fields->contexts = [
  'default',
  'wp',
  'elementor',
  'beaver-builder'
];

$fields->set_context = function(string $context) use($fields) {

  if( ! in_array($context, $fields->contexts) ) return;
  
  $fields->current_context = $context; 

  if( in_array($context, $fields->enqueued_contexts) ) return;

  $fields->enqueued_contexts []= $context; 
};

/**
 * By default, assume we want to use the wp context inside the
 * wordpress admin
 */
add_action( 'admin_init', function() use( $fields ) {
  $fields->set_context( 'wp' );
}, 1 );
