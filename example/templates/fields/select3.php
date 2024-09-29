<h4>Example Single-select</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('select3_single_select', [
    'type'  => 'select3',
    'value' => $fields->fetch_value('select3_single_select'),
    'label' => 'Select',
    'choices' => [
      'test1' => 'Test1',
      'test2' => 'Test2',
      'test3' => 'Test3',
      'test4' => 'Test4',
      'test5' => 'Test5',
      'test6' => 'Test6',
      'test7' => 'Test7',
    ],
    'placeholder' => 'Select for a choice',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example Multi-select</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('select3_multi_select', [
    'type'  => 'select3',
    'value' => $fields->fetch_value('select3_multi_select'),
    'label' => 'Select',
    'multiple' => true,
    'choices' => [
      'test1' => 'Test1',
      'test2' => 'Test2',
//      [
//        'name'    => 'Category 2',
//        'choices' => [
      'test3' => 'Test3',
      'test4' => 'Test4'
//        ]
//      ]
    ],
    'placeholder' => 'Select for a choice',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible()->see(
  $fields->fetch_value('select3_single_select'),
  $fields->fetch_value('select3_multi_select')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', []);
  </code>
</pre>
