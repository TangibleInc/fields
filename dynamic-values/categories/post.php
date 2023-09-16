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
  'callback' => function($settings, $config) {
    return $config['context']['current_post_id'];
  },
  'permission_callback' => '__return_true'
]);

$fields->register_dynamic_value([
  'category'   => 'post',
  'name'       => 'post_meta',
  'label'      => 'Post meta',
  'type'       => 'text',
  'callback'   => function($settings, $config) {
    
    $source = $settings['source'] ?? 'current';
    $meta_name = $settings['meta_name'] ?? '';
    
    $post_id = (int) (
      $source === 'current'
        ? $config['context']['current_post_id']
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
  ],
  'permission_callback_store' => function() {
    return in_array('administrator', wp_get_current_user()->roles ?? []);
  },
  'permission_callback_parse' => '__return_true'
]);
