const evaluateCondition = condition => {

  const partResults = []  
  
  if (condition.length === 0) return true
  
  for (const lho in condition) {
  
    const parts = condition[lho]
    
    // Relations
    if (['_and', '_or'].includes(lho)) {
    
      const partResultsInner = parts.map(evaluateCondition)

      if( partResultsInner.length === 0 ) {
        partResults.push(false)
        continue;
      }
      
      switch (lho) {
        case '_or':
          partResults.push(partResultsInner.filter(Boolean).length > 0)
          break;
        case '_and':
          partResults.push(partResultsInner.length === partResultsInner.filter(Boolean).length)
          break;
      }
      continue;
    }

    // Comparison.
    Object.entries(parts).forEach(([op, rho]) => {
      switch (op) {
        case '_eq':
          partResults.push(lho == rho)
          break;
        case '_neq':
          partResults.push(lho != rho)
          break;
        case '_lt':
          partResults.push(lho < rho)
          break;
        case '_gt':
          partResults.push(lho > rho)
          break;
        case '_lte':
          partResults.push(lho <= rho)
          break;
        case '_gte':
          partResults.push(lho >= rho)
          break;
        case '_in':
          partResults.push(rho.includes(lho))
          break;
        case '_nin':
          partResults.push(!rho.includes(lho))
          break;
        case '_contains':
          partResults.push(lho.includes(rho))
          break;
        case '_ncontains':
          partResults.push(!lho.includes(rho))
          break;
        case '_re':
          partResults.push(new RegExp(rho).test(lho))
          break;
        default:
          partResults.push(false)
      }
    })
  }
 
  return partResults.length > 0 && partResults.length === partResults.filter(Boolean).length
}

export {
  evaluateCondition
}
