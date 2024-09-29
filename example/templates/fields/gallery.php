<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('gallery', [
    'label'       => 'Gallery field',
    'type'        => 'gallery',
    'value'       => $fields->fetch_value('gallery'),
    'placeholder' => 'Example placeholder',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('gallery')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'label'       => 'Gallery field',
      'type'        => 'gallery',
      'value'       => $fields->fetch_value('name'),
      'placeholder' => 'Example placeholder',
      'description' => 'Example description'
    ]);
  </code>
</pre>
