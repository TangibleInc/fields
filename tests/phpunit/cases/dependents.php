<?php
class Dependents_TestCase extends WP_UnitTestCase {
	public function test_fields_dependent_name() {
		$this->assertEquals('test', tangible_fields()->get_dependent_name('{{test}}'));
		$this->assertEquals(' test ', tangible_fields()->get_dependent_name('{{ test }}'));
	}

	public function test_fields_dependent_value() {
		$this->assertFalse(tangible_fields()->is_dependent_value('test'));
		$this->assertFalse(tangible_fields()->is_dependent_value('{{'));
		$this->assertFalse(tangible_fields()->is_dependent_value('}}'));
		$this->assertFalse(tangible_fields()->is_dependent_value('{}'));

		$this->assertTrue(tangible_fields()->is_dependent_value('{{test}}'));
		$this->assertTrue(tangible_fields()->is_dependent_value('{{    }}'));
		$this->assertTrue(tangible_fields()->is_dependent_value('{{}}'));
		$this->assertTrue(tangible_fields()->is_dependent_value('test{{}}'));
		$this->assertTrue(tangible_fields()->is_dependent_value('t{{s}}t'));
	}

	public function test_fields_dependent_get_config() {
		$this->assertEmpty(tangible_fields()->get_dependent_config([]));
		$this->assertEmpty(tangible_fields()->get_dependent_config(['name' => null]));
		$this->assertEmpty(tangible_fields()->get_dependent_config(['name' => false]));
		$this->assertEmpty(tangible_fields()->get_dependent_config(['name' => 'test']));

		foreach (['description', 'label', 'placeholder', 'asyncArgs'] as $field) {
			$this->assertEmpty(tangible_fields()->get_dependent_config([
				'name' => 'test',
				$field => '{field}',
			]));

			$config = tangible_fields()->get_dependent_config([
				'name' => 'test',
				$field => '{{field}}',
			]);

			$this->assertEquals([
				'test' => [
					$field => 'field',
				],
			], $config);

			$this->assertEmpty(tangible_fields()->get_dependent_config([
				'name' => 'test',
				$field => [],
			]));

			$this->assertEmpty(tangible_fields()->get_dependent_config([
				'name' => 'test',
				$field => [
					'subkey' => '{field}',
				],
			]));
			
			$config = tangible_fields()->get_dependent_config([
				'name' => 'test',
				$field => [
					'subkey' => '{{field}}',
					'subkey_' => '{{field_}}',
				],
			]);

			$this->assertEquals([
				'test' => [
					$field => [
						'subkey' => 'field',
						'subkey_' => 'field_',
					],
				],
			], $config);
		}
	}

	public function test_fields_dependent_repeater_values() {
		$this->assertEmpty(tangible_fields()->get_repeater_dependent_values([]));
		$this->assertEmpty(tangible_fields()->get_repeater_dependent_values([
			'fields' => [],
		]));

		$this->assertEmpty(tangible_fields()->get_repeater_dependent_values([
			'fields' => [
				[],
				[]
			],
		]));

		$config = tangible_fields()->get_repeater_dependent_values([
			'fields' => [
				[
					'name' => 'test',
					'description' => '{{description}}',
					'label' => '{{label}}',
					'placeholder' => '{{placeholder}}',
					'asyncArgs' => '{{asyncArgs}}',
				],
				[
					'name' => 'tset',
					'description' => '{{description}}',
					'label' => '{{label}}',
					'placeholder' => '{{placeholder}}',
					'asyncArgs' => '{{asyncArgs}}',
				],
				[
					'name' => 'empty',
				],
				[],
			],
		]);

		$this->assertEquals([
			'test' => [
				'description' => 'description',
				'label' => 'label',
				'placeholder' => 'placeholder',
				'asyncArgs' => 'asyncArgs',
			],
			'tset' => [
				'description' => 'description',
				'label' => 'label',
				'placeholder' => 'placeholder',
				'asyncArgs' => 'asyncArgs',
			],
		], $config);
	}

	public function test_fields_dependent_contexts() {
		$this->assertEmpty(tangible_fields()->get_dependent_contexts([]));

		$this->assertEmpty(tangible_fields()->get_dependent_contexts([
			[
				'type' => 'number',
			]
		]));

		$context = tangible_fields()->get_dependent_contexts([
			[
				'type' => 'repeater',
				'element' => 'test',
			]
		]);

		$this->assertEquals([
			'test' => [],
		], $context);

		$context = tangible_fields()->get_dependent_contexts([
			[
				'type' => 'field-group',
				'element' => 'test',
				'fields' => [
					[
						'name' => 'test',
						'description' => '{{description}}',
					],
				],
			]
		]);

		$this->assertEquals([
			'test' => [
				'test' => [
					'description' => 'description',
				]
			],
		], $context);
	}
}
