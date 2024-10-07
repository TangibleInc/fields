<h4>Example</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('label', [
    'type'    => 'label',
    'content' => 'Label'
  ]) ?>
  <?= $fields->render_element('label') ?>
</div>

<h4>Code</h4>

<div class="tangible-settings-code-preview">

<?php $this->start_code('php') ?>

// Example - PHP

$fields->register_element('label-name', [
  'type'    => 'label',
  'content' => 'Label text'
]);

echo $fields->render_element('label-name')
<?php $this->end_code() ?>
<?php $this->start_code('javascript') ?>

// Example - JS

const component = tangibleFields.render(
  {
    name    : 'label-name',
    type    : 'label',
    content : 'Label text'
  }
  'element'
)
<?php $this->end_code() ?>
</div>


