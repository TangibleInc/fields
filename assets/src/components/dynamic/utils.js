const isDynamicValue = string => {
  const matches = string.match(/^\[\[([A-Za-zÀ-ú0-9_\- ]+(?!\[)[^\[\]]*)\]\]$/)
  return matches ? matches[1] : false
}

export { isDynamicValue }
