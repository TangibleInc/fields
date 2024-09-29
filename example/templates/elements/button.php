<h4>Example - Button action</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('button-action', [
    'type'    => 'button',
    'layout'  => 'action',
    'content' => 'Action'
  ]) ?>
  <?= $fields->render_element('button-action') ?>
</div>

<h4>Example - Button danger</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('button-danger', [
    'type'    => 'button',
    'layout'  => 'danger',
    'content' => 'Danger'
  ]) ?>
  <?= $fields->render_element('button-danger') ?>
</div>

<h4>Example - Button primary</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('button-primary', [
    'type'    => 'button',
    'layout'  => 'primary',
    'content' => 'Primary'
  ]) ?>
  <?= $fields->render_element('button-primary') ?>
</div>

<h4>Example - Button text action</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('button-text-action', [
    'type'    => 'button',
    'layout'  => 'text-action',
    'content' => 'Action'
  ]) ?>
  <?= $fields->render_element('button-text-action') ?>
</div>

<h4>Example - Button text danger</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('button-text-danger', [
    'type'    => 'button',
    'layout'  => 'text-danger',
    'content' => 'Danger'
  ]) ?>
  <?= $fields->render_element('button-text-danger') ?>
</div>

<h4>Example - Button text primary</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('button-text-primary', [
    'type'    => 'button',
    'layout'  => 'text-primary',
    'content' => 'Primary'
  ]) ?>
  <?= $fields->render_element('button-text-primary') ?>
</div>

<h4>Example - Button simple</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('button-simple', [
    'type'    => 'button',
    'content' => 'Simple'
  ]) ?>
  <?= $fields->render_element('button-simple') ?>
</div>

<h4>Code</h4>

<div class="tangible-settings-code-preview">

<?php $this->start_code('php') ?>

// Example - PHP

$fields->register_element('button-name', [
  'type'    => 'button',
  'layout'  => 'primary', // Optional: primary, action, danger, text-primary, text-action, text-danger
  'content' => 'Button text'
]);

echo $fields->render_element('button-name')
<?php $this->end_code() ?>
<?php $this->start_code('javascript') ?>

// Example - JS

const component = tangibleFields.render(
  {
    name    : 'button-name',
    type    : 'button',
    layout  : 'primary'
    content : 'Button text'
  }
  'element'
)
<?php $this->end_code() ?>
</div>


