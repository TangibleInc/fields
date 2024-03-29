const Title = (props) => {
  const Level = `h${props.level}`

  return (
    <div className="tf-title">
      <Level className={props.className}>{ props.children }</Level>
    </div>
  )
}

export default Title
