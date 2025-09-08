A repeater row can contain any fields.

<h4>Example repeater with advanced layout</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('repeater_advanced', [
    'label'      => 'Repeater field',
    'type'       => 'repeater',
    'layout'     => 'advanced',
    'value'      => $fields->fetch_value('repeater_advanced'),
    'sub_fields' => [
      [
        'label' => 'Date',
        'type'  => 'date_picker',
        'name'  => 'date',
      ], 
      [
        'label'   => 'Operator',
        'type'    => 'select',
        'name'    => 'select',
        'choices' => [
          'test1' => 'Test1',
          'test2' => 'Test2',
          'test3' => 'Test3',
          'test4' => 'Test4'
        ],
      ],
      [
        'label' => 'Color',
        'type'  => 'color_picker',
        'name'  => 'color',
      ],
    ]
  ]); ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<div><?php tangible\see($fields->fetch_value('repeater_advanced')) ?></div>

<h4>Example repeater with advanced layout and use_bulk set to true</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('repeater_advanced_use_bulk', [
    'label'      => 'Repeater field',
    'type'       => 'repeater',
    'layout'     => 'advanced',
    'value'      => $fields->fetch_value('repeater_advanced_use_bulk'),
    'use_bulk'   => true,
    'sub_fields' => [
      [
        'label' => 'Date',
        'type'  => 'date_picker',
        'name'  => 'date',
      ], 
      [
        'label'   => 'Operator',
        'type'    => 'select',
        'name'    => 'select',
        'choices' => [
          'test1' => 'Test1',
          'test2' => 'Test2',
          'test3' => 'Test3',
          'test4' => 'Test4'
        ],
      ],
      [
        'label' => 'Color',
        'type'  => 'color_picker',
        'name'  => 'color',
      ],
    ]
  ]); ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<div><?php tangible\see($fields->fetch_value('repeater_advanced_use_bulk')) ?></div>

<h4>Code</h4>

<?php $this->start_code('php') ?>
$fields->render_field('repeater_bare', [
  'label'      => 'Repeater field',
  'type'       => 'repeater',
  'layout'     => 'bare',
  'value'      => $fields->fetch_value('repeater_advanced'),

  'use_bulk'   => true, // Optional, default false

  /**
   * Optional:
   *
   * By default all fields will be displayed in the overview row, but it's possible
   * to only set a few if needed with the header_fields parameter
   *
   * It's also possible to set a callback to format the returned value. The callback will
   * have to be registered on the JS side:
   *
   * <script>
   * tangibleFields.fields.repeater.registerCallback(
   *    'callback_name',
   *    ({ value }) => `_Prefix_${value}`
   * )
   * </script>
   */
  'header_fields' => [
    'date_picker',
    [ name: 'color_picker', callback: 'callback_name' ]
  ],

  'sub_fields' => [
    [
      'label' => 'Text',
      'type'  => 'date_picker',
      'name'  => 'date',
    ], 
    [
      'label'   => 'Operator',
      'type'    => 'select',
      'name'    => 'select',
      'choices' => [
        'test1' => 'Test1',
        'test2' => 'Test2',
        'test3' => 'Test3',
        'test4' => 'Test4'
      ],
    ],
    [
      'label' => 'Color',
      'type'  => 'color_picker',
      'name'  => 'color',
    ],
  ]
]);
<?php $this->end_code() ?>
