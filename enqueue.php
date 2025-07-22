<?php
use tangible\framework;

defined('ABSPATH') or die();

/**
 * Store the $args of every registered field
 *
 * It will be passed to JS in order to init our react fields
 */
$fields->enqueued = [
  'fields'   => [],
  'elements' => []
];

$fields->is_enqueued = false;

$fields->enqueue_item = function(
  string $name,
  string $type,
  array $args
) use($fields) : void {

  $args['context'] = $fields->current_context;

  /**
   * An element can be rendered multiple times as it does not
   * contain a value
   */
  if( $type === 'elements' ) {
    $fields->enqueued[ $type ][ $name ] []= $args;
  }
  else $fields->enqueued[ $type ][ $name ] = $args;
};

$fields->enqueue = function(array $config = []) use($fields) {

  if( ! empty($config['context']) && is_array($config['context']) ) {
    $fields->enqueued_contexts = [
      ...$fields->enqueued_contexts,
      ...$config['context']
    ];
  }

  $contexts = ! empty($fields->enqueued_contexts)
    ? $fields->enqueued_contexts
    : ['default'];

  foreach( $contexts as $context ) {

    wp_enqueue_style(
      'tangible-fields-' . $context,
      framework\module_url( '/assets', __FILE__ ) . '/build/' . $context . '/index.min.css',
      [],
      $fields->version
    );
  }

  wp_enqueue_script(
    'tangible-fields',
    framework\module_url( '/assets', __FILE__ ) . '/build/index.min.js',
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
    'fields'    => $fields->enqueued['fields'],
    'elements'  => $fields->enqueued['elements'],
    'dynamics'  => $fields->get_dynamic_value_data(),
    'mimetypes' => get_allowed_mime_types()
  ];

  wp_add_inline_script( 'tangible-fields', 'var TangibleFieldsConfig = ' . json_encode($data) . ';', 'before' );

  $fields->is_enqueued = true;
};

$fields->maybe_enqueue_scripts = function() use($fields) : void {

  $has_registrations = empty($fields->enqueued['fields']) && empty($fields->enqueued['elements']);

  if( $has_registrations || $fields->is_enqueued ) {
    return;
  }

  $fields->enqueue();
};

add_action( 'wp_footer', $fields->maybe_enqueue_scripts );
add_action( 'admin_footer', $fields->maybe_enqueue_scripts );
add_action( 'login_footer', $fields->maybe_enqueue_scripts );
