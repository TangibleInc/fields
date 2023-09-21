<?php

class Dynamics_TestCase extends WP_UnitTestCase {

  function test_dynamic_value_category_registration() {
   
    $fields = tangible_fields();
    $fields->register_dynamic_value_category('test-category', [
      'label' => 'Test category'
    ]);

    $this->assertEquals(
      $fields->dynamic_values_categories['test-category'],
      [
        'name'   => 'test-category',
        'label'  => 'Test category',
        'values' => []
      ],
      'category was not registered'
    );

    $errored = null;
    set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
      $errored = [$errno, $errstr, $args];
      restore_error_handler();
    });

    $fields->register_dynamic_value_category('test-category');
    $this->assertNotNull($errored, 'registering category with same name did not trigger a warning');
    $this->assertEquals(E_USER_WARNING, $errored[0], 'registering category with same name not trigger an E_USER_WARNING');
  }

  function test_dynamic_value_category_registration_no_label() {
    
    $fields = tangible_fields();
    $fields->register_dynamic_value_category('test-category-no-label');

    $this->assertEquals(
      $fields->dynamic_values_categories['test-category-no-label'],
      [
        'name'   => 'test-category-no-label',
        'label'  => 'test-category-no-label',
        'values' => []
      ],
      'label was not set during registration'
    );
  }

  /**
   * @depends test_dynamic_value_category_registration
   */
  function test_dynamic_value_registration() {
   
    $fields = tangible_fields();
    $fields->register_dynamic_value($args = [
      'category' => 'test-category',
      'name'     => 'test-value',
    ]);

    $this->assertNotNull($fields->dynamic_values['test-value'], 'dynamic value was not registered');

    $errored = null;
    set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
      $errored = [$errno, $errstr, $args];
      restore_error_handler();
    });

    $fields->register_dynamic_value($args);
    $this->assertNotNull($errored, 'registering dynamic value with same name did not trigger a warning');
    $this->assertEquals(E_USER_WARNING, $errored[0], 'registering dynamic value with same name not trigger an E_USER_WARNING');
  }

  /**
   * @depends test_dynamic_value_category_registration
   */
  function test_dynamic_value_registration_without_name() {

    $errored = null;
    set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
      $errored = [$errno, $errstr, $args];
      restore_error_handler();
    });

    $fields = tangible_fields();
    $fields->register_dynamic_value(['category' => 'test-category']);

    $this->assertNotNull($errored, 'registering dynamic value without a name did not trigger a warning');
    $this->assertEquals(E_USER_WARNING, $errored[0], 'registering dynamic value without a name not trigger an E_USER_WARNING');
  }

  function test_dynamic_value_registration_without_category() {

    $errored = null;
    set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
      $errored = [$errno, $errstr, $args];
      restore_error_handler();
    });

    $fields = tangible_fields();
    $fields->register_dynamic_value(['name' => 'test-value-without-category']);

    $this->assertNotNull($errored, 'registering dynamic value without a category did not trigger a warning');
    $this->assertEquals(E_USER_WARNING, $errored[0], 'registering dynamic value without a category not trigger an E_USER_WARNING');
  }

  /**
   * @depends test_dynamic_value_category_registration
   */
  function test_dynamic_value_registration_fields_formating() {

    $fields = tangible_fields();
    $fields->register_dynamic_value([
      'name'    => 'test-value-with-fields',
      'category'=> 'test-category',
      'fields'  => [
        [
          'type' => 'color_picker',
          'name' => 'name'
        ]
      ]
    ]);
    
    $this->assertEquals(
      $fields->dynamic_values['test-value-with-fields']['fields'][0]['type'],
      'color-picker',
      'dynamic value fields was not formated during registration'
    );
  }

  /**
   * @depends test_dynamic_value_category_registration
   */
  function test_dynamic_value_render() {

    $fields = tangible_fields();
    $fields->register_dynamic_value([
      'name'     => 'test-value-render',
      'category' => 'test-category',
      'callback' => function() {
        return 'parsed_value';
      },
      'permission_callback_store' => '__return_true',
      'permission_callback_parse' => '__return_true'
    ]);
    
    $parsed_value = $fields->render_value('Dynamic value: [[test-value-render]]');
    $this->assertEquals($parsed_value, 'Dynamic value: parsed_value', 'dynamic value was not parsed');
  }

  function test_dynamic_value_render_unregistered() {
    
    $fields = tangible_fields();

    $value = 'Unregistered dynamic value: [[unregistered-dynamic-value]]';
    $parsed_value = $fields->render_value($value);
    
    $this->assertEquals(
      $parsed_value, 
      'Unregistered dynamic value: ', 
      'unregistered dynamic value was parsed'
    );

    $fields->register_field('store-unregistered-dynamic-value', 
      [ 'permission_callback' => '__return_true' ]
      + $fields->_store_callbacks['memory']()
    );

    $fields->store_value('store-unregistered-dynamic-value', $value);
    
    $this->assertEquals(
      $fields->fetch_value('store-unregistered-dynamic-value'),
      'Unregistered dynamic value: ', 
      'Unregistered dynamic value was stored'
    );

    // Cleanup
    $this->assertTrue( 
      $fields->store_value('store-unregistered-dynamic-value', null) 
    );
  }

  /**
   * @depends test_dynamic_value_category_registration
   */
  function test_dynamic_value_render_unauthorized() {
    
    $fields = tangible_fields();
    $fields->register_dynamic_value([
      'name'     => 'unauthorized-dynamic-value',
      'category' => 'test-category',
      'callback' => function() {
        return 'parsed_value';
      },
      'permission_callback_store' => '__return_false',
      'permission_callback_parse' => '__return_false'
    ]);

    $value = 'Unauthorized dynamic value: [[unauthorized-dynamic-value]]';
    $parsed_value = $fields->render_value($value);

    $this->assertEquals(
      $parsed_value,
      'Unauthorized dynamic value: ', 
      'unauthorized dynamic value was parsed'
    );

    $fields->register_field('store-unauthorized-dynamic-value', 
      [ 'permission_callback' => '__return_true' ]
      + $fields->_store_callbacks['memory']()
    );

    $fields->store_value('store-unauthorized-dynamic-value', $value);
    
    $this->assertEquals(
      $fields->fetch_value('store-unauthorized-dynamic-value'),
      'Unauthorized dynamic value: ', 
      'unauthorized dynamic value was stored'
    );

    // Cleanup
    $this->assertTrue( 
      $fields->store_value('store-unauthorized-dynamic-value', null) 
    );
  }

  /**
   * @depends test_dynamic_value_category_registration
   */
  function test_dynamic_value_render_with_settings() {

    $fields = tangible_fields();
    $fields->register_dynamic_value([
      'name'     => 'test-value-with-settings',
      'category' => 'test-category',
      'fields'   => [
        [
          'type' => 'text',
          'name' => 'return_value_1'
        ]
      ],
      'callback' => function($settings) {
        return $settings['return_value_1'] === 'yes'
          ? 'value_1'
          : 'value_2';
      },
      'permission_callback_store' => '__return_true',
      'permission_callback_parse' => '__return_true'
    ]);

    $parsed_value = $fields->render_value('[[test-value-with-settings]]');
    $this->assertEquals($parsed_value, 'value_2', 'parsed value was not equal to value_2 with empty settings');

    $parsed_value = $fields->render_value('[[test-value-with-settings::return_value_1=no]]');
    $this->assertEquals($parsed_value, 'value_2', 'parsed value was not equal to value_2 with return_value_1=no');

    $parsed_value = $fields->render_value('[[test-value-with-settings::return_value_1=yes]]');
    $this->assertEquals($parsed_value, 'value_1', 'parsed value was not equal to value_1 with return_value_1=yes');
  }

  /**
   * @depends test_dynamic_value_category_registration
   */
  function test_dynamic_value_render_with_context() {
    
    $fields = tangible_fields();
    $fields->register_dynamic_value([
      'name'     => 'test-value-with-config',
      'category' => 'test-category',
      'callback' => function($settings, $config) {
        return $config['context']['current_user_id'] . '-' . $config['context']['current_post_id'];
      },
      'permission_callback_store' => '__return_true',
      'permission_callback_parse' => '__return_true'
    ]);

    $default_config = $fields->get_dynamic_value_default_config();
    
    $parsed_value = $fields->render_value('[[test-value-with-config]]');
    $expected_value = $default_config['context']['current_user_id'] . '-' . $default_config['context']['current_post_id'];
    $this->assertEquals($parsed_value, $expected_value, 'parsed value was not equal to default config');

    $parsed_value = $fields->render_value('[[test-value-with-config]]', [ 
      'context' => [
        'current_post_id' => 2
      ]
    ]);
    $expected_value = $default_config['context']['current_user_id'] . '-' . 2;
    $this->assertEquals($parsed_value, $expected_value, 'parsed was not equal to config');
  }

  /**
   * @depends test_dynamic_value_category_registration
   */
  function test_dynamic_values_data_for_enqueue() {
    
    $fields = tangible_fields();
    $data = $fields->get_dynamic_value_data();

    $this->assertIsArray($data, 'get_dynamic_value_data() does not return an array');
    $this->assertEquals(
      array_keys($data),
      ['values', 'categories'],
      'get_dynamic_value_data() does not contain the expected keys'
    );
  
    $this->assertIsArray($data['values'], 'get_dynamic_value_data()["values"] is not an array');
    $this->assertIsArray($data['categories'], 'get_dynamic_value_data()["categories"] is not an array');
    
    $registered_category = $data['categories']['test-category'] ?? false;
    $this->assertIsArray($registered_category, 'get_dynamic_value_data()["categories"] does not contain registered category');
    $this->assertEquals(
      array_keys($registered_category),
      ['label', 'name', 'values'],
      'the registered category does not contain the expected keys'
    );

    $fields->register_dynamic_value([
      'name'     => 'test-value-enqueue',
      'category' => 'test-category',
      'callback' => function($settings, $config) {
        return '';
      },
      'permission_callback_store' => '__return_true',
      'permission_callback_parse' => '__return_true'
    ]);

    $expected_count = count($data['values']) + 1;
    $data = $fields->get_dynamic_value_data();
    
    $this->assertEquals(
      count($data['values']),
      $expected_count,
      'get_dynamic_value_data()["values"] does not contain registered category'
    );
    
    $fields->register_dynamic_value([
      'name'     => 'test-value-not-allowed-enqueue',
      'category' => 'test-category',
      'callback' => function($settings, $config) {
        return '';
      },
      'permission_callback_store' => '__return_false',
      'permission_callback_parse' => '__return_false'
    ]);

    $data = $fields->get_dynamic_value_data();
    $this->assertEquals(
      count($data['values']),
      $expected_count,  
      'get_dynamic_value_data()["values"] does contain unallowed value'
    );
  }

  /**
   * @depends test_dynamic_value_category_registration
   */
  function test_dynamic_values_data_for_enqueue_sorted() {

    $fields = tangible_fields();

    $fields->register_dynamic_value([
      'name'     => 'test-value-sort-last',
      'label'    => 'Z',
      'category' => 'test-category',
      'callback' => function($settings, $config) {
        return '';
      },
      'permission_callback_store' => '__return_true',
      'permission_callback_parse' => '__return_true'
    ]);

    $fields->register_dynamic_value([
      'name'     => 'test-value-sort-first',
      'label'    => 'A',
      'category' => 'test-category',
      'callback' => function($settings, $config) {
        return '';
      },
      'permission_callback_store' => '__return_true',
      'permission_callback_parse' => '__return_true'
    ]);

    $fields->register_dynamic_value([
      'name'     => 'test-value-sort-middle',
      'label'    => 'M',
      'category' => 'test-category',
      'callback' => function($settings, $config) {
        return '';
      },
      'permission_callback_store' => '__return_true',
      'permission_callback_parse' => '__return_true'
    ]);

    $data = $fields->get_dynamic_value_data();

    $this->assertGreaterThan(
      array_search('test-value-sort-first', array_keys($data['values'])),
      array_search('test-value-sort-last', array_keys($data['values'])),
      'get_dynamic_value_data()["values"] is not sorted alphabetically'
    );

    $this->assertGreaterThan(
      array_search('test-value-sort-first', array_keys($data['values'])),
      array_search('test-value-sort-middle', array_keys($data['values'])),
      'get_dynamic_value_data()["values"] is not sorted alphabetically'
    );

    $this->assertGreaterThan(
      array_search('test-value-sort-middle', array_keys($data['values'])),
      array_search('test-value-sort-last', array_keys($data['values'])),
      'get_dynamic_value_data()["values"] is not sorted alphabetically'
    );
  }
}
