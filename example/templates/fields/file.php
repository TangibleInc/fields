The saved value is an attachment ID.<br />
An important note is that all files uploaded will stay, regardless of if the field value is saved or not.<br />
By default, all the mime types from this function are allowed: <a href="https://developer.wordpress.org/reference/functions/get_allowed_mime_types/">get_allowed_mime_types()</a>.

<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('file', [
    'label'       => 'File',
    'type'        => 'file',
    'description' => 'Description',
    'value'       => $fields->fetch_value('file'),
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example of using stock file input field</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('file_input', [
    'label'       => 'File',
    'type'        => 'file',
    'description' => 'Description',
    'value'       => $fields->fetch_value('file_input'),
    'wp_media'    => false
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example of wp_media enabled and shortcut for mimetypes</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('file_wp_media', [
    'label'       => 'File',
    'type'        => 'file',
    'description' => 'Description',
    'value'       => $fields->fetch_value('file_wp_media'),
    'mime_types'  => [
        'video',
        'image', 
    ]
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with image only</h4>

<?= $fields->render_field('file_image', [
  'label'       => 'File',
  'type'        => 'file',
  'description' => 'Description',
  'value'       => $fields->fetch_value('file_image'),
  'mime_types'  => [
    'image/jpeg', 
    'image/gif', 
    'image/png', 
    'image/bmp', 
    'image/tiff', 
    'image/webp', 
    'image/x-icon', 
    'image/heic'
  ]
]) ?>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with a limit of 2 uploads</h4>

<?= $fields->render_field('file_limited', [
  'label'       => 'File',
  'type'        => 'file',
  'description' => 'Description',
  'value'       => $fields->fetch_value('file_limited'),
  'max_upload'  => 2
]) ?>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('file'),
  $fields->fetch_value('file_input'),
  $fields->fetch_value('file_wp_media'),
  $fields->fetch_value('file_image'),
  $fields->fetch_value('file_limited')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>
    
    echo $fields->render_field('name', [
      'label'       => 'Upload field',
      'type'        => 'file',
      'description' => 'Description',
      'value'       => $fields->fetch_value('name'),
      'max_upload'  => 5,
      // You can disable wp_media to use the file input field instead of WP media.
      'wp_media'    => false,
      'mime_types'  => [
        // you can include them by shortcut or by specific mime type
        'video',
        'image',
        'text',
        'application',
        'audio',
        'image/jpeg', 
        'image/gif', 
        'image/png', 
        'image/bmp', 
        'image/tiff', 
        'image/webp', 
        'image/x-icon', 
        'image/heic'
      ]
    ]);
  </code> 
</pre>

