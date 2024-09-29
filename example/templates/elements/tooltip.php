<!-- Tooltip Button -->

<h4>Example - Tooltip Button start</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('tooltip-button-start', [
    'type'      => 'tooltip',
    'layout'    => 'button',
    'label'     => 'Button Hover Start',
    'placement' => 'start',
    'content'   => 'Tooltip button content, placement on start'
  ]) ?>
  <?= $fields->render_element('tooltip-button-start') ?>
</div>

<h4>Example - Tooltip Button top</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('tooltip-button-top', [
    'type'      => 'tooltip',
    'layout'    => 'button',
    'label'     => 'Button Hover Top',
    'placement' => 'top',
    'content'   => 'Tooltip button content, placement on top'
  ]) ?>
  <?= $fields->render_element('tooltip-button-top') ?>
</div>

<h4>Example - Tooltip Button bottom</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('tooltip-button-bottom', [
    'type'      => 'tooltip',
    'layout'    => 'button',
    'label'     => 'Button Hover Bottom',
    'placement' => 'bottom',
    'theme'     => 'dark',
    'content'   => 'Tooltip button content, placement on bottom'
  ]) ?>
  <?= $fields->render_element('tooltip-button-bottom') ?>
</div>

<h4>Example - Tooltip Button end</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('tooltip-button-end', [
    'type'      => 'tooltip',
    'layout'    => 'button',
    'label'     => 'Button Hover End',
    'placement' => 'end',
    'theme'     => 'dark',
    'content'   => 'Tooltip button content, placement on end'
  ]) ?>
  <?= $fields->render_element('tooltip-button-end') ?>
</div>

<!-- Tooltip Text -->

<h4>Example - Tooltip Text start</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('tooltip-text-start', [
    'type'      => 'tooltip',
    'layout'    => 'text',
    'label'     => 'Text Hover Start',
    'placement' => 'start',
    'theme'     => 'dark',
    'content'   => 'Tooltip text content, placement on start'
  ]) ?>
  <?= $fields->render_element('tooltip-text-start') ?>
</div>

<h4>Example - Tooltip Text top</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('tooltip-text-top', [
    'type'      => 'tooltip',
    'layout'    => 'text',
    'label'     => 'Text Hover Top',
    'placement' => 'top',
    'theme'     => 'dark',
    'content'   => 'Tooltip text content, placement on top'
  ]) ?>
  <?= $fields->render_element('tooltip-text-top') ?>
</div>

<h4>Example - Tooltip Text bottom</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('tooltip-text-bottom', [
    'type'      => 'tooltip',
    'layout'    => 'text',
    'label'     => 'Text Hover Bottom',
    'placement' => 'bottom',
    'content'   => 'Tooltip text content, placement on bottom'
  ]) ?>
  <?= $fields->render_element('tooltip-text-bottom') ?>
</div>

<h4>Example - Tooltip Text end</h4>

<div class="tangible-settings-row">
  <?php $fields->register_element('tooltip-text-end', [
    'type'      => 'tooltip',
    'layout'    => 'text',
    'label'     => 'Text Hover End',
    'placement' => 'end',
    'content'   => 'Tooltip text content, placement on end'
  ]) ?>
  <?= $fields->render_element('tooltip-text-end') ?>
</div>

<h4>Code</h4>

<div class="tangible-settings-code-preview">

  <?php $this->start_code('php') ?>

  // Example - PHP

  $fields->register_element('tooltip-name', [
    'type'          => 'tooltip',
    'layout'        => 'button', // Optional: 'button', 'text'
    'button_props'  => [ 'type' => 'primary' ], // Optional, anything supported by the button element
    'label'         => 'Top'
    'placement'     => 'top', // Optional: 'start', 'top', 'bottom', 'end'
    'theme'         => 'light', // Optional: 'dark', 'light'
    'content'       => 'Tooltip content, placement on top'
  );

  echo $fields->render_element('tooltip-name')

  <?php $this->end_code() ?>
  <?php $this->start_code('javascript') ?>

  // Example - JS

  const component = tangibleFields.render(
    {
      name        : 'tooltip-name',
      type        : 'tooltip',
      layout      : 'button', // Optional: 'button', 'text'
      buttonProps : { onPress: () => console.log('Button pressed') } // Optional, anything supported by the button element
      label       : 'Top',
      placement   : 'top', // Optional: 'start', 'top', 'bottom', 'end'
      theme       : 'light', // Optional: 'dark', 'light'
      content     : 'Tooltip content, placement on top'
    }
    'element'
  )
  <?php $this->end_code() ?>
</div>
