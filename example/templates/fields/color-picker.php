Possible format:
<ul>
  <li>rgb</li>
  <li>rgba</li>
  <li>hex</li>
  <li>hsl</li>
</ul>

<h4>Example with opacity</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('color_opacity', [
    'type'            => 'color_picker',
    'value'           => $fields->fetch_value('color_opacity'),
    'label'           => 'Color',
    'enable_opacity'  => true,
    'format'          => 'rgba',
    'placeholder'     => 'Example placeholder',
    'description'     => 'Example description' 
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example without opacity</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('color', [
    'type'            => 'color_picker',
    'value'           => $fields->fetch_value('color'),
    'label'           => 'Color',
    'enable_opacity'  => false,
    'format'          => 'hex',
    'placeholder'     => 'Example placeholder',
    'description'     => 'Example description' 
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('color_opacity'),
  $fields->fetch_value('color')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'type'            => 'color_picker',
      'value'           => $fields->fetch_value('name'),
      'label'           => 'Color',
      'enable_opacity'  => true, // Optional, default true
      'format'          => 'rgba', // hex, rgb, hsl
      'placeholder'     => 'Example placeholder',
      'description'     => 'Example description' 
    ]);
  </code> 
</pre>
