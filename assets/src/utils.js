const uniqid = () => {
  const sec = Date.now() * 1000 + Math.random() * 1000
  return sec.toString(16).replace(/\./g, '').padEnd(14, '0')
}

export { uniqid }
