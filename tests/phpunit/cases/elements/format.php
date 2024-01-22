<?php

class FormatElement_TestCase extends WP_UnitTestCase {

  public function test_format_element_args_empty() {
    $args = tangible_fields()->format_element_args('test', []);
    $this->assertEquals(['element'], array_keys($args));
    $this->assertStringStartsWith('tangible-element-test-', $args['element']);
  }

  public function _test_format_args_type_attributes_data() {
    return [
      // type, [from => to, from => to...]
      'modal' => ['modal', [
        'cancel_text' => 'cancelText',
        'confirm_text' => 'confirmText'
      ]],
    ];
  }

  /**
   * @dataProvider _test_format_args_type_attributes_data
   */
  public function test_format_element_args_type_attributes(string $type, array $expected) {
    $args = tangible_fields()->format_element_args('test', 
      [ 'type' => $type ]
      + $expected
    );

    foreach ($expected as $name => $attribute) {
      $this->assertEquals($attribute, $args[$attribute], "$name should have been rewritten as $attribute");
      $this->assertArrayNotHasKey($name, $args, "$name should have been rewritten as $attribute");
    }
  }
}
