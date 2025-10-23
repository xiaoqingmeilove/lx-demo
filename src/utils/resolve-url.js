function resolveUrl(url, prefix) {
  prefix = prefix ? prefix : '/api'
  return `${prefix}/${url}`
}

export {
  resolveUrl
}