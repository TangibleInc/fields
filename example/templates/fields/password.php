<h4>Example</h4>

<p>
  A password field never receives the stored value. The server sends
  <code>value_is_set</code> — a boolean — and nothing else. While a value is
  saved and nothing has been typed, the input has no name, so it is left out of
  <code>$_POST</code> entirely. Typing replaces it.
</p>

<p>
  The save handler has to treat a missing key as "keep the saved value" — an
  empty string means the field was submitted empty. This page's handler only
  stores keys that are present:
</p>

<pre><code>if( isset($_POST['password']) ) {
  $fields->store_value('password', $_POST['password']);
}</code></pre>

<p>
  With the Settings API, a missing option is saved as <code>null</code>, so map
  it back in the <code>sanitize_callback</code>:
</p>

<pre><code>register_setting('my_group', 'my_api_key', [
  'sanitize_callback' => fn($value) => $value === null
    ? get_option('my_api_key')
    : sanitize_text_field($value),
]);</code></pre>

<p>
  Top-level only. A repeater, a group, tab or accordion that is not
  <code>uncontrolled</code>, and dynamic value settings save their subfields as
  one value and cannot leave one out, so a password subfield there is dropped
  with a warning — at any depth, so an <code>uncontrolled</code> group inside a
  repeater does not help.
</p>

<div class="tangible-settings-row">
  <?= $fields->render_field('password', [
    'label'        => 'API key',
    'type'         => 'password',
    'value_is_set' => (bool) $fields->fetch_value('password'),
    'placeholder'  => 'Paste a new key to replace',
    'description'  => 'Leave empty to keep the saved key.'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('password') ? '(a value is saved)' : '(empty)'
); ?>

<h4>Example with locked</h4>

<p>
  For a value defined outside this screen — a <code>wp-config.php</code>
  constant, an environment variable. Read-only rather than disabled, so the
  field stays in the tab order and screen reader users still learn it exists.
</p>

<div class="tangible-settings-row">
  <?= $fields->render_field('password-locked', [
    'label'          => 'API key',
    'type'           => 'password',
    'value_is_set'   => true,
    'locked'         => true,
    'locked_message' => 'Defined in wp-config.php.'
  ]) ?>
</div>

<h4>Example with translated labels</h4>

<p>
  Every string the field renders or exposes to assistive technology can be
  replaced. The set-state placeholder is one whole string, bullets included, so
  a translation controls the bullet run and the word order.
</p>

<div class="tangible-settings-row">
  <?= $fields->render_field('password-labels', [
    'label'        => 'Clé API',
    'type'         => 'password',
    'value_is_set' => true,
    'labels'       => [
      'reveal'              => 'Afficher la valeur',
      'hide'                => 'Masquer la valeur',
      'shown'               => 'Valeur affichée.',
      'hidden'              => 'Valeur masquée.',
      'valueSet'            => '•••••••• Enregistrée',
      'valueSetDescription' => 'Une valeur est enregistrée et masquée. La saisie la remplace.',
      'locked'              => 'Cette valeur est gérée en dehors de cet écran.'
    ]
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>
