<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('time', [
    'label'       => 'Time field',
    'type'        => 'time_picker',
    'hour_cycle'  => 12,
    'description' => "Decription for time-picker",
    'value'       => $fields->fetch_value('time')
  ]); ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
  </dib>

  <h4>Example of Limit Time Selection</h4>

  <div class="tangible-settings-row">
    <?= $fields->render_field('time-limit', [
      'label'       => 'Time field',
      'type'        => 'time_picker',
      'hour_cycle'  => 12,
      'min'         => "09:00",
      'max'         => "17:00",
      'description' => "You can only select a time between 9 AM to 5:00 PM",
      'value'       => $fields->fetch_value('time-limit')
    ]); ?>
  </div>

  <div class="tangible-settings-row">
    <?php submit_button() ?>
    </dib>

    <?php tangible\see(
      $fields->fetch_value('time'),
      $fields->fetch_value('time-limit'),
    ); ?>

    <h4>Code</h4>

    <pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('time', [
      'label'       => 'Time field',
      'type'        => 'time_picker',
      'hour_cycle'  => 12, // hour cyle can be 12 or 24
      'min'         => "09:00", // earliest selectable time
      'max'         => "17:00", // (military time) latest selectable time
      'description' => "Description",
      'value'       => $fields->fetch_value('time')
    ]);
  </code> 
</pre>