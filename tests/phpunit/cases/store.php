<?php
class Store_TestCase extends WP_UnitTestCase {
	public function setUp(): void {
		tangible_fields()->registered_fields = [];
	}

	public function test_fields_store_memory_callbacks() {
		$test = &$this;
		tangible_fields()->register_field('test', [
			...tangible_fields()->_store_callbacks['memory'](),
			'permission_callback' => '__return_true',
		]);

		$value = tangible_fields()->fetch_value('test');
		$this->assertNull($value);

		$this->assertTrue(tangible_fields()->store_value('test', 'store'));
		$value = tangible_fields()->fetch_value('test', 'sentinel');
		$this->assertEquals('store', $value);
	}
}
