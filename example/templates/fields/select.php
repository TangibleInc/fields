<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('select', [
    'type'  => 'select',
    'value' => $fields->fetch_value('select'),
    'label' => 'Select',
    'choices' => [
      'test1' => 'Test1',
      'test2' => 'Test2'
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
  <?= $fields->render_field('select_categories', [
    'type'  => 'select',
    'value' => $fields->fetch_value('select_categories'),
    'label' => 'Select',
    'choices' => [
      [
        'name'     => 'Category 1',
        'choices' => [ 
          'test1' => 'Test1',
          'test2'=> 'Test2'
        ]
      ],
      [
        'name'     => 'Category 2',
        'choices' => [ 
          'test3' => 'Test3',
          'test4' => 'Test4'
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

<h4>Example with multiple values</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('select_multiple', [
    'type'  => 'select',
    'value' => $fields->fetch_value('select_multiple'),
    'label' => 'Select',
    'choices' => [
      'test1' => 'Test1',
      'test2' => 'Test2',
      'test3' => 'Test3',
      'test4' => 'Test4'
    ],
    'multiple'    => true,
    'placeholder' => 'Example placeholder',
    'description' => 'Example description' 
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with multiple values and categories</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('select_multiple_categories', [
    'type'  => 'select',
    'value' => $fields->fetch_value('select_multiple_categories'),
    'label' => 'Select',
    'choices' => [
      [
        'name'     => 'Category 1',
        'choices' => [ 
          'test1' => 'Test1',
          'test2'=> 'Test2'
        ]
      ],
      [
        'name'     => 'Category 2',
        'choices' => [ 
          'test3' => 'Test3',
          'test4' => 'Test4'
        ]
      ]
    ],
    'multiple'    => true,
    'placeholder' => 'Example placeholder',
    'description' => 'Example description' 
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('select'),
  $fields->fetch_value('select_categories'),
  $fields->fetch_value('select_multiple'),
  $fields->fetch_value('select_multiple_categories'),
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'type'    => 'select',
      'value'   => $fields->fetch_value('name'),
      'label'   => 'Select',
      'choices' => [

        // Simple List
        'test1' => 'Test1',
        'test2' => 'Test2'

        // If categories
        [
          'name'    => 'Category 1',
          'choices' => [ 
            'test1' => 'Test1',
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
      'description' => 'Example description',

      // If multiple values allowed

      'multiple'    => true, 
    ]);
  </code> 
</pre>
