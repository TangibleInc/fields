<?php

use Tangible\Fields\Tests\Render;
use Tangible\Fields\Tests\Date;

class DynamicValuesGeneralDate_TestCase extends WP_UnitTestCase {

  use Date;
  use Render;

  private string $dynamic_value_slug = 'date';
  private array $dynamic_value_default_args = [
    'date_type'          => null,
    'custom_date_picker' => null,
    'delay'              => null,
    'delay_number'       => null,
    'delay_type'         => null,
    'date_format'        => null,
    'custom_date_format' => null,
    'date_timezone'      => null
  ];

  function _delay_after_provider() {
    $this->_date_set_up(); // Providers run before set_up
    return [
      [  
        [
          'delay_type'        => 'minute',
          'delay_number'      => '5',
          'delay'             => 'after',
          'current_timestamp' => tangible\date()->now()->addMinutes(5)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->addMinutes(5)->timestamp
        ]
      ],
      [ 
        [
          'delay_type'        => 'hour',
          'delay_number'      => '10',
          'delay'             => 'after',
          'current_timestamp' => tangible\date()->now()->addHours(10)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->addHours(10)->timestamp
        ]
      ],
      [ 
        [
          'delay_type'        => 'day',
          'delay_number'      => '10',
          'delay'             => 'after',
          'current_timestamp' => tangible\date()->now()->addDays(10)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->addDays(10)->timestamp
        ]
      ],
      [ 
        [
          'delay_type'        => 'week',
          'delay_number'      => '10',
          'delay'             => 'after',
          'current_timestamp' => tangible\date()->now()->addWeeks(10)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->addWeeks(10)->timestamp
        ]
      ],
      [ 
        [
          'delay_type'        => 'month',
          'delay_number'      => '10',
          'delay'             => 'after',
          'current_timestamp' => tangible\date()->now()->addMonths(10)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->addMonths(10)->timestamp
        ]
      ],
      [ 
        [
          'delay_type'        => 'year',
          'delay_number'      => '10',
          'delay'             => 'after',
          'current_timestamp' => tangible\date()->now()->addYears(10)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->addYears(10)->timestamp
        ]
      ]
    ];
  }

  function _delay_before_provider() {
    $this->_date_set_up(); // Providers run before set_up
    return [
      [  
        [
          'delay_type'        => 'minute',
          'delay_number'      => '5',
          'delay'             => 'before',
          'current_timestamp' => tangible\date()->now()->subMinutes(5)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->subMinutes(5)->timestamp
        ]
      ],
      [ 
        [
          'delay_type'        => 'hour',
          'delay_number'      => '10',
          'delay'             => 'before',
          'current_timestamp' => tangible\date()->now()->subHours(10)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->subHours(10)->timestamp
        ]
      ],
      [ 
        [
          'delay_type'        => 'day',
          'delay_number'      => '10',
          'delay'             => 'before',
          'current_timestamp' => tangible\date()->now()->subDays(10)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->subDays(10)->timestamp
        ]
      ],
      [ 
        [
          'delay_type'        => 'week',
          'delay_number'      => '10',
          'delay'             => 'before',
          'current_timestamp' => tangible\date()->now()->subWeeks(10)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->subWeeks(10)->timestamp
        ]
      ],
      [ 
        [
          'delay_type'        => 'month',
          'delay_number'      => '10',
          'delay'             => 'before',
          'current_timestamp' => tangible\date()->now()->subMonths(10)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->subMonths(10)->timestamp
        ]
      ],
      [ 
        [
          'delay_type'        => 'year',
          'delay_number'      => '10',
          'delay'             => 'before',
          'current_timestamp' => tangible\date()->now()->subYears(10)->timestamp,
          'custom_timestamp'  => tangible\date('2024-06-25', wp_timezone_string())->subYears(10)->timestamp
        ]
      ]
    ];
  }

  function set_up() {

    // @see https://make.wordpress.org/core/handbook/testing/automated-testing/writing-phpunit-tests/#shared-fixtures
    parent::set_up();

    // @see /tests/helpers/date.php
    $this->_date_set_up();
    wp_set_current_user('1');
  }

  function test_general_dynamic_values_default_date() {
    
    $this->_date_test_default_format(
      tangible\date()->now()->timestamp,
      function() {
        return $this->_render_value([
          'date_type' => 'now',
        ]);
      }
    );
  }

  /**
   * @dataProvider _format_provider
   */
  function test_general_dynamic_values_default_date_format( $format ) {

    $this->_date_test_custom_format(
      tangible\date()->now()->timestamp,
      $format,
      function($args) {
        return $this->_render_value([
          'date_type' => 'now',
        ] + $args);
      }
    );
  }

  /**
   * @dataProvider _format_provider
   */
  function test_general_dynamic_values_default_date_timezone( $format ) {

    $this->_date_test_timezone(
      tangible\date()->now()->timestamp,
      $format,
      function($args) {
        return $this->_render_value([
          'date_type' => 'now',
        ] + $args);
      }
    );
  }

  /**
   * @dataProvider _delay_after_provider
   */
  function test_general_dynamic_values_default_date_delay_after( $settings ) {

    $current_settings = [
      'delay'         => $settings['delay'],
      'delay_number'  => $settings['delay_number'],
      'delay_type'    => $settings['delay_type']
    ];

    $this->_date_test_default_format(
      $settings['current_timestamp'],
      function($args) {
        return $this->_render_value([
          'date_type' => 'now'
        ] + $args);
      },
      $current_settings
    );
  }

  /**
   * @dataProvider _delay_before_provider
   */
  function test_general_dynamic_values_default_date_delay_before( $settings ) {

    $current_settings = [
      'delay'         => $settings['delay'],
      'delay_number'  => $settings['delay_number'],
      'delay_type'    => $settings['delay_type']
    ];

    $this->_date_test_default_format(
      $settings['current_timestamp'],
      function($args) {
        return $this->_render_value([
          'date_type' => 'now',
        ] + $args);
      },
      $current_settings
    );
  }

  function test_general_dynamic_values_custom_date() {

    $this->_date_test_default_format(
      tangible\date('2024-06-25', wp_timezone_string())->timestamp,
      function() {
        return $this->_render_value([
          'date_type'           => 'custom',
          'custom_date_picker'  => '2024-06-25'
        ]);
      }
    );
  }

  /**
   * @dataProvider _format_provider
   */
  function test_general_dynamic_values_custom_date_format( $format ) {
    
    $this->_date_test_custom_format(
      tangible\date('2024-06-25', wp_timezone_string())->timestamp,
      $format,
      function($args) {
        return $this->_render_value([
          'date_type'          => 'custom',
          'custom_date_picker' => '2024-06-25'
        ] + $args);
      }
    );
  }

  /**
   * @dataProvider _format_provider
   */
  function test_general_dynamic_values_custom_date_timezone( $format ) {
    
    $this->_date_test_timezone(
      tangible\date('2024-06-25', wp_timezone_string())->timestamp,
      $format,
      function($args) {
        return $this->_render_value([
          'date_type'          => 'custom',
          'custom_date_picker' => '2024-06-25'
        ] + $args);
      }
    );
  }

  /**
   * @dataProvider _delay_after_provider
   */
  function test_general_dynamic_values_custom_date_delay_after( $settings ) {

    $current_settings = [
      'delay'         => $settings['delay'],
      'delay_number'  => $settings['delay_number'],
      'delay_type'    => $settings['delay_type']
    ];

    $this->_date_test_default_format(
      $settings['custom_timestamp'],
      function($args) {
        return $this->_render_value([
          'date_type'          => 'custom',
          'custom_date_picker' => '2024-06-25',
        ] + $args);
      },
      $current_settings
    );
  }

  /**
   * @dataProvider _delay_before_provider
   */
  function test_general_dynamic_values_custom_date_delay_before( $settings ) {

    $current_settings = [
      'delay'         => $settings['delay'],
      'delay_number'  => $settings['delay_number'],
      'delay_type'    => $settings['delay_type']
    ];

    $this->_date_test_default_format(
      $settings['custom_timestamp'],
      function($args) {
        return $this->_render_value([
          'date_type'          => 'custom',
          'custom_date_picker' => '2024-06-25'
        ] + $args);
      },
      $current_settings
    );
  }

}
