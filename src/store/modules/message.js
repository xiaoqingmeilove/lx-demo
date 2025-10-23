const STORE_MODULE = {
    namespaced: true,
    state: {
      unread:0,
      calid:0,
    },
    mutations: {
      updateUnread(state, data) {
        state.unread = data
      },
      updateCalId(state, data) {
        state.calid = data
      }
    }
  }
  
  export default STORE_MODULE