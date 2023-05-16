<?php

defined('ABSPATH') or die();

/**
 * This part is not usable, just here to simulate real dynamic values on the frontend
 */

$fields->dynamic_values = [];

$fields->register_dynamic_value = function(array $dynamic_value) use($fields) {
  
  $name = $dynamic_value['name'] ?? false;

  if( empty($name) ) return;

  $dynamic_value['settings'] = array_map(function($args) use($fields) {
    return $fields->format_args( 
      $args['name'] ?? '',
      $args,
      false
    );
  }, $dynamic_value['settings'] ?? []);

  $fields->dynamic_values[ $name ] = $dynamic_value;
};

$fields->register_dynamic_value([
  'name'     => 'post_parent',
  'label'    => 'Post parent',
  'type'     => 'text',
  'callback' => null,
  'settings' => [
    [
      'type'    => 'select',
      'name'    => 'display',
      'label'   => 'Display',
      'choices' => [
        'id'      => 'ID',
        'url'     => 'URL',
        'title'   => 'Title',
        'content' => 'Content'
      ],
    ],
    [
      'type'    => 'dimensions',
      'name'    => 'dimensions',
      'label'   => 'Dimensions',
    ],
  ],
  'conditions' => [],
]);

$fields->register_dynamic_value([
  'name'       => 'post_id',
  'label'      => 'Post ID',
  'type'       => 'text',
  'type'       => 'text',
  'callback'   => null,
  'settings'   => [],
  'conditions' => [],
]);

$fields->register_dynamic_value([
  'name'       => 'post_color',
  'label'      => 'Post color',
  'type'       => 'color',
  'callback'   => null,
  'settings'   => [],
  'conditions' => [],
]);

$fields->register_dynamic_value([
  'name'       => 'post_date',
  'label'      => 'Post date',
  'type'       => 'date',
  'callback'   => null,
  'settings'   => [],
  'conditions' => [],
]);
