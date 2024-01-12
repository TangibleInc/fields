<?php

class FormatElement_TestCase extends WP_UnitTestCase {

  public function test_format_element_args_empty() {
    $args = tangible_fields()->format_element_args('test', []);
    $this->assertEquals(['element'], array_keys($args));
    $this->assertStringStartsWith('tangible-element-test-', $args['element']);
  }

  public function _test_format_groups_args_data() {
    return [
      ['repeater'],
      ['accordion'],
      ['field_group']
    ]; 
  }
}
