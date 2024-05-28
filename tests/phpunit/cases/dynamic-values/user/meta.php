<?php

class DynamicValuesUserMeta_TestCase extends WP_UnitTestCase {

  function test_user_dynamic_values_meta() {

    $fields = tangible_fields();
    wp_set_current_user('1');

    $user_id = $this->factory->user->create();

    wp_set_current_user($user_id);

    $dynamic_value = $fields->render_value('[[user_meta::meta_name=nickname::source=current]]');
    $user_meta = get_user_meta( $user_id, 'nickname', true);
    $this->assertEquals($user_meta, $dynamic_value, 'Can\'t find current user ID');
  }
}
