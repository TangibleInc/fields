<?php

defined('ABSPATH') or die();

$fields->register_dynamic_value_category('user', [
  'label' => __( 'User', 'tangible-fields' ),
]);

$fields->register_dynamic_value([
  'category' => 'user',
  'name'     => 'user_id',
  'label'    => 'User ID',
  'type'     => 'text',
  'callback' => function() {
    return get_current_user_id();
  },
  'permission_callback' => '__return_true'
]);

$fields->register_dynamic_value([
  'category'   => 'user',
  'name'       => 'user_meta',
  'label'      => 'User meta',
  'type'       => 'text',
  'callback'   => function($settings) {
    
    $source = $settings['source'] ?? 'current';
    $meta_name = $settings['meta_name'] ?? '';
    
    $user_id = (int) (
      $source === 'current'
        ? get_current_user_id()
        : $settings['user_id'] ?? 0
    );

    return get_user_meta( $user_id, $meta_name, true );
  },
  'fields'   => [
    // TODO: Add async user select - For now current user only
    [
      'type'    => 'select',
      'name'    => 'source',
      'label'   => 'Source',
      'choices' => [
        'current' => 'Current user',
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
