We support two options for the editor: ProseMirror and TinyMCE.

<ul>
  <li> ProseMirror: default editor </li>
  <li> TinyMce: to use TinyMce editor, set the parameter 'editor' to 'editor' => 'tinymce' </ul>
</ul>

<h4>Example - ProseMirror</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('wysiwyg', [
    'label'       => 'Editor field',
    'type'        => 'wysiwyg',
    'value'       => $fields->fetch_value('wysiwyg'),
    'placeholder' => 'Example placeholder',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example - ProseMirror without raw_view</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('wysiwyg-visual', [
    'label'       => 'Editor field',
    'type'        => 'wysiwyg',
    'value'       => $fields->fetch_value('wysiwyg-visual'),
    'placeholder' => 'Example placeholder',
    'description' => 'Example description',
    'raw_view'    => false
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example - TinyMce</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('wysiwyg-tinymce', [
    'label'       => 'Editor field',
    'type'        => 'wysiwyg',
    'value'       => $fields->fetch_value('wysiwyg-tinymce'),
    'editor'      => 'tinymce',
    'placeholder' => 'Example placeholder',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('wysiwyg'),
  $fields->fetch_value('wysiwyg-visual'),
  $fields->fetch_value('wysiwyg-tinymce')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field( 'name', [
      'label'       => 'Editor field',
      'type'        => 'wysiwyg',
      'value'       => $fields->fetch_value('name'),
      'editor'      => 'tinymce',
      'raw_view'    => false, // Only with prosemirror editor, default true
      'placeholder' => 'Example placeholder',
      'description' => 'Example description'
    ]);
  </code>
</pre>
