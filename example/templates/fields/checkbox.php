<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('checkbox', [
    'label'       => 'Checkbox field',
    'type'        => 'checkbox',
    'value'       => $fields->fetch_value('checkbox'),
    'placeholder' => 'Example placeholder',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('checkbox')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'label'       => 'Checkbox field',
      'type'        => 'checkbox',
      'value'       => $fields->fetch_value('name'),
      'description' => 'Example description'
    ]);
  </code>
</pre>
