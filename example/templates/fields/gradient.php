<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('gradient', [
    'type'        => 'gradient',
    'value'       => $fields->fetch_value('gradient'),
    'label'       => 'Gradient',
    'placeholder' => 'Example placeholder',
    'description' => 'Example description' 
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('gradient')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'type'        => 'gradient',
      'value'       => $fields->fetch_value('name'),
      'label'       => 'Gradient',
      'placeholder' => 'Example placeholder',
      'description' => 'Example description' 
    ]);
  </code> 
</pre>
