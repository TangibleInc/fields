const Title = (props) => {
  const Level = `h${ props.level ?? '3' }`;
  const content = props.content ?? props.children;

  return (
    <div className="tf-title">
      {React.createElement(Level, { className: props.className }, content)}
    </div>
  );
};

export default Title;