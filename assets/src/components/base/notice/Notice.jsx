function Notice({ message, type, onDismiss }) {
  return (
    <div className={`tf-notice ${type} tf-is-dismissible`}>
      <p>{message}</p>
      <button type="button" className="tf-notice-dismiss" onClick={onDismiss}></button>
    </div>
  )
}

export default Notice
