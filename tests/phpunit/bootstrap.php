<?php

if (!$_WORDPRESS_DEVELOP_DIR = getenv('WORDPRESS_DEVELOP_DIR')) {
	$_WORDPRESS_DEVELOP_DIR = __DIR__ . '/../../wordpress-develop/';
}
$_PLUGIN_ENTRYPOINT = __DIR__ . '/../../plugin.php';

require_once $_WORDPRESS_DEVELOP_DIR . '/tests/phpunit/includes/functions.php';

tests_add_filter('muplugins_loaded', function() use ($_PLUGIN_ENTRYPOINT) {
	require $_PLUGIN_ENTRYPOINT;
});

require $_WORDPRESS_DEVELOP_DIR . '/tests/phpunit/includes/bootstrap.php';
