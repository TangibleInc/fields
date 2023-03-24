<?php

defined('ABSPATH') or die();

/**
 * This part is not usable, just here to simulate real dynamic values on the frontend
 */

$fields->dynamic_values = [];

$fields->register_dynamic_value = function(array $dynamic_value) use($fields) {
  
  $name = $dynamic_value['name'] ?? false;

  if( empty($name) ) return;

  $fields->dynamic_values[ $name ] = $dynamic_value;
};

$fields->register_dynamic_value([
  'name' => 'post_parent',
  'label' => 'Post parent',
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
      ]
    ]
  ],
  'conditions' => [],
]);

$fields->register_dynamic_value([
  'name'       => 'post_id',
  'label'      => 'Post ID',
  'callback'   => null,
  'settings'   => [],
  'conditions' => [],
]);
