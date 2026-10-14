# 20250107

- Dependent attributes
    - Add possibility to add multiple dependent string on the same attribtue
    - Add possibility to add dependent attribute inside a string
    - Add support for callbackData
    - Fix issue when formating dependent attributes
- Development:
    - Add archive command to create zip package
    - Add E2E testing with Playwright and wp-now
    - Add GitHub release workflow for version tag
    - Add local site environment with wp-now
    - Add NPM script "version" to update module version
    - Documentation: Move documentation from the [fields-example](https://github.com/TangibleInc/fields-example) plugin to the example folder
    - Document local test site and installing dev dependencies such as third-party plugins
    - Load Framework and Updater when running as plugin
    - Load Updater module when running as plugin
    - Move to devDependencies: @playwright/test, @wordpress/e2e-test-utils-playwright, concurrently
    - Update dependencies
    - Update URLs from Bitbucket to GitHub
    - Use standard module loader
- Fields:
    - Combobox: Async - Attempt to convert response to an array if it's an object
    - Checkbox: Make label clickable
    - Fetch/Store: Add possibility to pass an optional array
    - Repeater: Add possibility to override string for the add button
    - Repeater: Add possibility to register repeater layout from outisde of fields and give access to dispatcher
    - Repeater: Add Tab layout
    - Repeater: Fix default layout not being set correctly
    - Switch: Style - Use aspect ratio to change size easily
    - Text: Improve readonly mode
- Tests:
    - Checkbox: Add tests

# 20240927

- Dependent attribues:
    - Add possibility to define a callback to format the dependent value before using it as a prop
- Dynamic values:
    - Format: Move formating logic from PHP to JS
- Development:
    - Update npm dependencies and switch to ES module
    - Improve `initField` and `initElement` events
    - Add `ready` event
    - Pass previous value in `valueChange` event
- Elements:
    - Tooltip: New elements
- Fields:
    - Code editor: New field
    - Color picker: Prevent componenent to change from uncontrolled to controlled
    - Conditional panel: Add possibility to overwrite default configuration
    - ComboBox: Add support for `read_only`, add loading state in listbox when async
    - Number: Add support for `read_only`
    - Repeater: Set default layout to table and avoid error if set layout does not exists
    - Repeater: Table - Remove empty column at the start of the row and improve style
    - Select: Improve style
    - WYSIWYG: Add "raw" view that gives possibility to modify the html directly
- Tests:
    - Conditional panel: Improve tests
    - ComboBox: Improve tests
    - Dynamic values: Improve tests and fix test data not formated correctly
    - Jest: Increase default timeout and run tests with one worker only
    - Tooltip: Start tests
- Visibility conditions:
    - Read partial value even if value is a JSON string

# 20240614

- Dynamic values:
    - Date: Implement new dynamic value
- Fetch/Store:
    - Options: Store callback - Fix return when value not updated
- Fields:
    - ComboBox: Async mode - Show message in dropdown when no results
    - List: Implement new field type
    - Repeater: Pass current row index as a props of every child fields
    - Repeater: Section title - Fix dependent value when value comes from a repeater child field
    - Text: Fix placeholder
- Tests:
    - ComboBox: Improve tests
    - Field group: Improve tests
    - List: Start tests
    - Repeater: Improve tests
- Visibility conditions:
    - Add support for attributes when value is an object
- Conditional logic:
    - Add possibility to use a custom dynamic value config when evaluating conditional rules

# 20240322

- Fields:
    - Field group: Fix value not being saved when repeater used inside a field group
    - Field group: Fix issue when multiple visibilty conditions
    - Repeater: Advanced - Add support async combobox in item preview
- Contexts:
    - Various improvment for Elementor context

# 20240314

- Fields:
    - Conditional panel: Advanced - Add support for label
    - ComboBox: Improve CSS when used inside a repeater table
    - Repeater: Advanced - Improve CSS, add support for repeatable and min-length
    - Repeater: Table - Improve CSS
    - Value: If fetch callback defined and no value pass, populate field with callback value
    - Popover: Possibility to define a portalContainer other than body
    - Editor: Prosemirror - Improve CSS
    - Text: Prosemirror - Improve CSS
    - Date picker: Add support for date range values
- Elements:
    - Button: Improve CSS, add buttonPressed event, add support for buttonType
    - Modal: Add element
    - Add possibility to use elements inside repeaters and field groups
- Dependent values:
    - Fix issue when control is dependent and props contains an array
- Contexts:
    - Improve support for dark mode in BeaverBuilder

# 20240113

- Fields:
    - Repeater: New advanced layout 

# 20240112

- Fields:
    - Repeater: Table - Improve CSS
    - Wrapper: Remove warning we class is set from wrapper parameter
- Elements: Adds possibility to render non-fields component from PHP

# 20240104

- Fields:
    - Buttons group: Add support for read_only parameter
    - Select: Add support for read_only parameter
    - Add new conditional panel field type
- Beaver builder: Various style improvment in beaver-builder context

# 20231124

- Visibility conditions:
    - Move code into separate wrapper
- JavaScript:
    - Add possibility to re-render from tangibleFields object
- Dynamic values:
    - Text: Add support for replace mode

# 20231121

- JavaScript:
    - Add possibility to register custom field types from tangibleFields object
    - Add possibility to access utils functions from tangibleFields object
- Dependent values:
    - Add possibility to access dependent values attribute if value is an object
- Fields:
    - Repeaters and Field groups: Allows multiple level of nesting for visibility conditions and dependent values
    - Field groups: Fix issues with infinite re-render
    - Accordions: Fix issues with content visibility being changed when using header switch
    - Text: Add support for read_only parameter
    - File: Fix styling for delete button

# 20231109

- Style contexts:
    - Add possibility to manually enqueue contextes
- Fields:
    - Label: Fix missing missing label warning in various fields
    - Repeater: Fix dependent value not working if not comming from a subfield

# 20231101

- Fields:
    - Increase default z-index for fields that rely on the Popover component
    - Number: Fix issue with name not being used as it should in input element
- Visibility conditions:
    - Repeater: Fix issue with conditions not being evaluated properly in some cases
- Dynamic values:
    - Improve dynamic value detection and allow array to be used as setting values

# 20231003

- Fields:
    - ColorPicker: Switch to new Popover component
    - Gradient: Switch to new Popover component
    - ComboBox: Switch to new Popover component
    - Select: Switch to new Popover component
    - DatePicker: Switch to new Popover component
    - ListBox: Fix missing key errors
- Dynamic values:
    - Order alphabetically inside categories
    - Add optional description parameter

# 20230908

- JavaScript:
    - Improve possibility to interact with data from outside the module by adding tangibleFields.store
    - Add possibility to trigger events by adding tangibleFields.trigger
- Fields:
    - Async ComboBox: Add map_results attribute
- Dynamic values:
    - Fix settings not working with recent changes due to dependent values

# 20230831

- Dynamic values: Fix issues with dynamic values settings not working due to recent changes

# 20230829

- Dependent values: 
    - Remove backend logic and rewrite on the JS side
    - Remove previous limitation (works on every attributes and on both fields/subfields)

# 20230822

- Visibility conditions: Delay evaluateVisibility to next event cycle (prevent issues where values is not updated yet)
- Dynamic values: Add a $config array in render callback
- Dependent values: Fix error when value is not yet defined
- Text field: Fix height in wp context
- Add tangible_fields_loaded action

# 20230712

- Improved CSS for default and wp contexts
- Fields:
    - Number: Added string value support
    - Repeater: Added bulk action for table layout
    - ComboBox: Added placeholder support for single value
- Implemented dynamic value feature
    - Added post category: post_id, post_meta
    - Added user category: user_id, user_meta
    - Supported field types: color_picker, date_picker, number, text
