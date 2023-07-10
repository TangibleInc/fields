<?php

defined('ABSPATH') or die();

/**
 * Store the $args of every registered field
 * 
 * It will be passed to JS in order to init our react fields
 */
$fields->enqueued_fields = [];

$fields->is_enqueued = false;

$fields->enqueue_field = function(
  string $name, 
  array $args
) use($fields) : void {
  
  $args['context'] = $fields->current_context;
  
  $fields->enqueued_fields[ $name ] = $args;
};

$fields->enqueue = function() use($fields) {

  $contexts = ! empty($fields->enqueued_contexts) 
    ? $fields->enqueued_contexts 
    : ['default'];
  
  foreach( $contexts as $context ) {

    wp_enqueue_style( 
      'tangible-fields-' . $context, 
      plugins_url( '/assets', __FILE__ ) . '/build/' . $context . '/index.min.css', 
      [], 
      $fields->version 
    );

  }

  wp_enqueue_script( 
    'tangible-fields', 
    plugins_url( '/assets', __FILE__ ) . '/build/index.min.js', 
    [ 'wp-element' ], 
    $fields->version, 
    true 
  );

  $data = [
    'api' => [
      'nonce' => wp_create_nonce( 'wp_rest' ),
      'endpoint' => [
        'media' => esc_url_raw( rest_url( '/wp/v2/media/' ) ),
      ],
    ],
    'fields'    => $fields->enqueued_fields,
    'dependents'=> $fields->get_dependent_contexts($fields->enqueued_fields),
    'dynamics'  => $fields->get_dynamic_value_data(),
    'mimetypes' => get_allowed_mime_types()
  ];

  wp_add_inline_script( 'tangible-fields', 'var TangibleFields = ' . json_encode($data) . ';', 'before' );

  $fields->is_enqueued = true;
};

$fields->maybe_enqueue_scripts = function() use($fields) : void {

  if( empty($fields->enqueued_fields) || $fields->is_enqueued ) {
    return;
  } 

  $fields->enqueue();
};

add_action( 'wp_footer', $fields->maybe_enqueue_scripts );
add_action( 'admin_footer', $fields->maybe_enqueue_scripts );
