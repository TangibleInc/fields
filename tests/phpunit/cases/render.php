<?php
class Render_TestCase extends WP_UnitTestCase {
	public function test_fields_render() {
		$html = tangible_fields()->render_field('test', [
			'type' => 'number',
		]);

		$this->assertStringStartsWith('<div id="tangible-field-test-', $html);
		$this->assertStringEndsWith('" ></div>', $html);
	}

	public function test_fields_render_enqueues_field() {
		$html = tangible_fields()->render_field('test', [
			'type' => 'number',
		]);

		preg_match('#tangible-field-test-[^"]+#', $html, $matches);
		[$element] = $matches;

		$this->assertEquals([
			'type' => 'number',
			'element' => $element,
			'context' => 'default',
		], tangible_fields()->enqueued_fields['test']);
	}
}
