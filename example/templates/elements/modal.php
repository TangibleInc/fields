<h4>Example</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('modal', [
    'label'        => 'Open modal',
    'type'         => 'modal',
    'content'      => 'Modal',
    'title'        => 'Modal title',
    'content'      => 'Modal content',
    'confirm_text' => 'Are you sure?',
    'cancel_text'  => 'Discard changes',
  ]) ?>
  <?= $fields->render_element('modal') ?>
</div>

<h4>Code</h4>

<div class="tangible-settings-code-preview">

<?php $this->start_code('php') ?>

// Example - PHP

$fields->register_element('modal', [
  'label'        => 'Open modal',
  'type'         => 'modal',
  'content'      => 'Modal',
  'title'        => 'Modal title',
  'content'      => 'Modal content',
  'confirm_text' => 'Are you sure?',
  'cancel_text'  => 'Discard changes',
]);

echo $fields->render_element('modal')
<?php $this->end_code() ?>
<?php $this->start_code('javascript') ?>

// Example - JS

const component = tangibleFields.render(
  {
    label       : 'Open modal',
    type        : 'modal',
    content     : 'Modal',
    title       : 'Modal title',
    content     : 'Modal content',
    confirmText : 'Are you sure?',
    cancelText  : 'Discard changes',
  }
  'element'
)
<?php $this->end_code() ?>
</div>


