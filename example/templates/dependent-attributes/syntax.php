<p>The "Dependent Values" feature allows you to establish dynamic relationships between a 2 fields, where an attribute of one field is dependent on the value of another field.</p>
<p>This feature is particularly useful when you want to create interactive and context-aware fields that adapt to user selections.</p>

<h4>Usage</h4>

<p>To set up dependent values, follow these steps:</p>
<ul>
  <li>In your field definitions, set the <code>dependent</code> attribute to <code>true</code></li>
  <li>In the same field definition, use the notation <code>{{field-name}}</code> to indicate that a given attribut depends on another field's value. The field-name should be replaced with the actual name of the field you want to reference. You can use multiple depedent values coming from different fields inside on same field.</li>
  <li>If the field value we depend of is an object, it's possible to access to an attribute by using the following syntax: <code>{{field-name.attribute}}</code>. For example in the case of an async combobox, the field value will be a object like this one: <code>{ value: '1', label: 'Label' }</code>. It would be possible to access only the object or the label by doing the following: <code>{{field-name.value}}</code> and <code>{{field-name.label}}</code>.</li>
</ul>

<p>In this example, the label and the description the last field will be the value of the other 2 fields:</p>
<pre>
  <code>
    $fields = tangible_fields();
    <?php $plugin->render_registation_message(); ?>

    echo $fields->render_field('label-field', [
      'label'      => 'Set the label of the last field',
      'type'       => 'text',
      'value'      => $fields->fetch_value('label-field'),
    ]);

    echo $fields->render_field('description-field', [
      'label'      => 'Set the description of the last field',
      'type'       => 'text',
      'value'      => $fields->fetch_value('description-field'),
    ]);

    echo $fields->render_field('custom-field', [
      'label'       => '{{label-field}}',
      'description' => '{{description-field}}',
      'type'        => 'text',
      'dependent'   => true,
      'value'       => $fields->fetch_value('custom-field'),
    ]);
  </code>
</pre>


