<?php
class Fields_TestCase extends WP_UnitTestCase {
  public function setUp() : void {
    tangible_fields()->registered_fields = [];
  }

  public function test_fields_register() {
    tangible_fields()->register_field('test', [
      'type' => 'number',
    ]);

    $this->assertEquals([
      'type' => 'number',
    ], tangible_fields()->registered_fields['test']);
  }

  public function test_fields_register_existing() {
    tangible_fields()->register_field('test', [
      'type' => 'number',
    ]);

    $errored = null;
    set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
      $errored = [$errno, $errstr, $args];
      restore_error_handler();
    });

    tangible_fields()->register_field('test', [
      'type' => 'text',
    ]);

    $this->assertNotNull($errored, 'registering field with same name did not trigger a warning');
    [$errno, $errstr, $args] = $errored;

    $this->assertEquals(E_USER_WARNING, $errno, 'registering field with same name not trigger an E_USER_WARNING');

    $this->assertEquals([
      'type' => 'text',
    ], tangible_fields()->registered_fields['test'], 'registering field with same name did not overwrite existing field');
  }

  public function test_fields_register_empty() {
    $errored = null;
    set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
      $errored = [$errno, $errstr, $args];
      restore_error_handler();
    });

    tangible_fields()->register_field('test', []);

    $this->assertNotNull($errored, 'registering an empty field did not trigger a warning');
    [$errno, $errstr, $args] = $errored;

    $this->assertEquals(E_USER_WARNING, $errno, 'registering an empty field did not trigger an E_USER_WARNING');

    $this->assertEmpty(tangible_fields()->registered_fields, 'an empty field should not be registered');
  }
}
