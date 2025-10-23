<template>
  <app-page>
    <bill-btns :form="form" title="招标申请">
      <template #buttons>
        <!-- <page-button @click="submitBidding">1111</page-button> -->
        <page-button @click="publishBidding" v-if="showBtn('publishBidding')">{{ showBtn("publishBidding")?.btnName ?? "招标启动通告" }}</page-button>
        <page-button @click="openBid" v-if="showBtn('openBid')">{{ showBtn("openBid")?.btnName ?? "开标" }}</page-button>
        <template v-if="editState">
          <page-button @click="bsbzSave" v-if="showBtn('bsbzSave')">标书编制保存</page-button>
          <page-button @click="gysSave" v-if="showBtn('gysSave')">{{ showBtn("gysSave")?.btnName ?? "供应商入围保存" }}</page-button>
          <page-button @click="bidSave" v-if="showBtn('bidSave')">{{ showBtn("bidSave")?.btnName ?? "定标保存" }}</page-button>
          <page-button @click="cancel">取消</page-button>
        </template>
        <template v-else>
          <page-button class="page-button-green" v-if="showBtn('edit')" @click="editForm">修改</page-button>
          <!-- <page-button @click="onSubmitBtnClick" v-if="showBtn('dbSubmitWorkflow')"> {{ showBtn("dbSubmitWorkflow")?.btnName ?? "定标审批"}}</page-button> -->
          <page-button @click="editNotice"  class="page-button-red" v-if="showBtn('notice')">{{ showBtn("notice")?.btnName ?? "发布公告"}}</page-button>
          <page-button @click="signEnd" v-if="showBtn('signEnd')">{{ showBtn("signEnd")?.btnName ?? "报名结束" }}</page-button>
          <page-button @click="bidApply" v-if="showBtn('bidApply') ">{{ showBtn("bidApply")?.btnName ?? "定标" }}</page-button>
          <page-button @click="bidConfirm" v-if="showBtn('bidConfirm') ">{{ showBtn("bidConfirm")?.btnName ?? "定标提交" }}</page-button>
          <page-button @click="gysSubmit" v-if="showBtn('gysSubmit') ">{{ showBtn("gysSubmit")?.btnName ?? "供应商入围提交" }}</page-button>
          <page-button @click="bsbzSubmit" v-if="showBtn('bsbzSubmit') ">{{ showBtn("bsbzSubmit")?.btnName ?? "标书编制提交" }}</page-button>
          <page-button class="page-button-green" @click="submitBidding" v-if="showBtn('submitBidding')">{{ showBtn("submitBidding")?.btnName ?? "确定发标" }}</page-button>
          <page-button @click="closeAnswer" v-if="showBtn('closeAnswer') ">{{ showBtn("closeAnswer")?.btnName ?? "答疑结束" }}</page-button>
          <page-button @click="submitReview" v-if="showBtn('submitReview')">{{ showBtn("submitReview")?.btnName ?? "评标提交" }}</page-button>
        </template>
        <page-button @click="$tabs.close()" v-if="showBtn('close')">{{ showBtn("close")?.btnName ?? "关闭" }}</page-button>
        <!-- <workflow-operation
          code="market_srm_tender_audit"
          :bill-id="form.id"
          :bill-no="form.billNo"
          :bill-state="form.billState"
          :read-only="false"
          @ok="onWorkflowOk"
          ref="workflow"
        ></workflow-operation> -->
      </template>
      <template #steps>
        <bid-step :step="form.bizFlowStatus?Number(form.bizFlowStatus) :0" :icon-size="36"></bid-step>
        <!-- <div class="steps-box" >
          <el-steps :active="form.bizFlowStatus?Number(form.bizFlowStatus) :0"  process-status="finish" align-center>
            <el-step title="招标立项" icon="bi-file-earmark-text"></el-step>
            <el-step title="报名中" icon="bi-file-earmark-text"></el-step>
            <el-step title="供应商入围" icon="bi-people"></el-step>
            <el-step title="标书编制" icon="bi-bookmarks"></el-step>
            <el-step title="发标" icon="bi-cursor-fill"></el-step>
            <el-step title="答疑" icon="bi-chat-square-text"></el-step>
            <el-step title="投标" icon="bi-file-earmark-text"></el-step>
            <el-step title="开标" icon="bi-box-seam"></el-step>
            <el-step title="评标" icon="bi bi-clipboard-check"></el-step>
            <el-step title="定标" icon="bi bi-hand-thumbs-up"></el-step>
          </el-steps>
        </div> -->
      </template>
    </bill-btns>

    <div class="view-section tab-view-section" auto>
      <el-tabs v-model="activeName" flex ref="tabs">
        <el-tab-pane name="jbxx" v-if="selectActiveName('jbxx')">
          <span slot="label">基本信息</span>
          <sub-title title="基本信息">
            <template #beforeIcon>
              <i :class="formDataShow.jbxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click="formDataShow.jbxx = !formDataShow.jbxx"></i>
            </template>
          </sub-title>
          <data-form
            v-show="formDataShow.jbxx"
            :items="bindDescItems"
            :form-data="form"
            :source-list="descSourceList"
            :rules="rulesobj"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            @change:radio="onInputBlurFormChange"
            ref="dataForm"
          >
          <template #purchaseUserTel="{ item }">
            <!-- <el-input type="text" v-if="editState" clearable v-model="form.purchaseUserTel" style="width: 100%;"/>
            <span v-else>
              {{ form.purchaseUserTel }}
            </span> -->
            {{ form.purchaseUserTel }}
          </template>
            <template #slot_noneEdit_date="{ item }">
              <span>{{item.value}}</span>
            </template>
            <template #fileList>
              <div class="file-list">
                <upload-button v-if="editState" content="点击上传" style="width:90px" plain @success="(e) => onUploadSuccess(e, 'fileList', 1)"></upload-button>
                <div v-if="editState"  class="upload_spec">最多1个文件</div>
                <div v-for="(item, index) in form.fileList" :key="index" v-if="form.fileList && form.fileList.length">
                  <div class="file-list-item">
                    <div class="content" @click="viewFile(item, form.fileList)" style="color:var(--base-color);cursor: pointer;">{{item.originalFileName??''}}</div>
                    <div v-if="editState" class="bnt" @click.stop="form.fileList.splice(index, 1)"><i class="el-icon-close"></i></div>
                  </div>
                </div>
                <div style="color:red;">采购需求</div>
              </div>
            </template>
          </data-form>

          <sub-title title="时间安排">
            <template #beforeIcon>
              <i :class="formDataShow.sjap ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click="formDataShow.sjap = !formDataShow.sjap"></i>
            </template>
          </sub-title>
          <div class="timeline-box sjap-box" v-show="formDataShow.sjap" style="padding: 20px">
            <el-timeline v-if="form.ruleList?.length > 0">
            <el-timeline-item
              v-for="(activity, index) in form.ruleList.filter(item => item.type == 'date' && item.field != 'businessBidCompletionTime')"
              :key="index"
              >
              <div class="timeline-item-content">
                <div class="timeline-item-content-timestamp">{{activity.value}}</div>
                <div class="timeline-item-content-title">{{activity.label}}</div>
                <!-- <div class="timeline-item-content-remark">{{activity.remark}}</div> -->
              </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
        <el-tab-pane name="cgmx" v-if="selectActiveName('cgmx')">
          <span slot="label">采购明细</span>
          <sub-title title="采购明细">
            <template #beforeIcon>
              <i :class=" formDataShow.cgmx ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.cgmx = !formDataShow.cgmx"></i>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.cgmx"
            :data="form.detailList"
            :id="`tb_cgsq_detail_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
            ref="table"
            min-height="180"
            max-height="600"
          >
            <template #rowNum="{rowIndex}">
              <span>{{ rowIndex + 1 }}</span>
            </template>
          </vxe-grid>
        </el-tab-pane>
        <el-tab-pane name="gys" v-if="selectActiveName('gys')">
          <span slot="label">供应商</span>
          <supplier-select
            v-if="activeName == 'gys'"
            @init="init"
            :form="form"
            :editState="editState"
            :columnsData="tabList"
            ref="supplierSelect"
          ></supplier-select>
     
        </el-tab-pane>
        <el-tab-pane name="zbwj" v-if="selectActiveName('zbwj')">
          <span slot="label">招标文件</span>
          <FilelistList
            v-bind="$attrs"
            v-on="$listeners"
            :readOnly="true"
            :showEditName="false"
            :file-list="[...(form.businessFileList || []), ...(form.technicalFileList || [])]"
          >
            <template #buttons>
              <slot name="buttons"></slot>
            </template>
            <template #operations="data">
              <slot name="operations" v-bind="{ ...data }"></slot>
            </template>
          </FilelistList>
        </el-tab-pane>
        <el-tab-pane name="bsbz" v-if="selectActiveName('bsbz')">
          <span slot="label">标书编制</span>
          <bidPreparation
            :form-data="form"
            :pBusinessFileList.sync="form.businessFileList"
            :pTechnicalFileList.sync="form.technicalFileList"
            :editState="editState"
            v-if="activeName == 'bsbz'"
            ref="bidPreparation"
          >
          </bidPreparation>
        </el-tab-pane>
        <el-tab-pane name="dyzx" v-if="selectActiveName('dyzx')">
          <span slot="label">答疑中心</span>
          <answeringQuestion
            :form-data="form"
            :editState="editState"
            v-if="activeName == 'dyzx'"
            ref="answeringQuestion"
          >
          </answeringQuestion>
        </el-tab-pane>
        <el-tab-pane name="pb" v-if="selectActiveName('pb')">
          <span slot="label">评标</span>
          <bid-review
            :form-data="form"
            :editState="editState"
            @init="init"
            v-if="activeName == 'pb'"
            ref="bidReview"
          >
          </bid-review>
        </el-tab-pane>
        <el-tab-pane name="pbDetail" v-if="selectActiveName('pbDetail')">
          <span slot="label">评估结果</span>
          <bid-review-detail
            v-if="activeName == 'pbDetail'"
            ref="bidReviewDetail"
            :form-data="form"
          >
          </bid-review-detail>
        </el-tab-pane>
        <el-tab-pane name="swtp" v-if="selectActiveName('swtp')">
          <span slot="label">商务谈判</span>
          <negotiations
            :form-data="form"
            :editState="editState"
            v-if="activeName == 'swtp'"
            ref="negotiations"
          >
          </negotiations>
        </el-tab-pane>
        <el-tab-pane name="db" v-if="selectActiveName('db')">
          <span slot="label">定标</span>
          <bid-confirm
            :form-data="form"
            :editState="editState"
            @init="init"
            :bidConfirmItems="bidConfirmItems"
            :bidConfirmColumns="bidConfirmColumns"
            :dbqrColumns="dbqrColumns"
            v-if="activeName == 'db'"
            ref="bidConfirm"
          >
          </bid-confirm>
        </el-tab-pane>
        <el-tab-pane name="qt" v-if="selectActiveName('qt')">
          <span slot="label">其他</span>
          <sub-title title="招标方案">
            <template #beforeIcon>
              <i :class=" formDataShow.zbfa ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.zbfa = !formDataShow.zbfa"></i>
            </template>
          </sub-title>
          <data-form 
            v-show="formDataShow.zbfa"
            :items="businessRule"
            :form-data="form.ruleMap"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            @change:radio="onInputBlurFormChange"
            ref="dataForm"
          >
            <template #slot_switch="{ item }">
              <el-switch
                :disabled="!editState"
                v-model="form.ruleMap[item.field]"
                :active-value="1"
                :inactive-value="0"
                >
              </el-switch>
            </template>
            <template #tender_radio="{ item }">
              <el-radio-group v-model="form.ruleMap[item.field]" :disabled="!editState">
                <el-radio v-for="item in descSourceList[item.source]" :key="item.value" :label="item.value" :value="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </template>
          </data-form>
          <sub-title title="评标专家">
            <template #beforeIcon>
              <i :class=" formDataShow.pzbj ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.pzbj = !formDataShow.pzbj"></i>
            </template>
            <!-- <template #buttons >
              <page-button @click="addExpertVisible=true"  :disabled="!( editState)">添加专家</page-button>
            </template> -->
          </sub-title>
          <vxe-grid
            v-show="formDataShow.pzbj"
            :data="form.expertList"
            :id="`tb_bidding_pzbj_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="pzbjColumns"
            ref="pzbjTable"
            min-height="180"
            max-height="600"
          >
          <template #sex="{row, column}">
            <span>{{row[column.field] == 0 ? '男' :row[column.field] == 1 ? '女' : '未知'}}</span>
          </template>
          <template #action="{ row, rowIndex }">
            <page-button type="text" @click="delExpert(row, rowIndex)" v-if="editState">删除</page-button>
          </template>
          </vxe-grid>
          <sub-title title="招标计划时间表">
            <template #beforeIcon>
              <i :class=" formDataShow.zbjhsj ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.zbjhsj = !formDataShow.zbjhsj"></i>
            </template>
          </sub-title>
          <data-form 
            v-show="formDataShow.zbjhsj"
            :items="zbjhsjColumns"
            :form-data="form.ruleMap"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            @change:radio="onInputBlurFormChange"
            ref="zbjhsjForm"
          >
          </data-form>
        </el-tab-pane>
        <el-tab-pane name="czjl" v-if="selectActiveName('czjl')">
          <span slot="label">操作记录</span>
            <biz-oper-log :form-data="form" bizType="TENDER" v-if="activeName == 'czjl'" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <column-pasting :visible="lztVisible" @ok="lztOk" @close="lztClose" :lztLoadText="lztLoadText" />
    
    <vxe-modal
      width="80%"
      v-model="addListVisible"
      resize
      title="添加明细"
      destroy-on-close
      height="90%"
      @close="addListVisible = false"
      class-name="add-modal"
    >
      <!-- <product-list :menuCode="menuCode" @ok="addProductData" v-if="addListVisible"></product-list> -->
      <material-list :menuCode="menuCode" @ok="addProductData" v-if="addListVisible"></material-list>
    </vxe-modal>
    <vue-easy-lightbox
      :visible="previewImg"
      :imgs="imgs"
      :index="previewIndex"
      @hide="previewImg = false"
      ref="lightbox"
    ></vue-easy-lightbox>
    <template #custom>
      <page-drawer
        v-model="addUnconVisible"
        direction="ltr"
        width="95%"
        destroy-on-close
        :z-index="980"
        @closed="handleClose"
        :maskClosable="false"
      >
        <addUnconventional
          :detailList="form.detailList"
          @submit="addUnconOk"
          @close="addUnconVisible = false"
        />
      </page-drawer>
    </template>

    <vxe-modal
      width="80%"
      v-model="addSupplierVisible"
      resize
      title="添加供应商"
      destroy-on-close
      height="90%"
      @close="addSupplierVisible = false"
      class-name="add-modal"
    >
      <supplier-list
        :menuCode="menuCode"
        @ok="addSupplierData"
        v-if="addSupplierVisible"
      ></supplier-list>
    </vxe-modal>

    <vxe-modal
      width="80%"
      v-model="addExpertVisible"
      resize
      title="添加专家"
      destroy-on-close
      height="90%"
      @close="addExpertVisible = false"
      class-name="add-modal"
    >
      <expert-list
        :menuCode="menuCode"
        :expertType="form.bidScope"
        @ok="addExpertData"
        v-if="addExpertVisible"
      ></expert-list>
    </vxe-modal>
    <vxe-modal
      show-zoom
      resize
      v-model="noticeVisible"
      width="50%"
      height="80%"
      title="发布公告"
      :maskClosable="false"
      destroy-on-close
      @close="noticeClose"
    >
      <notice-modal
        v-if="noticeVisible"
        :editNoticeState="editNoticeState"
        :form="noticeForm"
        @close="noticeClose"
        @ok="issueOk"
      ></notice-modal>
    </vxe-modal>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
@import url("./index_scoped.less");
</style>
