<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('radio', [
    'label'   => 'Radio field',
    'type'    => 'radio',
    'value'   => $fields->fetch_value('radio'),
    'choices' => [
      '1' => 'Value 1',
      '2' => 'Value 2'
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
  $fields->fetch_value('radio')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field( 'name', [
      'label'   => 'Text field',
      'type'    => 'radio',
      'choices' => [
        '1' => 'Value 1',
        '2' => 'Value 2'
      ],
      'placeholder' => 'Example placeholder',
      'description' => 'Example description'
    ]);
  </code>
</pre>
