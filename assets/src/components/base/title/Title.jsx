const Title = (props) => {

  const Level = `h${ props.level ?? '3' }`
  const content = props.content ?? props.children
  
  return (
    <div className="tf-title">
      <Level className={ props.className }>
        { content }
      </Level>
    </div>
  )
}

export default Title
