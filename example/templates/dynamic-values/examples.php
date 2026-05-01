<h4>Text (insert mode)</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dynamic-text', [
    'label'       => 'Text field',
    'type'        => 'text',
    'value'       => $fields->fetch_value('dynamic-text'),
    'placeholder' => 'Example placeholder',
    'description' => 'Example description',
    'dynamic'     => true
  ]) ?>
</div>

<?php tangible\see(
  'Raw value: ' . $fields->fetch_value('dynamic-text'),
  'Parsed value: ' . $fields->render_value(
    $fields->fetch_value('dynamic-text')
  ),
); ?>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Text (replace mode)</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dynamic-text-replace', [
    'label'       => 'Text field',
    'type'        => 'text',
    'value'       => $fields->fetch_value('dynamic-text-replace'),
    'placeholder' => 'Example placeholder',
    'description' => 'Example description',
    'dynamic'     => [ 'mode' => 'replace' ]
  ]) ?>
</div>

<?php tangible\see(
  'Raw value: ' . $fields->fetch_value('dynamic-text-replace'),
  'Parsed value: ' . $fields->render_value(
    $fields->fetch_value('dynamic-text-replace')
  ),
); ?>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Color</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dynamic-color', [
    'label'       => 'Color field',
    'type'        => 'color_picker',
    'value'       => $fields->fetch_value('dynamic-color'),
    'placeholder' => 'Example placeholder',
    'description' => 'Example description',
    'dynamic'     => true
  ]) ?>
</div>

<?php tangible\see(
  'Raw value: ' . $fields->fetch_value('dynamic-color'),
  'Parsed value: ' . $fields->render_value(
    $fields->fetch_value('dynamic-color')
  ),
); ?>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Date</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dynamic-date', [
    'label'       => 'Date field',
    'type'        => 'date_picker',
    'value'       => $fields->fetch_value('dynamic-date'),
    'placeholder' => 'Example placeholder',
    'description' => 'Example description',
    'dynamic'     => true
  ]) ?>
</div>

<?php tangible\see(
  'Raw value: ' . $fields->fetch_value('dynamic-date'),
  'Parsed value: ' . $fields->render_value(
    $fields->fetch_value('dynamic-date')
  ),
); ?>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Number</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dynamic-number', [
    'label'       => 'Number',
    'type'        => 'number',
    'value'       => $fields->fetch_value('dynamic-number'),
    'placeholder' => 'Example placeholder',
    'description' => 'Example description',
    'dynamic'     => true
  ]) ?>
</div>

<?php tangible\see(
  'Raw value: ' . $fields->fetch_value('dynamic-number'),
  'Parsed value: ' . $fields->render_value(
    $fields->fetch_value('dynamic-number')
  ),
); ?>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Editor (ProseMirror)</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dynamic-editor', [
    'label'       => 'Editor field',
    'type'        => 'wysiwyg',
    'value'       => $fields->fetch_value('dynamic-editor'),
    'description' => 'Example description',
    'dynamic'     => true
  ]) ?>
</div>

<?php tangible\see(
  'Raw value: ' . $fields->fetch_value('dynamic-editor'),
  'Parsed value: ' . $fields->render_value(
    $fields->fetch_value('dynamic-editor')
  ),
); ?>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Editor (TinyMCE)</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('dynamic-editor-tinymce', [
    'label'       => 'Editor field (TinyMCE)',
    'type'        => 'wysiwyg',
    'editor'      => 'tinymce',
    'value'       => $fields->fetch_value('dynamic-editor-tinymce'),
    'description' => 'Example description',
    'dynamic'     => true
  ]) ?>
</div>

<?php tangible\see(
  'Raw value: ' . $fields->fetch_value('dynamic-editor-tinymce'),
  'Parsed value: ' . $fields->render_value(
    $fields->fetch_value('dynamic-editor-tinymce')
  ),
); ?>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>
