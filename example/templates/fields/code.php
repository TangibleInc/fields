<h4>Example</h4>

<div class="tangible-settings-row">
  <?=
    $fields->render_field('code', [
      'label'       => 'Code',
      'type'        => 'code',
      'value'       => $fields->fetch_value('code'),
      'description' => 'Example description',
    ])
  ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('code')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>
    
    $fields->render_field('code', [
      'label'       => 'Code',
      'type'        => 'code',
      'value'       => $fields->fetch_value('code'),
      'description' => 'Example description',
    ])
  </code>
</pre>
