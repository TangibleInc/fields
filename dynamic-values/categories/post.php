<?php

defined('ABSPATH') or die();

$fields->register_dynamic_value_category('post', [
  'label' => __( 'Post', 'tangible-fields' ),
]);

$fields->register_dynamic_value([
  'category' => 'post',
  'name'     => 'post_id',
  'label'    => 'Post ID',
  'type'     => 'text',
  'callback' => function() {
    return get_the_ID();
  }
]);

$fields->register_dynamic_value([
  'category'   => 'post',
  'name'       => 'post_meta',
  'label'      => 'Post meta',
  'type'       => 'text',
  'callback'   => function($settings) {
    
    $source = $settings['source'] ?? 'current';
    $meta_name = $settings['meta_name'] ?? '';
    
    $post_id = (int) (
      $source === 'current'
        ? get_the_ID()
        : $settings['post_id'] ?? 0
    );
     
    return get_post_meta( $post_id, $meta_name, true );
  },
  'fields'   => [
    [
      'type'    => 'select',
      'name'    => 'source',
      'label'   => 'Source',
      'choices' => [
        'current' => 'Current post',
        'select'  => 'Select post'
      ]
    ],
    [
      'type'    => 'combo_box',
      'name'    => 'post_id',
      'label'   => 'Select post',
      // Async list - Avoid issue if too much post
      'is_async'   => true,
      'search_url' => get_rest_url( null, 'wp/v2/search' ),
      'async_args' => [ 'subtype' => 'post' ],
      'condition' => [
        'action'    => 'show',
        'condition' => [
          'source' => [ '_eq' => 'select' ],
        ]
      ]
    ],
    [
      'type'    => 'text',
      'name'    => 'meta_name',
      'label'   => 'Meta name'
    ]
  ]
]);
