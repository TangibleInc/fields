<?php
class Render_TestCase extends WP_UnitTestCase {
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
			'type' => 'number',
		]);

		$html = tangible_fields()->render_field('test');

		preg_match('#tangible-field-test-[^"]+#', $html, $matches);
		[$element] = $matches;

		$this->assertEquals([
			'type' => 'number',
			'element' => $element,
			'context' => 'default',
		], tangible_fields()->enqueued_fields['test']);
	}
}
