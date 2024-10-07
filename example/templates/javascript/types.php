<h4>Register a new field type</h4>

<p>It's possible to register your own field type from your script, by registering a React component and associating it with a new field type.</p>
<p>It can be done with the <code>tangibleFields.types.add()</code> function:</p>

<?php $this->start_code('javascript') ?>
tangibleFields.types.add('custom-field-type', CustomFieldComponent)
<?php $this->end_code() ?>

<h4>Create your custom field component</h4>

In order to interact correctly with fields, your custom component must:
<ul>
  <li>Get its initial value from <code>props.value</code></li>
  <li>If <code>props.onChange</code> is defined, return the new value each time it changes</li>
  <li>When <code>props.name</code> is defined, make the value accessible from a traditional html form (by defining the value in an hidden input for example)</li>
</ul>

<p>Here is a minimal example:</p>
<?php $this->start_code('javascript') ?>
const CustomFieldComponent = props => {

  const [value, setValue] = useState(props.value ?? '')

  // ...

  useEffect(() => props.onChange ? props.onChange(value) : null, [value])
  
  // ...

  return(
   <>
    <input type="hidden" name={ props.name ?? '' } value={ value } />
    // ...
   </> 
  )
}
<?php $this->end_code() ?>

<h4>Example - User info field type</h4>

Here is a working example with a JSON value:
<div class="tangible-settings-code-preview">

  <div class="tangible-settings-code-preview-field">
    <!-- Custom field type example initialized in this div -->
    <div 
      id="tf-example-custom-types"
      class="tangible-settings-row" 
      data-value="<?= esc_attr( $fields->fetch_value('custom-field-example') ) ?>"
    ></div>
    <?php tangible\see( 
      $fields->fetch_value('custom-field-example')
    ); ?>
    <div class="tangible-settings-row">
      <?php submit_button() ?>
    </div>
  </div>

  <div class="tangible-settings-code-preview-code">
    <?php $this->start_code('javascript') ?>
const UserForm = props => {

  const { initJSON } = tangibleFields.utils
  const [value, setValue] = useState( initJSON(props.value ?? {}) )

  useEffect(() => {
    if( props.onChange ) props.onChange(value)
  }, [value])

  return(
    <div className="tf-custom-type" style={{ display: 'flex' }}>
      <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(value) } />
      <div>
        <strong>Character attributes:</strong>
        <hr /> 
        { tangibleFields.render({
          label     : 'First name',
          type      :'text',
          value     : value.firstName ?? '',
          onChange  : firstName => setValue({ ...value, firstName: firstName }),
        }) }
        { tangibleFields.render({
          label     : 'Last name',
          type      :'text',
          value     : value.lastName,
          onChange  : lastName => setValue({ ...value, lastName: lastName }),
        }) }
        <hr />
        { tangibleFields.render({
          label     : 'Avatar',
          type      : 'file',
          maxUpload : 1,
          wp_media  : false,
          value     : value.avatar ?? '',
          onChange  : avatar => setValue({ ...value, avatar: avatar }),
          mimeTypes : [ 'image' ]
        }) }
      </div>
    </div>
  )
}
tangibleFields.types.add('user-form', UserForm)
    <?php $this->end_code() ?>
  </div>
</div>
