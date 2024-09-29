<h4>Example - Without visibility button</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('list', [
    'label'       => 'List field',
    'type'        => 'list',
    'value'       => $fields->fetch_value('list'),
    'placeholder' => 'Example placeholder',
    'description' => 'Example description',
    'choices'     => [
      'test1' => 'Test 1',
      'test2' => 'Test 2',
      'test3' => 'Test 3'
    ]
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('list')
); ?>

<h4>Example - With visibility button</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('list-with-visibility', [
    'label'          => 'List field',
    'type'           => 'list',
    'value'          => $fields->fetch_value('list-with-visibility'),
    'placeholder'    => 'Example placeholder',
    'description'    => 'Example description',
    'use_visibility' => true,
    'choices'     => [
      'test1' => 'Test 1',
      'test2' => 'Test 2',
      'test3' => 'Test 3'
    ]
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('list-with-visibility')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    $fields->render_field('field-name', [
      'label'       => 'Hidden field',
      'type'        => 'list',
      'value'       => $fields->fetch_value('field-name'),
      'placeholder' => 'Example placeholder',
      'description' => 'Example description',

      // Optional - Default false
      'use_visibility' => true,

      'choices'     => [
        'test1' => 'Test 1',
        'test2' => 'Test 2',
        'test3' => 'Test 3'
      ]
    ])
  </code>
</pre>
