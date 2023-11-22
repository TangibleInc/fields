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
