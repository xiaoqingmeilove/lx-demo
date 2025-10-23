import store from '@/store'
import { WS_HOST } from '../config'
import showNotice from '@/utils/message-notice'

class MsgClient {
  socket = null
  #url = ''
  #protocol = ''
  #closed = false
  #reconnectCount = 0
  #instance = null
  constructor(instance, token) {
    const protocol = location.protocol === 'https:' ? 'wss' : 'ws'
    this.#url = `${protocol}://${WS_HOST}/api/message-center/ws/useMsg`
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
    console.log('useMsg连接成功')
    this.#reconnectCount = 0
  }
  #onclose(e) {
    console.log('useMsg onclose')
    this.socket = null
    if (!this.#closed) {
      this.#reconnect()
    }
  }
  #onmessage({ data }) {
    const msg = JSON.parse(data)
    const { applicationName, content, funcEvent, createTime } = msg
    const contentObj = JSON.parse(msg?.content) ?? {}
    if (applicationName  && !(localStorage.getItem("rnable_reminder") === "false")) {
      showNotice(this.#instance, {
        name: applicationName,
        func: funcEvent,
        date: createTime ||'',
        detail: contentObj.url || ''
      })
    }
  }

  #reconnect() {
    this.#reconnectCount++
    console.log(`reconnect useMsg [${this.#reconnectCount}]`)
    setTimeout(() => {
      this.init()
    }, 1000)
  }
}

export default MsgClient
