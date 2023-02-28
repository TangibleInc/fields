<?php
class Usable_TestCase extends WP_UnitTestCase {
	public function test_fields_module_is_loaded_and_usable() {
		$this->assertTrue(function_exists('tangible_fields'), 'tangible_fields() is not defined');
	}
}
