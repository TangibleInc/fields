<?php

class TF_UnitTestCase extends WP_UnitTestCase {
	public function assertWPErrorCode($expected, $actual) {
		$this->assertInstanceOf(WP_Error::class, $actual);
		$this->assertEquals($expected, $actual->get_error_code());
	}
}
