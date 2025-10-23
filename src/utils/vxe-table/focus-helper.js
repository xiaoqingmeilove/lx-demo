// const getNextElement = (table, rowIndex, columnIndex, code) => {
//   let el = table.querySelector(`[data-row="${rowIndex}"][data-column="${columnIndex}"]`)
//   if (el) {
//     if (el.tagName !== 'INPUT') {
//       el = el.querySelector('input')
//       if (el.getAttribute('disabled') === 'disabled') {
//         const idx = getNextIndex(code, rowIndex, columnIndex)
//         return getNextElement(table, idx[0], idx[1], code)
//       }
//     }
//   }
//   return el
// }

const CODE_MAP = {
  ArrowDown: 'ArrowDown',
  ArrowUp: 'ArrowUp'
}

const getElement = (container, rowIndex, columnIndex) => {
  const el = container.querySelector(`[data-row="${rowIndex}"][data-column="${columnIndex}"]`)
  if (el) {
    if (el.tagName === 'INPUT') return el
    return el.querySelector('input')
  }
  return null
}

const setNextIndex = (code, rowIndex, columnIndex) => {
  let idx = []
  if (code === CODE_MAP.ArrowDown) {
    idx = [rowIndex + 1, columnIndex]
  } else if (code === CODE_MAP.ArrowUp) {
    idx = [rowIndex - 1, columnIndex]
  }
  return idx
}

const getNextIndex = (container, code, rowIndex, columnIndex) => {
  const idx = setNextIndex(code, rowIndex, columnIndex)
  let el = container.querySelector(`[data-row="${idx[0]}"][data-column="${idx[1]}"]`)
  if (el) {
    //TODO
    if (el.tagName !== 'INPUT') {
      el = el.querySelector('input')
    }
    if (el.getAttribute('disabled') === 'disabled') {
      return getNextIndex(container, code, idx[0], idx[1])
    }
    return idx
  }
  return null
}

const isEnd = (code, rowIndex, columnIndex, max_row) => {
  if (code === CODE_MAP.ArrowDown) {
    return rowIndex > max_row - 1
  } else if (code === CODE_MAP.ArrowUp) {
    return rowIndex < 0
  }
  return false
}

const getNext = (container, code, rowIndex, columnIndex, max_row, max_column) => {
  const idx = setNextIndex(code, rowIndex, columnIndex)
  if (isEnd(code, idx[0], idx[1], max_row)) {
    return null
  }
  const el = getElement(container, idx[0], idx[1])
  if (el) {
    if (el.getAttribute('disabled') === 'disabled') {
      return getNext(container, code, idx[0], idx[1], max_row, max_column)
    }
    return {
      el,
      idx
    }
  }
  return getNext(container, code, idx[0], idx[1], max_row, max_column)
}

let focusing = false
export const handleNextFocus = (container, code, rowIndex, columnIndex, max_row) => {
  code = ['NumpadEnter', 'Enter'].includes(code) ? 'ArrowDown' : code
  if (!['ArrowUp', 'ArrowDown'].includes(code)) return
  if (focusing) return
  focusing = true
  const next = getNext(container, code, rowIndex, columnIndex, max_row)
  if (next) {
    const { el, idx } = next
    if (el) {
      el.focus()
      setTimeout(() => {
        const _el = getElement(container, idx[0], idx[1])
        if (!_el) {
          focusing = false
          return
        }
        _el.focus()
        setTimeout(() => {
          _el.select()
          focusing = false
        }, 0)
      }, 30)
    }
  } else {
    focusing = false
  }
}
