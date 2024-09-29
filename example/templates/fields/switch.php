<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('switch', [
    'label'       => 'Switch field',
    'type'        => 'switch',
    'description' => 'Description',
    'value_on'    => 'on',
    'value_off'   => 'off',
    'value'       => $fields->fetch_value('switch'),
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('switch')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'label'       => 'Switch field',
      'type'        => 'switch',
      'value'       => $fields->fetch_value('name'),
      'description' => 'Description',
      'value_on'    => 'on', // Optional, default on
      'value_off'   => 'off',  // Optional, default off
    ]);
  </code> 
</pre>
