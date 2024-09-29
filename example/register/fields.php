<?php

namespace Tangible\FieldsExample;

defined('ABSPATH') or die();

/**
 * Registration is undocumented for now
 * 
 * @see ./vendor/tangible/fields/store.php
 */
$plugin->register_options = function(string $name, array $args = []) use($fields) {
  $fields->register_field($name, 
    $args
    + (
      empty($args['json'])
        ? $fields->_store_callbacks['options']('tfe_')
        : ([
          'store_callback' => $fields->_store_callbacks['options']('tfe_')['store_callback'],
          'fetch_callback' => function($name) use($fields) {
            $value =$fields->_store_callbacks['options']('tfe_')['fetch_callback']($name);
            return stripslashes($value); // We need to stripslashes to return valid JSON
          }
        ])
    )
    + $fields->_permission_callbacks([
      'store' => ['user_can', 'manage_options'],
      'fetch' => ['always_allow']
    ])
  );
};

/**
 * We don't want to assume that visitors know that it's required to register a field, so we excplicitly add
 * the registration in all of our examples
 * 
 * This function is just an helper so that we don't have to copy/paste the registration sample everywhere
 */
$plugin->render_registation_message = function() {
?>

   /**
    * Your field must be registered, otherwise you won't be able to use fetch/store_value 
    * See the "Registration" section for more details 
    * 
    * @see https://bitbucket.org/tangibleinc/tangible-fields-module/src/main/store.php
    */
  <?php
};
