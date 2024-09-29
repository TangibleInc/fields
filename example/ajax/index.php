<?php

defined('ABSPATH') or die();

use tangible\ajax;

/**
 * Test action copied from tangible-blocks, just added it so that we have an 
 * example of ajax action from our module to use
 * 
 * @see https://bitbucket.org/tangibleinc/blocks/src/main/includes/block/controls/aliases/post-select.php
 */

ajax\enqueue();

ajax\add_action('tangible_field_select_post', function($data, $ajax) use($plugin) {
  
  /**
   * Here, we should check that the current user has the right to edit in the current builder 
   * before returning anything
   * 
   * We would need an helper to evaluate this, according to the current builder
   */

  global $wpdb;

  $post_title = $data['search'];

  $limit = (int) ( $data['result_length'] ?? 10 );
  $post_type = explode(',', $data['post_type'] ?? 'post');

  $order = $data['result_order'] ?? 'ASC';
  if( ! in_array($order, ['ASC', 'DESC']) ) $order = 'ASC';

  /**
   * @see https://wordpress.stackexchange.com/a/8847/190549
   */
  $results = $wpdb->get_results(
    $wpdb->prepare(
      "SELECT * FROM {$wpdb->posts}
      WHERE (`post_title` LIKE %s)
      AND `post_type` IN ({$plugin->prepare_sql_in_statement($post_type)})
      ORDER BY `post_title` {$order}
      LIMIT %d",
      '%' . $wpdb->esc_like($post_title) . '%',
      $limit
    )
  );

  $response = array_map(function($post) {
    return [ 'id' => $post->ID, 'title' => $post->post_title ];
  }, $results);

  return $response;
});

$plugin->prepare_sql_in_statement = function($array) {

  global $wpdb;

  $escaped = [];
  foreach($array as $value) {
    $escaped[] = $wpdb->prepare('%s', $value);
  }

  return implode(',', $escaped);
};
