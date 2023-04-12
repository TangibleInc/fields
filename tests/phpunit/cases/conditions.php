<?php
class Conditions_TestCase extends WP_UnitTestCase {
	/**
	 * @dataProvider _test_fields_evaluate_condition_data
	 */
	public function test_fields_evaluate_condition(bool $result, array $condition) {
		$this->assertSame($result, tangible_fields()->evaluate_condition($condition));
	}

	public function _test_fields_evaluate_condition_data() {
		return [

			'basic' => [
				true, [
					'1' => [
						'_eq' => '1'
					],
				],
			],

			'basic nested' => [
				true, [
					'_and' => [
						'1' => [
							'_eq' => '1'
						],
						'2' => [
							'_eq' => '2'
						],
					],
				],
			],

			'basic nested or' => [
				true, [
					'_or' => [
						'2' => [
							'_eq' => '1'
						],
						'2' => [
							'_eq' => '2'
						],
					],
				],
			],

			'basic nested nested' => [
				true, [
					'_and' => [
						'_and' => [
							'1' => [
								'_eq' => '1'
							]
						]
					],
				],
			],

			'basic fail' => [
				false, [
					'_and' => [
						'1' => [
							'_eq' => '1'
						],
						'2' => [
							'_eq' => '1'
						]
					]
				],
			],

			'complex booleans' => [
				true, [
					'_and' => [
						'_and' => [
							'1' => [
								'_eq' => '1'
							]
						],
						'_or' => [
							'2' => [
								'_eq' => '1'
							],
							'2' => [
								'_eq' => '2'
							]
						],
					]
				]
			],

			'unknown op' => [
				false, [
					'1' => [
						'_unknown' => '1',
					],
				]
			],

			'_neq' => [
				true, [
					'1' => [
						'_neq' => '2',
					]
				]
			],

			'_eq ducking' => [
				true, [
					'1' => [
						'_eq' => 1,
					]
				]
			],

			'_neq ducking' => [
				true, [
					'1' => [
						'_neq' => 2,
					]
				]
			],

			'_lt' => [
				true, [
					-20 => [
						'_lt' => 80,
					]
				]
			],

			'_gt' => [
				false, [
					-20 => [
						'_gt' => 80,
					]
				]
			],

			'_lte' => [
				true, [
					-20 => [
						'_lte' => -20,
					]
				]
			],

			'_gte' => [
				true, [
					-20 => [
						'_gte' => -20,
					]
				]
			],
		];
	}
}
