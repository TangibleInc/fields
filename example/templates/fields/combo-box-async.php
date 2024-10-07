While the control looks the same regardless of if it uses static or async data, the returned value will be different.<br />
In the case of an async combobox, it will be a json object with both the value and the labe (instead of a string with the value).

<h4>Map results</h4>

<p>The optional <code>map_results</code> attribute allows you to configure how data from asynchronous sources is mapped to the <code>id</code> and <code>title</code> attributes of the ComboBox options.</p> 
<p>This mapping is crucial if the endpoint/ajax action you are using doesn't return objects with a <code>title</code> and an <code>id</code> keys.</p>

<p>For example, if the returned data for a given endpoint is this JSON:</p>
<pre>
  <code>
    [
      { label: 'First', uuid: '1' },
      { label: 'Second', uuid: '2' }
    ]
  </code>
</pre>

<p>We will want to use label as the title, and uuid as the id.</p>
<p>In order to do that, we can will have to set <code>map_results</code> like this:</p>
<pre>
  <code>
    echo $fields->render_field('name', [
      'type'  => 'combo_box',
      // ...
      'map_results' => [
        'id'    => 'uuid'
        'title' => 'label'
      ]
    ]);
  </code>
</pre>

<p>It is also possible to get data from an object, for example with this response:</p>
<pre>
  <code>
    [
      { 
        uuid: '1',
        data: {
          title: 'Fist',
          content: 'First content'
        } 
      },
      { 
        uuid: '2',
        data: {
          title: 'Second',
          content: 'Second content'
        } 
      }
  ] 
  </code>
</pre>

<p>We can use the following <code>map_results</code>:</p>
<pre>
  <code>
    echo $fields->render_field('name', [
      'type'  => 'combo_box',
      // ...
      'map_results' => [
        'id'    => 'uuid'
        'title' => [
          'key'       => 'data',
          'attribute' => 'title',
        ]
      ]
    ]);
  </code>
</pre>

<p>Currently, it won't work with nested objects.</p>

<h4>Example with async loading (using a fetch url)</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('combobox_async_rest', [
    'type'       => 'combo_box',
    'value'      => $fields->fetch_value('combobox_async_rest'),
    'label'      => 'Categories list combobox',
    'is_async'   => true,
    'search_url' => get_rest_url() . 'wp/v2/search',
    'async_args' => [
      'subtype' => 'post'
    ],
    'placeholder' => 'Example placeholder',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with async loading (using ajax module from the framework)</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('combobox_async_ajax', [
    'type'        => 'combo_box',
    'value'       => $fields->fetch_value('combobox_async_ajax'),
    'label'       => 'Categories list combobox',
    'is_async'    => true,
    'ajax_action' => 'tangible_field_select_post', // @see ../ajax/index.php
    'async_args'  => [
      'post_type' => 'post,page'
    ],
    'placeholder' => 'Example placeholder',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Example with async loading and multiple values</h4>

<div class="tangible-settings-row">
  <?= $fields->render_field('combobox_async_multiple', [
    'type'        => 'combo_box',
    'value'       => $fields->fetch_value('combobox_async_multiple'),
    'label'       => 'Categories list combobox',
    'is_async'    => true,
    'multiple'    => true,
    'ajax_action' => 'tangible_field_select_post', // @see ../ajax/index.php
    'async_args'  => [
      'post_type' => 'post,page'
    ],
    'placeholder' => 'Example placeholder',
    'description' => 'Example description'
  ]) ?>
</div>

<div class="tangible-settings-row">
  <?php submit_button() ?>
</div>

<h4>Value</h4>

<?php tangible\see(
  $fields->fetch_value('combobox_async_rest'),
  $fields->fetch_value('combobox_async_ajax'),
  $fields->fetch_value('combobox_async_multiple')
); ?>

<h4>Code</h4>

<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('name', [
      'type'  => 'combo_box',
      'value' => $fields->fetch_value('name'),
      'label' => 'Categories list combobox',

      // Async list (fetch url)
      'is_async'   => true,
      'search_url' => get_rest_url() . 'wp/v2/search',
      'async_args' => [
        'subtype' => 'post'
      ],

      // Async list (framework ajax module, @see https://docs.tangible.one/modules/plugin-framework/ajax/)
      'is_async'   => true,
      'ajax_action'=> 'ajax_action_name',
      'async_args' => [
        'post_type' => 'post'
      ],

      'placeholder' => 'Example placeholder',
      'description' => 'Example description'
    ]);
  </code> 
</pre>
