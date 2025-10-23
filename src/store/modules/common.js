import { ApiCommon } from '@/apis'
import XEUtils from 'xe-utils'

function handlePCAChildren(item) {
  if (item.children) {
    if (item.children.length === 0) {
      delete item.children
    } else {
      item.children = item.children.map(c => {
        c = handlePCAChildren(c)
        return c
      })
    }
  }
  return item
}

const STORE_MODULE = {
  namespaced: true,
  state: {
    table_column_config: {},
    dict: {},
    rtp: {},
    rtpMessage: '',
    pca: [],
    businessCode:'',
  },
  mutations: {
    
  },
  getters: {
    getDictByCode: state => (code) => {
      const dict = state.dict ?? {}
      return dict[code]
    },
    getDicts(state) {
      const dict = state.dict ?? {}
      return Object.entries(dict).reduce((obj, [key, list]) => {
        obj[key] = list.map(item => ({
          label: item.dictLabel,
          value: item.dictValue
        }))
        return obj
      })
    }
  },
  actions: {
    async getDicts({ commit, state, dispatch }, fn) {
      const res = await ApiCommon.getDictByCode(['PROCUREMENT','SYSTEM','WORKFLOW'])
      if (res.code === 200) {
        const data = res.data ?? {}
        state.dict =  data
        state.businessCode = data.businessCode ?   data.businessCode[0]?.dictValue :null;
      }
      return res.code === 200
    },
    async getPCAData({ commit, state, dispatch }) {
      const res = await ApiCommon.getPCAData()
      const data = res.data ?? []
      state.pca = data.map(item => {
        item = handlePCAChildren(item)
        return item
      })
    },
  }
}

export default STORE_MODULE
