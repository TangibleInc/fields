<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('simple_dimension', [
    'label'       => 'Simple Dimension field',
    'type'        => 'simple_dimension',
    'description' => 'Description',
    'units'       => [ 'px','vh','%','vw' ],
    'value'       => $fields->fetch_value('simple_dimension'),
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('simple_dimension')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    $fields->render_field('name', [
      'label'       => 'Simple Dimension field', // Optional
      'type'        => 'simple_dimension',
      'description' => 'Description', // Optional
      'units'       => [ 'px','vh','%','vw' ], // Optional, default px
      'value'       => $fields->fetch_value('name'),
    ]);
  </code>
</pre>
