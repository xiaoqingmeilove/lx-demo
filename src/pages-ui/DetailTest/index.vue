<template>
  <app-page>
    <page-header>
      <template #content>
        <adjust-price></adjust-price>
      </template>
      <template #buttons>
        <page-button v-if="!!submitBtn" @click="onSubmitBtnClick">提交审批</page-button>
        <page-button>修改</page-button>
        <page-button @click="$tabs.close({ force: false })">关闭</page-button>
        <!-- <page-button v-if="submitWorkflowBtnVisible">提交审批</page-button> -->
        <workflow-operation
          code="market_quote_newSpecial"
          :bill-id="detailData.id"
          :bill-no="detailData.billNo"
          :bill-state="detailData.billState"
          :read-only="false"
          :before-submit="beforeSubmit"
          @load="onWorkflowLoad"
          @ok="onWorkflowOk"
          ref="workflow"
        ></workflow-operation>
      </template>
    </page-header>
    <bill-info :info-value="detailData" :show-value="!!detailData.id"></bill-info>

    <div class="view-section" style="padding: 10px;">
      <sub-title title="标题"></sub-title>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    </div>

    <div class="view-section tab-view-section" auto>
      <el-tabs v-model="activeTab" @tab-click="" flex ref="tabs">
        <template #buttons>
          <page-button size="small">按钮</page-button>
        </template>
        <el-tab-pane name="djxx">
          <span slot="label">单据信息</span>
          <div class="tab-content-container">
            <el-collapse v-model="activeName" class="page-collapse">
              <el-collapse-item name="jbxx">
                <template slot="title">
                  <sub-title title="基本信息" style="margin-bottom: 0;">
                    <template #buttons v-if="activeName.includes('jbxx')">
                      <page-button>修改</page-button>
                    </template>
                  </sub-title>
                </template>
                <data-form
                  :items="items"
                  :form-data="detailData"
                  :source-list="sourceList"
                >
                </data-form>
              </el-collapse-item>
              <el-collapse-item name="cpqd">
                <template slot="title">
                  <sub-title title="产品清单" style="margin-bottom: 0;"></sub-title>
                </template>
                <table-section :loaded="true" ref="tableSection" :class="isMaximize ? 'table--maximize' : ''">
                  <div class="app-table-container">
                    <div class="app-table-header">
                      <vxe-toolbar ref="toolbar" class="app-table-toolbar">
                        <template #tools>
                          <table-tools :tools="['maximize']" @ok="onToolOk"></table-tools>
                        </template>
                      </vxe-toolbar>
                    </div>
                    <div class="app-table-body">
                      <vxe-grid
                        :columns="[
                          { title: 'ID', field: 'id' },
                          { title: '用户名', field: 'username' },
                          { title: '地址', field: 'address' },
                          { title: '备注', field: 'remark' }
                        ]"
                        :data="tableData"
                        :height="isMaximize ? 'auto' : ''"
                        :max-height="isMaximize ? undefined : tableMaxHeight"
                        ref="table"
                      >
                      </vxe-grid>
                    </div>
                  </div>
                </table-section>

              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息({{attachList.length}})</span>
          <div class="tab-content-container">
            <div style="width: 800px;">
              <attachment-list :list="attachList"
                @change="onAttachChange"
                @delete="onAttachDelete"
              ></attachment-list>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

  </app-page>
</template>

<script>
  import { ApiQuotation } from '@/apis'

  const apiQuotation = new ApiQuotation()

  export default {
    pageScroller: ['.el-tab-pane'],
    data() {
      const dict = this.$store.state.Common.dict;
      return {
        id: -1,
        detailData: {},
        infoList: [
          { label: '组织架构', field: 'org', placeholder: '无', icon: 'el-icon-share', span: 2 },
          { label: '单据编号', field: 'billNo', placeholder: '系统自动生成', icon: 'el-icon-document' },
          { label: '单据状态', field: 'billStateName', placeholder: '计划中', icon: 'el-icon-s-data', span: 1 },
          { label: '制单人', field: 'createUser', placeholder: '', icon: 'el-icon-user', span: 1 },
          { label: '单据时间', field: 'createTime', placeholder: '系统自动生成', icon: 'el-icon-date' },
          { label: '申请时间', field: 'submissionTime', placeholder: '系统自动生成', icon: 'el-icon-timer' },
          { label: '审核时间', field: 'auditDate', placeholder: '系统自动生成', icon: 'el-icon-finished' },
        ],
        infoValue: {},

        activeTab: 'djxx',

        attachList: [
          { fileName: '111.pdf', originalFileName: '111.pdf', url: '', fileImageSize: '0B', uploadTime: '2000-01-01 00:00:00', createUser: '张三' },
          { fileName: '222.xlsx', originalFileName: '222.xlsx', url: '', fileImageSize: '0B', uploadTime: '2001-01-01 00:00:00', createUser: '李四' }
        ],

        submitWorkflowBtnVisible: false,

        activeName: ['jbxx', 'cpqd'],
        tableData: [],
        items: [
          {label:'客户名称',field:'customerName', type:'input'},
          {label:'项目名称',field:'projectName',type:'input'},
          {label:'送货区域',field:'areaCodeList',slot: 'areaCodeList'},
          {label:'详细地址',field:'deliveryAddress',type:'input'},
          {label:'联系人',field:'linkerListObj',slot:'linkerListObj'},
          {label:'报价类型',field:'quotedType',type:'selectinput', source: 'quotedTypeList'},
          {label:'业务类型',field:'quoteType',type:'selectinput', source: 'quoteTypeList'},
          {label:'采购单位',field:'purchaseCompany',type:'input'},
          {label:'业主单位',field:'ownerCompany',type:'input'},
          {label:'招标单位',field:'bidsCompany',type:'input'},
          {label:'施工单位',field:'buildCompany',type:'input'},
          {label:'交货时间',field:'deliveryDate',type:'datetime'},
          {label:'业务员',field:'salesrepListObj',slot:'salesrepListObj'},
          {label:'客户类型',field:'customerType',type: 'selectinput', source: 'customerTypeList'},
          {label:'项目类型',field:'projectType',type:'selectinput', source: 'projectTypeList' },
          {label:'费用系数',field:'externalFeeRate',slot:'externalFeeRate'},
          {label:'付款方式',field:'paymentModeName',type:'selectinput', source: 'paymentModeNameList'},
          {label:'情况说明',field:'expound',type:'textarea',},
          {label:'备注',field:'remark',type:'textarea', },
        ],
        sourceList: {
          quotedTypeList: (dict["quoted_type"] ?? []).map((d) => {
            return { label: d.dictLabel, value: d.dictValue }
          }),
          quoteTypeList: (dict["quote_type"] ?? []).map((d) => {
            return { label: d.dictLabel, value: d.dictValue }
          }),
        },

        isMaximize: false,
        tableMaxHeight: null,

        submitBtn: null,

        confirmMessage: 'abc'
      }
    },
    created() {
      const { params } = this.$route
      const { id } = params
      if (id) {
        this.id = params.id
        this.getData()
      }

      const tableData = []
      this.tableData = Array.from({length: 100}, (_, i) => {
        return {
          id: i + 1,
          username: `u_${i+1}`,
          address: `address_${i+1}`,
          remark: `remark_${i+1}`,
        }
      })
      console.log('detail created', this.id)
    },
    mounted() {
      //this.$tabs.activeTab.title = 'aaa'
      this.infoValue = {
        state: '计划中',
        createUser: '张三'
      }

      const { table, toolbar } = this.$refs
      table.connect(toolbar)

      const { tabs } = this.$refs
      const content = tabs.$el.querySelector('.el-tabs__content')
      this.tableMaxHeight = content.clientHeight - 44
    },
    destroyed() {
      console.log('detail destroyed', this.id)
    },
    beforeRouteLeave(to, from, next) {
      console.log('beforeRouteLeave')
      next()
      // if (confirm('beforeRouteLeave是否离开?')) {
      //   next()
      // } else {
      //   next(false)
      // }
    },
    beforeRouteUpdate(to, from, next) {
      console.log('beforeRouteUpdate',)
      next()
      // if (confirm('beforeRouteUpdate是否离开?')) {
      //   next()
      // } else {
      //   next(false)
      // }
    },
    beforePageLeave(tab, type) {
      return new Promise((resolve, reject) => {
        if (['unload', 'leave'].includes(type)) {
          resolve()
        } else {
          if (confirm('是否离开?' + type)) {
            resolve()
          } else {
            reject(`取消`)
          }
        }
      })
    },
    methods: {
      async getData()  {
        const loading = this.$loading({
        	lock: true,
        	text: '正在加载',
        	spinner: 'el-icon-loading',
        })
        this.workflowLoadState = 0
        const res = await apiQuotation.detailQuoted({
          id: this.id,
        })
        this.detailData = res.data ?? {}
        setTimeout(() => {
          loading.close()
        }, 300)
      },
      async test() {
        const loading = this.$loading({
        	lock: true,
        	text: '正在加载',
        	spinner: 'el-icon-loading',
        })
        setTimeout(() => {
          const infoValue = {...this.infoValue}
          infoValue.billNo = '0123456789'
          this.infoValue = infoValue
          loading.close()
        }, 300)
      },

      onAttachChange(files) {
        //TODO
        const { fileName, url, uploadTime, fileImageSize, originalFileName } = files[0]
        this.attachList.push({
          fileName,
          originalFileName,
          url,
          fileImageSize,
          uploadTime,
          createUser: '张三'
        })
      },
      onAttachDelete(e) {
        console.log('onAttachDelete', e)
        const { data, index } = e
        this.attachList.splice(index, 1)
      },

      async beforeSubmit() {
        const loading = this.$loading({
        	lock: true,
        	text: '正在保存订单',
        	spinner: 'el-icon-loading',
        })
        //TODO
        await new Promise(resolve => setTimeout(resolve, 2000))
        loading.close()
        return true
      },

      onToolOk(e) {
        const { type, data } = e
        const fn = this.toolMethods()[type]
        fn && fn(data)
      },
      toolMethods() {
        return {
          maximize: data => {
            const { maximize } = data
            if (maximize) {
              this.maximizeTable()
            } else {
              const element = this.$refs.tableSection
              if (this.movedTable.prev) {
                this.movedTable.parent.insertBefore(element.$el, this.movedTable.prev.nextSibling)
              } else {
                this.movedTable.parent.appendChild(element.$el)
              }
            }
            this.isMaximize = maximize
          }
        }
      },
      maximizeTable() {
        const container = document.querySelector('.app-page')
        const element = this.$refs.tableSection.$el;
        this.movedTable = {
          prev: element.previousElementSibling,
          parent: element.parentElement
        }
        container.appendChild(element)
      },

      onWorkflowOk() {
        this.getData()
      },
      onWorkflowLoad({ data, submitState }) {
        //submitState start: 启动;restart: 重启
        this.submitBtn = submitState
      },
      onSubmitBtnClick() {
        const { workflow } = this.$refs
        const { workflow: workflowComponent } = workflow?.$refs
        workflowComponent && workflowComponent.externalBtnClick(this.submitBtn)
      }
    }
  }
</script>

<style>
</style>
