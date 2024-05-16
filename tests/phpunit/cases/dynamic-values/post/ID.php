<?php

class DynamicValuesPostID_TestCase extends WP_UnitTestCase {

  function test_post_dynamic_values_id() {

    $fields = tangible_fields();
    wp_set_current_user('1');

    $post_id = $this->factory->post->create();

    $dynamic_value = $fields->render_value('[[post_id]]');
    $this->assertNotEquals($post_id, $dynamic_value);

    $this->go_to(get_permalink($post_id));
    $dynamic_value = $fields->render_value('[[post_id]]');
    $this->assertEquals($post_id, $dynamic_value, 'Can\'t find current post ID');
  }
}
