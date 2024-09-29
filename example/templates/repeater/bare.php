A repeater row can contain any fields.

<h4>Example repeater with bare layout</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('repeater_bare', [
    'label'      => 'Repeater field',
    'type'       => 'repeater',
    'layout'     => 'bare',
    'value'      => $fields->fetch_value('repeater_bare'),
    'sub_fields' => [
      [
        'label' => 'Text',
        'type'  => 'date_picker',
        'name'  => 'date',
        'label_visually_hidden' => true
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
        'label_visually_hidden' => true,
      ],
      [
        'label' => 'Color',
        'type'  => 'color_picker',
        'name'  => 'color',
        'label_visually_hidden' => true,
      ],
    ]
  ]); ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<div><?php tangible\see($fields->fetch_value('repeater_bare')) ?></div>

<h4>Code</h4>

<?php $this->start_code('php') ?>
$fields->render_field('repeater_bare', [
  'label'      => 'Repeater field',
  'type'       => 'repeater',
  'layout'     => 'bare',
  'value'      => $fields->fetch_value('repeater_bare'),
  'sub_fields' => [
    [
      'label' => 'Text',
      'type'  => 'date_picker',
      'name'  => 'date',
      'label_visually_hidden' => true
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
      'label_visually_hidden' => true,
    ],
    [
      'label' => 'Color',
      'type'  => 'color_picker',
      'name'  => 'color',
      'label_visually_hidden' => true,
    ],
  ]
]);
<?php $this->end_code() ?>
