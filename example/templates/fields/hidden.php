<h4>Example</h4>

<div class="tangible-settings-row">
  <?=
    $fields->render_field('hidden', [
      'label'       => 'Hidden field',
      'type'        => 'hidden',
      'value'       => $fields->fetch_value('hidden'),
      'placeholder' => 'Example placeholder',
      'description' => 'Example description',
      'attributes'  => [
        'data-foo'    => 'bar',
        'class'       => 'baz-class'
      ]
    ])
  ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('hidden')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    $fields->render_field('name', [
      'label'       => 'Hidden field',
      'type'        => 'hidden',
      'value'       => $fields->fetch_value('name'),
      'placeholder' => 'Example placeholder',
      'description' => 'Example description',
      'attributes'  => [
        'data-foo'=> 'bar',
        'class'   => 'baz-class'
      ]
    ])
  </code>
</pre>
