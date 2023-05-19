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
			'type' => 'switch',
		]);

		$html = tangible_fields()->render_field('test');

		preg_match('#tangible-field-test-[^"]+#', $html, $matches);
		[$element] = $matches;

		$this->assertEquals([
			'type' => 'switch',
			'element' => $element,
			'context' => 'default',
		], tangible_fields()->enqueued_fields['test']);
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
		], tangible_fields()->enqueued_fields['test']);
	}
}
