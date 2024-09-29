<h4>Example with linked values and opacity</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('border', [
    'label'         => 'Border field',
    'type'          => 'border',
    'description'   => 'Description',
    'enable_opacity'=> true,
    'format'        => 'rgba',
    'units'         => ['px', 'vh', '%', 'vw'],
    'value'         => $fields->fetch_value('border')
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example without linked values and opacity</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('border_unlinked', [
    'label'         => 'Border field',
    'type'          => 'border',
    'description'   => 'Description',
    'enable_opacity'=> false,
    'linked'        => false,
    'format'        => 'rgba',
    'units'         => ['px', 'vh', '%', 'vw'],
    'value'         => $fields->fetch_value('border_unlinked')
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with forced linked values and opacity</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('border_linked', [
    'label'         => 'Border field',
    'type'          => 'border',
    'description'   => 'Description',
    'enable_opacity'=> true,
    'linked'        => true,
    'format'        => 'hex',
    'units'         => ['px', 'vh', '%', 'vw'],
    'value'         => $fields->fetch_value('border_linked')
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('border'),
  $fields->fetch_value('border_unlinked'),
  $fields->fetch_value('border_linked')
); ?>

<h4>Code</h4>

<pre>
  <code>
  $fields = tangible_fields();
  <?php $plugin->render_registation_message(); ?>

  echo $fields->render_field('name', [
    'type'            => 'border',
    'value'           => $fields->fetch_value('name'),
    'label'           => 'Border',
    'enable_opacity'  => true, // Optional, default true
    'linked'          => 'toggle', // Optional, default toggle (use true or false to force value)
    'format'          => 'rgba', // hex, rgb, hsl
    'units'           => ['px', 'vh', '%', 'vw'], // Optional, default px
    'description'     => 'Example description' 
  ]);
  </code>
</pre>
