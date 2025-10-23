<template>
  <div class="workflow-view"
    v-loading="loading"
    element-loading-text="正在加载工作流"
    element-loading-spinner="el-icon-loading"
  >
    <div class="workflow-view-body">
      <el-tabs class="workflow-tabs" v-model="activeTab" flex @tab-click="onTabClick">
        <template #buttons>
          <i v-if="closeBtn" class="vxe-icon-close workflow-close-icon" @click="onCloseClick"></i>
        </template>
        <el-tab-pane name="comment">
          <el-badge slot="label" :value="commentCount" :hidden="!commentCount">
            <span class="workflow-tabs-item-title">交流评论</span>
          </el-badge>
          <Comments v-if="workflowData"
            :bill-id="billId"
            :bill-no="billNo"
            @change="onCommentsChange"
            ref="commentRef"
          ></Comments>
        </el-tab-pane>
        <el-tab-pane name="task">
          <span slot="label" class="workflow-tabs-item-title">任务审批</span>
          <div class="workflow-steps-view" v-if="!loading">
            <template v-if="!workflowData">
              <div class="workflow-steps-view-body">
                <el-empty description="未开启工作审批"></el-empty>
                <page-button v-if="!billState" theme="danger" class="submit-workflow-btn" @click="startWorkflowBtnClick">提交审批</page-button>
              </div>
              <div class="workflow-steps-view-footer">
                <page-button @click="close">关闭</page-button>
              </div>
            </template>
            <template v-else>
              <div class="workflow-steps-view-body">
                <div class="workflow-state-wrapper">
                  <div class="workflow-state-item" :class="bindWorkflowStateClass">
                    <div class="workflow-state-item-icon">
                      <!-- <i class="el-icon-document"></i> -->
                      <!-- <page-icon name="todo" color="#fff" size="40"></page-icon> -->
                      <svg-icon :icon-class="bindStateIcon" fill="#fff" size="40"></svg-icon>
                    </div>
                    <div class="workflow-state-item-content">
                      <label>审批状态</label>
                      <span>{{bindWorkflowState}}</span>
                    </div>
                  </div>
                  <div class="workflow-state-item workflow-total-duration">
                    <div class="workflow-state-item-icon">
                      <!-- <i class="el-icon-time"></i> -->
                      <svg-icon icon-class="clock2" fill="#fff" size="40"></svg-icon>
                    </div>
                    <div class="workflow-state-item-content">
                      <label>总耗时</label>
                      <span>{{totalTime}}</span>
                    </div>
                  </div>
                </div>
                <div class="workflow-steps" :class="stepsClass">
                  <el-steps direction="vertical" :active="steps.length - 1" class="workflow-steps-list">
                    <el-step v-for="(item, index) in steps" :key="index" :status="isEnd ? 'success' : ''">
                      <template #title>
                        <span class="step-title">{{item.nodeName}}</span>
                        <!-- <el-tooltip effect="dark" :content="item.operResultName" placement="top">
                          <span class="step-handle-duration" :style="durationStyle(item)">{{item.timeDifference}}</span>
                        </el-tooltip> -->
                        <div class="step-handle-duration" :style="durationStyle(item)"
                          v-if="item.operResultName && index > 0">
                          <!-- <i v-if="itemIcon(item)" :class="itemIcon(item)"></i> -->
                          <template v-if="itemIcon(item)">
                            <svg-icon :icon-class="itemIcon(item)" :fill="durationStyle(item).color" :size="16"></svg-icon>
                          </template>
                          <span>{{item.operResultName}}</span>
                          <small v-if="item.timeDifference">
                            <svg-icon icon-class="hourglass" size="10"></svg-icon>
                            {{item.timeDifference}}
                          </small>
                        </div>
                      </template>
                      <template #description>
                        <div class="description-row" v-if="item.createUser">
                          <div class="description-row-icon">
                            <el-tooltip effect="dark" content="制单人" placement="left">
                              <i class="vxe-icon-file-txt"></i>
                            </el-tooltip>
                          </div>
                          <div class="description-row-main">
                            <div class="step-desc-text step-desc-user">{{item.createUser}}</div>
                            <div class="step-desc-time">{{item.operDate}}</div>
                          </div>
                        </div>

                        <div class="description-row" v-if="item.users">
                          <div class="description-row-icon">
                            <el-tooltip effect="dark" content="审核人" placement="left">
                              <i class="vxe-icon-user"></i>
                            </el-tooltip>
                          </div>
                          <div class="description-row-main">
                            <div class="step-desc-text step-desc-user" v-for="(u, uIndex) in item.users || []" :key="uIndex">{{showName(u)}}</div>
                            <div class="step-desc-time">{{item.operDate}}</div>
                          </div>
                        </div>

                        <div class="description-row" v-if="item.readships && item.readships.length > 0">
                          <div class="description-row-icon">
                            <el-tooltip effect="dark" content="传阅人" placement="left">
                              <i class="vxe-icon-eye-fill"></i>
                            </el-tooltip>
                          </div>
                          <div class="description-row-main">
                            <div class="step-desc-text" v-for="(u, uIndex) in item.readships || []" :key="uIndex">
                              <span>{{showName(u)}}</span>
                              <template v-if="u.readFlag === 1">
                                <i class="read--state read--state-isread vxe-icon-envelope-open" title="已读"></i>
                              </template>
                              <template v-else>
                                <i class="read--state read--state-unread vxe-icon-envelope" title="未读"></i>
                              </template>
                            </div>
                          </div>
                        </div>

                        <div class="description-row" v-if="item.opinion">
                          <div class="description-row-icon">
                            <el-tooltip effect="dark" content="备注" placement="left">
                              <i class="vxe-icon-edit"></i>
                            </el-tooltip>
                          </div>
                          <div class="description-row-main">
                            <div class="step-desc-text step-desc-text-remark" @click="onRemarkClick(item.opinion)">{{item.opinion}}</div>
                          </div>
                        </div>

                      </template>
                    </el-step>
                  </el-steps>
                </div>
              </div>

              <div class="workflow-steps-view-footer">
                <template v-if="isEnd">
                  <page-button @click="close">关闭</page-button>
                </template>
                <template v-else>
                  <template v-if="!billState">
                    <template >
                      <page-button @click="onRestartClick">提交审批</page-button>
                    </template>
                  </template>
                  <template v-else>
                    <template v-if="hasAuth && !readOnly">
                      <!-- <page-button @click="onActionBtnClick('pass')">通过</page-button>
                      <page-button @click="onActionBtnClick('reject')">驳回</page-button>
                      <page-button @click="onActionBtnClick('delegate')">委托</page-button> -->
                      <page-button v-for="item in bindBtns" :key="item.code"
                        @click="onActionBtnClick(item.code)"
                      >{{item.text}}</page-button>
                    </template>
                  </template>
                  <page-button @click="close">关闭</page-button>
                </template>


                <!-- <template v-else-if="lastStep.isApplicat == '1'">
                  <page-button @click="onRestartClick">提交审批</page-button>
                </template>
                <template v-else>
                  <template v-if="hasAuth && !readOnly">
                    <page-button @click="onActionBtnClick('pass')">通过</page-button>
                    <page-button @click="onActionBtnClick('reject')">驳回</page-button>
                    <page-button @click="onActionBtnClick('delegate')">委托</page-button>
                  </template>
                  <template v-else>
                    <page-button @click="close">关闭</page-button>
                  </template>
                </template> -->
              </div>
            </template>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <vxe-modal v-model="modalVisible"
      class="approval-modal"
      :title="modalTitle"
      width="610"
      :position="{ top: '12vh' }"
      :mask="true"
      destroy-on-close
      @hide=""
    >
      <approval-modal
        :operation="oper"
        :bill-id="billId"
        :bill-no="billNo"
        :nodeParam="nodeParam"
        :rejectNodes="rejectNodes"
        :auditors="auditors"
        :circulations="circulations"
        :rejects="rejects"
        :delegations="delegations"
        :controlRejectionFlag="controlRejectionFlag"
        @close="modalVisible = false;"
        @ok="onModalOk"
      ></approval-modal>
    </vxe-modal>

    <vxe-modal
      v-model="visible"
      width="410"
      show-footer
      destroy-on-close
      @close="modalHeadrenText=='提示'?confirmClick():closeDelModal()"
    >
      <template #title>
        <img :src="require(`/static/images/icon-warn-fill@2x.png`)" alt="img">
        <span class="modal-title">{{ modalHeadrenText }}</span>
      </template>
      <div style="font-size: 14px;color:#595959;">
        <template v-if="modalHeadrenText=='提示'">
          <span>{{ remindTitle }}</span>
        </template>
        <template v-else>
          <div style="color: #FF4D4F;font-weight: 700;margin-bottom: 10px">{{remindTitle}}</div>
          <div style="line-height: 24px;">单据类型：{{billType}}</div>
          <div style="line-height: 24px;">单据编号：{{billNo}}</div>
        </template>
      </div>
      <template #footer>
        <page-button v-if="modalHeadrenText=='提示'" background="#FF4D4F" @click="confirmClick">确认</page-button>
        <page-button v-else background="#FF4D4F" @click="closeDelModal">关闭</page-button>
      </template>
    </vxe-modal>

    <popup-form v-model="selectUserForm.visible"
      title="选择审批用户"
      :span="12"
      width="410"
      :form-data="selectUserForm.data"
      :data-gather="selectUserForm.dataGather"
      :data-list="bindSelectUserDataList"
      :rules="selectUserForm.rules"
      :title-width="90"
      auto-scroll
      okText="确定"
      cancelText="取消"
      btn-align="right"
      @ok="selectUserForm.ok"
      @hide="selectUserForm.data = {};"
    >
    </popup-form>

  </div>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import VXETable from 'vxe-table'
  import ApiWorkflow from './scripts/apis'
  import approvalModal from './scripts/modal'
  import Comments from './scripts/comments/index.vue'

  import { fakeData, auditors, circulations, rejectNodes, delegations } from './scripts/data'

  const OPER_RESULT = {
    40: '同意',
    41: '不同意',
    3: '驳回',
    5: '终止',
    50: '撤回'
  }
  const OPER_ACTION = {
    pass: 1,
    reject: 2,
    delegate: 3,
    nopass:4,
  }
  const OPER_ACTION_TITLE_TEXT = {
    1: '审批通过',
    2: '审批驳回',
    3: '委托',
    4:"审批不通过"
  }

  const RESULT_CONFIG = {
    3: { text: '驳回', color: '#ffa940', icon: 'warning-fill' },
    5: { text: '终止', color: '#d2d2d2', icon: 'disable-fill' },
    21: { text: '委托', color: '#5771f5', icon: 'delegation' },
    40: { text: '已同意', color: '#52c41a', icon: 'success-fill' },
    41: { text: '不同意', color: '#b53730', icon: 'error-fill' },
    50: { text: '撤回', color: '#ff4d4f', icon: 'redo-fill' },
  }

  const BILL_STATE = {
    0: '计划中',
    1: '审核中',
    2: '已审核',
    3: '已作废',
    4: '转议价',
    5: '已失效',
    6: '转线下',
    7: '已成交'
  }

  const apiWorkflow = new ApiWorkflow()

  export default {
    name: 'workflow',
    props: {
      closeBtn: {
        type: Boolean,
        default: true
      },
      // defaultKey: {
      //   type: String,
      //   default: ''
      // },
      code: {
        type: String,
        default: ''
      },
      billId: {
        type: Number,
        default: null
      },
      billNo: {
        type: String,
        default: ''
      },
      billState: {
        type: Number,
        default: null
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      beforeSubmit: {
        type: Function,
        default: null
      },
      beforeBtnClick: {
        type: Function,
        default: null
      },
      showBtns: {
        type: Array,
        default: () => ["pass","reject","delegate"]
      },
      confirmMessage: {
        type: String,
        default: null
      }
    },
    components: {
      approvalModal,
      Comments,
    },
    computed: {
      ...mapState({
        userInfo: state => state.User.userInfo ?? {},
        businessCode: (state) => state.Common.businessCode,
      }),
      ...mapGetters('Common', {
        getDicts: 'getDicts'
      }),
      DICTS() {
        return {
          ...this.getDicts
        }
      },
      modalTitle() {
        return OPER_ACTION_TITLE_TEXT[this.oper]
      },
      lastStep() {
        if (this.steps.length > 0) {
          const last = this.steps[this.steps.length - 1]
          return last
        }
        return {}
      },
      isEnd() {
        return String(this.lastStep.isEnd) === '1'
      },
      hasAuth() {
        const users = this.lastStep.users ?? []
        return users.some(x => x.userName === this.userInfo.userName)
      },
      durationStyle() {
        return item => {
          const style = {}
          style.color = RESULT_CONFIG[item.operResult]?.color
          return style
        }
      },
      itemIcon() {
        return item => {
          return RESULT_CONFIG[item.operResult]?.icon
        }
      },
      currentNode() {
        if (this.steps && this.steps.length > 0) {
          return this.steps[this.steps.length - 1]
        }
        return null
      },
      bindBillState() {
        return BILL_STATE[this.billState] ?? ''
      },
      bindWorkflowState() {
        if (this.steps.length === 0) return ''
        const lastNode = this.steps[this.steps.length - 1]
        return lastNode.isEnd === '1' ? '审核完成'
              : lastNode.isApplicat === '1' ? '计划中'
              : '审核中'
      },
      bindBtns() {
        const showBtns = this.showBtns ?? []
        if (showBtns.length > 0) {
          return this.operationBtns.filter(item => showBtns.includes(item.code))
        }
        // return this.operationBtns
        return []
      },
      bindStateIcon() {
        const { operStatus } = this.lastStep
        return operStatus === 21 ? 'doc-complete' : 'doc-inprogress'
      },
      bindWorkflowStateClass() {
        const { operStatus } = this.lastStep
        return operStatus === 21 ? 'workflow-state--complete' : 'workflow-state--inprogress'
      },
      bindSelectUserDataList() {
        return {
          users: this.selectUserList
        }
      },
      stepsClass() {
        return {
          'workflow-steps--reverse': this.sort === 'reverse'
        }
      }
    },
    data() {
      return {
        controlRejectionFlag:null,//驳回是否必填驳回原因
        defaultKey: '',
        loading: false,
        activeTab: 'task',
        steps: [],
        totalTime: '',

        workflowData: null,
        oper: OPER_ACTION.pass,
        modalVisible: false,

        nodeParam: null,
        auditors: [],       //审核人列表
        circulations: [],   //传阅人列表
        rejects: [],        //驳回人列表
        delegations: [],    //委托人列表
        rejectNodes: [],    //驳回节点列表,

        operationBtns: [
          { text: '通过', code: 'pass' },
          { text: '不通过', code: 'nopass' },
          { text: '驳回', code: 'reject' },
          { text: '委托', code: 'delegate' },
        ],

        selectUserForm: {
          visible: false,
          data: {},
          dataGather: [
            {
              span: 24,
              config: [
                { label: '审批用户', field: 'user', type: 'selectinput', source: 'users' },
              ]
            },
          ],
          rules: {
            user: [
              { required: true, message: '请选择用户' }
            ]
          },
          ok: (data) => {
            const { user } = data
            this.selectUserForm.visible = false
            this.selectedUser = user
            this.handleSubmitWorkflow()
          }
        },

        selectUserList: [],
        selectedUser: null,

        visible: false,
        billType: '',
        remindTitle: '',
        modalHeadrenText: '提示',

        sort: 'asc',

        commentCount: 0,
        commentOpened: false
      }
    },
    created() {
      this.getConfig(() => {
        this.$emit('init')
        this.getWorkflow()
        this.initSelectUsers()
      })
      this.setSort()
    },
    mounted() {
      setTimeout(() => {
        //this.activeTab = 'task'
      }, 1000)
    },
    destroyed() {
      console.log('destroyed')
    },
    methods: {
      showName(item){
        const WORKFLOW_COMPONENT = this.DICTS?.WORKFLOW_COMPONENT ?? []
        let find = WORKFLOW_COMPONENT.find(item => item.label === 'showname')
        if (find) {
          return item[find.value]
        }
        return item.nickName
      },
      async getConfig(callback) {
        const res = await apiWorkflow.getConfig(this.code)
        const cfgs = res.data ?? []
        this.defaultKey = cfgs[0]?.workflow_key
        // 工作流驳回是否必填驳回原因
        let controlFind = cfgs.find(item => item.type === 1)
        this.controlRejectionFlag = controlFind ? controlFind.control_rejection_flag : 0;

        typeof callback === 'function' && callback()
      },
      async getWorkflow() {
        this.loading = true
        let resData = null
        try {
          const res = await apiWorkflow.getWorkflowByBillNo(this.billNo)
          resData = res.data
          this.steps = resData?.wfLinks ?? []
          this.totalTime = resData?.totalTime
          this.nodeParam = resData?.nodeParam
        } catch (err) {
          console.log('err', err)
        }
        this.workflowData = resData

        this.getNodesList()

        setTimeout(() => {
          this.loading = false
          this.$emit('load', {
           data: resData,
           submitState: this.getSubmitState()
          })
        }, 300)
        // setTimeout(() => {
        //   this.loading = false
        //   this.workflowData = {...fakeData}
        //   this.steps = fakeData.wfLinks ?? []
        //   this.$emit('load', {
        //     data: resData
        //   })
        // }, 300)
      },

      initSelectUsers() {
        const { code, billState } = this
        const configs = this.DICTS?.WORKFLOW_COMPONENT_CONFIG ?? []
        const find = configs.some(item => item.value === code)
        if (!find) return
        if (!!billState) return
        apiWorkflow.getRoleUsers(code).then(res => {
          this.selectUserList = (res.data ?? []).map(item => ({
            label: item.nickName +' '+ item.userName +' '+ item?.remark??'',
            value: item.userName
          }))
        })
      },

      getSubmitState() {
        if (!this.workflowData && !this.billState) {
          return 'start'
        }
        if (!this.isEnd && !this.billState && !!this.readOnly) {
          return 'restart'
        }
        return null
      },
      externalBtnClick(type) {
        if (type === 'start') {
          this.startWorkflowBtnClick()
        } else if (type === 'restart') {
          this.onRestartClick()
        }
      },

      close() {
        this.modalVisible = false
        this.$emit('close')
      },
      onCloseClick() {
        this.close()
      },
      onRemarkClick(content) {
        VXETable.modal.alert({
          title: '审批意见',
          content,
          showFooter: false,
          zIndex: 10001,
          mask: true,
          maskClosable: false
        })
      },

      onActionBtnClick(actionName) {
        if (this.beforeBtnClick && typeof this.beforeBtnClick === 'function') {
          this.beforeBtnClick(actionName, () => { this.nextAction(actionName) })
        } else {
          this.nextAction(actionName)
        }
      },
      nextAction(actionName) {
        const oper = OPER_ACTION[actionName]
        if (!oper) return
        this.oper = oper
        this.modalVisible = true
      },
      onModalOk(e) {
        this.modalVisible = false
        this.getWorkflow()
        this.$emit('ok')
      },

      startWorkflowBtnClick() {
        // VXETable.modal.confirm({
        //   title: '提示',
        //   content: this.confirmMessage || '是否提交审批?',//第一次提示
        //   mask: true,
        // }).then(type => {
        //   if (type === 'confirm') {
        //     this.startWorkflow()
        //   }
        // })
        this.startWorkflow();
      },
      async startWorkflow() {
        let result = true
        if (this.beforeSubmit) {
          result = await this.beforeSubmit(this)
          if (!result) return
          this.submitWorkflow()
        } else {
          VXETable.modal.confirm({
            title: '提示',
            content: this.confirmMessage || '是否提交审批?',
            mask: true,
          }).then(type => {
            if (type === 'confirm') {
              this.submitWorkflow()
            }
          })
        }
      },
      async handleSubmitWorkflow() {
        const { defaultKey, code, billId, billNo, selectedUser } = this
        const loading = this.$loading({
        	lock: true,
        	text: '正在提交',
        	spinner: 'el-icon-loading',
        })
        //const res = await apiWorkflow.start(defaultKey, code, billId, billNo)
        const res = await apiWorkflow.submit(code, billId, billNo, selectedUser)
        loading.close()
        if (res?.code === 200) {
          this.$message.success(res.message)
          this.getWorkflow()
          this.$emit('ok')
        } else if([4811, 4813].includes(res?.code)){
          if(res.code == 4813){
            this.billType = res.data?.billTypeName
          }
          this.modalHeadrenText = res.code == 4813 ? '单据异常' : '提示'
          this.visible = true;
          this.remindTitle = res?.message || '操作失败'
        }else {
          this.$message.error(res?.message || '操作失败')
        }

      },
      async submitWorkflow() {
        const { code } = this
        const configs = this.DICTS?.WORKFLOW_COMPONENT_CONFIG ?? []
        const find = configs.some(item => item.value === code)
        if (find) {
          this.selectUserForm.visible = true
        } else {
          this.handleSubmitWorkflow()
        }
      },
      // async startWorkflow() {
      //   let result = true
      //   if (this.beforeSubmit) {
      //     result = await this.beforeSubmit(this)  //第二次提示撞单
      //   }
      //   if (!result) return

      //   const { defaultKey, code, billId, billNo } = this
      //   const loading = this.$loading({
      //   	lock: true,
      //   	text: '正在提交',
      //   	spinner: 'el-icon-loading',
      //   })
      //   //const res = await apiWorkflow.start(defaultKey, code, billId, billNo)
      //   const res = await apiWorkflow.submit(code, billId, billNo)
      //   loading.close()
      //   if (res?.code === 200) {
      //     this.$message.success(res.message)
      //     this.getWorkflow()
      //     this.$emit('ok')
      //   } else {
      //     this.$message.error(res?.message || '操作失败')
      //   }
      // },
      async getNodesList() {
        const lastNode = this.steps.length === 0 ? null : this.steps[this.steps.length - 1]
        if (!lastNode) return
        const tasks = []

        tasks.push(apiWorkflow.nodes(lastNode.nodeId, this.billNo))

        tasks.push(apiWorkflow.users(lastNode.nodeId, this.billNo, 1,this.code))
        tasks.push(apiWorkflow.users(lastNode.nodeId, this.billNo, 2,this.code))
        tasks.push(apiWorkflow.users(lastNode.nodeId, this.billNo, 3,this.code))
        tasks.push(apiWorkflow.users(lastNode.nodeId, this.billNo, 4,this.code))
        const responses = await Promise.all(tasks)
        this.rejectNodes = responses[0].data ?? []

        this.auditors = responses[1].data ?? []
        this.circulations = responses[2].data ?? []
        //this.rejects = responses[3].data ?? []
        this.delegations = responses[4].data ?? []

        this.rejects = lastNode.rejectUsers ?? []
      },
      // onRestartClick() {
      //   VXETable.modal.confirm({
      //     title: '提示',
      //     content: this.confirmMessage || '是否提交审批?',
      //     mask: true,
      //   }).then(async type => {
      //     if (type === 'confirm') {
      //       let result = true
      //       if (this.beforeSubmit) {
      //         result = await this.beforeSubmit(this)
      //       }
      //       if (!result) return

      //       this.reStart()
      //     }
      //   })
      // },
      async onRestartClick() {
        let result = true
        if (this.beforeSubmit) {
          result = await this.beforeSubmit(this)
          if (!result) return
           this.reStart()
        } else {
          VXETable.modal.confirm({
            title: '提示',
            content: this.confirmMessage || '是否提交审批?',
            mask: true,
          }).then(async type => {
            if (type === 'confirm') {
               this.reStart()
            }
          })
        }
      },
      async reStart() {
        const { billId, billNo, code } = this
        // const res = await apiWorkflow.pass(billId, billNo, {
        //   isNext: 0
        // })
        const loading = this.$loading({
        	lock: true,
        	text: '正在提交',
        	spinner: 'el-icon-loading',
        })
        const res = await apiWorkflow.submit(code, billId, billNo)
        loading.close()
        if (res.code === 200) {
          this.getWorkflow()
          this.$emit('ok')
        } else if([4811, 4813].includes(res?.code)){
          if(res.code == 4813){
            this.billType = res.data?.billTypeName
          }
          this.modalHeadrenText = res.code == 4813 ? '单据异常' : '提示'
          this.visible = true;
          this.remindTitle = res?.message || '操作失败'
        } else {
          this.$message.error(res.message || '操作失败')
        }
      },
      closeDelModal(){
        this.visible = false;
        this.onCloseClick();
        this.$tabs.close(null, '/quotation/notFound')
      },
      confirmClick(){
        this.onCloseClick();
        this.visible = false;
        this.$tabs.refresh();
      },

      setSort() {
        const WORKFLOW_COMPONENT = this.DICTS?.WORKFLOW_COMPONENT ?? []
        if (WORKFLOW_COMPONENT.some(item => item.value === 'desc')) {
          this.sort = 'reverse'
        }
      },

      onCommentsChange(data) {
        const { count } = data
        this.commentCount = count
        this.$emit('commentChange', data)
      },

      onTabClick({ index }) {
        if (index == '0' && !this.commentOpened && this.$refs.commentRef) {
          this.commentOpened = true
          setTimeout(() => {
            this.$refs.commentRef.scrollToBottom()
          }, 0)
        }
      }
    }
  }
</script>

<style lang="less">
.workflow-view {
  display: flex;
  flex-direction: column;
  padding: 12px 20px;
  height: 100%;
  width: 100%;
  .el-tabs__item.is-active > span {
    box-shadow: none;
  }
  .el-step.is-vertical .el-step__title {
    margin-bottom: 6px;
  }
  .el-step.is-vertical {
    margin-bottom: 0;
    .el-step__main {
      flex: 1;
      width: 0;
      padding: 10px;
      margin: 12px 10px 16px;
      box-shadow: 0 0 8px 0 rgb(45 45 45 / 15%);
    }
  }
  .workflow-view-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 0;
  }
  .workflow-close-icon {
    color: #d2d2d2;
    font-size: 18px;
    cursor: pointer;
    transition: color .3s;
  }
  .workflow-close-icon:hover {
    color: #333;
  }
  .workflow-steps-view {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 0 6px;
  }
  .workflow-steps-view-body {
    display: block;
    height: 100%;
    overflow: auto;
  }
  .workflow-steps-view-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 6px 0;
    height: 40px;
  }

  .workflow-state-wrapper {
    display: flex;
    padding: 0 10px;
    margin: 6px auto 16px;
    .workflow-state-item {
      display: flex;
      flex: 1;
      width: 0;
      margin: 0 7px;
      padding: 8px;
      border-radius: 4px;
      background: linear-gradient(135deg, #fa8c16 0%,#fff1e1 100%);
      color: #fff;
      font-size: 14px;
      box-shadow: 0px 0px 6px 0px rgba(0,0,0,0.15);
      .workflow-state-item-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
        width: 40px;
        height: 40px;
        font-size: 40px;
      }
      .workflow-state-item-content {
        display: flex;
        flex-direction: column;
        flex: 1;
        width: 0;
        > label {
          margin-bottom: 6px;
        }
        > span {
          white-space: nowrap;
        }
      }
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }
    .workflow-total-duration {
      background: linear-gradient(135deg, #168DFA 0%, #D3E7FF 100%);
    }
    .workflow-state-item.workflow-state--complete {
      background: linear-gradient(135deg, #4dc613 0%,#78e352 100%);
        // background: linear-gradient(135deg, #50a8ff 0%, #98c7ff 100%);
    }
  }

  .workflow-steps {
    padding: 0 0 30px;
    .workflow-steps-list {
      display: flex;
      flex-direction: column;
    }
    .el-step {
      min-height: 160px;
    }

    .is-success {
      .el-step__line {
        background: #13ce66;
      }
    }

    .step-title {
      padding: 3px 10px;
      font-size: 13px;
      border-radius: 16px;
      color: #fff;
      background: var(--base-color);
      font-weight: normal;
    }
    .step-handle-duration {
      display: flex;
      align-items: center;
      float: right;
      position: relative;
      padding: 0;
      border-radius: 8px;
      font-size: 14px;
      color: #69C0FF;
      cursor: default;
      > i {
        font-size: 18px;
        margin-right: 3px;
      }
      > small {
        position: absolute;
        left: 0;
        top: 80%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        color: #d2d2d2;
        white-space: nowrap;
        line-height: 20px;
        font-size: 12px;
        svg {
          margin-right: 3px;
        }
      }
    }
    .el-step__head.is-process {
      color: #aeaeae;
      border-color: #aeaeae;
    }
    .el-step__head.is-finish {
      // color: #aeaeae;
      // border-color: #aeaeae;
      color: var(--base-color);
      border-color: var(--base-color);
      .el-step__line-inner {
        border-width: 1px !important;
        height: 100% !important;
      }
    }
    .el-step__description {
      color: #848484;
      font-size: 14px;
      padding-right: 0;
    }
  }

  .description-row {
    display: flex;
    line-height: 24px;
    margin-bottom: 5px;
    .description-row-icon {
      font-size: 16px;
      > i {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 24px;
        height: 24px;
      }
    }
    .description-row-main {
      flex: 1;
      width: 0;
      padding: 0 3px;
    }
  }
  .step-desc-text {
    display: inline-flex;
    align-items: center;
    position: relative;
    margin-right: 20px;
  }
  .step-desc-user {
    margin-right: 3px;
  }
  .step-desc-time {
    display: inline-flex;
    align-items: center;
    position: relative;
    padding: 0 6px;
    margin-left: 3px;
    color: #aaa;
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      margin: auto;
      height: 50%;
      width: 1px;
      background: #aaa;
    }
  }
  .read--state {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 2px;
    width: 12px;
    height: 12px;
    font-size: 14px;
    background: #fff;
  }
  .read--state-isread {
    color: #1be584;
  }
  .read--state-unread {
    color: var(--base-color);
  }
  .step-desc-text-remark {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    -webkit-box-decoration-break: clone;
    overflow: hidden;
    padding: 6px;
    border-radius: 4px;
    background: #f0f0f0;
    color: #595959;
    cursor: pointer;
  }
  .submit-workflow-btn {
    width: 100%;
    height: 48px;
  }
}
.workflow-tabs {
  .el-tabs__item {
    padding: 0 12px;
    .el-badge__content {
      top: 6px;
      right: 22px;
      background-color: var(--base-color);
    }
  }
}

.approval-modal.type--modal {
  .vxe-modal--box {
    .vxe-modal--body,
    .vxe-modal--content {
      overflow: unset;
    }
  }
}

.handle-totaltime {
  display: flex;
  align-items: center;
  height: 36px;
  margin: 16px 0;
  font-size: 16px;
  color: #666;
  > span {
    margin-left: 12px;
    border-radius: 10px;
    background: #ffedd1;
    color: #FFA000;
    padding: 6px 10px;
  }
}
.modal-title {
  vertical-align: 6px;
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px;
  line-height: 24px;
  color: #333333;
}

.workflow-view .workflow-steps.workflow-steps--reverse {
  .workflow-steps-list {
    flex-direction: column-reverse;
    .el-step:first-of-type .el-step__line {
      display: none;
    }
    .el-step:last-of-type .el-step__line {
      display: block;
    }
    .el-step:only-child .el-step__line {
      display: none;
    }
  }
}
.workflow-tabs-item-title {
  padding: 0 16px;
}
</style>
