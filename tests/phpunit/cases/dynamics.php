<?php
class Dynamics_TestCase extends WP_UnitTestCase {
	public function test_fields_dynamic_name() {
		$this->assertEquals('test', tangible_fields()->get_dynamic_name('{{test}}'));
		$this->assertEquals(' test ', tangible_fields()->get_dynamic_name('{{ test }}'));
	}

	public function test_fields_dynamic_value() {
		$this->assertFalse(tangible_fields()->is_dynamic_value('test'));
		$this->assertFalse(tangible_fields()->is_dynamic_value('{{'));
		$this->assertFalse(tangible_fields()->is_dynamic_value('}}'));
		$this->assertFalse(tangible_fields()->is_dynamic_value('{}'));

		$this->assertTrue(tangible_fields()->is_dynamic_value('{{test}}'));
		$this->assertTrue(tangible_fields()->is_dynamic_value('{{    }}'));
		$this->assertTrue(tangible_fields()->is_dynamic_value('{{}}'));
		$this->assertTrue(tangible_fields()->is_dynamic_value('test{{}}'));
		$this->assertTrue(tangible_fields()->is_dynamic_value('t{{s}}t'));
	}

	public function test_fields_dynamic_get_config() {
		$this->assertEmpty(tangible_fields()->get_dynamic_config([]));
		$this->assertEmpty(tangible_fields()->get_dynamic_config(['name' => null]));
		$this->assertEmpty(tangible_fields()->get_dynamic_config(['name' => false]));
		$this->assertEmpty(tangible_fields()->get_dynamic_config(['name' => 'test']));

		foreach (['description', 'label', 'placeholder', 'asyncArgs'] as $field) {
			$this->assertEmpty(tangible_fields()->get_dynamic_config([
				'name' => 'test',
				$field => '{field}',
			]));

			$config = tangible_fields()->get_dynamic_config([
				'name' => 'test',
				$field => '{{field}}',
			]);

			$this->assertEquals([
				'test' => [
					$field => 'field',
				],
			], $config);

			$this->assertEmpty(tangible_fields()->get_dynamic_config([
				'name' => 'test',
				$field => [],
			]));

			$this->assertEmpty(tangible_fields()->get_dynamic_config([
				'name' => 'test',
				$field => [
					'subkey' => '{field}',
				],
			]));
			
			$config = tangible_fields()->get_dynamic_config([
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

	public function test_fields_dynamic_repeater_values() {
		$this->assertEmpty(tangible_fields()->get_repeater_dynamic_values([]));
		$this->assertEmpty(tangible_fields()->get_repeater_dynamic_values([
			'fields' => [],
		]));

		$this->assertEmpty(tangible_fields()->get_repeater_dynamic_values([
			'fields' => [
				[],
				[]
			],
		]));

		$config = tangible_fields()->get_repeater_dynamic_values([
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

	public function test_fields_dynamic_contexts() {
		$this->assertEmpty(tangible_fields()->get_dynamic_contexts([]));

		$this->assertEmpty(tangible_fields()->get_dynamic_contexts([
			[
				'type' => 'number',
			]
		]));

		$context = tangible_fields()->get_dynamic_contexts([
			[
				'type' => 'repeater',
				'element' => 'test',
			]
		]);

		$this->assertEquals([
			'test' => [],
		], $context);

		$context = tangible_fields()->get_dynamic_contexts([
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
