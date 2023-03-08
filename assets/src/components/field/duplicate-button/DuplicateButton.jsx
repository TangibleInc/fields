import { Button } from '../../base'
import { uniqid } from '../../../utils'

export default props => {

    function copy_paste() {

        console.log(TangibleFields.fields)
        let value = TangibleFields.fields['tangible_field_example_settings[setting_repeater_repeatable_list_name]']

        value.element = TangibleFields.fields[props.related].element + '1'

        console.log(value)

        tangibleFields.render(value)
    }
    
    return (
        <div>
            <Button type="action" onPress={ copy_paste }>
                Duplicate
            </Button>
        </div>
    )
}
