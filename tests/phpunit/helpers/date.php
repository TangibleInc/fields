<?php

namespace Tangible\Fields\Tests;

use tangible;

trait Date {

  private string $default_format;
  private string $default_timezone;

  /**
   * Needs to be call durint test set_up method
   */
  function _date_set_up() {

    $this->default_format = get_option('date_format') . ' ' . get_option('time_format');

    // Make sure site timezone is not UTC
    update_option('timezone_string', 'Europe/Rome');
    $this->default_timezone = 'Europe/Rome';
  }

  function _format_provider() {
    return [
      [ 'Y-m-d' ],
      [ 'd/m/Y' ],
      [ 'm/d/Y' ],
      [ 'Y-m-d H:i:s' ],
      [ 'H:i:s' ]
    ];
  }

  function _date_test_default_format($expected_timestamp, $render_value, $settings = []) {

    $expected_result = tangible\date()
      ->fromTimestamp($expected_timestamp)
      ->setTimezone($this->default_timezone)
      ->format($this->default_format);

    $result = $render_value($settings);
    
    $this->assertNotEmpty($result, 'date should not be empty');
    $this->assertEquals($expected_result, $result, 'result should use default date and default timezone');
  }

  function _date_test_custom_format($expected_timestamp, $format, $render_value) {

    $expected_result = tangible\date()
      ->fromTimestamp($expected_timestamp)
      ->setTimezone($this->default_timezone)
      ->format($this->default_format);

    $result = $render_value([
      'custom_date_format' => $format,
    ]);

    $this->assertEquals($expected_result, $result, 'date should use default format if date_format is empty');
    
    $result = $render_value([
      'date_format'        => 'default',
      'custom_date_format' => $format,
    ]);

    $this->assertEquals($expected_result, $result, 'date should use default format if date_format is default');

    $result = $render_value([
      'date_format'        => 'custom',
      'custom_date_format' => $format,
    ]);

    $expected_result = tangible\date()
      ->fromTimestamp($expected_timestamp)
      ->setTimezone($this->default_timezone)
      ->format($format);

    $this->assertNotEmpty($result, 'date should not be empty');
    $this->assertEquals($expected_result, $result, 'date should use custom format');
  }

  function _date_test_timezone($expected_timestamp, $format, $render_value) {

    $expected_result = tangible\date()
      ->fromTimestamp($expected_timestamp)
      ->setTimezone($this->default_timezone)
      ->format($this->default_format);

    $result = $render_value([
      'date_timezone' => 'default'
    ]);

    $this->assertEquals($expected_result, $result, 'date should use site timezone');

    $expected_result = tangible\date()
      ->fromTimestamp($expected_timestamp)
      ->setTimezone('utc')
      ->format($this->default_format);
      
    $result = $render_value([
      'date_timezone' => 'utc'
    ]);

    $this->assertEquals($expected_result, $result, 'date should use UTC');

    $expected_result = tangible\date()
      ->fromTimestamp($expected_timestamp)
      ->setTimezone('utc')
      ->format($format);
      
    $result = $render_value([
      'date_timezone'      => 'utc',
      'date_format'        => 'custom',
      'custom_date_format' => $format,
    ]);

    $this->assertEquals($expected_result, $result, 'date should use UTC');
  }

}
