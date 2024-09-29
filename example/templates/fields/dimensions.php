<h4>Example linked values</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dimensions', [
    'label'       => 'Dimensions field',
    'type'        => 'dimensions',
    'description' => 'Description',
    'units'       => [ 'vh','%', 'vw' ],
    'value'       => $fields->fetch_value('dimensions'),
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example without linked values</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dimensions_not_linked', [
    'label'       => 'Dimensions field',
    'type'        => 'dimensions',
    'description' => 'Description',
    'units'       => [ 'vh','%', 'vw' ],
    'linked'      => false,
    'value'       => $fields->fetch_value('dimensions_not_linked'),
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with forced linked values</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dimensions_linked', [
    'label'       => 'Dimensions field',
    'type'        => 'dimensions',
    'description' => 'Description',
    'units'       => [ 'px','vw' ],
    'linked'      => true,
    'value'       => $fields->fetch_value('dimensions_linked'),
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('dimensions'),
  $fields->fetch_value('dimensions_not_linked'),
  $fields->fetch_value('dimensions_linked')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'label'       => 'Dimensions field',
      'type'        => 'dimensions',
      'description' => 'Description',
      'units'       => [ 'px','vw' ], // Optional, default px
      'linked'      => 'toggle', // Optional, default toggle (use true or false to force value)
      'value'       => $fields->fetch_value('name'),
    ]);
  </code> 
</pre>
