import appPage from './app-page/index.vue'
import pageButton from './page-button/index.vue'
import searchComponent from './search-component/index.vue'
import pageHeader from './page-header/index.vue'
import dataInfoBox from './data-info-box/index.vue'
import subTitle from './sub-title/index.vue'
import fileButton from './file-button/index.vue'
import popupForm from './popup-form/index.vue'
import popupTable from './popup-table/index.vue'
import tableSection from './table-section/index.vue'
import dataForm from './data-form/index.vue'
import descriptionsForm from './descriptions-form/index.vue'
import pcaCascader from './pca-cascader/index.vue'
import pca from './pca/index.vue'
import pageDrawer from './page-drawer/index.vue'
import combineOperation from './combine-operation/index.vue'
import pageIcon from './page-icon/index.vue'
import tableColumnSetting from './table-column-setting/index.vue'
import tableTools from './table-tools/index.vue'
import modalTitle from './modal-title/index.vue'
import filterDataButton from "./filter-data-button/index.vue"

import tableIcon from './table-Icon/index.vue'
import uploadComponent from './upload-component/index.vue'
import leadingComponent from './leading-component/index.vue'
import modal from "./modal/index.vue"
import detailForm from "./detail-form/index.vue"
import selectAddress from "./select-address/index.vue"
import billIcons from "./bill-icons/index.vue"
import autoRefresh from "./autoRefresh/index.vue"
import pcaCascaderHome from "./pca-cascader-home/index.vue"
import billBtns from "./bill-btns/index.vue"
import btnStateInfo from "./btn-state-info/index.vue"
import importModal from "./import-modal/index.vue"
import fileButtonDrag from "./file-button-drag/index.vue"

const COMs = [
  pca,
  appPage,
  pageButton,
  searchComponent,
  pageHeader,
  dataInfoBox,
  subTitle,
  fileButton,
  popupForm,
  popupTable,
  tableSection,
  dataForm,
  descriptionsForm,
  pcaCascader,
  pageDrawer,
  combineOperation,
  pageIcon,
  tableColumnSetting,
  modalTitle,
  tableTools,
  tableIcon,
  uploadComponent,
  leadingComponent,
  modal,
  detailForm,
  selectAddress,
  filterDataButton,
  billIcons,
  autoRefresh,
  pcaCascaderHome,
  billBtns,
  btnStateInfo,
  importModal,
  fileButtonDrag,
]

export default {
  install(Vue) {
    COMs.forEach(com => {
      Vue.component(com.name, com)
    })
  }
}