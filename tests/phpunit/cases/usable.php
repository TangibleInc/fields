<?php
class Usable_TestCase extends WP_UnitTestCase {
	public function test_fields_module_is_loaded_and_usable() {
		$this->assertTrue(function_exists('tangible_fields'), 'tangible_fields() is not defined');
		$this->assertEquals('tangible_fields', tangible_fields()->name);
	}

	public function test_reinitialization() {
		$_previous_tangible_fields = tangible_fields();

		$this->assertEquals(42, tangible_fields(42), 'tangible_fields() did not return override');
		$this->assertEquals(42, tangible_fields(), 'tangible_fields() did not return override');

		// Reinitialize.
		global $_PLUGIN_ENTRYPOINT;
		require dirname($_PLUGIN_ENTRYPOINT) . '/index.php';
		do_action('tangible_fields');

		$this->assertEquals($_previous_tangible_fields->name, tangible_fields()->name);

		// The plugin cannot actually be reinizialized due to require_once calls.
		tangible_fields($_previous_tangible_fields);
	}

	public function test_dynamic_methods_does_not_exist() {
		$errored = null;
		set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
			$errored = [$errno, $errstr, $args];
			restore_error_handler();
		});
		tangible_fields()->_this_method_does_not_exist();

		$this->assertNotNull($errored, '_this_method_does_not_exist did not trigger a warning');
		[$errno, $errstr, $args] = $errored;

		$this->assertEquals(E_USER_WARNING, $errno, '_this_method_does_not_exist did not trigger an E_USER_WARNING');
	}

	public function test_dynamic_method_exists() {
		tangible_fields()->_this_method_returns_true = '__return_true';
		$this->assertTrue(tangible_fields()->_this_method_returns_true(), '_this_method_returns_true does not return true');
	}
}
