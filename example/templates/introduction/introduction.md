#### Concept

Tangible Fields is a composer module designed to easily generate form fields that utilize a unified styling across multiple code bases. This module can be used from both PHP and JavaScript (although this documentation only covers the PHP part at the moment).

It's important to note that currently, this module is purely front-end focused and does not handle getting or saving data by itself.

#### How it Works

To generate a field, we pass a field name and a configuration array to the `render_field()` method, which return an empty `<div>` element with a unique ID:

```php
$fields = tangible_fields();

$field_html = $fields->render_field('field_name', 
  [
    'label'       => 'Text field',
    'type'        => 'text',
    'value'       => '',
    'placeholder' => 'Example placeholder',
    'description' => 'Example description'
  ]
);
```

In this example, the value of `$field_html` will be something like this: 
```html
<div id="field_name-63f4729c357e4"></div>
```

The module keeps track of which field name/configuration is associated to which `') ?>` thanks to the id and passes all data (div id + field configuration) to the frontend. The appropriate React component is then initialized inside the correct `<div>` based on this.

Each field type is linked to a react component. You can see which field type is associated with which component in the [types.js file](https://bitbucket.org/tangibleinc/tangible-fields-module/src/main/assets/src/types.js).

When a field is initialized, the associated config is passed to the component as react props.

To generate the JS/CSS build file, we use an internal tool called Tangible Roller (the documentation can be found [here](https://develop.tangible.one/tools/roller)).

#### Getting started

An easy way to work on the Tangible Fields module is to work from the [documentation repository](https://bitbucket.org/tangibleinc/tangible-fields-example/src/main/), which is a wordpress plugin that uses the Tangible Fields as a composer dependency.

One advantage of working from this plugin is that all the possible fields are already included in the documentation as example, an can be used for testing.

As long as Tangible Fields is used as a composer module, so the repository will be available in /vendor/tangible/fields. You can work in this folder directy (it should already be a git repository if the dependencies has been installed by running `composer install`).

The module can also be used in any plugin as a composer module by following the documenation on composer installation page.
