import { useState, useEffect } from 'react'
import { Checkbox, Switch } from '../../field'

const ExpandablePanel = props => {

    const [showItem, setShowItem] = useState(true)

    useEffect(() => {
        setShowItem( props.showItem ) 
    }, [props.showItem])

    return ( 

        <div>
            <div class='tf-repeater-block-item-header' >
                {
                    props.accordion_checkbox && <Checkbox value={ props.accordion_checkbox } />
                }
                {
                    props.accordion_switch && <Switch value={ props.accordion_switch } />
                }
                <div class='tf-repeater-header-clickable' onClick={ () => props.toggleShow() } >
                    <div class="tf-repeater-block-item-header">
                        <strong>{ props.title }</strong>
                    </div>
                    <div class='tf-repeater-group-buttons' >
                        <span class={showItem ? 'tf-repeater-arrow tf-repeater-arrow-up' : 'tf-repeater-arrow tf-repeater-arrow-down'} />
                    </div>
                </div>
            </div>
            { props.children }
        </div>

    )
}

export default ExpandablePanel