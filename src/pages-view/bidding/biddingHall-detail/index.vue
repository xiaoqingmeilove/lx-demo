<template>
  <app-page>
    <bill-btns :form="form" title="SRM系统 - 竞价大厅" filed ="billNo">
      <template #buttons>
        <el-tag effect="dark" style="margin-right: 10px;"> 当前排名：{{ form.ranking }}</el-tag>
        <!-- <el-tag :style="{marginRight: '10px', color:'#fff', borderColor : sourceList.projectStatus[form.projectStatus].color, backgroundColor: sourceList.projectStatus[form.projectStatus].color}">
          {{ sourceList.projectStatus[form.projectStatus].label }}
        </el-tag>  -->
        <!-- <el-tag :type="projectStatusType[form.projectStatus]" style="margin-right: 10px;"> {{ sourceList.projectStatus[form.projectStatus].label }}</el-tag> -->
        
        <business-status-pro :state="form.projectStatus" source="bidding_project_status" style="margin-right: 10px;"></business-status-pro>
        <page-button v-if="showBtn('closePage')" @click="$tabs.close()">关闭</page-button>
      </template>
      <template #content>
        <div class="page-info">
          <div class="page-info-item">
            采购项目： <span class="page-info-item-value">{{form.projectName}} </span> 
          </div>
          <div class="page-info-item">
            <label class="page-info-item-label">竞价开始时间:</label>
            <span class="page-info-item-value">{{form.beginTime}}</span>
          </div>
          <div class="page-info-item">
            <label class="page-info-item-label">竞价截止时间:</label>
            <span class="page-info-item-value">{{form.endTime}}</span>
          </div>
          <div class="page-info-item">
            <label class="page-info-item-label">{{countForm.label}}:</label>
            <span class="page-info-item-value">
              <el-statistic
                v-if="countForm.beginValue && form.beginTime"
                format="DD天HH:mm:ss"
                :value="countForm.beginValue"
                time-indices
              />
              <el-statistic
                v-if="countForm.endValue && form.endTime"
                format="DD天HH:mm:ss"
                :value="countForm.endValue"
                time-indices
              />
            </span>
          </div>
          <div class="page-info-item">
            <label class="page-info-item-label">距离出价时间:</label>
            <span class="page-info-item-value">
              <el-statistic
                v-if="form.offerTime && countForm.offerTime"
                format="HH:mm:ss"
                :value="countForm.offerTime"
                time-indices
              />
            </span>
          </div>
        </div>
      </template>
    </bill-btns>
    <div class="page-body">
      <div class="page-body-item" style="background-color: #fff;">
        <bid-price :menuCode="menuCode" :read-only="bidPriceReadOnly"  :form-data="form" @ok="getDetail();"/>
      </div>
      <div class="page-body-content">
        <div class="body-content-item">
          <sub-title high title="报价历史">
            <template #description>
              <div>您的所有报价历史</div>
            </template>
            <template #buttons>
              <vxe-toolbar ref="cjlbtoolbar" class="app-table-toolbar">
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="outPriceDefaultColumns"
                    @ok="(e) => onToolOk(e, 'tableColumns1')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          
          <div style="height: calc(100% - 32px)">
          <vxe-grid
            v-show="formDataShow.cjlb"
            :data="form.offerList"
            :id="`tb_biddingHall_detail_cjlb_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="outPriceTableColumns"
            :footer-method="footerMethod"
            :show-footer="showfooter('outPriceTableColumns')"
            height="auto"
            min-height="180px"
            ref="cjlbtable"
          >
            <template #rowNum="{rowIndex}">
              <span>{{rowIndex + 1}}</span>
            </template>
            <template #amount="{row, column}">
              <span style="color: var(--base-color);cursor: pointer;">{{row[column.field]}}</span>
              <!-- <span style="color: var(--base-color);cursor: pointer;" @click="openOut(row)">{{row[column.field]}}</span> -->
            </template>
            <template #action="{row}">
              <page-button type="text" :disabled="!row.id" @click="$router.push({path: `/bidding/supplierApply-detail/detail/${row.id}`})">查看报价详情</page-button>
            </template>
          </vxe-grid>
          </div>
          
        </div>
        <div class="body-content-item">
          <sub-title high title="价格趋势">
            <template #description>
              <div>您的报价价格变化趋势</div>
            </template>
            <template #buttons>
            </template>
          </sub-title>
          <div class="charts" ref="charts" style="width: 100%;height: 100%"></div>
        </div>
        
      </div>
    </div>
    <div v-if="false" class="view-section tab-view-section" auto>
      <el-tabs v-model="activeName" flex ref="tabs">
        <el-tab-pane name="jbxx">
          <span slot="label">基本信息</span>
          <sub-title title="基本信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.jbxx
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.jbxx = !formDataShow.jbxx"
              ></i>
            </template>
          </sub-title>
          <div class="view-top" v-show="formDataShow.jbxx">
            <data-form
              :items="descItems"
              :form-data="form"
              :editable="editState"
              :source-list="descSourceList"
              :rules="rules"
              @hidden:select="onInputBlurFormChange"
              @change:select="onInputBlurFormChange"
              ref="dataForm1"
              class="view-top-form"
            >
              <template #supplierListObj="{ value, item }">
                <div class="supplier-config">
                  <div v-for="(items, index) in form.supplierList" :key="items.id">
                    <div class="supplier-item">
                      <span>{{ items.supplierName }}</span>
                      <span>{{ items.linkerName }}</span>
                      <span>{{ items.linkerTel }}</span>
                    </div>
                  </div>
                </div>
              </template>
            </data-form>
            <div class="view-top-ranking">
              <h3>排名<span style="color: red;padding: 2px 10px;border-bottom: 2px solid red;">{{form.ranking}}</span></h3>
              <div><p>出价时间</p><p>{{form.offerTime}}</p></div>
            </div>
          </div>
          <sub-title title="采购明细内容">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.cpxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.cpxx = !formDataShow.cpxx"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="cpxxtoolbar" class="app-table-toolbar">
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="defaultColumns"
                    @ok="(e) => onToolOk(e, 'tableColumns')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.cpxx"
            :data="form.detailList"
            :id="`tb_biddingHall_detail_cpxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns"
            :footer-method="footerMethod"
            :show-footer="showfooter('tableColumns')"
            min-height="180px"
            max-height="500px"
            ref="cpxxtable"
          >
        </vxe-grid>
          <sub-title title="出价列表">
            <template #beforeIcon>
              <i :class="formDataShow.cjlb ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
                @click="formDataShow.cjlb = !formDataShow.cjlb"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="cjlbtoolbar" class="app-table-toolbar">
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="outPriceDefaultColumns"
                    @ok="(e) => onToolOk(e, 'tableColumns1')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.cjlb"
            :data="form.offerList"
            :id="`tb_biddingHall_detail_cjlb_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="outPriceTableColumns"
            :footer-method="footerMethod"
            :show-footer="showfooter('outPriceTableColumns')"
            min-height="180px"
            max-height="600px"
            ref="cjlbtable"
          >
            <template #rowNum="{rowIndex}">
              <span>{{rowIndex + 1}}</span>
            </template>
            <template #amount="{row, column}">
              <span style="color: var(--base-color);cursor: pointer;" @click="openOut(row)">{{row[column.field]}}</span>
            </template>
            <template #action="{row}">
              <page-button type="text" :disabled="!row.id" @click="$router.push({path: `/bidding/supplierApply-detail/detail/${row.id}`})">查看报价详情</page-button>
            </template>
        </vxe-grid>
        </el-tab-pane>
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.id"
            bill-type="BM-1"
            ref="fileList"
            :menuCode="menuCode"
            @filelist-update="onFilelistUpdate"
          >
          </bill-filelist-group>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #custom>
      <vxe-modal
        width="80%"
        v-model="visible.outVisible"
        resize
        title="出价"
        destroy-on-close
        :position="{ top: '12vh'}"
        @close="visible.outVisible = false"
      >
        <bid-price :menuCode="menuCode" :read-only="outReadOnly" :form-data="outForm" @ok="getDetail();visible.outVisible=false" @close="visible.outVisible=false" v-if="visible.outVisible" />
      </vxe-modal>
    </template>
  </app-page>
</template>
<script src="./index.js"></script>
<style lang="less" scoped>
@import url("./index_scoped.less");
</style>
