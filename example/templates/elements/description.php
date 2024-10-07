<h4>Example</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('description', [
    'type'    => 'description',
    'content' => 'Description text'
  ]) ?>
  <?= $fields->render_element('description') ?>
</div>

<h4>Code</h4>

<div class="tangible-settings-code-preview">

<?php $this->start_code('php') ?>

// Example - PHP

$fields->register_element('description-name', [
  'type'    => 'description',
  'content' => 'Description text'
]);

echo $fields->render_element('description-name')
<?php $this->end_code() ?>
<?php $this->start_code('javascript') ?>

// Example - JS

const component = tangibleFields.render(
  {
    name    : 'description-name',
    type    : 'description',
    content : 'Description text'
  }
  'element'
)
<?php $this->end_code() ?>
</div>


