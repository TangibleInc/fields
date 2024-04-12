<?php

class Elements_TestCase extends WP_UnitTestCase {

  public function setUp() : void {
    tangible_fields()->registered_elements = [];
  }

  public function test_elements_register() {
    tangible_fields()->register_element('test', [
      'type' => 'button',
    ]);

    $this->assertEquals([
      'type' => 'button',
    ], tangible_fields()->registered_elements['test']);
  }

  public function test_elements_register_existing() {
    tangible_fields()->register_element('test', [
      'type' => 'button',
    ]);

    $errored = null;
    set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
      $errored = [$errno, $errstr, $args];
      restore_error_handler();
    });

    tangible_fields()->register_element('test', [
      'type' => 'button',
    ]);

    $this->assertNotNull($errored, 'registering element with same name did not trigger a warning');
    [$errno, $errstr, $args] = $errored;

    $this->assertEquals(E_USER_WARNING, $errno, 'registering element with same name not trigger an E_USER_WARNING');

    $this->assertEquals([
      'type' => 'button',
    ], tangible_fields()->registered_elements['test'], 'registering element with same name did not overwrite existing element');
  }

  public function test_elements_register_empty() {
    $errored = null;
    set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
      $errored = [$errno, $errstr, $args];
      restore_error_handler();
    });

    tangible_fields()->register_element('test', []);

    $this->assertNotNull($errored, 'registering an empty element did not trigger a warning');
    [$errno, $errstr, $args] = $errored;

    $this->assertEquals(E_USER_WARNING, $errno, 'registering an empty element did not trigger an E_USER_WARNING');

    $this->assertEmpty(tangible_fields()->registered_elements, 'an empty element should not be registered');
  }
}
