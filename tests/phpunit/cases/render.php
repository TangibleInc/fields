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

	public function test_fields_render_callback_conditional_fields_default() {
		tangible_fields()->register_field('test', [
			'type' => 'conditional',
		]);

		$this->assertArrayHasKey('render_callback', tangible_fields()->registered_fields['test'], 'default render_callback for conditonal fieldsets is not set');
		$this->assertEquals(
			[tangible_fields(), '_render_callback_default_conditional_field'],
			tangible_fields()->registered_fields['test']['render_callback'],
			'default render_callback should be _render_callback_default_conditional_field'
		);

		// @todo ohai, Nicolas! Please call render_field('test') and verify HTML output here :)
	}
}
