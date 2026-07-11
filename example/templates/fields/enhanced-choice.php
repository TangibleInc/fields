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

$choices_viewable = [
  'red'    => [ 'label' => 'Red',    'viewLink' => '/colors/red'    ],
  'blue'   => [ 'label' => 'Blue',   'viewLink' => '/colors/blue'   ],
  'green'  => [ 'label' => 'Green',  'viewLink' => '/colors/green'  ],
  'yellow' => [ 'label' => 'Yellow', 'viewLink' => '/colors/yellow' ],
  'purple' => [ 'label' => 'Purple', 'viewLink' => '/colors/purple' ],
  'orange' => [ 'label' => 'Orange', 'viewLink' => '/colors/orange' ],
];

$choices_grouped = [
  [
    'label' => 'Warm Colors',
    'items' => [
      'red'    => 'Red',
      'orange' => 'Orange',
      'yellow' => 'Yellow',
    ],
  ],
  [
    'label' => 'Cool Colors',
    'items' => [
      'blue'  => 'Blue',
      'green' => 'Green',
    ],
  ],
  [
    'label' => 'Other',
    'items' => [
      'purple' => 'Purple',
    ],
  ],
];

$choices_view_and_group = [
  [
    'label' => 'Warm Colors',
    'items' => [
      'red'    => [ 'label' => 'Red',    'viewLink' => '/colors/red'    ],
      'orange' => [ 'label' => 'Orange', 'viewLink' => '/colors/orange' ],
      'yellow' => 'Yellow',  
    ],
  ],
  [
    'label' => 'Cool Colors',
    'items' => [
      'blue'  => [ 'label' => 'Blue',  'viewLink' => '/colors/blue'  ],
      'green' => [ 'label' => 'Green', 'viewLink' => '/colors/green' ],
    ],
  ],
];

$plugin->render_registation_message();
?>

<h3>Basic Single Selection</h3>

<?php echo $fields->render_field('enhanced_choice', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'description' => 'basic single selection',
  'choices'     => $choices,
  'placeholder' => 'Search colors...',
  'isViewable'  => false, // Optional, defaults to false
]);
?>

<hr />

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h3>Basic Single Selection with view button</h3>
<?php
echo $fields->render_field('enhanced_choice_visibility', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'description' => 'with view link button',
  'choices'     => $choices_viewable,
  'placeholder' => 'Search colors...',
  'isViewable'  => true, // Optional, defaults to false
]);
?>

<hr />

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h3>Basic Single Selection with custom value</h3>

<?php echo $fields->render_field('enhanced_choice_custom', [
  'type'        => 'enhanced-choice',
  'label'       => 'Pick a color',
  'description' => 'basic single selection',
  'choices'     => $choices,
  'placeholder' => 'Search colors...',
  'isViewable'  => false, // Optional, defaults to false
  'isCustomModeEnabled' => true, // Optional, defaults to false
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
  'description' => 'multiple selection',
  'choices'     => $choices,
  'placeholder' => 'Search colors...',
  'isViewable' => true, // Optional, defaults to false
]);
?>

<hr />

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h3>Multiple Selection with grouped items</h3>

<?php
echo $fields->render_field('enhanced_choice_multiple_group_items', [
  'type'        => 'enhanced-choice',
  'multiple'    => true,
  'filterCategories' => [ [ 'value' => 'a', 'label' => 'Category A' ] ],
  'actionLabel' => 'Add License Type',
  'label'       => 'Pick multiple colors',
  'description' => 'Grouped items',
  'choices'     => $choices_grouped,
  'placeholder' => 'Search colors...',
  'isViewable' => true, // Optional, defaults to false
  'isGrouped'     => true, // Optional, defaults to false
]);
?>

<hr />

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h3>Multiple Selection with grouped items and view links</h3>

<?php
echo $fields->render_field('enhanced_choice_multiple_group_and_view', [
  'type'        => 'enhanced-choice',
  'multiple'    => true,
  'filterCategories' => [ [ 'value' => 'a', 'label' => 'Category A' ] ],
  'actionLabel' => 'Add License Type',
  'label'       => 'Pick multiple colors',
  'description' => 'Grouped items',
  'choices'     => $choices_view_and_group,
  'placeholder' => 'Search colors...',
  'isViewable'  => true, // Optional, defaults to false
  'isGrouped'   => true, // Optional, defaults to false
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
\tangible\see($fields->fetch_value('enhanced_choice_multiple'));
\tangible\see($fields->fetch_value('enhanced_choice_multiple_group_items'));
?>

<h4>Code sample</h4>
<pre>
  <code>
echo $fields->render_field('enhanced_choice', [
  'type'        => 'enhanced-choice',
  'multiple'    => true, // Optional
  'label'       => 'Pick multiple colors',
  'placeholder' => 'Search colors...',
  'isViewable'  => true, // Optional, defaults to false
  'isGrouped'     => true, // Optional, defaults to false
  'isCustomModeEnabled' => true, // Optional, defaults to false
  'choices'     => [
    'red'    => 'Red',
    'blue'   => 'Blue',
    // ...
  ],
  
  '$choices_viewable = [
    'red'    => [ 'label' => 'Red',    'viewLink' => '/colors/red'    ],
    'blue'   => [ 'label' => 'Blue',   'viewLink' => '/colors/blue'   ],
    'green'  => [ 'label' => 'Green',  'viewLink' => '/colors/green'  ],
    'yellow' => [ 'label' => 'Yellow', 'viewLink' => '/colors/yellow' ],
    'purple' => [ 'label' => 'Purple', 'viewLink' => '/colors/purple' ],
    'orange' => [ 'label' => 'Orange', 'viewLink' => '/colors/orange' ],
  ]',

  '$choices_grouped = [
    [
      'label' => 'Warm Colors',
      'items' => [
        'red'    => 'Red',
        'orange' => 'Orange',
        'yellow' => 'Yellow',
      ],
    ],
    [
      'label' => 'Cool Colors',
      'items' => [
        'blue'  => 'Blue',
        'green' => 'Green',
      ],
    ],
    [
      'label' => 'Other',
      'items' => [
        'purple' => 'Purple',
      ],
    ],
  ]',

  '$choices_view_and_group = [
    [
      'label' => 'Warm Colors',
      'items' => [
        'red'    => [ 'label' => 'Red',    'viewLink' => '/colors/red'    ],
        'orange' => [ 'label' => 'Orange', 'viewLink' => '/colors/orange' ],
        'yellow' => 'Yellow',  
      ],
    ],
    [
      'label' => 'Cool Colors',
      'items' => [
        'blue'  => [ 'label' => 'Blue',  'viewLink' => '/colors/blue'  ],
        'green' => [ 'label' => 'Green', 'viewLink' => '/colors/green' ],
      ],
    ],
  ]',
]);
  </code>
</pre>
