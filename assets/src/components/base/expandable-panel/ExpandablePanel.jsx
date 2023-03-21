import { useState, useEffect } from 'react'
import { Checkbox, Switch } from '../../field'

const ExpandablePanel = props => {

    const [showItem, setShowItem] = useState(true)

    useEffect(() => {
        if( typeof(props.showItem) !== 'number' ) {
            setShowItem(props.showItem)
        } else {
            setShowItem(true)
        } 
    }, [props.showItem])

    return ( 

        <div>
            <div class='tf-accordion-header' >
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
                    <div class='tf-accordion-group-buttons' >
                        <span class={showItem ? 'tf-accordion-arrow tf-accordion-arrow-up' : 'tf-accordion-arrow tf-accordion-arrow-down'} />
                    </div>
                </div>
            </div>
            { props.children }
        </div>

    )
}

export default ExpandablePanel