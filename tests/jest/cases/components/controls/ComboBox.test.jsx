import '../../../../../assets/src/index.jsx'
import { 
  render,
  waitFor
} from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'

const fields = window.tangibleFields

describe('ComboBox component', () => {

  it('supports no results in async mode', async () => {

    const url = document.location.origin + '/wp-json/wp/v2/search'
    const { container } = render(
      fields.render({
        name      : 'field-name',
        type      : 'combo-box',
        label     : 'Label',
        isAsync   : true,
        searchUrl : url
      })
    )

    const input = container.querySelector('.tf-button-action > span')
    const comboBoxText = await waitFor(() => container.querySelector('.tf-combo-box-text > input') )

    const user = userEvent.setup()
    await user.click(input)
    await user.type(comboBoxText, 'my custom value')
  }, 10000)
})
