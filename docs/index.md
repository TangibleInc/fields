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
composer install & npm install
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

$fields->render_field($plugin->get_settings_key() . '[setting_dimensions_name]', [
  'type'        => 'dimensions',
  'value'       => '',
  'label'       => 'Dimensions field', // Optional
  'description' => 'Description',  // Optional
  'units'       => [ 'px','vw' ],  // Optional, default ['px']
  'linked'      => false,  // Optional, default false
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

$fields->render_field('repeater_name', [
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
