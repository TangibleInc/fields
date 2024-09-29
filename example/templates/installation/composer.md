#### Use in a plugin

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
```
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

