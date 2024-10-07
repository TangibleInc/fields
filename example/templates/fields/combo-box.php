Might be renamed to "search" in the future.

<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('combobox', [
    'type'  => 'combo_box',
    'value' => $fields->fetch_value('combobox'),
    'label' => 'Categories list combobox',
    'choices' => [
      'test1' => 'Test1',
      'test2' => 'Test2',
      'test3' => 'Test3',
      'test4' => 'Test4'
    ],
    'placeholder' => 'Example placeholder',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with multiple values</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('combobox_multiple', [
    'type'     => 'combo_box',
    'value'    => $fields->fetch_value('combobox_multiple'),
    'label'    => 'Categories list combobox',
    'multiple' => true,
    'choices' => [
      'test1' => 'Test1',
      'test2' => 'Test2',
      'test3' => 'Test3',
      'test4' => 'Test4'
    ],
    'placeholder' => 'Example placeholder',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with categories</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('combobox_categories', [
    'type'    => 'combo_box',
    'value'   => $fields->fetch_value('combobox_categories'),
    'label'   => 'Categories list combobox',
    'choices' => [
      [
        'name'    => 'Category 1',
        'choices' => [ 
          'test1'  => 'Test1',
          'test2 ' => 'Test2'
        ]
      ],
      [
        'name'    => 'Category 2',
        'choices' => [ 
          'test3'  => 'Test3',
          'test4'  => 'Test4'
        ]
      ]
    ],
    'placeholder' => 'Example placeholder',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('combobox'),
  $fields->fetch_value('combobox_multiple'),
  $fields->fetch_value('combobox_categories'),
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'type'  => 'combo_box',
      'value' => $fields->fetch_value('name'),
      'label' => 'Categories list combobox',

      // Simple list
      'choices' => [
        'test1' => 'Test1'
        'test2' => 'Test2'
        'test3' => 'Test3'
        'test4' => 'Test4'
      ],
      
      // If multiple
      'multiple' => true,

      // List with categories
      'choices' => [
        [
          'name'    => 'Category 1',
          'choices' => [ 
            'test1' => 'Test1'
            'test2' => 'Test2'
          ]
        ],
        [
          'name'    => 'Category 2',
          'choices' => [
            'test3' => 'Test3',
            'test4' => 'Test4'
          ]
        ]
      ],

      'placeholder' => 'Example placeholder',
      'description' => 'Example description'
    ]);
  </code> 
</pre>
