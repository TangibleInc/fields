import '../../../../../assets/src/index.jsx'
import { 
  act, 
  render,
  within 
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import ReactDOM from 'react-dom/client';

const fields = window.tangibleFields

let container

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

describe('ComboBox component', () => {

    it('supports no results in async mode', async () => {

        act(() => {
            ReactDOM.createRoot(container).render( 
              fields.render({
                name   : 'field-name', 
                type   : 'combo-box', 
                label  : 'Label',
                isAsync  : true,
                searchUrl: '' 
              })
            )            
        })

        const comboBox = container.querySelector('.tf-combo-box-text')
        const inputs = container.querySelectorAll('input')
        console.log('comboBox : ', comboBox)
        console.log('inputs : ', inputs)

        const user = userEvent.setup()
        // await user.type(comboBox)

    })
})