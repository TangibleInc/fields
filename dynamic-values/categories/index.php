<?php

defined('ABSPATH') or die();

add_action('init', function() use($fields) {
  require_once __DIR__ . '/post.php';
  require_once __DIR__ . '/user.php';
});
