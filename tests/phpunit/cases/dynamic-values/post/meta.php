<?php

class DynamicValuesPostMeta_TestCase extends WP_UnitTestCase {

  function test_post_dynamic_values_meta() {

    $fields = tangible_fields();
    wp_set_current_user('1');
    $post = $this->factory->post->create_and_get();

    // Select post
    $dynamic_value = $fields->render_value('[[post_meta::meta_name="_wp_page_template"::source=select::post_id={"value":'.$post->ID.',"label":'.$post->label.'}]]');
    $post_meta = get_post_meta( $post->ID, '_wp_page_template', true);
    $this->assertEquals($post_meta, $dynamic_value);

    // Current post
    $this->go_to(get_permalink($post->ID));
    $dynamic_value = $fields->render_value('[[post_meta::meta_name="_wp_page_template"::source=current]]');
    $post_meta = get_post_meta( $post->ID, '_wp_page_template', true);
    $this->assertEquals($post_meta, $dynamic_value);

    // Without source
    $dynamic_value = $fields->render_value('[[post_meta::meta_name="_wp_page_template"]]');
    $post_meta = get_post_meta( $post->ID, '_wp_page_template', true);
    $this->assertEquals($post_meta, $dynamic_value);
  }
}
