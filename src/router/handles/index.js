import store from '@/store'
import { ApiBasic } from "@/apis";
const apiBasic = new ApiBasic();

const removeTooltip = () => {
  const tooltips = document.querySelectorAll('body > .vxe-table--tooltip-wrapper')
  for (const t of tooltips) {
    try {
      t.parentNode.removeChild(t)
    } catch (err) { console.error(err) }
  }
}

const beforeEach = router => {
  router.beforeEach(async(to, from, next) => {
    if(to.name === 'supplier_supplierRegister'){
      const userInfo = store.state.User.userInfo||{};
      const {userType, roleKeys} = userInfo;
      if(userType === "03"){
        const res = await apiBasic.getSupplierList();
        if(res.code === 200 && res.data && res.data.records && res.data.records.length){
          const {id, authStatus} = res.data.records[0];
          if(id) router.push({ path: `/supplier/supplierRegister-detail/detail/${id}` });
        }
        return
      }
    }
    removeTooltip()
    next()
  })
}


const afterEach = router => {
  let timeout = null

  router.afterEach(async(to, from) => {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      removeTooltip()
      timeout = null
    }, 1200)

    //store.commit('User/updateCommonList', to)
  })
}

export {
  beforeEach,
  afterEach
}
