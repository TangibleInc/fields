<?php
class Format_TestCase extends WP_UnitTestCase {
	public function test_format_value() {
		$args = tangible_fields()->format_value([
			'key' => 'value',
		], 'old_name', 'new_name');

		$this->assertEquals([
			'key' => 'value',
		], $args);

		$args = tangible_fields()->format_value([
			'key' => 'value',
			'old_name' => 'copy',
		], 'old_name', 'new_name');

		$this->assertEquals([
			'key' => 'value',
			'new_name' => 'copy',
		], $args);

		$args = tangible_fields()->format_value([
			'new_name' => 'disappears',
		], 'new_name', 'new_name');

		$this->assertEmpty($args);
	}

	public function test_format_args_empty() {
		$args = tangible_fields()->format_args('test', []);
		$this->assertEquals(['element'], array_keys($args));
		$this->assertStringStartsWith('tangible-field-test-', $args['element']);
	}

	public function test_format_args_noname() {
		$args = tangible_fields()->format_args('', []);
		$this->assertStringStartsWith('tangible-field--', $args['element']);
	}

	public function test_format_args_instructions_overwrite_description() {
		$args = tangible_fields()->format_args('test', [
			'description' => 'This should not appear in the description',
			'instructions' => $expected = 'These instructions should appear in the description',
		]);
		$this->assertEquals($expected, $args['description']);
	}

	public function test_format_args_empty_string_when_false() {
		$args = tangible_fields()->format_args('test', [
			'value' => false,
		]);
		$this->assertEquals('', $args['value']);
	}

	/**
	 * @dataProvider _test_format_args_types_data
	 */
	public function test_format_args_types(string $type, string $expected) {
		$args = tangible_fields()->format_args('test', [
			'type' => $type,
		]);

		$this->assertEquals($expected, $args['type'] ?? null);
	}

	private function _test_format_args_types_data() {
		return [
			'unknown' => ['unknown', 'unknown'],
			'button_group' => ['button_group', 'button-group'],
			'color_picker' => ['color_picker', 'color-picker'],
			'date_picker' => ['date_picker', 'date-picker'],
			'number' => ['number', 'number'],
			'simple_dimension' => ['simple_dimension', 'simple-dimension'],
			'wysiwyg' => ['wysiwyg', 'wysiwyg'],
			'gallery' => ['gallery', 'gallery'],
			'combo_box' => ['combo_box', 'combo-box'],
			'text_suggestion' => ['text_suggestion', 'text-suggestion'],
			'file' => ['file', 'file'],
			'repeater' => ['repeater', 'repeater'],
			'field_group' => ['field_group', 'field-group'],
			'switch' => ['switch', 'switch'],
		];
	}

	/**
	 * @dataProvider _test_format_args_type_attributes_data
	 */
	public function test_format_args_type_attributes(string $type, array $expected) {
		$args = tangible_fields()->format_args('test', [
			'type' => $type,
			...$expected
		]);

		foreach ($expected as $name => $attribute) {
			$this->assertEquals($attribute, $args[$attribute], "$name should have been rewritten as $attribute");
			$this->assertArrayNotHasKey($name, $args, "$name should have been rewritten as $attribute");
		}
	}

	private function _test_format_args_type_attributes_data() {
		return [
			// type, [from => to, from => to...]
			'color_picker' => ['color_picker', [
				'enable_opacity' => 'hasAlpha',
			]],
			'number' => ['number', [
				'min' => 'minValue',
				'max' => 'maxValue',
			]],
			'combo_box' => ['combo_box', [
				'is_async' => 'isAsync',
				'async_args' => 'asyncArgs',
				'search_url' => 'searchUrl',
				'ajax_action' => 'ajaxAction',
			]],
			'file' => ['file', [
				'mime_types' => 'mimeTypes',
				'max_upload' => 'maxUpload',
			]],
			'switch' => ['switch', [
				'value_on' => 'valueOn',
				'value_off' => 'valueOff',
			]],
		];
	}

	public function test_format_args_wysiwyg_ensure_wp_enqueue_editor() {
		$args = tangible_fields()->format_args('test', [
			'type' => 'wysiwyg',
		]);
		$this->assertGreaterThan(0, did_action('wp_enqueue_editor'), 'wp_enqueue_editor was not called');
	}

	public function test_format_args_gallery_ensure_wp_enqueue_media() {
		$args = tangible_fields()->format_args('test', [
			'type' => 'gallery',
		]);
		$this->assertGreaterThan(0, did_action('wp_enqueue_media'), 'wp_enqueue_media was not called');
	}

	public function test_format_args_repeater_empty_value() {
		$args = tangible_fields()->format_args('test', [
			'type' => 'repeater',
		]);
		$this->assertSame('', $args['value']);

		$args = tangible_fields()->format_args('test', [
			'type' => 'repeater',
			'value' => 'default',
		]);
		$this->assertEquals('default', $args['value']);
	}

	public function test_format_args_field_group_title_alias() {
		$args = tangible_fields()->format_args('test', [
			'type' => 'field_group',
			'title' => $expected = 'This title should overwrite the label and still exist',
		]);

		$this->assertEquals($expected, $args['title']);
		$this->assertEquals($expected, $args['label']);
	}

	public function test_format_args_field_group_fields_mapped() {
		$args = tangible_fields()->format_args('test', [
			'type' => 'field_group',
		]);

		$this->assertEmpty($args['fields']);

		$args = tangible_fields()->format_args('test', [
			'type' => 'field_group',
			'fields' => [
				['name' => 'one', 'type' => 'color_picker', 'enable_opacity' => true],
				['name' => 'two', 'type' => 'field_group', 'title' => $_expected = 'This title should overwrite the label and still exist'],
			],
		]);

		$this->assertTrue($args['fields'][0]['hasAlpha']);
		$this->assertEquals('color-picker', $args['fields'][0]['type']);
		$this->assertEquals($_expected, $args['fields'][1]['label']);
	}
}
