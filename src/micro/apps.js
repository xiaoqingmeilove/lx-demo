// 微应用注册配置
// 按需调整 entry 地址；开发时可用本地端口，生产可走环境变量
import { actions } from './globalState'
const VUE3_DEV = process.env.VUE3_MICRO_ENTRY || 'http://localhost:7100'
const REACT_DEV = process.env.REACT_MICRO_ENTRY || 'http://localhost:7200'

function getBaseUrl(withPort = true) {
  const { protocol, hostname, port } = window.location
  return withPort && port
    ? `${protocol}//${hostname}:${port}`
    : `${protocol}//${hostname}`
}

export default function createApps({ store, router }) {
  const commonProps = {
    store,
    routerBase: '/apps',
    getToken: () => store?.state?.User?.token?.value
  }

  const isHashMatch = (loc, base) => (loc.hash || '').startsWith(`#${base}`)

  return [
    {
      name: 'srm-finance',
      // entry: 'http://192.168.3.145:8099',
      // entry: 'http://localhost:3001',
      entry: `${getBaseUrl(false)}:8055`,
      container: '#react-micro-host',
      activeRule: (location) => {
        return isHashMatch(location, '/finance')
      },
      props: {
        framework: 'react',
        routerBase: '/finance',
        store,
        actions,
        getToken: () => store?.state?.User?.token?.value
      }
    }
  ]
}
