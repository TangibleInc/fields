<h3>Angle Picker</h3>

Choose an angle by directly inserting the desired angle in the text field or with the mouse by dragging the angle
indicator inside a circle.

<h4>Example with forced linked values</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('angle_picker', [
    'label'       => 'Angle Picker field',
    'type'        => 'angle_picker',
    'description' => 'Description',
    'value'       => $fields->fetch_value('angle_picker'),
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('angle_picker')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'label'       => 'Angle Picker field',
      'type'        => 'angle_picker',
      'description' => 'Description',
      'value'       => $fields->fetch_value('name'),
    ]);
  </code>
</pre>
