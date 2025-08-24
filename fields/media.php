<?php

defined('ABSPATH') or die();

/**
 * Enqueue WP media uploader
 * 
 * A wrapper around wp_enqueue_media() which needs to be enqueued at the
 * right time to prevent issues like missing nonce for AJAX request.
 */
$fields->enqueue_wp_media_uploader = function() {

  if (is_admin()) {

    // Admin

    // Before document head
    $action = 'admin_enqueue_scripts';

    if (doing_action($action) || did_action($action)) {
      $action = 'admin_footer'; // During and after
    }

  } else {

    // Site frontend

    // Before document head
    $action = 'wp_enqueue_scripts';

    if (doing_action($action) || did_action($action)) {
      $action = 'wp_footer'; // During and after
    }
  }

  add_action($action, 'wp_enqueue_media');
};
