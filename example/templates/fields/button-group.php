Buttons can contain both <a href='https://developer.wordpress.org/resource/dashicons/'>dashicon</a> or text.

<h4>Example with Dashicon</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('button_group_dashicon', [
    'label'       => 'Button group field',
    'type'        => 'button_group',
    'description' => 'Description',
    'use_dashicon'=> true,
    'value'       => $fields->fetch_value('button_group_dashicon'),
    'choices'     => [
      'left'   => 'editor-alignleft',
      'center' => 'editor-aligncenter',
      'right'  => 'editor-alignright',
    ]
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with text</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('button_group', [
    'label'       => 'Button group field',
    'type'        => 'button_group',
    'description' => 'Description',
    'value'       => $fields->fetch_value('button_group'),
    'choices'     => [
      'one'   => 'One',
      'two'   => 'Two',
      'three' => 'Three',
    ]
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('button_group_dashicon'),
  $fields->fetch_value('button_group')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'label'       => 'Button group field',
      'type'        => 'button_group',
      'description' => 'Description',
      'value'       => $fields->fetch_value('name'),

      // Dashicon

      'use_dashicon'=> true
      'choices'     => [
        'left'   => 'editor-alignleft',
        'center' => 'editor-aligncenter',
        'right'  => 'editor-alignright',
      ],
      
        // Text

      'choices' => [
        'one'   => 'One',
        'two'   => 'Two',
        'three' => 'Three',
      ],
    ]);
  </code> 
</pre>
