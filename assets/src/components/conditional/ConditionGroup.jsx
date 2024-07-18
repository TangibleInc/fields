import Repeater from '../repeater/Repeater'
import { Button } from '../base'
import { getInitialOperator } from './condition-fields'

const ConditionGroup = props => {

  const afterRow = (item, i, dispatch) => (
    <div className="tf-conditional-panel-condition-actions">
      <Button type="action" onPress={ () => dispatch({
        type: 'insert',
        position: i + 1,
        data: { operator: getInitialOperator(props.fields) }
      }) }>
        And
      </Button>
      <Button
        type="danger"
        onPress={ () => dispatch({ type: 'remove', item: i }) }
        isDisabled={ ! props.canDelete }
        contentVisuallyHidden
      >
        Delete condition
      </Button>
    </div>
  )

  return(
    <div className="tf-conditional-panel-conditions">
      <Repeater
        { ...props }
        type={ 'repeater' }
        layout={ 'bare' }
        afterRow={ afterRow }
        repeatable={ false }
      />
    </div>
  )
}

export default ConditionGroup
