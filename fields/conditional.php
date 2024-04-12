<?php

defined('ABSPATH') or die();

/**
 * Evaluates a conditional field.
 */
$fields->evaluate_conditional = function(
  array $conditional
) use ($fields) {

  $result_or = false;
  foreach ($conditional as $key => $conditions) {
    $result_and = true;
    foreach ($conditions->data as $key => $condition) {
      if ( isset($condition->left_value) && isset($condition->operator) && isset($condition->right_value) ) {
        $result_and = $fields->evaluate_condition([
          $condition->left_value => [
            $condition->operator => $condition->right_value
          ]
        ]) && $result_and;
      }
    }
    $result_or = $result_or || $result_and;
  }

  return $result_or;
};

$fields->condition_has_dynamic_value = function($value) use($fields) : bool {
  return ! is_object($value) 
      && ! is_array($value) 
      && preg_match( $fields->dynamic_value_regex, (string) $value );
};

/**
 * See Conditions_TestCase::_test_fields_evaluate_condition_data for examples.
 */
$fields->evaluate_condition = function(
  array $condition
) use ( $fields ) : bool {
  $part_results = [];

  if ( ( empty( $condition ) ) || ( count( $condition ) === 1 && empty($condition[0]) ) ) {
    return true;
  }

  foreach ( $condition as $lho => $_parts ) {
    if ( $fields->condition_has_dynamic_value($lho) ) {
      $lho = $fields->render_value($lho, [ 'action' => 'evaluate' ]);
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
      if ( $fields->condition_has_dynamic_value($rho) ) {
        $rho = $fields->render_value($rho, [ 'action' => 'evaluate' ]);
      }
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
        case '_in':
          $part_results []= in_array( $lho, $rho );
          break;
        case '_nin':
          $part_results []= !in_array( $lho, $rho );
          break;
        case '_contains':
          $part_results []= mb_strpos( $lho, $rho ) !== false;
          break;
        case '_ncontains':
          $part_results []= mb_strpos( $lho, $rho ) === false;
          break;
        case '_re':
          $part_results []= preg_match( $rho, $lho ) > 0;
          break;
        default:
          $part_results []= false;
      }
    }
  }

  return ( ! empty ( $part_results ) ) && ( count( $part_results ) === count( array_filter( $part_results ) ) );
};
