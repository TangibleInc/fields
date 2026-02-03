<?php

class RenderElement_TestCase extends WP_UnitTestCase {

  public function setUp() : void {
    tangible_fields()->registered_elements = [];
    tangible_fields()->enqueued = [
      'fields'   => [],
      'elements' => []
    ];
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
    $fields = tangible_fields();
    $fields->register_element('test', [
      'type' => 'button',
    ]);

    $html = $fields->render_element('test');
    preg_match('#tangible-element-test-[^"]+#', $html, $matches);
    [$element] = $matches;

    $this->assertEquals(
      1,
      count( $fields->enqueued['elements']['test'] )
    );

    $this->assertEquals([
      'type'    => 'button',
      'element' => $element,
      'context' => 'default',
    ], $fields->enqueued['elements']['test'][0] );

    $html = $fields->render_element('test');
    preg_match('#tangible-element-test-[^"]+#', $html, $matches);
    [$element] = $matches;

    $this->assertEquals(
      2,
      count( $fields->enqueued['elements']['test'] )
    );

    $this->assertEquals([
      'type'    => 'button',
      'element' => $element,
      'context' => 'default',
    ], $fields->enqueued['elements']['test'][1] );
  }

  public function test_elements_render_compat() {
    $html = tangible_fields()->render_element('test', [
      'type' => 'button',
    ]);

    preg_match('#tangible-element-test-[^"]+#', $html, $matches);
    [$element] = $matches;

    $this->assertEquals([
      'type'    => 'button',
      'element' => $element,
      'context' => 'default',
    ], tangible_fields()->enqueued['elements']['test'][0]);
  }
}
