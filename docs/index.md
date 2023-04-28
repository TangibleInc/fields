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
<div id="field_name-63618923e7118"></div>
```

It also enqueue our JavaScript dependencies, which will use this span to render the field on the client side.

## Field types

For the complete list of field types and the associated syntax, see documentation on [this site](https://develop.tangible.one/sites/fields/wp-admin/admin.php?page=tangible-field-example-settings).

This is not ideal and we will try to move back the documentation in the module at some point.
