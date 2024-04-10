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

    if ( empty($settings['date_type']) ) return '';
    if ( !empty($settings['custom_date_picker']) ) $custom_date = explode('-', $settings['custom_date_picker']);
    if ( $settings['date_type'] === 'now' ) { 
        $timestamp = time();
    } else {
        $timestamp = mktime(date('H'), date('i'), date('s'), $custom_date[1], $custom_date[2], $custom_date[0]);
    }

    if ( $settings['delay'] === 'after' || $settings['delay'] === 'before' ) {
        
        if ( !empty($settings['delay_number']) && !empty($settings['delay_type']) ) {

            $delay = $settings['delay'];
            $delay_number = $settings['delay_number'];
            $day = !isset($custom_date) ? date('d') : $custom_date[2];
            $month = !isset($custom_date) ? date('m') : $custom_date[1];
            $year = !isset($custom_date) ? date('y') : $custom_date[0];

            switch ($settings['delay_type']) {
                case 'minute':
                    $timestamp = mktime(date('H'), 
                        $delay === 'after' ? date('i') + $delay_number : date('i') - $delay_number,
                        date('s'), $month, $day, $year
                    );
                    break;

                case 'hour':
                    $timestamp = mktime($delay === 'after' ? date('H') + $delay_number : date('H') - $delay_number, 
                        date('i'), date('s'), $month, $day, $year
                    );
                    break;

                case 'day':
                    $timestamp = mktime(date('H'), 
                        date('i'), date('s'), $month, 
                        $delay === 'after' ? $day + $delay_number : $day - $delay_number
                        , $year
                    );
                    break;

                case 'week':
                    $delay_number = 7 * (int) $delay_number;
                    $timestamp = mktime(date('H'), 
                        date('i'), date('s'), $month, 
                        $delay === 'after' ? $day + $delay_number : $day - $delay_number
                        , $year
                    );
                    break;

                case 'month':
                    $timestamp = mktime(date('H'), 
                        date('i'), date('s'),
                        $delay === 'after' ? $month + $delay_number : $month - $delay_number
                        , $day, $year
                    );
                    break;

                case 'year':
                    $timestamp = mktime(date('H'), 
                        date('i'), date('s'), $month, $day,
                        $delay === 'after' ? $year + $delay_number : $year - $delay_number
                    );
                    break;

                default:
                    break;
            }
        }
    }

    return $fields->dynamic_values_date_helper['render']($timestamp, $settings);
  },
  'fields'  => [
    [
        'name'  => 'date_type',
        'type'  => 'select',
        'label' => 'Date type',
        'choices' => [
            'now'       => 'Now',
            'custom'    => 'Custom',
        ]
    ],
    [
        'name'  => 'custom_date_picker',
        'type'  => 'date_picker',
        'label' => 'Custom date',
        'condition'    => [
            'action'    => 'show',
            'condition'=> [
                'date_type' => [ '_eq' => 'custom' ]
            ]
        ]
    ],
    [
        'name'      => 'delay',
        'type'      => 'select',
        'label'     => 'Delay',
        'choices'   => [
            'none'  => 'None',
            'after' => 'After',
            'before'=> 'Before'
        ]
    ],
    [
        'name'      => 'delay_number',
        'type'      => 'number',
        'label'     => 'Number',
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
  'permission_callback_store' => function() {
    return in_array('administrator', wp_get_current_user()->roles ?? []);
  },
  'permission_callback_parse' => '__return_true'
]);
