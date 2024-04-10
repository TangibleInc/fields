<?php

defined('ABSPATH') or die();

$fields->dynamic_values = [];
$fields->dynamic_values_categories = [];

/**
 * \[\[ .... \]\]/  => Start and end with [[ ]]
 * (...+\]?)        => Capture the string inside [[ and ]] (will add a second match without prefix/suffix), 
 *                     '+' makes sure we apply the rules to every characters and not for a single one
 *                     '\]?' allow the last character to be ], which  is needed to support caes like [[value::param=[]]]
 * (?:...)          => Define a non-capturing group that will contains the rules we will apply to each character (?) 
 * (?!\]\]).        => (?!...) is a negative lookahead that makes sure there is not another ]] inside the content
 *                     '.' allow every characters (as long as it's allowed by the negative lookahead)
 *                     [[, [, and ] are still allowed inside the string
 */
$fields->dynamic_value_regex = '/\[\[((?:(?!\]\]).)+\]?)\]\]/';

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/enqueue.php';
require_once __DIR__ . '/permissions.php';
require_once __DIR__ . '/register.php';
require_once __DIR__ . '/render.php';
require_once __DIR__ . '/utils.php';
require_once __DIR__ . '/categories/index.php';
