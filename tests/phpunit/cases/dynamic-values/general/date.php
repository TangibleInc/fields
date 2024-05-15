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
    return [
      [  
        [
          'delay_type'      => 'minute',
          'delay_number'    => '5',
          'delay'           => 'after',
          'current_timestamp'       => mktime(date('H'), date('i') + 5, date('s'), date('m'), date('d'), date('y')),
          'custom_timestamp' => mktime(date('H'), date('i') + 5, date('s'), 06, 25, 2024)
        ]
      ],
      [ 
        [
          'delay_type'    => 'hour',
          'delay_number'  => '10',
          'delay'         => 'after',
          'current_timestamp'     => mktime(date('H') + 10, date('i'), date('s'), date('m'), date('d'), date('y')),
          'custom_timestamp' => mktime(date('H') + 10, date('i'), date('s'), 06, 25, 2024)
        ]
      ],
      [ 
        [
          'delay_type'    => 'day',
          'delay_number'  => '10',
          'delay'         => 'after',
          'current_timestamp'     => mktime(date('H'), date('i'), date('s'), date('m'), date('d') + 10, date('y')),
          'custom_timestamp' => mktime(date('H'), date('i'), date('s'), 06, 25 + 10, 2024)
        ]
      ],
      [ 
        [
          'delay_type'    => 'week',
          'delay_number'  => '10',
          'delay'         => 'after',
          'current_timestamp'     => mktime(date('H'), date('i'), date('s'), date('m'), date('d') + 70, date('y')),
          'custom_timestamp' => mktime(date('H'), date('i'), date('s'), 06, 25 + 70, 2024)
        ]
      ],
      [ 
        [
          'delay_type'    => 'month',
          'delay_number'  => '10',
          'delay'         => 'after',
          'current_timestamp'     => mktime(date('H'), date('i'), date('s'), date('m') + 10, date('d'), date('y')),
          'custom_timestamp' => mktime(date('H'), date('i'), date('s'), 06 + 10, 25, 2024)
        ]
      ],
      [ 
        [
          'delay_type'    => 'year',
          'delay_number'  => '10',
          'delay'         => 'after',
          'current_timestamp'     => mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('y') + 10),
          'custom_timestamp' => mktime(date('H'), date('i'), date('s'), 06, 25, 2024 + 10)
        ]
      ]
    ];
  }

  function _delay_before_provider() {
    return [
      [  
        [
          'delay_type'    => 'minute',
          'delay_number'  => '5',
          'delay'         => 'before',
          'current_timestamp'     => mktime(date('H'), date('i') - 5, date('s'), date('m'), date('d'), date('y')),
          'custom_timestamp' => mktime(date('H'), date('i') - 5, date('s'), 06, 25, 2024)
        ]
      ],
      [ 
        [
          'delay_type'    => 'hour',
          'delay_number'  => '10',
          'delay'         => 'before',
          'current_timestamp'     => mktime(date('H') - 10, date('i'), date('s'), date('m'), date('d'), date('y')),
          'custom_timestamp' => mktime(date('H') - 10, date('i'), date('s'), 06, 25, 2024)
        ]
      ],
      [ 
        [
          'delay_type'    => 'day',
          'delay_number'  => '10',
          'delay'         => 'before',
          'current_timestamp'     => mktime(date('H'), date('i'), date('s'), date('m'), date('d') - 10, date('y')),
          'custom_timestamp' => mktime(date('H'), date('i'), date('s'), 06, 25 - 10, 2024)
        ]
      ],
      [ 
        [
          'delay_type'    => 'week',
          'delay_number'  => '10',
          'delay'         => 'before',
          'current_timestamp'     => mktime(date('H'), date('i'), date('s'), date('m'), date('d') - 70, date('y')),
          'custom_timestamp' => mktime(date('H'), date('i'), date('s'), 06, 25 - 70, 2024)
        ]
      ],
      [ 
        [
          'delay_type'    => 'month',
          'delay_number'  => '10',
          'delay'         => 'before',
          'current_timestamp'     => mktime(date('H'), date('i'), date('s'), date('m') - 10, date('d'), date('y')),
          'custom_timestamp' => mktime(date('H'), date('i'), date('s'), 06 - 10, 25, 2024)
        ]
      ],
      [ 
        [
          'delay_type'    => 'year',
          'delay_number'  => '10',
          'delay'         => 'before',
          'current_timestamp'     => mktime(date('H'), date('i'), date('s'), date('m'), date('d'), date('y') - 10),
          'custom_timestamp' => mktime(date('H'), date('i'), date('s'), 06, 25, 2024 - 10)
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
      time(),
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
      time(),
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
      time(),
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
          'date_type'     => 'now'
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
          'date_type'     => 'now',
        ] + $args);
      },
      $current_settings
    );
  }

  function test_general_dynamic_values_custom_date() {

    $current_timestamp = mktime(date('H'), date('i'), date('s'), 06, 25, 2024);
    
    $this->_date_test_default_format(
      $current_timestamp,
      function() {
        return $this->_render_value([
          'date_type' => 'custom',
          'custom_date_picker'  => '2024-06-25'
        ]);
      }
    );
  }

  /**
   * @dataProvider _format_provider
   */
  function test_general_dynamic_values_custom_date_format( $format ) {
    
    $current_timestamp = mktime(date('H'), date('i'), date('s'), 06, 25, 2024);

    $this->_date_test_custom_format(
      $current_timestamp,
      $format,
      function($args) {
        return $this->_render_value([
          'date_type' => 'custom',
          'custom_date_picker'  => '2024-06-25'
        ] + $args);
      }
    );
  }

  /**
   * @dataProvider _format_provider
   */
  function test_general_dynamic_values_custom_date_timezone( $format ) {
    
    $current_timestamp = mktime(date('H'), date('i'), date('s'), 06, 25, 2024);

    $this->_date_test_timezone(
      $current_timestamp,
      $format,
      function($args) {
        return $this->_render_value([
          'date_type' => 'custom',
          'custom_date_picker'  => '2024-06-25'
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
          'date_type' => 'custom',
          'custom_date_picker'  => '2024-06-25',
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
          'date_type' => 'custom',
          'custom_date_picker'  => '2024-06-25'
        ] + $args);
      },
      $current_settings
    );
  }

}
