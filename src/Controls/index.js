import uploadButton from './upload-button/index.vue'
import uploadFileButton from './upload-file-button/index.vue'
import attachmentList from './attachment-list/index.vue'
import workflow from './workflow/index.vue'
import workflowOperation from './workflow-operation/index.vue'
import adjustPrice from './adjust-price/index.vue'
import billInfo from './bill-info/index.vue'
import billItemStateIcon from './bill-item-state-icon/index.vue'
import billItemStates from './bill-item-states/index.vue'
import billState from './bill-state/index.vue'
import newItemStateIcon from './new-item-state-icon/index.vue'
import newItemStates from './new-item-states/index.vue'
import filelistGroup from './filelist-group/index.vue'
import billFilelistGroup from './bill-filelist-group/index.vue'
import uploadDrag from './upload-drag/index.vue'
import businessSource from './business-source/index.vue'
import orderBizFlowStatus from './order_biz_flow_status/index.vue'
import bizFlowStatus from './biz-flow-status/index.vue'
import sourceState from './source-state/index.vue'
import projectState from './project-state/index.vue'
import statePro from './bill-state-pro/index.vue'
import businessStatusPro from './business-status-pro/index.vue'


const COMs = [
  uploadButton,
  attachmentList,
  workflow,
  workflowOperation,
  adjustPrice,
  billInfo,
  billItemStateIcon,
  billItemStates,
  billState,
  newItemStateIcon,
  newItemStates,
  filelistGroup,
  billFilelistGroup,
  uploadFileButton,
  uploadDrag,
  businessSource,
  orderBizFlowStatus,
  bizFlowStatus,
  sourceState,
  projectState,
  statePro,
  businessStatusPro
]

export default {
  install(Vue) {
    COMs.forEach(com => {
      Vue.component(com.name, com)
    })
  }
}
