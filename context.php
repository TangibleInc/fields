<?php

defined('ABSPATH') or die();

$fields->current_context = 'default';
$fields->enqueued_contexts = [];
$fields->contexts = [
  'default'
];

$fields->set_context = function(string $context) use($fields) {

  if( ! in_array($context, $fields->contexts) ) return;
  
  $fields->current_context = 'default'; 

  if( in_array($context, $fields->enqueued_contexts) ) return;

  $fields->enqueued_contexts []= $context; 
};
