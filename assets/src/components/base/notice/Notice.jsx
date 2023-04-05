import {useState} from 'react'

function Notice({ message, type }) {
  const [isDismissed, setIsDismissed] = useState(false)

  return (
    !isDismissed && (
        <div className={`notice ${type} is-dismissible`}>
            <p>{message}</p>
            {
                <button type="button" className="notice-dismiss" onClick={() => setIsDismissed(true)}></button>
            }
        </div>
    )
  )
}

export default Notice