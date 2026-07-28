const Title = ({ level, content, children, ...props }) => {

  const Level = `h${ level ?? '3' }`

  return (
    <div className="tf-title">
      <Level { ...props }>
        { content ?? children }
      </Level>
    </div>
  )
}

export default Title
