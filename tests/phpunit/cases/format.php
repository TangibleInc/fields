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

	public function _test_format_args_types_data() {
		return [
			'unknown' => ['unknown', 'unknown'],
			'button_group' => ['alignment_matrix', 'alignment-matrix'],
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
		$args = tangible_fields()->format_args('test', 
      [ 'type' => $type ]
      + $expected
    );

		foreach ($expected as $name => $attribute) {
			$this->assertEquals($attribute, $args[$attribute], "$name should have been rewritten as $attribute");
			$this->assertArrayNotHasKey($name, $args, "$name should have been rewritten as $attribute");
		}
	}

	public function _test_format_args_type_attributes_data() {
		return [
			// type, [from => to, from => to...]
			'color_picker' => ['color_picker', [
				'enable_opacity' => 'hasAlpha',
			]],
      'date_picker' => ['date_picker', [
        'future_only' => 'futureOnly'
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
				'map_results' => 'mapResults'
			]],
			'file' => ['file', [
				'mime_types' => 'mimeTypes',
				'max_upload' => 'maxUpload',
			]],
			'switch' => ['switch', [
				'value_on' => 'valueOn',
				'value_off' => 'valueOff',
			]],
      'text' => ['text', [
				'read_only' => 'readOnly'
			]],
      'button_group' => ['button_group', [
        'read_only' => 'isDisabled'
			]],
      'select' => ['button_group', [
        'read_only' => 'isDisabled'
			]],
		];
	}

	public function test_format_args_wysiwyg_ensure_wp_enqueue_editor() {
		$args = tangible_fields()->format_args('test', [
			'type' => 'wysiwyg',
		]);

		$this->assertEquals(0, did_action('wp_enqueue_editor'), 'wp_enqueue_editor was called but editor type was not tinymce');

    $args = tangible_fields()->format_args('test', [
			'type'   => 'wysiwyg',
      'editor' => 'tinymce'
		]);

    $this->assertGreaterThan(0, did_action('wp_enqueue_editor'), 'wp_enqueue_editor was not called');
	}

  public function test_format_args_number_ensure_min_value() {
		$args = tangible_fields()->format_args('test', [
			'type' => 'number',
			'min'  => '10',
		]);
		$this->assertEquals('10', $args['value'], 'value is not equal to min_value');
	}

	public function test_format_args_gallery_ensure_wp_enqueue_media() {
		$args = tangible_fields()->format_args('test', [
			'type' => 'gallery',
		]);
		$this->assertGreaterThan(0, did_action('wp_enqueue_media'), 'wp_enqueue_media was not called');
	}

  public function test_format_args_file_ensure_wp_enqueue_media() {    
    $args = tangible_fields()->format_args('test', [
			'type'     => 'file',
      'wp_media' => false
		]);
    $this->assertEquals(0, did_action('wp_enqueue_media'), 'wp_enqueue_media was called');

    $args = tangible_fields()->format_args('test', [
			'type' => 'file',
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

  public function _test_format_groups_args_data() {
    return [
      ['repeater'],
      ['accordion'],
      ['field_group']
    ]; 
  }

  /**
	 * @dataProvider _test_format_groups_args_data
	 */
  public function test_format_groups_args_label_alias(string $type) {
    $args = tangible_fields()->format_groups($type, [
      'type'  => $type,
      'title' => $expected = 'This title should overwrite the label and still exist',
    ]);

    $this->assertEquals($expected, $args['title']);
    $this->assertEquals($expected, $args['label']);
  }

  /**
	 * @dataProvider _test_format_groups_args_data
	 */
  public function test_format_groups_args_fields(string $type) {
    $args = tangible_fields()->format_groups($type, [
			'type' => $type,
		]);

		$this->assertEmpty($args['fields']);

    $args = tangible_fields()->format_groups($type, [
      'type'       => $type,
      'sub_fields' => [
        [
          'name' => 'one', 
          'type' => 'color_picker', 
          'enable_opacity' => true
        ],
        [
          'name' => 'two', 
          'type' => 'field_group', 
          'title' => $_expected = 'This title should overwrite the label and still exist'
        ],
      ],
    ]);

    $this->assertArrayHasKey('fields', $args, 'sub_fields should be replaced by fields');
    $this->assertNotEmpty($args['fields']);

    $this->assertTrue($args['fields'][0]['hasAlpha']);
		$this->assertEquals('color-picker', $args['fields'][0]['type']);
		$this->assertEquals($_expected, $args['fields'][1]['label']);
  }

  public function _test_format_dynamic_values_data() {
    return [
      ['color_picker', 'replace', ['color']],
      ['date_picker', 'replace', ['date']],
      ['number', 'replace', ['number']],
      ['text', 'insert', ['text', 'date', 'color', 'number']]
    ];
  }

  /**
   * @dataProvider _test_format_dynamic_values_data
   */
  public function test_format_dynamic_values(string $type, string $default_mode, array $default_types) {
    $fields = tangible_fields(); 
    
    $args = $fields->format_args($type, [
      'type' => $type
    ]);
    $this->assertFalse($args['dynamic'], 'value of $args["dynamic"] should be set to false when not set');

    $args = $fields->format_args($type, [
      'type'    => $type,
      'dynamic' => false
    ]);
    $this->assertFalse($args['dynamic'], 'value of $args["dynamic"] should stay false when initial value is false');
    
    $args = $fields->format_args($type, [
      'type'    => $type,
      'dynamic' => true
    ]);

    $this->assertIsArray($args['dynamic'], 'value of $args["dynamic"] should be converted to an array when dynamic true');
    $this->assertEquals($default_mode, $args['dynamic']['mode'], '$args["dynamic"]["mode"] should be equal to default if not specified');
    $this->assertEquals($default_types, $args['dynamic']['types'], '$args["dynamic"]["types"] should be equal to default if not specified');
    
    $set_mode = $default_mode === 'insert' ? 'replace' : 'insert';
    $set_types = ['text', 'number', 'custom'];
    $expected_types = [ ...array_intersect($set_types, $default_types) ];
    
    $args = $fields->format_args($type, [
      'type'    => $type,
      'dynamic' => [
        'mode'  => $set_mode,
        'types' => $set_types,
      ]
    ]);


    $this->assertIsArray($args['dynamic'], 'value of $args["dynamic"] should stay an array when passed value was an array');
    $this->assertEquals($set_mode, $args['dynamic']['mode'], '$args["dynamic"]["mode"] should be equal to passed value when specified');
    $this->assertNotContains('custom', $args['dynamic']['types'], '$args["dynamic"]["types"] should remove unexpected values');
    $this->assertEquals($expected_types, $args['dynamic']['types'], '$args["dynamic"]["types"] should only contains authorized types');
  }
}
