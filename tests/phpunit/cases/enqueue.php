<?php
class Enqueue_TestCase extends WP_UnitTestCase {
  public function setUp(): void {
    tangible_fields()->enqueued = [
      'fields'   => [],
      'elements' => []
    ];
    tangible_fields()->is_enqueued = false;
    tangible_fields()->set_context('default');

    $GLOBALS['wp_styles'] = new WP_Styles();
    $GLOBALS['wp_scripts'] = new WP_Scripts();
  }

  function _test_items_enqueue_data() {
    return [
      [ 'fields',  ['type' => 'number'] ],
      [ 'elements', ['type' => 'button'] ]
    ];
  }

  /**
   * @dataProvider _test_items_enqueue_data
   */
  public function test_items_enqueue(string $type, array $args) {
    global $wp_version;
    $this->assertEmpty(tangible_fields()->enqueued[ $type ], "There should not be enqueued $type yet");
    $this->assertFalse(tangible_fields()->is_enqueued);

    tangible_fields()->maybe_enqueue_scripts();
    $this->assertFalse(tangible_fields()->is_enqueued);

    tangible_fields()->enqueue_item('test', $type, $args);
    $args['context'] = 'default';

    if ( $type === 'elements' ) {
      $this->assertEquals(['test' => [ $args ]], tangible_fields()->enqueued[ $type ]);
    }
    else {
      $this->assertEquals(['test' => $args], tangible_fields()->enqueued[ $type ]);
    }

    $this->assertFalse(tangible_fields()->is_enqueued);
    $this->assertFalse(wp_styles()->query('tangible-fields-default'));
    $this->assertFalse(wp_scripts()->query('tangible-fields'));
    $this->assertFalse(wp_scripts()->get_data('tangible-fields', 'data'));

    tangible_fields()->maybe_enqueue_scripts();

    $this->assertTrue(tangible_fields()->is_enqueued);
    $this->assertEquals('tangible-fields-default', wp_styles()->query('tangible-fields-default')->handle);
    $this->assertEquals('tangible-fields', wp_scripts()->query('tangible-fields')->handle);

    if ( version_compare($wp_version, '6.3', '>') ) {
      $data = wp_scripts()->get_inline_script_data('tangible-fields', 'before', false);
    } else {
      $data = wp_scripts()->print_inline_script('tangible-fields', 'before', false);
    }
    $this->assertGreaterThan(0, preg_match('#^var TangibleFieldsConfig = (.+?);$#', $data, $matches), 'wp_add_inline_script does not have TangibleFieldsConfig');
    $data = json_decode($matches[1], true);

    $this->assertEquals([
      'api', 
      'fields', 
      'elements', 
      'dynamics', 
      'mimetypes'
    ], array_keys($data));
  }

  /**
    * @dataProvider _test_items_enqueue_data
    */
  public function test_fields_enqueue_conditions(string $type, array $args) {
    global $wp_version;
    tangible_fields()->enqueue_item('test', $type, $args);

    $args['condition'] = [
      'action' => 'show',
      'condition' => [
        'test' => [
          '_gt' => 0,
        ]
      ],
    ];

    tangible_fields()->enqueue_item('field', $type, $args);
    tangible_fields()->maybe_enqueue_scripts();

    if ( version_compare($wp_version, '6.3', '>') ) {
      preg_match('#^var TangibleFieldsConfig = (.+?);$#', wp_scripts()->get_inline_script_data('tangible-fields', 'before', false), $matches);
    } else {
      preg_match('#^var TangibleFieldsConfig = (.+?);$#', wp_scripts()->print_inline_script('tangible-fields', 'before', false), $matches);
    }

    $data = json_decode($matches[1], true);

    $this->assertArrayNotHasKey('condition', $data[ $type ]['test']);
		$this->assertEquals(
		  $args['condition'],
			$type === 'elements'
	      ? $data[ $type ]['field'][0]['condition']
			  : $data[ $type ]['field']['condition']
		);
  }
}
