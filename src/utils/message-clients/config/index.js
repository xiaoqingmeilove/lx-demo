const WS_HOST = process.env.NODE_ENV === 'development' ? `192.168.3.118:8096` : `${location.hostname}:${location.port}`

export {
  WS_HOST
}