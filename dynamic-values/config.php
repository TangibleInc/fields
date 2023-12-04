<?php 

defined('ABSPATH') or die();

/**
 * Use by default if no config passed in $fields->render_value(), otherwise merged with passed $config
 */
$fields->get_dynamic_value_default_config = function() : array {
  return [
    'context' =>[
      'current_user_id' => get_current_user_id(),
      'current_post_id' => get_the_ID()
    ]
  ];
};

$fields->get_dynamic_value_config = function(array $config = []) use($fields) : array {
  $default_config = $fields->get_dynamic_value_default_config();
  return [
    'context' => array_merge($default_config['context'], $config['context'] ?? [])
  ];
};
