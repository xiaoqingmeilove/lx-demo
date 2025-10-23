<template>
  <div class="workflow-operation">

    <page-button
      class="workflow-operation-btn"
      type="text"
      :disabled="workflowLoadState === 1"
      @click="onWorkflowBtnClick">
      <btn-icon v-if="workflowLoadState === 2"></btn-icon>
      {{workflowBtnText}}
      <i class="el-icon-d-arrow-right" v-if="workflowLoadState === 2"></i>
      <span class="comment-badge" v-if="commentCount">{{commentCount}}</span>
    </page-button>

    <page-drawer v-model="workflowVisible"
      :fixed="fixed"
      mask-background="none"
      width="420px"
      :container="container"
      :z-index="980"
    >
      <workflow
        v-if="billId"
        :code="code"
        :bill-id="billId"
        :bill-no="billNo"
        :bill-state="billState"
        :read-only="readOnly"
        :before-submit="beforeSubmit"
        :before-btn-click="beforeBtnClick"
        :show-btns="showBtns"
        :confirm-message="confirmMessage"
        @init="workflowLoadState = 1;"
        @close="onWorkflowClose"
        @ok="onWorkflowOk"
        @load="onWorkflowLoad"
        @commentChange="onCommentChange"
        ref="workflow"
      ></workflow>
    </page-drawer>
  </div>
</template>

<script>
  import btnIcon from './scripts/icon/index.vue'
  const WORKFLOW_BTN_TEXT = {
    1: '工作流加载中',
    2: '协同',
    3: '点击重试'
  }

  export default {
    name: 'workflowOperation',
    components: {
      btnIcon,
    },
    props: {
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
      container: {
        type: String,
        default: 'body'
      },
      fixed: {
        type: Boolean,
        default: true
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
    computed: {
      workflowBtnText() {
        return WORKFLOW_BTN_TEXT[this.workflowLoadState] ?? ''
      }
    },
    data() {
      return {
        workflowVisible: false,
        workflowLoadState: 0,      //1加载中;2读取成功;3读取失败;4空数据
        clicked: false,
        commentCount: 0
      }
    },
    methods: {
      close() {
        this.workflowVisible = false
      },
      onWorkflowBtnClick() {
        if (this.workflowLoadState === 2) {
          this.workflowVisible = true
          if (!this.clicked) {
            const { workflow } = this.$refs
            workflow.activeTab = ''
            this.$nextTick(() => {
              workflow.activeTab = 'task'
              const { commentRef } = workflow.$refs
              commentRef && commentRef.getComments()
            })
            this.clicked = true
          }
        }
      },
      onWorkflowLoad(e) {
        this.workflowLoadState = 2
        this.$emit('load', e)
      },
      onWorkflowClose() {
        this.close()
      },
      onWorkflowOk() {
        this.$emit('ok', {
          instance: this
        })
      },
      onCommentChange({ count }) {
        this.commentCount = count
      }
    }
  }
</script>

<style>
.workflow-operation{
  display: flex;
  align-items: center;
}
.workflow-operation-btn {
  margin: 0 12px;
}
.comment-badge {
  position: absolute;
  background-color: var(--base-color);
  border-radius: 10px;
  color: #fff;
  display: inline-block;
  font-size: 12px;
  height: 18px;
  line-height: 18px;
  padding: 0 6px;
  text-align: center;
  white-space: nowrap;
  border: 1px solid #fff;
  right: 0px;
  top: -18px;
}
</style>
