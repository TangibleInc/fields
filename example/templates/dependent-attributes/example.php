<h4>Color opacity</h4> 

<p>The switch will enable or disable the opacity in the color picker:</p>

<div class="tangible-settings-row">
  <?= $fields->render_field('dependent-color-switch', [
    'type'      => 'switch',
    'value'     => $fields->fetch_value('dependent-color-switch'),
    'value_on'  => true,
    'value_off' => false
  ]); ?>
</div>

<div class="tangible-settings-row">
  <?= $fields->render_field('dependent-color-picker', [
    'type'           => 'color_picker',
    'enable_opacity' => '{{dependent-color-switch}}',
    'value'          => $fields->fetch_value('dependent-color-picker'),
    'dependent'      => true,
  ]); ?>
</div>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('dependent-color-switch', [
      'type'      => 'switch',
      'value'     => $fields->fetch_value('dependent-color-switch'),
      'value_on'  => true,
      'value_off' => false
    ]);

    echo $fields->render_field('dependent-color-picker', [
      'type'           => 'color_picker',
      'enable_opacity' => '{{dependent-color-switch}}',
      'value'          => $fields->fetch_value('dependent-color-picker'),
      'dependent'      => true,
    ]);
  </code>
</pre>

<h4>Repeater</h4> 

<p>The first select of a row will the post types of the post in the combo box:</p>

<div class="tangible-settings-row">
  <?= $fields->render_field('dependent-attribute-repeater', [
    'type'       => 'repeater',
    'layout'     => 'table',
    'value'      => $fields->fetch_value('dependent-attribute-repeater'),
    'sub_fields' => [
      [
        'type'    => 'select',
        'label'   => 'Post types',
        'name'    => 'field-post-type',
        'choices' => array_reduce(
          get_post_types([], 'objects'),
          function($post_types, $item) {
            $post_types[ $item->name ] = $item->labels->singular_name;
            return $post_types;
          },
          []
        )
      ],
      [
        'label'      => 'Select a post',
        'description'=> '',
        'name'       => 'post-select',
        'type'       => 'combo_box',
        'is_async'   => true,
        'dependent'  => true,
        'search_url' => get_rest_url() . 'wp/v2/search',
        'async_args' => [
          'subtype' => '{{field-post-type}}'
        ],
      ]
    ]
  ]); ?>
</div>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('dependent-attribute-repeater', [
      'type'       => 'repeater',
      'layout'     => 'table',
      'value'      => $fields->fetch_value('dependent-attribute-repeater'),
      'sub_fields' => [
        [
          'type'    => 'select',
          'label'   => 'Post types',
          'name'    => 'field-post-type',
          'choices' => array_reduce(
            get_post_types([], 'objects'),
            function($post_types, $item) {
              $post_types[ $item->name ] = $item->labels->singular_name;
              return $post_types;
            },
            []
          )
        ],
        [
          'label'      => 'Select a post',
          'description'=> '',
          'name'       => 'post-select',
          'type'       => 'combo_box',
          'is_async'   => true,
          'dependent'  => true,
          'search_url' => get_rest_url() . 'wp/v2/search',
          'async_args' => [
            'subtype' => '{{field-post-type}}'
          ],
        ]
      ]
    ]);
  </code>
</pre>
