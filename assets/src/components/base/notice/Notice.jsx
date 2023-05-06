function Notice({ message, type, onDismiss }) {
  return (
    <div className={`notice ${type} is-dismissible`}>
      <p>{message}</p>
      <button type="button" className="notice-dismiss" onClick={onDismiss}></button>
    </div>
  )
}

export default Notice
