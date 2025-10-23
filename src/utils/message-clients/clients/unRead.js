import store from '@/store'
import { WS_HOST } from '../config'

class UnreadClient {
  socket = null
  #url = ''
  #protocol = ''
  #closed = false
  #reconnectCount = 0
  #instance = null
  constructor(instance, token) {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    this.#url = `${protocol}://${WS_HOST}/api/message-center/ws/unRead`
    this.#protocol = token
    this.#instance = instance
  }

  init() {
    if (this.socket) return
    this.socket = new WebSocket(this.#url, [this.#protocol])

    this.socket.onopen = this.#onopen.bind(this)
    this.socket.onclose = this.#onclose.bind(this)
    this.socket.onmessage = this.#onmessage.bind(this)
  }
  close() {
    this.#closed = true
    if (!this.socket) return    
    this.socket.close()
  }

  #onopen(e) {
    console.log('UnreadClient 连接成功')
    this.#reconnectCount = 0
  }
  #onclose(e) {
    console.log('UnreadClient onclose')
    this.socket = null
    if (!this.#closed) {
      this.#reconnect()
    }
  }
  #onmessage({ data }) {
    store.commit('Message/updateUnread', Number(data || 0))
  }

  #reconnect() {
    this.#reconnectCount++
    console.log(`reconnect unRead [${this.#reconnectCount}]`)
    setTimeout(() => {
      this.init()
    }, 1000)
  }
}

export default UnreadClient
