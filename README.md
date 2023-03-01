## Testing

This modules comes with a suite of unit and integration tests.

`composer install --dev` will install PHPUnit.

You will need a copy of https://github.com/WordPress/wordpress-develop.git available. You can run `git clone https://github.com/WordPress/wordpress-develop.git` in this directory as this is where the bootstrap script expects it to be by default (the `WORDPRESS_DEVELOP_DIR` environment variable overrides this path).

Bootstrap the WordPress development environment by running `npm i; npm run dev:build`. Then copy wp-tests-config-sample.php to wp-tests-config.php inside the wordpress-develop directory and set the database credentials as needed. **WARNING!** This database is **dropped** everytime the tests run. Do not use a production database.

Run `vendor/bin/phpunit` to launch the tests and hope for all green ;)

Unit and integration tests are mixed together (as is usual in WordPress) and can be found in tests/phpunit/cases and its subdirectories. Every case is in a class extending a TestCase, every test should be a public function starting with "test". We prefer snake case.

The `DOING_TANGIBLE_TESTS` constant is defined during tests and can be used to modify core behavior as needed.

Coverage can be had using `vendor/bin/phpunit --coverage-text` (requires the XDebug extension to be available and enabled) or `vendor/bin/phpunit --coverage-html=coverage` for an HTML version.

https://docs.phpunit.de/en/9.6/
