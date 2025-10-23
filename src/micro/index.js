import {
  registerMicroApps,
  start,
  addGlobalUncaughtErrorHandler,
} from 'qiankun'
import createApps from './apps'
import { actions } from './globalState'

export function setupMicro({ store, router }) {
  const apps = createApps({ store, router })
  registerMicroApps(apps, {
    beforeLoad: [(app) => Promise.resolve()],
    beforeMount: [(app) => Promise.resolve()],
    afterMount: [(app) => Promise.resolve()],
    beforeUnmount: [(app) => Promise.resolve()],
    afterUnmount: [(app) => Promise.resolve()]
  })

  // 共享状态（按需）
  // const actions = initGlobalState({
  //   user: store?.state?.User?.userInfo || null,
  //   token: store?.state?.User?.token?.value || null
  // })
  actions.onGlobalStateChange(() => {}, true)

  addGlobalUncaughtErrorHandler((event) => {
    // 这里可以打点或提示
    console.error('MicroApp error:', event)
  })

  start({
    sandbox: { experimentalStyleIsolation: true, strictStyleIsolation: false },
    prefetch: false,
    singular: false
  })
}
