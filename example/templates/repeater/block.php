A repeater row can contain any field.

<h4>Example with Base Repeater Block</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('repeater_block', [
    'label'      => 'Repeater field',
    'type'       => 'repeater',
    'layout'     => 'block',
    'value'      => $fields->fetch_value('repeater_block'),
    'sub_fields' => [
      [
        'label'   => 'Text',
        'type'    => 'text',
        'name'    => 'text_name',
      ], [
        'label'   => 'Dynamic text name',
        'type'    => 'text_suggestion',
        'name'    => 'dynamic_text_name',
        'choices' => [
          [
            'name'    => 'Category 1',
            'choices' => [
              'test1' => 'Test1',
              'test2' => 'Test2'
            ]
          ], [
            'name'    => 'Category 2',
            'choices' => [
              'test3' => 'Test3',
              'test4' => 'Test4'
            ]
          ]
        ]
      ], [
        'label' => 'Date field',
        'type'  => 'date_picker',
        'name'  => 'date_picker_name',
      ]
    ]
  ]); ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with `'repeatable' => false` property</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('repeater_block_non_repeatable', [
    'label'     => 'Repeater Repeatable Field',
    'type'      => 'repeater',
    'layout'    => 'block',
    'repeatable'=> false,
    'value'     => $fields->fetch_value('repeater_block_non_repeatable'),
    'sub_fields'=> [
      [
        'label'   => 'Text',
        'type'    => 'text',
        'name'    => 'text_name',
      ], [
        'label'   => 'Dynamic text name',
        'type'    => 'text_suggestion',
        'name'    => 'dynamic_text_name',
        'choices' => [
          [
            'name'    => 'Category 1',
            'choices' => [
              'test1' => 'Test1',
              'test2' => 'Test2'
            ]
          ], [
            'name'    => 'Category 2',
            'choices' => [
              'test3' => 'Test3',
              'test4' => 'Test4'
            ]
          ]
        ]
      ], [
        'label' => 'Date field',
        'type'  => 'date_picker',
        'name'  => 'date_picker_name',
      ]
    ]
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with `'maxlength' => 3` property</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('repeater_block_max', [
    'label'     => 'Repeater Maxlength Field',
    'type'      => 'repeater',
    'layout'    => 'block',
    'maxlength' => 3,
    'value'     => $fields->fetch_value('repeater_block_max'),
    'sub_fields'=> [
      [
        'label'   => 'Text',
        'type'    => 'text',
        'name'    => 'text_name',
      ], [
        'label'   => 'Dynamic text name',
        'type'    => 'text_suggestion',
        'name'    => 'dynamic_text_name',
        'choices' => [
          [
            'name'    => 'Category 1',
            'choices' => [
              'test1' => 'Test1',
              'test2' => 'Test2'
            ]
          ], [
            'name'    => 'Category 2',
            'choices' => [
              'test3' => 'Test3',
              'test4' => 'Test4'
            ]
          ]
        ]
      ], [
        'label' => 'Date field',
        'type'  => 'date_picker',
        'name'  => 'date_picker_name',
      ]
    ]
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with `'use_bulk' => true` , `'use_switch' => true` and `'section_title' => 'My section title'` properties</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('repeater_block_bulk_switch_title', [
    'label'         => 'Repeater Bulk Switch Custom Title Field',
    'type'          => 'repeater',
    'layout'        => 'block',
    'use_bulk'      => true,
    'use_switch'    => true,
    'section_title' => 'My section title',
    'value'         => $fields->fetch_value('repeater_block_bulk_switch_title'),
    'sub_fields'    => [
      [
        'label'   => 'Text',
        'type'    => 'text',
        'name'    => 'text_name',
      ], [
        'label'   => 'Dynamic text name',
        'type'    => 'text_suggestion',
        'name'    => 'dynamic_text_name',
        'choices' => [
          [
            'name'    => 'Category 1',
            'choices' => [
              'test1' => 'Test1',
              'test2' => 'Test2'
            ]
          ], [
            'name'    => 'Category 2',
            'choices' => [
              'test3' => 'Test3',
              'test4' => 'Test4'
            ]
          ]
        ]
      ], [
        'label' => 'Date field',
        'type'  => 'date_picker',
        'name'  => 'date_picker_name',
      ]
    ]
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<div><?php tangible\see($fields->fetch_value('repeater_block')) ?></div>
<div><?php tangible\see($fields->fetch_value('repeater_block_non_repeatable')) ?></div>
<div><?php tangible\see($fields->fetch_value('repeater_block_max')) ?></div>
<div><?php tangible\see($fields->fetch_value('repeater_block_bulk_switch_title')) ?></div>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'label'   => 'Repeater field',
      'type'    => 'repeater',
      'layout'  => 'block',
      'value'   => $fields->fetch_value('name'),

      // repeatable has higher priority than maxlength
      'repeatable' => false, // If false, Disallows adding and removing of a single item
      'maxlength' => 3, // Limits the number of items that can be added on the repeater

      // You can use the 'use_switch' property even without 'use_bulk'. And if you use the 'use_bulk' property without 'use_switch', you'll only have the 'Delete' option.
      'use_bulk'      => true,
      'use_switch'    => true,
      'section_title' => 'My section title',

      // Can be any type of field, just make sure to add a name

      'sub_fields' => [          
        [
          'label'   => 'Text',
          'type'    => 'text',
          'name'    => 'text_name',
        ],[
          'label'   => 'Dynamic text name',
          'type'    => 'text-suggestion',
          'name'    => 'dynamic_text_name',
          'choices' => [
            [
              'name'    => 'Category 1',
              'choices' => [ 
                'test1' => 'Test1',
                'test2' => 'Test2'
              ]
            ],[
              'name'    => 'Category 2',
              'choices' => [ 
                'test3' => 'Test3',
                'test4' => 'Test4'
              ]
            ]
          ]
        ],[
          'label' => 'Date field',
          'type'  => 'date_picker',
          'name'  => 'date_name',
        ]
      ]
    ]); 
  </code> 
</pre>
