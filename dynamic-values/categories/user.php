<?php

defined('ABSPATH') or die();

$fields->register_dynamic_value_category('user', [
  'label' => __( 'User', 'tangible-fields' ),
]);

$fields->register_dynamic_value([
  'category'    => 'user',
  'name'        => 'user_id',
  'label'       => 'User ID',
  'type'        => 'text',
  'description' => 'Return the current user ID, if any',
  'callback'    => function($settings, $config) {
    return $config['context']['current_user_id'];
  },
  'permission_callback' => '__return_true'
]);

$fields->register_dynamic_value([
  'category'    => 'user',
  'name'        => 'user_meta',
  'label'       => 'User meta',
  'type'        => 'text',
  'description' => 'Return a given user meta for the current user',
  'callback'    => function($settings, $config) {
    
    $source = $settings['source'] ?? 'current';
    $meta_name = $settings['meta_name'] ?? '';
    
    if( empty($meta_name) ) return '';

    $user_id = (int) (
      $source === 'current'
        ? $config['context']['current_user_id']
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
