<?php

defined('ABSPATH') or die();

$fields->dynamic_values = [];
$fields->dynamic_values_categories = [];

/**
 * TODO: pass to JS to be sure to use the same regex everywhere
 */
$fields->dynamic_value_regex = '/\[\[([A-Za-zÀ-ú0-9_\- ]+(?!\[)[^\[\]]*)\]\]/';

require_once __DIR__ . '/enqueue.php';
require_once __DIR__ . '/permissions.php';
require_once __DIR__ . '/register.php';
require_once __DIR__ . '/render.php';
require_once __DIR__ . '/categories/index.php';
