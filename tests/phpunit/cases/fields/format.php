<?php

use Tangible\Fields\Tests as helpers;

// @todo: We need tests for the tab layout
class FormatField_TestCase extends WP_UnitTestCase {

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
      'unknown'           => ['unknown', 'unknown'],
      'button_group'      => ['alignment_matrix', 'alignment-matrix'],
      'button_group'      => ['button_group', 'button-group'],
      'color_picker'      => ['color_picker', 'color-picker'],
      'conditional_panel' => ['conditional_panel', 'conditional-panel'],
      'date_picker'       => ['date_picker', 'date-picker'],
      'number'            => ['number', 'number'],
      'simple_dimension'  => ['simple_dimension', 'simple-dimension'],
      'wysiwyg'           => ['wysiwyg', 'wysiwyg'],
      'gallery'           => ['gallery', 'gallery'],
      'combo_box'         => ['combo_box', 'combo-box'],
      'text_suggestion'   => ['text_suggestion', 'text-suggestion'],
      'file'              => ['file', 'file'],
      'repeater'          => ['repeater', 'repeater'],
      'field_group'       => ['field_group', 'field-group'],
      'switch'            => ['switch', 'switch'],
      'time_picker'       => ['time_picker', 'time-picker'],
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
      'all_types' => ['all_types', [
        'label_visually_hidden' => 'labelVisuallyHidden'
      ]],
      'accordion' => ['accordion', [
        'use_switch' => 'useSwitch'
      ]],
      'color_picker' => ['color_picker', [
        'enable_opacity' => 'hasAlpha',
      ]],
      'conditional_panel' => ['conditional_panel', [
        'use_modal' => 'useModal',
      ]],
      'date_picker' => ['date_picker', [
        'future_only' => 'futureOnly',
        'date_range' => 'dateRange',
        'multi_month' => 'multiMonth',
        'date_presets' => 'datePresets'
      ]],
      'number' => ['number', [
        'min' => 'minValue',
        'max' => 'maxValue',
        'read_only' => 'readOnly'
      ]],
      'combo_box' => ['combo_box', [
        'is_async' => 'isAsync',
        'async_args' => 'asyncArgs',
        'search_url' => 'searchUrl',
        'ajax_action' => 'ajaxAction',
        'map_results' => 'mapResults',
        'read_only' => 'readOnly',
        'debounce_time' => 'debounceTime'
      ]],
      'file' => ['file', [
        'mime_types' => 'mimeTypes',
        'max_upload' => 'maxUpload',
      ]],
      'switch' => ['switch', [
        'value_on' => 'valueOn',
        'value_off' => 'valueOff',
      ]],
      'time_picker' => ['time_picker', [
				'hour_cycle' => 'hourCycle',
			]],
      'text' => ['text', [
        'read_only' => 'readOnly',
        'input_mask' => 'inputMask',
      ]],
      'repeater' => ['repeater', [
        'use_switch' => 'useSwitch',
        'use_bulk' => 'useBulk',
        'section_title' => 'sectionTitle',
        'header_fields' => 'headerFields',
        'new_item' => 'newItem'
      ]],
      'button_group' => ['button_group', [
        'read_only' => 'isDisabled'
      ]],
      'select' => ['select', [
        'read_only' => 'isDisabled'
      ]],
      'list' => ['list', [
        'is_async' => 'isAsync',
        'async_args' => 'asyncArgs',
        'search_url' => 'searchUrl',
        'ajax_action' => 'ajaxAction',
        'map_results' => 'mapResults',
        'use_visibility' => 'useVisibility'
      ]],
      'wysiwyg' =>  ['wysiwyg', [
        'raw_view' => 'rawView'
      ]]
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

    $field_args = [
      'type' => 'gallery',
    ];

    // Frontend before document head

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('wp_enqueue_scripts', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in site frontend before head'
    );

    // Frontend during head

    helpers\mock_doing_action('wp_enqueue_scripts');

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('wp_footer', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in site frontend during head'
    );
    helpers\unmock_doing_action('wp_enqueue_scripts');

    // Frontend after head

    helpers\mock_did_action('wp_enqueue_scripts');

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('wp_footer', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in site frontend after head'
    );
      
    helpers\unmock_did_action('wp_enqueue_scripts');

    // Admin

    // Admin before document head

    helpers\mock_is_admin();

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('admin_enqueue_scripts', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in admin before head'
    );

    // Admin during head

    helpers\mock_doing_action('admin_enqueue_scripts');

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('admin_footer', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in admin during head'
    );

    helpers\unmock_doing_action('admin_enqueue_scripts');

    // Admin after head

    helpers\mock_did_action('admin_enqueue_scripts');

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('admin_footer', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in admin after head'
    );

    helpers\unmock_did_action('admin_enqueue_scripts');

    helpers\unmock_is_admin();
  }

  public function test_format_args_file_ensure_wp_enqueue_media() {

    // Without media uploader
    $args = tangible_fields()->format_args('test', [
      'type'     => 'file',
      'wp_media' => false
    ]);

    $this->assertFalse(
      helpers\action_hook_has_callback('wp_enqueue_scripts', 'wp_enqueue_media'),
      'wp_enqueue_media was enqueued using wp_enqueue_scripts'
    );

    $this->assertFalse(
      helpers\action_hook_has_callback('admin_enqueue_scripts', 'wp_enqueue_media'),
      'wp_enqueue_media was enqueued using admin_enqueue_scripts'
    );

    // With media uploader

    $field_args = [
      'type' => 'file',
    ];

    // Frontend before document head

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('wp_enqueue_scripts', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in site frontend before head'
    );

    // Frontend during head

    helpers\mock_doing_action('wp_enqueue_scripts');

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('wp_footer', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in site frontend during head'
    );

    helpers\unmock_doing_action('wp_enqueue_scripts');
    
    // Frontend after head

    helpers\mock_did_action('wp_enqueue_scripts');

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('wp_footer', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in site frontend after head'
    );

    helpers\unmock_did_action('wp_enqueue_scripts');

    // Admin

    // Admin before document head

    helpers\mock_is_admin();

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('admin_enqueue_scripts', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in admin before head'
    );

    // Admin during head

    helpers\mock_doing_action('admin_enqueue_scripts');

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('admin_footer', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in admin during head'
    );

    helpers\unmock_doing_action('admin_enqueue_scripts');

    // Admin after head

    helpers\mock_did_action('admin_enqueue_scripts');

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('admin_footer', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in admin after head'
    );

    helpers\unmock_did_action('admin_enqueue_scripts');

    helpers\unmock_is_admin();

    // Login

    // Login before document head

    helpers\mock_is_login();

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('login_enqueue_scripts', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in login before head'
    );

    // Login during head

    helpers\mock_doing_action('login_enqueue_scripts');

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('login_footer', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in footer during head'
    );

    helpers\unmock_doing_action('login_enqueue_scripts');

    // Login after head

    helpers\mock_did_action('login_enqueue_scripts');

    tangible_fields()->format_args('test', $field_args);
    $this->assertTrue(
      helpers\action_hook_has_callback('login_footer', 'wp_enqueue_media'),
      'wp_enqueue_media was not enqueued in login after head'
    );

    helpers\unmock_did_action('login_enqueue_scripts');

    helpers\unmock_is_login();
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
      ['field_group'],
      ['conditional_panel']
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

  /**
   * @dataProvider _test_format_groups_args_data
   */
  public function test_format_groups_args_elements(string $type) {
    $args = tangible_fields()->format_groups($type, [
      'type'   => $type,
      'fields' => [
        [
          'type' => 'button',
          'button_type' => 'action'
        ]
      ]
    ]);

    $this->assertNotEmpty($args['fields']);
    $this->assertEquals('action', $args['fields'][0]['buttonType']);
  }

  public function test_format_args_dependent() {
    $args = tangible_fields()->format_args('text', [
      'dependent' => [
        'callback_data' => [ 'data_name' => 'data_value' ]
      ]
    ]);
    $this->assertNotEmpty($args['dependent']['callbackData']);
  }

}
