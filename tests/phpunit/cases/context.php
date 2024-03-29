<?php
class Context_TestCase extends WP_UnitTestCase {
	public function setUp(): void {
		tangible_fields()->enqueued_contexts = [];
	}

	public function test_fields_context() {
		$this->assertEquals(['default','wp','elementor','beaver-builder'], tangible_fields()->contexts);
		$this->assertEquals('default', tangible_fields()->current_context);
		$this->assertEmpty(tangible_fields()->enqueued_contexts);

		tangible_fields()->set_context('unknown');
		$this->assertEquals(['default','wp','elementor','beaver-builder'], tangible_fields()->contexts);
		$this->assertEquals('default', tangible_fields()->current_context);
		$this->assertEmpty(tangible_fields()->enqueued_contexts);

		tangible_fields()->set_context('default');
		$this->assertEquals(['default','wp','elementor','beaver-builder'], tangible_fields()->contexts);
		$this->assertEquals('default', tangible_fields()->current_context);
		$this->assertEquals(['default'], tangible_fields()->enqueued_contexts);

		tangible_fields()->contexts []= 'custom';
		tangible_fields()->set_context('custom');
		$this->assertEquals(['default','wp','elementor','beaver-builder','custom'], tangible_fields()->contexts);
		$this->assertEquals('custom', tangible_fields()->current_context);
		$this->assertEquals(['default', 'custom'], tangible_fields()->enqueued_contexts);
    tangible_fields()->set_context('default');
  }

  public function test_fields_context_with_enqueue_config() {
    tangible_fields()->set_context('wp');
    tangible_fields()->enqueue([ 'context' => ['elementor'] ]); 
		$this->assertEquals(['wp', 'elementor'], tangible_fields()->enqueued_contexts);
    tangible_fields()->set_context('default');
  }
}
