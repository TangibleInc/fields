<?php

class RenderElement_TestCase extends WP_UnitTestCase {

  public function setUp() : void {
    tangible_fields()->registered_elements = [];
  }

  public function test_elements_render() {
    tangible_fields()->register_element('test', [
      'type' => 'button',
    ]);

    $html = tangible_fields()->render_element('test');

    $this->assertStringStartsWith('<div id="tangible-element-test-', $html);
    $this->assertStringEndsWith('" ></div>', $html);
  }

  public function test_elements_render_enqueues_element() {
    tangible_fields()->register_element('test', [
      'type' => 'button',
    ]);

    $html = tangible_fields()->render_element('test');

    preg_match('#tangible-element-test-[^"]+#', $html, $matches);
    [$element] = $matches;

    $this->assertEquals([
      'type'    => 'button',
      'element' => $element,
      'context' => 'default',
    ], tangible_fields()->enqueued['elements']['test']);
  }

  public function test_elements_render_compat() {
    $errored = null;
    set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
      $errored = [$errno, $errstr, $args];
      restore_error_handler();
    });

    $html = tangible_fields()->render_element('test', [
      'type' => 'button',
    ]);

    $this->assertNotNull($errored, 'calling render_element without register_element did not trigger a warning');
    [$errno, $errstr, $args] = $errored;

    $this->assertEquals(E_USER_WARNING, $errno, 'calling render_element without register_element did not trigger an E_USER_WARNING');

    preg_match('#tangible-element-test-[^"]+#', $html, $matches);
    [$element] = $matches;

    $this->assertEquals([
      'type'    => 'button',
      'element' => $element,
      'context' => 'default',
    ], tangible_fields()->enqueued['elements']['test']);
  }
}
