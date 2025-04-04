<?php
class RenderField_TestCase extends WP_UnitTestCase {
  public function setUp() : void {
    tangible_fields()->registered_fields = [];
  }

  public function test_fields_render() {
    tangible_fields()->register_field('test', [
      'type' => 'number',
    ]);

    $html = tangible_fields()->render_field('test');

    $this->assertStringStartsWith('<div id="tangible-field-test-', $html);
    $this->assertStringEndsWith('" ></div>', $html);
  }

  public function test_fields_render_enqueues_field() {
    tangible_fields()->register_field('test', [
      'type' => 'switch',
    ]);

    $html = tangible_fields()->render_field('test');

    preg_match('#tangible-field-test-[^"]+#', $html, $matches);
    [$element] = $matches;

    $this->assertEquals([
      'type' => 'switch',
      'element' => $element,
      'context' => 'default',
    ], tangible_fields()->enqueued['fields']['test']);
  }

  public function test_fields_render_compat() {
    $errored = null;
    set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
      $errored = [$errno, $errstr, $args];
      restore_error_handler();
    });

    $html = tangible_fields()->render_field('test', [
      'type' => 'switch',
    ]);

    $this->assertNotNull($errored, 'calling render_field without register_field did not trigger a warning');
    [$errno, $errstr, $args] = $errored;

    $this->assertEquals(E_USER_WARNING, $errno, 'calling render_field without register_field did not trigger an E_USER_WARNING');

    preg_match('#tangible-field-test-[^"]+#', $html, $matches);
    [$element] = $matches;

    $this->assertEquals([
      'type' => 'switch',
      'element' => $element,
      'context' => 'default',
    ], tangible_fields()->enqueued['fields']['test']);
  }

  public function test_fields_render_callback() {
    tangible_fields()->register_field('test', [
      'type' => 'number',
      'render_callback' => function($args, $field) {
        return json_encode([$args, $field]);
      }
    ]);

    $result = json_decode(tangible_fields()->render_field('test'));
    $this->assertEquals('number', $result[0]->type);
    $this->assertNotEmpty($result[0]->element);
    $this->assertEquals('number', $result[1]->type);
  }

  public function test_fields_render_fetch_value() {
    tangible_fields()->register_field('test', [
      'type' => 'text',
      'render_callback' => function($args, $field) {
        return json_encode([$args, $field]);
      }
    ]);

    $result = json_decode(tangible_fields()->render_field('test'));
    $this->assertFalse(isset($result[0]->value), 'value should not be defined if no fetch_callback set');

    tangible_fields()->register_field('test-with-callback', [
      'type' => 'text',
      'fetch_callback' => function() {
        return 'updated';
      },
      'permission_callback_fetch' => function() {
        return true;
      },
      'render_callback' => function($args, $field) {
        return json_encode([$args, $field]);
      }
    ]);

    $result = json_decode(tangible_fields()->render_field('test-with-callback'));
    $this->assertEquals('updated', $result[0]->value, 'value should be set to what fetch_callback returns if no value');

    tangible_fields()->register_field('test-with-callback-and-value', [
      'type' => 'text',
      'value' => 'initial',
      'fetch_callback' => function() {
        return 'updated';
      },
      'permission_callback_fetch' => function() {
        return true;
      },
      'render_callback' => function($args, $field) {
        return json_encode([$args, $field]);
      }
    ]);

    $result = json_decode(tangible_fields()->render_field('test-with-callback-and-value'));
    $this->assertEquals('initial', $result[0]->value, 'value should not use fetch_callback if set on registration');
  }

  public function test_fields_render_with_fetch_value_args() {
    $fields = tangible_fields();
    $fields->register_field('test', [
      'type'                      => 'number',
      'store_callback'            => '__return_false',
      'permission_callback_fetch' => '__return_true',
      'permission_callback_store' => '__return_false',
      // We don't use the store callback, save is handled by database module
      'fetch_callback'            => function( string $name, array $args ) {
        return $args['test_render_args'] ?? 0;
      },
      'render_callback'           => function($args, $field) {
        return json_encode([ $args, $field ]);
      }
    ]);

    $result = json_decode( $fields->render_field( 'test' ) );
    $this->assertEquals(
      0,
      $result[0]->value,
      'value should be 0 if rendered without $args[\'test_render_args\']t'
    );

    $result = json_decode(
      $fields->render_field( 'test', [], [ 'test_render_args' => 999 ] )
    );

    $this->assertEquals(
      999,
      $result[0]->value,
      'value should be equal to $args[\'test_render_args\']t'
    );
  }
}
