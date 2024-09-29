<div class="tf-dynamic-value-list">

  <div class="tf-dynamic-value-list-sidebar">
    <?php foreach($fields->dynamic_values_categories as $category): ?>
      <strong><?= $category['label'] ?></strong>
      <?php sort($category['values']) ?>
      <ul>
        <?php foreach($category['values'] as $value): ?>
          <li class="tf-dynamic-value-trigger-js" data-value="<?= $value ?>">
            <?= $fields->dynamic_values[ $value ]['label'] ?>
          </li>
        <?php endforeach; ?>
      </ul>
    <?php endforeach; ?>
  </div>

  <div class="tf-dynamic-value-list-content">
    <?php foreach($fields->dynamic_values_categories as $category): ?>
        <?php foreach($category['values'] as $value): ?>
          <div class="tf-dynamic-value-content-js" style="display: none">
            <h3>
              <?= $category['label'] ?> - <?= $fields->dynamic_values[ $value ]['label'] ?>
            </h3>
            <div class="tf-dynamic-value-description">
              <i><?= $fields->dynamic_values[ $value ]['description'] ?? 'No description' ?></i>
            </div>
            <div class="tf-dynamic-value-settings">
              <?php if($settings = $fields->dynamic_values[ $value ]['fields'] ?? false): ?>
                <strong>Setting form:</strong>
                <ul>
                <?php foreach($settings as $setting): ?>
                  <li><?= $setting['label'] ?> - <?= $setting['type'] ?></li>
                <?php endforeach; ?>
                </ul>
              <?php endif; ?>
            </div>
          </div>
        <?php endforeach; ?>
    <?php endforeach; ?>
    <div class="tf-dynamic-value-content-js">
      <i>No dynamic value selected</i>
    </div>
  </div>

</div>
