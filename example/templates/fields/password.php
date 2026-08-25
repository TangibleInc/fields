<h4>Example</h4>

<p>
  A password field never receives the stored value. The server sends
  <code>value_is_set</code> — a boolean — and nothing else, so an untouched
  field submits empty and the save handler reads empty as "keep the stored
  value". Typing replaces it.
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
