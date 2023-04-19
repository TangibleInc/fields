<?php

defined('ABSPATH') or die();

$fields->get_condition_contexts = function(array $contexts) use($fields) : array {
	$field_conditions = [];

	foreach( $contexts as $context ) {
		if ( ! ( $context['conditions'] ?? false ) ) {
			continue;
		}
		$field_conditions[ $context['element'] ] = $context['conditions'];
	}

	return $field_conditions;
};
