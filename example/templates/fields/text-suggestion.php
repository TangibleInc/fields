I'm really not sure about how to name this one.</br >
Can contain both text and dynamic element from the dropdown.<br />

<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dynamic_text', [
    'label'       => 'Test',
    'label'       => 'Label',
    'value'       => $fields->fetch_value('dynamic_text'),
    'placeholder' => 'Example placeholder', 
    'description' => 'Example description',
    'type'        => 'text_suggestion',
    'choices'     => [
      'test1' => 'Test1',
      'test2' => 'Test2',
      'test3' => 'Test3',
      'test4' => 'Test4',
    ]
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with categories</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dynamic_text_categories', [
    'label'       => 'Test',
    'label'       => 'Label',
    'value'       => $fields->fetch_value('dynamic_text_categories'),
    'placeholder' => 'Example placeholder', 
    'description' => 'Example description',
    'type'        => 'text_suggestion',
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
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('dynamic_text'),
  $fields->fetch_value('dynamic_text_categories')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    // Option can be with or without categories

    echo $fields->render_field('name', [
      'label'       => 'Dynamic text',
      'placeholder' => 'Example placeholder', 
      'description' => 'Example description',
      'type'        => 'text_suggestion',
      'choices'     => [
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
    ])
  </code> 
</pre>
