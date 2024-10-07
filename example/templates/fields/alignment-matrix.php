<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('alignment_matrix', [
    'label'       => 'Alignment matrix',
    'type'        => 'alignment_matrix',
    'description' => 'Description',
    'value'       => $fields->fetch_value('alignment_matrix'),
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('alignment_matrix')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('alignment_matrix', [
      'label'      => 'Alignment Matrix',
      'type'       => 'alignment_matrix',
      'description'=> 'Description',
      'value'      => $fields->fetch_value('alignment_matrix'),
    ]);
  </code>
</pre>
