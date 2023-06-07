<?php

defined('ABSPATH') or die();

/**
 * Return data needed by the frontend
 * 
 * @see ../enqueue.php
 */
$fields->get_dynamic_value_data = function() use($fields) : array {
  return [
    'values'     => $fields->dynamic_values,
    'categories' => array_map(
      function($category) : array {
        return [
         'label'  => $category['label'],
         'name'   => $category['name'],
         'values' => $category['values'] ?? [],
        ];
      },
      $fields->dynamic_values_categories
    )
  ];
};
