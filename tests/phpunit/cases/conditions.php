<?php
class Conditions_TestCase extends WP_UnitTestCase {

  public function set_up() {
    // @see https://make.wordpress.org/core/handbook/testing/automated-testing/writing-phpunit-tests/#shared-fixtures
    parent::set_up();
    wp_set_current_user(1);
  }

  /**
   * @dataProvider _test_fields_evaluate_condition_data
   */
  public function test_fields_evaluate_condition(bool $result, array $condition) {
    $this->assertSame($result, tangible_fields()->evaluate_condition($condition));
  }

  /**
   * @dataProvider _test_fields_evaluate_conditional_data
   */
  public function test_fields_evaluate_conditional(
    bool $result,
    string $conditions,
    array $dynamic_value_config = []
  ) {
    $this->assertSame(
      $result,
      tangible_fields()->evaluate_conditional(
        json_decode($conditions), $dynamic_value_config
      )
    );
  }

  public function _test_fields_evaluate_conditional_data() {

    $fields = tangible_fields();
    $fields->register_dynamic_value([
      'name'     => 'test-value-conditional-config',
      'label'    => 'Test dynamic value',
      'category' => 'test-category',
      'callback' => function($settings, $config) {
        return $config['context']['test'] ?? '';
      },
      'permission_callback_store' => '__return_true',
      'permission_callback_parse' => '__return_true'
    ]);

    return [
      'basic nested and modal false'	=> [
        false, json_encode([	
          [
            'key' => '60be9330eb99c0',
            'data' => [ 
              [
                'key' => '60be9330ebae0c',
                'left_value' => '[[post_id]]',
                'operator' => '_eq',
                'right_value' => 5,
              ], 
              [
                'key' => '60be93e414b920',
                'left_value' => '[[user_id]]',
                'operator' => '_eq',
                'right_value' => 1,
              ]
            ]
          ],
        ]),
      ],
      'basic nested modal true'	=> [
        true, json_encode([	
          [
            'key' => '60be9330eb99c0',
            'data' => [  
              [
                'key' => '60be93e414b920',
                'left_value' => '[[user_id]]',
                'operator' => '_eq',
                'right_value' => 1,
              ]
            ]

          ],
        ]),
      ],
      'basic nested or modal true'	=> [
        true, json_encode([	
          [
            'key' => '60be9330eb99c0',
            'data' => [  
              [
                'key' => '60be93e414b920',
                'left_value' => '[[user_id]]',
                'operator' => '_eq',
                'right_value' => 1,
              ]
            ]
          ],
          [
            'key' => '60be9330eb99c1',
            'data' => [  
              [
                'key' => '60be93e414b921',
                'left_value' => '[[post_id]]',
                'operator' => '_eq',
                'right_value' => 5,
              ]
            ]
          ],
        ]),
      ],
      'basic nested or modal false'	=> [
        false, json_encode([	
          [
            'key' => '60be9330eb99c0',
            'data' => [  
              [
                'key' => '60be93e414b920',
                'left_value' => '[[user_id]]',
                'operator' => '_eq',
                'right_value' => 2,
              ]
            ]
          ],
          [
            'key' => '60be9330eb99c1',
            'data' => [  
              [
                'key' => '60be93e414b921',
                'left_value' => '[[post_id]]',
                'operator' => '_eq',
                'right_value' => 5,
              ]
            ]
          ],
        ]),
      ],
      'basic nested with config true'  => [
        true, json_encode([	
          [
            'key' => '60be9330eb99c1',
            'data' => [ 
              [
                'key' => '60be9330ebae1c',
                'left_value' => '[[test-value-conditional-config]]',
                'operator' => '_eq',
                'right_value' => 'middle',
              ]
            ]
          ],
        ]), [
          'context' => [
            'test'  => 'middle'
          ]
        ]
      ],
      'basic nested with config false'  => [
        false, json_encode([	
          [
            'key' => '60be9330eb99c1',
            'data' => [ 
              [
                'key' => '60be9330ebae1c',
                'left_value' => '[[test-value-conditional-config]]',
                'operator' => '_eq',
                'right_value' => 'middle',
              ]
            ]
          ],
        ])
      ],
      'basic nested modal no value true'	=> [
        true, json_encode([	
          [
            'key' => '60be9330eb99c0',
            'data' => [  
              [
                'key' => '60be93e414b920',
                'left_value' => '',
                'operator' => '_eq',
                'right_value' => '',
              ]
            ]
          ],
        ])
      ],
      'empty value'	=> [ true, json_encode([]) ],
    ];
  }

  public function _test_fields_evaluate_condition_data() {
    return [

      'dynamic value true'	=> [
        true, [
          '[[user_id]]'	=> [
            '_eq'	=> 1
          ],
        ],
      ],

      'dynamic value mixed with text true'	=> [
        true, [
          'User id is [[user_id]]'	=> [
            '_eq'	=> 'User id is 1'
          ],
        ],
      ],

      'dynamic value true (right value)'	=> [
        true, [
          '1'	=> [
            '_eq'	=> '[[user_id]]'
          ],
        ],
      ],

      'dynamic value mixed with text (right value) true'	=> [
        true, [
          'User id is 1'	=> [
            '_eq'	=> 'User id is [[user_id]]'
          ],
        ],
      ],
      
      'dynamic value false'	=> [
        false, [
          '[[user_id]]'	=> [
            '_eq'	=> 2
          ],
        ],
      ],

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
      '_in' => [
        true, [
          'one' => [
            '_in' => ['two', 'three', 'four', 'one'],
          ]
        ]
      ],
      '_nin' => [
        true, [
          'four' => [
            '_in' => ['two', 'three', 'four'],
          ]
        ]
      ],
      '_contains' => [
        true, [
          'four' => [
            '_contains' => 'fo',
          ]
        ]
      ],
      '_ncontains' => [
        false, [
          'four' => [
            '_ncontains' => 'f',
          ]
        ]
      ],
      '_contains utf8' => [
        true, [
          'привет' => [
            '_contains' => 'п',
          ]
        ]
      ],
      '_ncontains utf8' => [
        true, [
          'привет' => [
            '_ncontains' => 'П',
          ]
        ]
      ],
      '_re' => [
        true, [
          'hello world' => [
            '_re' => '/hel{2}.?/',
          ]
        ]
      ],
      '_re utf8' => [
        true, [
          'привет мир' => [
            '_re' => '/\sм[ий]р$/u',
          ]
        ]
      ],
    ];
  }
}
