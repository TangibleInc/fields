<?php
/**
 * Enhanced Choice field simple list
 */

$choices = [
  'red'    => 'Red',
  'blue'   => 'Blue',
  'green'  => 'Green',
  'yellow' => 'Yellow',
  'purple' => 'Purple',
  'orange' => 'Orange'
];

$plugin->render_registation_message();
?>

<h3>Basic Single Selection</h3>

<?php echo $fields->render_field('enhanced_choice', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'description' => 'Select one color and toggle visibility if needed',
  'choices'     => $choices,
  'placeholder' => 'Search colors...',
  'isVisibilityEnabled'  => false, // Optional, defaults to false
]);
?>

<hr />

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h3>Basic Single Selection with visibility</h3>
<?php
echo $fields->render_field('enhanced_choice_visibility', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'description' => 'Select one color and toggle visibility if needed',
  'choices'     => $choices,
  'placeholder' => 'Search colors...',
  'isVisibilityEnabled'  => true, // Optional, defaults to false
]);
?>

<hr />

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h3>Multiple Selection</h3>
<?php
echo $fields->render_field('enhanced_choice_multiple', [
  'type'        => 'enhanced-choice',
  'multiple'    => true,
  'label'       => 'Pick multiple colors',
  'description' => 'Select multiple colors and toggle visibility for each',
  'choices'     => $choices,
  'placeholder' => 'Search colors...',
  'isVisibilityEnabled' => true, // Optional, defaults to false
]);
?>

<hr />

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php 
\tangible\see($fields->fetch_value('enhanced_choice')); 
\tangible\see($fields->fetch_value('enhanced_choice_visibility'));
?>

<h4>Code sample</h4>
<pre>
  <code>
echo $fields->render_field('enhanced_choice', [
  'type'        => 'enhanced-choice',
  'multiple'    => true, // Optional
  'label'       => 'Pick multiple colors',
  'choices'     => [
    'red'    => 'Red',
    'blue'   => 'Blue',
    // ...
  ],
]);
  </code>
</pre>
