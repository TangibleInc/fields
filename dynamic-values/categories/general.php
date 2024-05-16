<?php

defined('ABSPATH') or die();

$fields->register_dynamic_value_category('general', [
  'label' => __( 'General', 'tangible-fields' ),
]);

$fields->register_dynamic_value([
  'category'    => 'general',
  'name'        => 'date',
  'label'       => 'Date',
  'type'        => 'text',
  'description' => 'Return a given post meta for a the current or a selected post',
  'callback'    => function($settings, $config) use ($fields) {

    $date_type = in_array($settings['date_type'], ['now', 'custom']) 
      ? $settings['date_type']
      : 'now';

    if ( $date_type === 'now' ) $date = tangible\date()->now();
    else {
      /**
       * As the custom date will set by the user from the UI, we assume
       * that it uses site timezone and not UTC
       */
      $date = tangible\date( 
        $settings['custom_date_picker'] ?? 'now',
        wp_timezone_string()
      );
    }

    /**
     * We need this filter because other plugin adds custom values
     * for $settings['date_type']
     */
    $date = apply_filters('tangible_fields_dynamic_value_general_date', $date, $settings, $config);

    if ( ! in_array( $settings['delay'], ['after', 'before'] ) ) {
      return $fields->dynamic_values_date_helper['render']($date->timestamp, $settings);
    }

    /**
     * Should we move the delay logic into the helper?
     */

    $delay_number = (int) ($settings['delay_number'] ?? 0);
    $delay_type = in_array($settings['delay_type'], [ 'minute', 'hour', 'day', 'week', 'month', 'year' ]) 
      ? $settings['delay_type']
      : false;

    if ( empty($delay_number) || empty($delay_type) ) {
      return $fields->dynamic_values_date_helper['render']($date->timestamp, $settings);
    }

    if( $settings['delay'] === 'after' )  $date->add( $delay_type, $delay_number );
    if( $settings['delay'] === 'before' ) $date->sub( $delay_type, $delay_number );

    return $fields->dynamic_values_date_helper['render']($date->timestamp, $settings);
  },
  'fields'  => [
    [
      'name'    => 'date_type',
      'type'    => 'select',
      'label'   => 'Date type',
      'choices' => [ 
        'now'    => 'Now',
        'custom' => 'Custom'
      ]
    ],
    [
      'name'      => 'custom_date_picker',
      'type'      => 'date_picker',
      'label'     => 'Custom date',
      'condition' => [
          'action'    => 'show',
          'condition' => [
            'date_type' => [ '_eq' => 'custom' ]
          ]
      ]
    ],
    [
      'name'    => 'delay',
      'type'    => 'select',
      'label'   => 'Delay',
      'choices' => [
        'none'    => 'None',
        'after'   => 'After',
        'before'  => 'Before'
      ]
    ],
    [
      'name'      => 'delay_number',
      'type'      => 'number',
      'label'     => 'Number',
      'min'       => 0,
      'condition' => [
        'action'    => 'show',
        'condition' => [
          '_or' => [
            [ 'delay'   => [ '_eq'  => 'after' ] ],
            [ 'delay'   => [ '_eq'  => 'before' ] ]
          ]
        ]
      ]
    ],
    [
      'name'      => 'delay_type',
      'type'      => 'select',
      'label'     => 'Type',
      'choices'   => [
        'minute'    => 'Minute',
        'hour'      => 'Hour',
        'day'       => 'Day',
        'week'      => 'Week',
        'month'     => 'Month',
        'year'      => 'Year'
      ],
      'condition' => [
        'action'    => 'show',
        'condition' => [
          '_or'   => [
            [ 'delay'   => [ '_eq'  => 'after' ] ],
            [ 'delay'   => [ '_eq'  => 'before' ] ]
          ]
        ]
      ]
    ],
    ...$fields->dynamic_values_date_helper['settings']
  ],
  'permission_callback' => '__return_true'
]);
