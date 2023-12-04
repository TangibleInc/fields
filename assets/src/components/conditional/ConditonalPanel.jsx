import { 
  useState, 
  useEffect 
} from 'react'

import { 
  uniqid, 
  initJSON 
} from '../../utils'

import { Button } from '../base/'
import ConditionGroup from './ConditionGroup'

const Panel = props => {
  
  const emptyRow = () => ({ 
    key: uniqid(), 
    data: [{ key: uniqid() }] 
  })

  const [value, setValue] = useState(
    initJSON(props.value ?? '', [ emptyRow() ])
  )

  /**
   * Auto remove groups when no group when empty, unless it's the last one
   */
  useEffect(() => {
    if( value.length === 1 ) return;
    const groups = value.filter(group => group.data.length !== 0)
    if( groups.length !== value.length ) setValue([ ...groups ])
  }, [value])

  const insertGroup = position => setValue([
    ...value.slice(0, position),
    emptyRow(),
    ...value.slice(position)
  ])

  const updateGroup = (groupValue, i) => {
    const updatedValue = value
    updatedValue[i].data = groupValue
    setValue([ ...updatedValue ])
  }

  return(
    <div className="tf-conditional-panel">
      <input type="hidden" name={ props.name ?? '' } value={ JSON.stringify(value) } />
      <div className="tf-conditional-panel-container">
        <div className="tf-conditional-groups">
          { value.map((group, i) => (
            <div key={ group.key } className="tf-conditional-group">
              <ConditionGroup 
                value={ group.data } 
                onChange={ value => updateGroup(value, i) } 
              />
              <div className="tf-conditional-group-actions">
                <strong>Or</strong>
                <Button type="primary" onPress={ () => insertGroup(i + 1) }>
                  Add group
                </Button>
              </div>
            </div>
          )) }
        </div>
      </div>
    </div>
  )
}

export default Panel
