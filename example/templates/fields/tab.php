<h4>Example</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('tab', [
    'label' => 'Tab field',
    'type'  => 'tab',
    'value' => $fields->fetch_value('tab'),
    'tabs'  => [
      'tab-name-1' => [
        'title'   => 'Tab name 1',
        'fields'  => [
          [
            'label' => 'Text field',
            'type'  => 'text',
            'name'  => 'text-field'
          ],
          [
            'label' => 'Code field',
            'type'  => 'code',
            'name'  => 'code-field'
          ],
        ]
      ],
      'tab-name-2' => [
        'title'   => 'Tab name 2',
        'fields'  => [
          [
            'label' => 'Color field',
            'type'  => 'color-picker',
            'name'  => 'color-field'
          ],
          [
            'label' => 'Number field',
            'type'  => 'number',
            'name'  => 'number-field'
          ],
        ]
      ]
    ]
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('tab')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'label' => 'Tab field',
      'type'  => 'tab',
      'value' => $fields->fetch_value('name'),
      'tabs'  => [
        'tab-name-1' => [
          'title'   => 'Tab name 1',
          'fields'  => [
            [
              'label' => 'Text field',
              'type'  => 'text',
              'name'  => 'text-field'
            ],
            [
              'label' => 'Code field',
              'type'  => 'code',
              'name'  => 'code-field'
            ],
          ]
        ],
        'tab-name-2' => [
          'title'   => 'Tab name 2',
          'fields'  => [
            [
              'label' => 'Color field',
              'type'  => 'color-picker',
              'name'  => 'color-field'
            ],
            [
              'label' => 'Number field',
              'type'  => 'number',
              'name'  => 'number-field'
            ],
          ]
        ]
      ]
    ]);
  </code> 
</pre>
