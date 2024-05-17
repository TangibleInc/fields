<?php

defined('ABSPATH') or die();

/**
 * Helper to handle and evaluate date in dynamic value forms
 */
$fields->dynamic_values_date_helper = [
  'settings' => [
    [
      'type'    => 'select',
      'name'    => 'date_format',
      'label'   => 'Date format',
      'choices' => [
        'default' => 'Site format',
        'custom'  => 'Custom format'
      ]
    ],
    [
      'type'      => 'text',
      'name'      => 'custom_date_format',
      'label'     => 'Custom date format',
      'condition' => [
        'action'    => 'show',
        'condition' => [
          'date_format' => [ '_eq' => 'custom' ]
        ]        
      ]
    ],
    [
      'type'    => 'select',
      'name'    => 'date_timezone',
      'label'   => 'Date timezone',
      'choices' => [
        'default' => 'Site timezone',
        'utc'     => 'UTC'
      ]
    ]
  ],
  'render' => function(int $timestamp, array $settings) {

    if( empty($timestamp) ) return '';

    // @see https://github.com/TangibleInc/framework/tree/main/date
    $date = tangible\date()
      ->fromTimestamp($timestamp)
      ->setTimezone(
        $settings['date_timezone'] !== 'utc' 
          ? wp_timezone_string()
          : 'utc'
      );

    $format = $settings['date_format'] === 'custom' 
      ? $settings['custom_date_format'] 
      : get_option('date_format') . ' ' . get_option('time_format');

    return $date->format($format);
  }
];
