<?php
class Enqueue_TestCase extends WP_UnitTestCase {
	public function setUp(): void {
		tangible_fields()->enqueued_fields = [];
		tangible_fields()->is_enqueued = false;
		tangible_fields()->set_context('default');

		$GLOBALS['wp_styles'] = new WP_Styles();
		$GLOBALS['wp_scripts'] = new WP_Scripts();
	}

	public function test_fields_enqueue() {
		$this->assertEmpty(tangible_fields()->enqueued_fields, 'There should not be enqueued fields yet');
		$this->assertFalse(tangible_fields()->is_enqueued);

		tangible_fields()->maybe_enqueue_scripts();
		$this->assertFalse(tangible_fields()->is_enqueued);

		tangible_fields()->enqueue_field('test', ['type' => 'number']);
		$this->assertEquals(['test' => ['context' => 'default', 'type' => 'number']], tangible_fields()->enqueued_fields);

		$this->assertFalse(tangible_fields()->is_enqueued);
		$this->assertFalse(wp_styles()->query('tangible-fields-default'));
		$this->assertFalse(wp_scripts()->query('tangible-fields'));
		$this->assertFalse(wp_scripts()->get_data('tangible-fields', 'data'));

		tangible_fields()->maybe_enqueue_scripts();

		$this->assertTrue(tangible_fields()->is_enqueued);
		$this->assertEquals('tangible-fields-default', wp_styles()->query('tangible-fields-default')->handle);
		$this->assertEquals('tangible-fields', wp_scripts()->query('tangible-fields')->handle);

		$data = wp_scripts()->get_data('tangible-fields', 'data');
		$this->assertGreaterThan(0, preg_match('#^var TangibleFields = (.+?);$#', $data, $matches), 'wp_localize_scripts does not have TangibleFields');
		$data = json_decode($matches[1], true);

		$this->assertEquals(['api', 'fields', 'dependents', 'mimetypes'], array_keys($data));
	}

	public function test_fields_enqueue_conditions() {
		tangible_fields()->enqueue_field('test', [
			'type' => 'number'
		]);

		tangible_fields()->enqueue_field('field', [
			'type' => 'number',
			'condition' => $condition = [
				'action' => 'show',
				'condition' => [
					'test' => [
						'_gt' => 0,
					]
				],
			],
		]);

		tangible_fields()->maybe_enqueue_scripts();
		preg_match('#^var TangibleFields = (.+?);$#', wp_scripts()->get_data('tangible-fields', 'data'), $matches);
		$data = json_decode($matches[1], true);

		$this->assertArrayNotHasKey('condition', $data['fields']['test']);
		$this->assertEquals($condition, $data['fields']['field']['condition']);
	}
}
