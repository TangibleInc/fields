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
