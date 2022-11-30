<?php

defined('ABSPATH') or die();

/**
 * Store the $args of every registered field
 * 
 * It will be passed to JS in order to init our react fields
 */
$fields->enqueued_fields = [];

$fields->enqueue_field = function(string $name, array $args) use($fields) {

  $fields->enqueued_fields[ $name ] = $args;

  wp_enqueue_style( 
    'tangible-fields', 
    plugins_url( '/assets', __FILE__ ) . '/build/index.min.css', 
    [], 
    $fields->module->version 
  );

};

$fields->maybe_enqueue_scripts = function() use($fields) {

  if( empty($fields->enqueued_fields) ) return;

  wp_enqueue_script( 
    'tangible-fields', 
    plugins_url( '/assets', __FILE__ ) . '/build/index.min.js', 
    [ 'wp-element' ], 
    $fields->module->version, 
    true 
  );

  $data = [
    'fields' => $fields->enqueued_fields,
    'api'    => [
      'nonce'    => wp_create_nonce( 'wp_rest' ),
      'endpoint' => [
        'media' => esc_url_raw( rest_url( '/wp/v2/media/' ) ),
      ],
    ],
    'mimetypes' => get_allowed_mime_types()
  ];

  wp_localize_script( 'tangible-fields', 'TangibleFields', $data );
  
};

add_action( 'wp_footer', $fields->maybe_enqueue_scripts );
add_action( 'admin_footer', $fields->maybe_enqueue_scripts );
