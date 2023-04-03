# Tangible Field module

Not ready to be used yet, just a proof of concept for now.

## Use in a plugin

Add module to your composer.json:

```json
{
  "repositories": [{
    "type": "vcs",
    "url": "git@bitbucket.org:/tangibleinc/tangible-fields-module.git"
  }],
  "require": {
    "tangible/fields": "dev-main"
  },
  "minimum-stability": "dev"
}
```

The module can then be installed in your project using:

```sh 
composer install
```

The module needs to be manually required in your code:

```php
require_once __DIR__ . '/vendor/tangible/fields/index.php';
```

You can then access the module from anywhere using this function:
```php
$fields = tangible_fields();
```

## Develop

Install depedencies:

```sh
composer install & npm ci
```

Build for development - watch files for changes and rebuild

```sh
npm run dev
```

Build for production

```sh
npm run build
```

Format to code standard

```sh
npm run format
```

## Tests

This modules comes with a suite of unit and integration tests.

`composer install --dev` will install PHPUnit.

You will need a copy of https://github.com/WordPress/wordpress-develop.git available. You can run `git clone https://github.com/WordPress/wordpress-develop.git` in this directory as this is where the bootstrap script expects it to be by default (the `WORDPRESS_DEVELOP_DIR` environment variable overrides this path).

Bootstrap the WordPress development environment by running `npm i; npm run dev:build`. Then copy wp-tests-config-sample.php to wp-tests-config.php inside the wordpress-develop directory and set the database credentials as needed. **WARNING!** This database is **dropped** everytime the tests run. Do not use a production database.

Run `vendor/bin/phpunit` to launch the tests and hope for all green ;)

Unit and integration tests are mixed together (as is usual in WordPress) and can be found in tests/phpunit/cases and its subdirectories. Every case is in a class extending a TestCase, every test should be a public function starting with "test". We prefer snake case.

The `DOING_TANGIBLE_TESTS` constant is defined during tests and can be used to modify core behavior as needed.

Coverage can be had using `vendor/bin/phpunit --coverage-text` (requires the XDebug extension to be available and enabled) or `vendor/bin/phpunit --coverage-html=coverage` for an HTML version.

https://docs.phpunit.de/en/9.6/ for more information.

## Render fields

To render a field, we use `$fields->render_field`. It takes 2 arguments:

```php
$fields->render_field(
  'field_name',
  $args,
);
```

The `render_field` method returns an html span, like this one:

```html
<span id="field_name-63618923e7118"></span>
```

It also enqueue our JavaScript dependencies, which will use this span to render the field on the client side.

## Field types

```php

require_once __DIR__ . '/vendor/tangible/fields/index.php';

$fields = tangible_fields();

$fields->render_field('button_group_name', [
  'type'        => 'button-group',
  'value'       => 'center', 
  'label'       => 'Button group field', // Optional
  'description' => 'Description', // Optional
  'options'     => [
    [
      'value'     => 'left',
      'dashicon'  => 'editor-alignleft'
    ],[
      'value'     => 'center',
      'dashicon'  => 'editor-aligncenter'
    ],[
      'value'     => 'right',
      'dashicon'  => 'editor-alignright'
    ]
  ]
]);

$fields->render_field('color_name', [
  'type'        => 'color',
  'value'       => '#FFFFFF',
  'label'       => 'Color',
  'hasAlpha'    => true, // Optional, default true
  'format'      => 'rgba', // Optional, default hexa
  'placeholder' => 'Example placeholder', // Optional
  'description' => 'Example description' // Optional
]),

$fields->render_field('combo_box_name', [
  'type'    => 'combo-box',
  'value'   => '1',
  'options' => [
    // Can be used without categories
    [
      'name'     => 'Category 1',
      'children' => [ 
        [ 'id' => 'placeholder_1', 'name' => 'Label 1' ],
        [ 'id' => 'placeholder_2', 'name' => 'Label 2' ]
      ],
    ],[
      'name'     => 'Category 2',
      'children' => [ 
        [ 'id' => 'placeholder_3', 'name' => 'Label 3' ],
        [ 'id' => 'placeholder_4', 'name' => 'Label 4' ]
      ]
    ]
  ],
  'label'       => 'Label', // Optional
  'placeholder' => 'Example placeholder', // Optional
  'description' => 'Example description' // Optional
]);

$fields->render_field('dimensions_name', [
  'type'        => 'dimensions',
  'value'       => '',
  'label'       => 'Dimensions field', // Optional
  'description' => 'Description',  // Optional
  'units'       => [ 'px','vw' ],  // Optional, default ['px']
  'linked'      => 'toggle', // Optional, default toggle (use true or false to force value)
]);

$fields->render_field('simple_dimension_name', [
  'type'        => 'simple_dimension', // Support for single-valued dimensions
  'label'       => 'Simple Dimension field', // Optional
  'description' => 'Description', // Optional
  'units'       => [ 'px','vh','%','vw' ], // Optional, default px
  'value'       => '',
]);

$fields->render_field('date_name', [
  'type'        => 'date',
  'value'       => '2025-01-31',
  'label'       => 'Date field', // Optional
  'description' => 'Description', // Optional
]);

$fields->render_field('file_upload_name', [
  'label'         => 'Dimensions field',
  'type'          => 'file-upload',
  'description'   => 'Description',
  'value'         => '',
  'max_upload'    => 5, // Optional, default none
  'allowed_types' => [ // Optional, Default all allowed types
    'image/jpeg', 
    'image/gif', 
    'image/png', 
    'image/bmp', 
    'image/tiff', 
    'image/webp', 
    'image/x-icon', 
    'image/heic'
  ]
]);

$fields->render_field('gradient_name', [
  'type'        => 'gradient',
  'value'       => '',
  'label'       => 'Gradient field', // Optional
  'placeholder' => 'Example placeholder', // Optional
  'description' => 'Description',  // Optional
]);

$fields->render_field('number_name', [
  'type'        => 'number',
  'value'       => 30,
  'min'         => 10, // Optional
  'max'         => 100, // Optional
  'label'       => 'Label', // Optional
  'placeholder' => 'Example placeholder', // Optional
  'description' => 'Example description' // Optional
  'hasButtons'  => true, // Optional
]);

$fields->render_field('repeater_list_name', [
  'type'    => 'repeater-list',
  'value'   => '',
  'fields'  => [          
    [
      'type'  => 'text',
      'value' => 'Field value', 
      'name'  => 'repeater_text_name'
    ],[
      // Any existing field
    ]
  ]
]);

$fields->render_field('repeater_table_name', [
  'type'    => 'repeater-table',
  'value'   => '',
  'fields'  => [          
    [
      'type'  => 'text',
      'value' => 'Field value', 
      'name'  => 'repeater_text_name'
    ],[
      // Any existing field
    ]
  ]
]);

$fields->render_field('select_name', [
  'type'    => 'select',
  'value'   => '1',
  'options' => [
    [ 'id' => '1', 'name' => 'Value 1' ],
    [ 'id' => '2', 'name' => 'Value 2' ],
  ],
  'label'       => 'Label', // Optional
  'placeholder' => 'Example placeholder', // Optional
  'description' => 'Example description' // Optional
]);

$fields->render_field('switch_name', [
  'type'        => 'switch',
  'label'       => 'Switch field',
  'description' => 'Description',
  'activated'   => 'on', // Optional, default on
  'desactivated'=> 'off', // Optional, default off
  'value'       => 'on',
]);

$fields->render_field('text_field_name', [
  'type'        => 'text',
  'value'       => 'Field value', 
  'label'       => 'Label', // Optional
  'placeholder' => 'Example placeholder', // Optional
  'description' => 'Example description' // Optional
]);

$fields->render_field('text_suggestion_name', [
  'type'       => 'text-suggestion',
  'value'      => 'Text with a [[placeholder_1]]',
  'options'    => [ 
    // Can be used without categories
    [
      'name'     => 'Category 1',
      'children' => [ 
        [ 'id' => 'placeholder_1', 'name' => 'Label 1' ],
        [ 'id' => 'placeholder_2', 'name' => 'Label 2' ]
      ],
    ],[
      'name'     => 'Category 2',
      'children' => [ 
        [ 'id' => 'placeholder_3', 'name' => 'Label 3' ],
        [ 'id' => 'placeholder_4', 'name' => 'Label 4' ]
      ]
    ]
  ]
]);

```
