<?php
// @todo Move to fields/conditional.php

defined('ABSPATH') or die();

/**
 * Evaluates a conditional field.
 */
$fields->evaluate_conditional = function() {
  // Calls evaluate_condition on the field value
};

/**
 * See Conditions_TestCase::_test_fields_evaluate_condition_data for examples.
 */
$fields->evaluate_condition = function(
  array $condition
) use ( $fields ) : bool {
  $part_results = [];

  if ( empty( $condition ) ) {
    return true;
  }

  foreach ( $condition as $lho => $_parts ) {
    if ( preg_match( '#^\[\[.+?\]\]$#', $lho ) ) {
      // @todo Evaluate dynamic fields when we have them.
    }

    // Relations.
    if ( in_array( $lho, [ '_and', '_or' ], true ) ) {
      $_part_results = [];

      foreach ( $_parts as $_lho => $_part ) {
        $_part_results[] = $fields->evaluate_condition( [ $_lho => $_part ] );
      }

      switch ( $lho ) {
        case '_or': 
          $part_results[] = ( ! empty ( $_part_results ) ) && ( ! empty( array_filter( $_part_results ) ) );
          break;
        case '_and':
          $part_results[] = ( ! empty( $_part_results ) ) && ( count( $_part_results ) === count( array_filter( $_part_results ) ) );
          break;
      }
      continue;
    }

    // Comparison.
    foreach ( $_parts as $op => $rho ) {
      switch ( $op ) {
        case '_eq':
          $part_results []= $lho == $rho;
          break;
        case '_neq':
          $part_results []= $lho != $rho;
          break;
        case '_lt':
          $part_results []= $lho < $rho;
          break;
        case '_gt':
          $part_results []= $lho > $rho;
          break;
        case '_lte':
          $part_results []= $lho <= $rho;
          break;
        case '_gte':
          $part_results []= $lho >= $rho;
          break;
        default:
          $part_results []= false;
      }
    }
  }

  return ( ! empty ( $part_results ) ) && ( count( $part_results ) === count( array_filter( $part_results ) ) );
};

/**
 * Renders a conditional fieldset.
 */
$fields->_render_callback_default_conditional_field = function( $args, $field ) {
  // @todo Nicolas, please output the HTML placeholders as required
  // @todo Nicolas, also complete the test in cases/fields.php test_fields_render_callback_conditional_fields_default
};
