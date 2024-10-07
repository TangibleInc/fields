<h4>Example</h4>

<div class="tangible-settings-row">
  <?=
    $fields->render_field('textarea', [
      'label'       => 'Text Area',
      'type'        => 'textarea',
      'value'       => $fields->fetch_value('textarea'),
      'placeholder' => 'Example placeholder',
      'description' => 'Example description',
      'maxlength'   => 150,
      'minlength'   => 10,
      'required'    => false,
      'rows'        => 8,
      'wrapper'     => [
        'data-foo'    => 'bar',
        'class'       => 'foo-class'
      ]
    ] )
  ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('textarea')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field( 'name', [
      'label'       => 'Text Area',
      'type'        => 'textarea',
      'value'       => $plugin->get_settings()['setting_textarea_name'] ?? '',
      'placeholder' => 'Example placeholder',
      'description' => 'Example description',
      'maxlength'   => 150,
      'minlength'   => 10,
      'required'    => false,
      'rows'        => 8,
      'wrapper'     => [
        'data-foo' => 'bar',
        'class'    => 'foo-class'
      ]
    ] )
  </code>
</pre>

