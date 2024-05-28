<?php

class DynamicValuesUserID_TestCase extends WP_UnitTestCase {

  function test_user_dynamic_values_id() {

    $fields = tangible_fields();
    wp_set_current_user('1');

    $user_id = $this->factory->user->create();

    $dynamic_value = $fields->render_value('[[user_id]]');
    $this->assertNotEquals($user_id, $dynamic_value);

    wp_set_current_user($user_id);
    $dynamic_value = $fields->render_value('[[user_id]]');
    $this->assertEquals($user_id, $dynamic_value, 'Can\'t find current user ID');
  }
}
