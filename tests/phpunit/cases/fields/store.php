<?php
class Store_TestCase extends TF_UnitTestCase {
  public function setUp(): void {
    tangible_fields()->registered_fields = [];
  }

  public function test_fields_store_store_callbacks_memory() {
    tangible_fields()->register_field('test', 
      [ 'permission_callback' => '__return_true' ] 
      + tangible_fields()->_store_callbacks['memory']()
    );

    $value = tangible_fields()->fetch_value('test');
    $this->assertNull($value);

    $this->assertTrue(tangible_fields()->store_value('test', 'store'));
    $value = tangible_fields()->fetch_value('test');
    $this->assertEquals('store', $value);

    $this->assertTrue(tangible_fields()->store_value('test', null)); // Cleanup.
  }

  public function test_fields_store_store_callbacks_options() {
    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['options']('test_'),
      [ 'permission_callback' => '__return_true' ],
    ));

    $this->assertFalse(get_option('test_test'));

    $this->assertTrue(tangible_fields()->store_value('test', 'store'));
    $this->assertEquals('store', get_option('test_test'));
    $this->assertEquals('store', tangible_fields()->fetch_value('test'));

    $this->assertTrue(tangible_fields()->store_value('test', null)); // Cleanup.
    $this->assertFalse(get_option('test_test'));

    tangible_fields()->register_field('default', array_merge(
      tangible_fields()->_store_callbacks['options'](),
      [ 'permission_callback' => '__return_true' ],
    ));

    $this->assertTrue(tangible_fields()->store_value('default', 'store'));
    $this->assertEquals('store', get_option('tf_default'));

    tangible_fields()->store_value('default', null); // Cleanup.
    $this->assertFalse(get_option('tf_default'));
  }

  public function test_fields_store_store_callbacks_meta_post() {
    $id = wp_insert_post(['post_title' => 'A Tangible Post']);

    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['meta']('post', $id, 'test_'),
      [ 'permission_callback' => '__return_true' ],
    ));

    $this->assertEmpty(get_post_meta($id, 'test_test', true));

    $this->assertTrue(tangible_fields()->store_value('test', 'store'));
    $this->assertEquals('store', get_post_meta($id, 'test_test', true));
    $this->assertEquals('store', tangible_fields()->fetch_value('test'));

    $this->assertTrue(tangible_fields()->store_value('test', null)); // Cleanup.
    $this->assertEmpty(get_post_meta($id, 'test_test'));
  }

  public function test_fields_store_store_callbacks_meta_user() {
    $users = get_users();
    $id = current($users)->ID;

    $the_user_id = function() use (&$id) {
      return $id;
    };

    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['meta']('user', $the_user_id),
      [ 'permission_callback' => '__return_true' ],
    ));

    $this->assertEmpty(get_user_meta($id, 'tf_test', true));

    $this->assertTrue(tangible_fields()->store_value('test', 'store'));
    $this->assertEquals('store', get_user_meta($id, 'tf_test', true));
    $this->assertEquals('store', tangible_fields()->fetch_value('test'));

    $this->assertTrue(tangible_fields()->store_value('test', null)); // Cleanup.
    $this->assertEmpty(get_user_meta($id, 'tf_test'));

    $id = 0;
    $this->assertWPErrorCode('tf-error', tangible_fields()->store_value('test', 'store'));
  }

  public function test_fields_store_permission_custom_permissions() {
    $allowed = false;

    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['memory'](),
      [
        'permission_callback_store' => function() use (&$allowed) {
          return $allowed;
        },
        'permission_callback_fetch' => function() use (&$allowed) {
          return $allowed;
        },
      ]
    ));

    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->store_value('test', 'store'));
    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->fetch_value('test'));

    $allowed = true;
    $this->assertTrue(tangible_fields()->store_value('test', 'store'));
    $this->assertEquals('store', tangible_fields()->fetch_value('test'));

    $allowed = false;
    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->fetch_value('test'));

    $allowed = true;
    tangible_fields()->store_value('test', null); // Cleanup.
  }

  public function test_fields_store_permission_custom_permission() {
    $allowed = false;

    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['memory'](),
      [
        'permission_callback' => function() use (&$allowed) {
          return $allowed;
        },
      ]
    ));

    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->store_value('test', 'store'));
    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->fetch_value('test'));

    $allowed = true;
    $this->assertTrue(tangible_fields()->store_value('test', 'store'));
    $this->assertEquals('store', tangible_fields()->fetch_value('test'));

    $allowed = false;
    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->fetch_value('test'));

    $allowed = true;
    tangible_fields()->store_value('test', null); // Cleanup.
  }

  public function test_fields_store_permission_undefined() {
    tangible_fields()->register_field('test', tangible_fields()->_store_callbacks['memory']());

    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->store_value('test', 'store'));
    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->fetch_value('test'));
  }

  public function test_fields_store_permission_callback_empty() {
    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['memory'](),
      tangible_fields()->_permission_callbacks([])
    ));

    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->store_value('test', 'store'));
    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->fetch_value('test'));
  }

  public function test_fields_store_permission_callback_unknown() {
    $errored = [];
    set_error_handler(function($errno, $errstr, ...$args) use (&$errored) {
      $errored[] = [$errno, $errstr];
    });

    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['memory'](),
      tangible_fields()->_permission_callbacks([
        'store' => 'unknown',
        'fetch' => 'unknown'
      ])
    ));

    restore_error_handler();

    $this->assertNotNull($errored, 'unknown permission callback did not trigger a warning');
    $this->assertCount(2, $errored);
    $this->assertEquals($errored[0], $errored[1], 'the two warnings are not the same');
    [$errno, $errstr] = $errored[0];

    $this->assertEquals(E_USER_WARNING, $errno, 'unknown permission callback did not trigger an E_USER_WARNING');

    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->store_value('test', 'store'));
    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->fetch_value('test'));
  }

  public function test_fields_store_permission_callbacks_always_allow() {
    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['memory'](),
      tangible_fields()->_permission_callbacks([
        'store' => 'always_allow',
        'fetch' => 'always_allow',
      ])
    ));

    $this->assertTrue(tangible_fields()->store_value('test', 'store'));
    $this->assertEquals('store', tangible_fields()->fetch_value('test'));

    tangible_fields()->store_value('test', null); // Cleanup.
  }

  public function test_fields_store_permission_callbacks_user_can() {
    $password = '';
    $current_password = function() use (&$password) {
      return $password;
    };

    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['memory'](),
      tangible_fields()->_permission_callbacks([
        'store' => ['user_can', 'letmein', 'hunter2', $current_password],
        'fetch' => 'always_allow',
      ])
    ));

    add_filter('map_meta_cap', $map_meta_cap_filter = function($caps, $cap, $user_id, $args) {
      list ($expected, $actual) = $args;
      return $expected === $actual ? ['exist'] : ['do_not_allow'];
    }, 10, 4);

    $this->assertWPErrorCode('tf-no-permission', tangible_fields()->store_value('test', 'store'));
    $this->assertNull(tangible_fields()->fetch_value('test'));

    $password = 'hunter2';

    $this->assertTrue(tangible_fields()->store_value('test', 'store'));
    $this->assertEquals('store', tangible_fields()->fetch_value('test'));

    tangible_fields()->store_value('test', null); // Cleanup.
    remove_filter('map_meta_cap', $map_meta_cap_filter, 10);
  }

  public function test_fields_store_validation_callbacks_required() {
    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['memory'](),
      tangible_fields()->_permission_callbacks([
        'store' => 'always_allow',
        'fetch' => 'always_allow',
      ]),
      [
        'validation_callbacks' => [
          tangible_fields()->_validation_callback('required'),
        ]
      ]
    ));

    $this->assertWPErrorCode('tf-validation', tangible_fields()->store_value('test', ''));
    $this->assertTrue(tangible_fields()->store_value('test', 'store'));

    tangible_fields()->store_value('test', null); // Cleanup.
  }

  public function test_fields_store_validation_callbacks_required_custom_message() {
    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['memory'](),
      tangible_fields()->_permission_callbacks([
        'store' => 'always_allow',
        'fetch' => 'always_allow',
      ]),
      [
        'validation_callbacks' => [
          tangible_fields()->_validation_callback('required', 'You MUST fill this in!'),
        ],
      ]
    ));

    $this->assertWPErrorCode('tf-validation', $error = tangible_fields()->store_value('test', ''));
    $this->assertEquals('You MUST fill this in!', $error->get_error_message());
  }

  public function test_fields_store_ajax_should_not_exit_in_testmode() {
    $result = tangible_fields()->__send_ajax([
      'test' => 'me',
    ]);
    $this->assertEquals(['test' => 'me'], $result);
  }

  public function test_fields_store_ajax_registered() {
    $this->assertEquals(10, has_action('wp_ajax_tangible_fields_store', [tangible_fields(), '_ajax_store_callback']), 'AJAX is not registered');
    $this->assertEquals(10, has_action('wp_ajax_nopriv_tangible_fields_store', [tangible_fields(), '_ajax_store_callback']), 'AJAX is not registered');

    $this->assertEquals(10, has_action('wp_ajax_tangible_fields_fetch', [tangible_fields(), '_ajax_fetch_callback']), 'AJAX is not registered');
    $this->assertEquals(10, has_action('wp_ajax_nopriv_tangible_fields_fetch', [tangible_fields(), '_ajax_fetch_callback']), 'AJAX is not registered');
  }

  public function test_fields_store_ajax_store_errors() {
    $response = tangible_fields()->_ajax_store_callback();

    $this->assertEquals([
      'success' => false,
      'error' => 'Unknown field ',
    ], $response);

    $_GET['name'] = 'test';
    $response = tangible_fields()->_ajax_store_callback();

    $this->assertEquals([
      'success' => false,
      'error' => 'Unknown field test',
    ], $response);

    tangible_fields()->register_field('test', [
      'type' => 'text',
    ]);

    $response = tangible_fields()->_ajax_store_callback();

    $this->assertEquals([
      'success' => false,
      'error' => 'Unknown store callback for test',
    ], $response);

    unset($_GET['name']);
  }

  public function test_fields_store_ajax_store() {
    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['memory'](),
      tangible_fields()->_permission_callbacks([
        'store' => 'always_allow',
        'fetch' => 'always_allow',
      ]),
      [
        'validation_callbacks' => [
          tangible_fields()->_validation_callback('required', 'You MUST fill this in!'),
        ],
      ]
    ));

    $_GET['name'] = 'test';
    $response = tangible_fields()->_ajax_store_callback();

    $this->assertEquals([
      'success' => false,
      'error' => 'You MUST fill this in!',
    ], $response);

    $_REQUEST['value'] = 42;
    $response = tangible_fields()->_ajax_store_callback();

    $this->assertEquals([
      'success' => true,
      'error' => null
    ], $response);

    $this->assertEquals(42, tangible_fields()->fetch_value('test'));

    unset($_REQUEST['value']);

    tangible_fields()->registered_fields = [];
    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['memory'](),
      tangible_fields()->_permission_callbacks([
        'store' => 'always_allow',
        'fetch' => 'always_allow',
      ])
    ));

    $response = tangible_fields()->_ajax_store_callback();
    $this->assertNull(tangible_fields()->fetch_value('test'));

    unset($_GET['name']);
  }

  public function test_fields_store_ajax_fetch_errors() {
    $response = tangible_fields()->_ajax_fetch_callback();

    $this->assertEquals([
      'success' => false,
      'error' => 'Unknown field ',
    ], $response);

    $_GET['name'] = 'test';

    $response = tangible_fields()->_ajax_fetch_callback();

    $this->assertEquals([
      'success' => false,
      'error' => 'Unknown field test',
    ], $response);

    tangible_fields()->register_field('test', [
      'type' => 'text',
    ]);

    $response = tangible_fields()->_ajax_fetch_callback();

    $this->assertEquals([
      'success' => false,
      'error' => 'Unknown fetch callback for test',
    ], $response);

    unset($_GET['name']);
  }

  public function test_fields_store_ajax_fetch() {
    tangible_fields()->register_field('test', array_merge(
      tangible_fields()->_store_callbacks['memory'](),
      tangible_fields()->_permission_callbacks([
        'store' => 'always_allow',
        'fetch' => 'always_allow',
      ])
    ));

    $_GET['name'] = 'test';

    $response = tangible_fields()->_ajax_fetch_callback();

    $this->assertEquals([
      'success' => true,
      'error' => null,
      'value' => null,
    ], $response);

    unset($_GET['name']);
  }
}
