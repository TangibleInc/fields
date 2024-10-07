<div class="tangible-settings-row">
  <?= $fields->render_field('visibility-text', [
    'type'        => 'text',
    'label'       => 'Text input',
    'description' => 'Type "show repeater" to display the repeater',
    'value'       => $fields->fetch_value('visibility-text'),
  ]); ?>
</div>

<div class="tangible-settings-row">
  <?= $fields->render_field('visibility-repeater', [
    'type'      => 'repeater',
    'layout'    => 'table',
    'value'     => $fields->fetch_value('visibility-repeater'),
    'condition' => [
      'action'    => 'show',
      'condition' => [
        'visibility-text' => [ '_eq' => 'show repeater' ],
      ],
    ],
    'sub_fields' => [
      [
        'name'  => 'number-subfield',
        'type'  => 'number',
        'label' => 'Row 1',
      ],
      [
        'type'      => 'text',
        'name'      => 'text-subfield',
        'label'     => 'If row1 >= 10',
        'condition' => [
          'action'    => 'show',
          'condition' => [
            'number-subfield' => [ '_gte' => 10 ],
          ],
        ]
      ],
      [
        'name'      => 'subfield-3',
        'type'      => 'text',
        'label'     => 'If row1 < 10 OR row2 contains "third"',
        'condition' => [
          'action'    => 'show',
          'condition' => [
            '_or' => [
              [ 'number-subfield' => [ '_lt' => 10 ] ],
              [ 'text-subfield' => [ '_contains' => 'third' ] ],
            ]
          ],
        ],
      ],
    ]
  ]); ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('visibility-text', [
      'type'        => 'text',
      'description' => 'Type "show repeater" to display the repeater',
      'value'       => $fields->fetch_value('visibility-text'),
    ]);

    echo $fields->render_field('visibility-repeater', [
      'type'      => 'repeater',
      'layout'    => 'table',
      'value'     => $fields->fetch_value('visibility-repeater'),
      'condition' => [
        'action'    => 'show',
        'condition' => [
          'visibility-text' => [ '_eq' => 'show repeater' ],
        ],
      ],
      'sub_fields' => [
        [
          'name' => 'number-subfield',
          'type' => 'number',
        ],
        [
          'type'      => 'text',
          'name'      => 'text-subfield',
          'label'     => 'If row1 >= 10',
          'condition' => [
            'action'    => 'show',
            'condition' => [
              'number-subfield' => [ '_gte' => 10 ],
            ],
          ]
        ],
        [
          'name'      => 'subfield-3',
          'type'      => 'text',
          'label'     => 'If row1 < 10 OR row2 contains "third"',
          'condition' => [
            'action'    => 'show',
            'condition' => [
              '_or' => [
                [ 'number-subfield' => [ '_lt' => 10 ] ],
                [ 'text-subfield' => [ '_contains' => 'third' ] ],
              ]
            ],
          ],
        ],
      ]
    ]);
  </code>
</pre>
