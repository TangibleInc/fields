<h4>Render conditonal panel</h4>

Conditions can be saved using the conditional panel field type. 

The data saved by this field type can then retrieve and be evaluated (more about this in the evaluate page).

<h4>Simple example</h4>

Here is how the conditional panel looks like, and the associated code:

<div class="tangible-settings-row">
  <?= $fields->render_field('conditonal_logic', [
    'type'  => 'conditional_panel',
    'value' => $fields->fetch_value('conditonal_logic'),
    'dynamic_categories' => [ 'post' ],
    'operators' => [
      '_eq' => 'Is',
      '_neq' => 'Is not',
      '_lt' => 'Less than',
      '_gt' => 'Greater than',
    ]
  ]); ?>
</div>

<?php $this->start_code('php') ?>
$fields->render_field('conditonal_logic', [
  'type'  => 'conditional_panel',
  'value' => $fields->fetch_value('conditonal_logic'),
  'dynamic_categories' => [ 'post', 'user', 'general' ],
  'operators' => [
    '_eq' => 'Is',
    '_neq' => 'Is not',
    '_lt' => 'Less than',
    '_gt' => 'Greater than',
  ]
]);
<?php $this->end_code() ?>

<div><?php tangible\see($fields->fetch_value('conditonal_logic')) ?></div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with a modal</h4>

It is possible to wrap the conditional panel inside a modal, by using the <code>use_modal</code> parameter.

Here is an example with a modal:

<div class="tangible-settings-row">
  <?= $fields->render_field('conditonal_logic_modal', [
    'type'      => 'conditional_panel',
    'use_modal' => true,
    'value'     => $fields->fetch_value('conditonal_logic_modal'),
  ]); ?>
</div>

<?php $this->start_code('php') ?>
$fields->render_field('conditonal_logic_modal', [
  'type'      => 'conditional_panel',
  'use_modal' => true,
  'value'     => $fields->fetch_value('conditonal_logic_modal'),
  // 'dynamic_categories' => [ 'post', 'user', 'general' ],
]);
<?php $this->end_code() ?>

<div><?php tangible\see($fields->fetch_value('conditonal_logic_modal')) ?></div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>
