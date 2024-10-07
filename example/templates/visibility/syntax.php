<h4>Overview</h4>

The conditional visibility functionality enables showing/hiding specific fields form based on other fields values.

<h4>Syntax</h4>

To implement conditional visibility, use the following syntax:

<pre>
  <code>
    echo $fields->render_field('visibility-text', [
      'condition' => [
        'action'    => 'show',
        'condition' => [
          '_and' => [
            ['field_name' => [ 'comparison_operator' => 'value']],
            ['field_name' => [ 'comparison_operator' => 'value']]
          ]
        ]
      ]
    ]
  </code>
</pre>

<ul>
  <li>field_name: the name of the field to which the conditional visibility applies.</li>
  <li>field_value: the value of the field to which the conditional visibility applies.</li>
  <li>action: either `show` or `hide`, depending on whether the field should be shown or hidden when the conditions are met.</li>
  <li>condition: an array of conditions that must be met for the field to be shown/hidden. This array can contain an `_and` or `_or` key that specifies the logical operator to be used for the comparison, when no specified `_and` will be used.</li>
</ul>
