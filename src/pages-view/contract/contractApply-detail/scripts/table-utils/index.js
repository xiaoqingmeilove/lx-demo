const rowDown = (arr, i, frozen) => {
  let idx = i + 1
  if (i === arr.length - 1) {
    frozen.push(i)
    return i
  } else if (frozen.includes(idx)) {
    frozen.push(i)
    return i
  } 
  
  let data = arr[idx]
  arr.splice(idx, 1)
  arr.splice(i, 0, data)
  return idx
}

const rowUp = (arr, i, frozen) => {
  let idx = i - 1
  if (i === 0) {
    frozen.push(i)
    return i
  } else if (frozen.includes(idx)) {
    frozen.push(i)
    return i
  } 
    
  let data = arr[idx]
  arr.splice(idx, 1)
  arr.splice(i, 0, data)
  return idx
}

export {
  rowDown,
  rowUp
}
