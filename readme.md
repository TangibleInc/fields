# Tangible Fields

React-based form fields library 

## Use in a plugin

To use the module inside the plugin, you need to update your composer.json. It's required to add the framework in the repositories list as well even if your project dosen't use it directly, because it's used by the fields module and [repositories needs to be defined at the root](https://getcomposer.org/doc/04-schema.md#repositories):
```json
{
  "repositories": [
    {
      "type": "vcs",
      "url": "git@github.com:tangibleinc/fields.git"
    },
    {
      "type": "vcs",
      "url": "git@github.com:tangibleinc/framework.git"
    }
  ],
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

Prerequisites: [Git](https://git-scm.com/), [Node](https://nodejs.org/en/) (version 18 and above)

```sh
git clone git@github.com:tangibleinc/fields.git
cd fields
```

Install dependencies:

```sh
npm ci
```

### JS and CSS

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

## Local test site

Start a local test site using [`wp-now`](https://github.com/WordPress/playground-tools/blob/trunk/packages/wp-now/README.md).

```sh
npm run start
```

For convenience, this also concurrently runs `npm run dev`.

### Dev dependencies

Install dev dependencies such as third-party plugins. This is optional.

```sh
npm run install:dev
```

To keep them updated, run:

```sh
npm run update:dev
```

### Customize environment

Create a file named `.wp-env.override.json` to customize the WordPress environment. This file is listed in `.gitignore` so it's local to your setup.

Mainly it's useful for mounting local folders into the virtual file system. For example, to link another plugin in the parent directory:

```json
{
  "mappings": {
    "wp-content/plugins/example-plugin": "../example-plugin"
  }
}
```

## Tests

### PHPUnit

This module comes with a suite of unit and integration tests.

#### Method 1: Cloning wordpress-develop.git (Previous)

You will need a copy of https://github.com/WordPress/wordpress-develop.git available. You can run `git clone https://github.com/WordPress/wordpress-develop.git` in this directory as this is where the bootstrap script expects it to be by default (the `WORDPRESS_DEVELOP_DIR` environment variable overrides this path).

Bootstrap the WordPress development environment by running `npm i; npm run build:dev`. Then copy wp-tests-config-sample.php to wp-tests-config.php inside the wordpress-develop directory and set the database credentials as needed. **WARNING!** This database is **dropped** everytime the tests run. Do not use a production database.

To install PHPUnit with this method, run `composer install`. You'll need `composer` installed globally.

Run `vendor/bin/phpunit` to launch the tests and hope for all green ;)

Unit and integration tests are mixed together (as is usual in WordPress) and can be found in tests/phpunit/cases and its subdirectories. Every case is in a class extending a TestCase, every test should be a public function starting with "test". We prefer snake case.

The `DOING_TANGIBLE_TESTS` constant is defined during tests and can be used to modify core behavior as needed.

Coverage can be had using `vendor/bin/phpunit --coverage-text` (requires the XDebug extension to be available and enabled) or `vendor/bin/phpunit --coverage-html=coverage` for an HTML version.

https://docs.phpunit.de/en/9.6/ for more information.

#### Method 2: Using wp-env (Recommended)

Alternatively, you can use the [wp-env](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/) tool to serve local dev and test sites, optionally switching between multiple PHP versions.

The test environment is started by running:

```sh
npm run env:start
```

This uses [`wp-env`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/), which requires Docker to be installed. There are instructions available for installing Docker on [Windows](https://docs.docker.com/desktop/install/windows-install/), [macOS](https://docs.docker.com/desktop/install/mac-install/), and [Linux](https://docs.docker.com/desktop/install/linux-install/).

Visit [http://localhost:8888](http://localhost:8888) to see the dev site, and [http://localhost:8889](http://localhost:8880) for the test site, whose database is cleared on every run.

Before running tests, install PHPUnit as a dev dependency using Composer in the container.

```sh
npm run env:composer:install
```

To run the tests:

```sh
npm run env:test:8.2
npm run env:test:7.4
```

The version-specific commands take a while to start, but afterwards you can run npm run env:test to re-run tests in the same environment.

To stop the Docker process:

```sh
npm run env:stop
```

To “destroy” and remove cache:

```sh
npm run env:destroy
```

#### Notes

To run more than one instance of `wp-env`, set different ports for the dev and test sites:

```sh
WP_ENV_PORT=3333 WP_ENV_TESTS_PORT=3334 npm run env:start
```

---

This repository includes NPM scripts to run the tests with PHP versions 8.2 and 7.4. We need to maintain compatibility with PHP 7.4, as WordPress itself only has “beta support” for PHP 8.x. See https://make.wordpress.org/core/handbook/references/php-compatibility-and-wordpress-versions/ for more information.

---

If you’re on Windows, you might have to use [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install) to run the tests (see [this comment](https://bitbucket.org/tangibleinc/tangible-fields-module/pull-requests/30#comment-389568162)).

### Jest

We rely on Jest to test the frontend side of the module:
```
npm install
npm run jest:test
```

### Playwright

End-to-end tests with [Playwright](https://playwright.dev/).

```sh
npm run e2e
```

### Storybook

Frontend workshop for building UI components and pages in isolation with [Storybook](https://storybook.js.org)

```
npm run  storybook dev -p 6006
```

## Render fields

To render a field, we use `$fields->render_field`. It takes 2 arguments:

```php
$fields->render_field(
  'field_name',
  $args,
);
```

The `render_field` method returns an html div, like this one:

```html
<div id="tangible-field-{{name}}-{{uniqid}}"></div>
```

It also enqueue our JavaScript dependencies, which will use this span to render the field on the client side.

## Render elements

The difference between a field and an element is that the element won't have any value.

To render an element, we use `$fields->render_element`. It takes 2 arguments:

```php
$fields->render_element(
  'field_name',
  $args,
);
```

The `render_element` method returns an html div, like this one:

```html
<div id="tangible-element-{{name}}-{{uniqid}}"></div>
```

It also enqueue our JavaScript dependencies, which will use this span to render the field on the client side.

## References

For the complete list of field types and the associated syntax, see documentation on [this site](https://develop.tangible.one/sites/fields/wp-admin/admin.php?page=tangible-field-example-settings).

This is not ideal and we will try to move back the documentation in the module at some point.
