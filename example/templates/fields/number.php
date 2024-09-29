<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('number', [
    'label'       => 'Number field',
    'type'        => 'number',
    'value'       => $fields->fetch_value('number'),
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example for a value between 10 and 20</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('number_max', [
    'label'       => 'Number field',
    'type'        => 'number',
    'value'       => $fields->fetch_value('number_max'),
    'min'         => 10,
    'max'         => 20,
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('number'),
  $fields->fetch_value('number_max'),
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'label'       => 'Number field',
      'type'        => 'number',
      'value'       => $fields->fetch_value('name'),
      'min'         => 10, // Optional
      'max'         => 20, // Optional
      'description' => 'Example description'
    ]);
  </code>
</pre>
