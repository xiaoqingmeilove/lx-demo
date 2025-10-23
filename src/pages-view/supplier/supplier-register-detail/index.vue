<template>
  <app-page>
    <bill-btns :form="form" title="" filed="supplierName">
      <template #content>
        <div class="page-head-content" v-if="id">
          <!-- <div class="logo" v-if="logoUrl">
            <img :src="logoUrl" alt="">
          </div> -->
          <data-form
            class="page-form"
            :items="bindBillDescItems"
            :showTool="false"
            :form-data="form"
            :editable="false"
            labelWidth="100px"
          >
            <template #authStatus="{item}">
              <span class="status" :style="{color: getColorAndName(item, descSourceList.authStatusList).color}">
                <span class="dot" :style="{background: getColorAndName(item, descSourceList.authStatusList).color}"></span>
                <span>{{getColorAndName(item, descSourceList.authStatusList).label}}</span>
              </span>
            </template>
            <template #taxRate="{item}">
              <span>{{form.invoiceTypeName}} {{form.taxRate}}<span v-if="form.taxRate">%</span></span>
            </template>
            <template #validityEndDate>
              <span v-if="form.autoRenewalFlag">长期有效</span>
              <span v-else>{{form.validityEndDate}}</span>
            </template>
          </data-form>
        </div>
      </template>
      <template #state>
        <span v-if="id && getSupplierState().label" class="bill-bg" :style="{background: getSupplierState().color}">{{getSupplierState().label}}</span>
      </template>
      <template #buttons>
        <template v-if="id">
          <template v-if="editState">
            <page-button theme="special" v-if="showBtn('changeSubmit')" @click="changeSubmit">{{showBtn('changeSubmit')?.btnName??'变更提交'}}</page-button>
            <page-button v-if="showBtn('save')" @click="editSave">保存</page-button>
            <page-button v-if="showBtn('cancel')" @click="cancel">取消</page-button>
          </template>
          <template v-else>
            <page-button theme="special" v-if="showBtn('submitWorkflow')" @click="onSubmitBtnClick">提交审批</page-button>
            <page-button theme="special" v-if="showBtn('edit')" @click="editClick">修改</page-button>
            <page-button theme="special" v-if="showBtn('changeEdit')" @click="changeEditClick">{{showBtn('changeEdit')?.btnName??'变更修改'}}</page-button>
          </template>
        </template>
        <template v-else>
          <page-button v-if="showBtn('addSave')" @click="addSave">保存</page-button>
        </template>
        <page-button v-if="showBtn('close')" @click="$tabs.close()">关闭</page-button>
        <workflow-operation
          v-if="userInfo.userType==='03'"
          code="market_supplier_access"
          :bill-id="form.id"
          :bill-no="form.billNo"
          :bill-state="form.billState"
          :read-only="true"
          :before-submit="beforeSubmit"
          @ok="onWorkflowOk"
          ref="workflow"
        ></workflow-operation>
      </template>
    </bill-btns>

    <div class="view-section tab-view-section" auto>
      <el-tabs v-model="activeName" flex ref="tabs" @tab-click="tabClick">
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
          <data-form
            v-show="formDataShow.jbxx"
            :items="descItems"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rules"
            label-width="125px"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            ref="dataForm"
          >
            <template #areaCodeList>
              <template v-if="editState">
                <pca-cascader-home
                  v-model="form"
                  data-type="string"
                  @change="pcaChange"
                  clearable
                  :check-strictly="false"
                  placeholder="请选择"
                  style="width: 100%"
                ></pca-cascader-home>
              </template>
              <template v-else>
                <span>{{ form.areaCodeListName }}</span>
              </template>
            </template>
            <template #supplierStatus="{item}">
              <template v-if="editState">
                <el-select
                  v-model="form.supplierStatus"
                  class="data-form--select"
                  :disabled="item.disabled"
                  :placeholder="item.placeholder"
                  clearable
                  @change="() => onInputBlurFormChange({item})"
                >
                  <el-option v-for="item in descSourceList[item.source]" :key="item.value" :value="item.value" :label="item.label" />
                </el-select>
              </template>
              <template v-else>
                <span v-if="form.supplierStatus || form.supplierStatus === 0" class="bill-bg" :style="{background: getSupplierState().color}">{{getSupplierState().label}}</span>
              </template>
            </template>
          </data-form>
          <sub-title title="详细信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.lxrxx
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.lxrxx = !formDataShow.lxrxx"
              ></i>
            </template>
          </sub-title>
          <data-form
            :items="bindDescItems2"
            :form-data="form"
            v-show="formDataShow.lxrxx"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rules"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            ref="dataForm1"
          >
            <template #supplierLogo="{item}">
              <div class="uploadBox">
                <div class="imgBox" v-if="(form[item.field]??[]).length">
                  <el-image style="width:100%;height:100%;"
                    :src="'/'+ form[item.field][0]?.url"
                    :preview-src-list="['/'+ form[item.field][0]?.url]">
                  </el-image>
                  <div class="img-bnt">
                    <i v-if="editState" class="el-icon-close" @click="delLogo(item.field)"></i>
                  </div>
                </div>
                <template v-else>
                  <upload-button v-if="editState" class="uploadBtn" :accept="['.jpg','.jpeg','.png','.gif']" content="+" plain @success="(e) => onUploadLogoSuccess(e, item.field, 1)"></upload-button>
                </template>
                <div  v-if="editState" class="upload_spec">最多1个, 只能上传.gif,.jpg,.jpeg,.png文件</div>
              </div>
            </template>
          </data-form>
          <sub-title title="开户信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.skxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.skxx = !formDataShow.skxx"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="skxxtoolbar" class="app-table-toolbar">
                <template #buttons>
                  <page-button v-if="editState && showBtn('addInvoice')" @click="addBank" content="新增" type="text" style="margin-right: 36px;">
                    <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                  </page-button>
                </template>
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="defaultColumns1"
                    @ok="(e) => onToolOk(e, 'columns1')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.skxx"
            :data="form.bankList"
            :id="`tb_skxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns1"
            max-height="260px"
            ref="skxxtable"
          >
            <template #slot_required="{column}">
              <span><span style="color:red">*</span>{{column.title}}</span>
            </template>
            <!-- 文字 -->
            <template
              #slot_edit_input="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <el-input v-model="row[column.field]"  clearable
                  :placeholder="`请输入${column.title}`"
                  @focus="($event) => $event.target.select()"
                ></el-input>
              </template>
              <template v-else>
                <span>{{
                  column.formatter
                    ? column.formatter({
                        cellValue: row[column.field],
                        row,
                        rowIndex,
                        column,
                        columnIndex,
                        $columnIndex,
                      })
                    : row[column.field]
                }}</span>
              </template>
            </template>
            <!-- 文字 -->
            <template
              #slot_edit_flag="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <el-checkbox v-model="row[column.field]" :true-label="1" :false-label="0" @change="(e)=>backCheckChange(e, row, rowIndex, column)">默认开户行</el-checkbox>
              </template>
              <template v-else>
                <span>{{row[column.field]?'是':'否'}}</span>
              </template>
            </template>
            <template #action="{row, rowIndex}">
              <page-button type="text" :disabled="!editState || (form.bankList && form.bankList.length == 1)" @click="delBank(rowIndex)">删除</page-button>
            </template>
          </vxe-grid>
          <sub-title title="联系人信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.lxxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.lxxx = !formDataShow.lxxx"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="lxxxtoolbar" class="app-table-toolbar">
                <template #buttons>
                  <page-button v-if="editState && showBtn('addlinker')" @click="addlinker" content="新增" type="text" style="margin-right: 36px;">
                    <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                  </page-button>
                </template>
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="defaultColumns3"
                    @ok="(e) => onToolOk(e, 'columns3')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.lxxx"
            :data="form.contactList"
            :id="`tb_lxxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns3"
            max-height="260px"
            ref="lxxxtable"
          >
            <template #slot_required="{column}">
              <span><span style="color:red">*</span>{{column.title}}</span>
            </template>
            <!-- 文字 -->
            <template
              #slot_edit_input="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <el-input v-model="row[column.field]"  clearable
                  :placeholder="`请输入${column.title}`"
                  @focus="($event) => $event.target.select()"
                ></el-input>
              </template>
              <template v-else>
                <span>{{
                  column.formatter
                    ? column.formatter({
                        cellValue: row[column.field],
                        row,
                        rowIndex,
                        column,
                        columnIndex,
                        $columnIndex,
                      })
                    : row[column.field]
                }}</span>
              </template>
            </template>
            <!-- 文字 -->
            <template
              #slot_edit_flag="{
                row,
                rowIndex,
                $rowIndex,
                column,
                columnIndex,
                $columnIndex,
              }"
            >
              <template v-if="editState">
                <el-checkbox v-model="row[column.field]" :true-label="1" :false-label="0" @change="(e)=>linkerCheckChange(e, row, rowIndex, column)">默认联系人</el-checkbox>
              </template>
              <template v-else>
                <span>{{row[column.field]?'是':'否'}}</span>
              </template>
            </template>
            <template #action="{row, rowIndex}">
              <page-button type="text" :disabled="!editState || (form.contactList && form.contactList.length == 1)" @click="delLinker(rowIndex)">删除</page-button>
            </template>
          </vxe-grid>
          <sub-title title="营业执照">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.yyzz ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.yyzz = !formDataShow.yyzz"
              ></i>
            </template>
          </sub-title>
          <el-descriptions direction="vertical" :column="3" border v-show="formDataShow.yyzz" class="desc-content">
            <el-descriptions-item content-class-name="my-content">
              <template slot="label">
                <span style="color:red">*</span>统一社会信用代码
              </template>
              <template v-if="editState">
                <el-input v-model="form.businessLicense" clearable style="width: 100%" placeholder="请输入统一社会信用代码"></el-input>
              </template>
              <template v-else>
                <span>{{form.businessLicense}}</span>
              </template>
            </el-descriptions-item>
            <el-descriptions-item content-class-name="my-content">
              <template slot="label">
                <span style="color:red" v-if="!form.businessLicenseAutoRenewalFlag">*</span>到期日期
              </template>
              <div v-if="editState" class="due">
                <el-date-picker
                  v-model="form.businessLicenseValidityEndDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  clearable
                  placeholder="选择日期"
                  :disabled="!!form.businessLicenseAutoRenewalFlag"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
                <el-checkbox v-model="form.businessLicenseAutoRenewalFlag" :true-label="1" :false-label="0" @change="(e)=>form.businessLicenseValidityEndDate=''">长期有效</el-checkbox>
              </div>
              <template v-else>
                <span v-if="form.businessLicenseAutoRenewalFlag">长期有效</span>
                <span v-else>{{form.businessLicenseValidityEndDate}}</span>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="附件">
              <upload-button v-if="editState" content="点击上传" plain @success="(e) => onUploadLogoSuccess(e, 'businessLicenseFileList', 2)"></upload-button>
              <div v-if="editState"  class="upload_spec">最多2个文件</div>
              <div v-for="(item, index) in form.businessLicenseFileList" :key="index" v-if="form.businessLicenseFileList && form.businessLicenseFileList.length">
                <div class="file-list-item">
                  <div class="content" @click="viewFile(item, form.businessLicenseFileList)" style="color:var(--base-color);cursor: pointer;">{{item.originalFileName??''}}</div>
                  <div v-if="editState" class="bnt" @click.stop="form.businessLicenseFileList.splice(index, 1)"><i class="el-icon-close"></i></div>
                </div>
              </div>
              <div style="color:red;margin-top:10px">企业资料-企业资质/营业执照</div>
            </el-descriptions-item>
            <el-descriptions-item content-class-name="my-content">
              <template slot="label">
                确认函
              </template>
              <!-- <template v-if="editState">
                <el-input v-model="form.confirmTitle" clearable style="width: 100%" placeholder="请输入确认函名称"></el-input>
              </template>
              <template v-else> -->
                <span>{{form.confirmTitle||'供应商信息确认函'}}</span>
              <!-- </template> -->
            </el-descriptions-item>
            <el-descriptions-item content-class-name="my-content">
              <template slot="label">
                到期日期
              </template>
              <div v-if="editState" class="due">
                <el-date-picker
                  v-model="form.confirmValidityEndDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  clearable
                  placeholder="选择日期"
                  :disabled="!!form.confirmAutoRenewalFlag"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
                <el-checkbox v-model="form.confirmAutoRenewalFlag" :true-label="1" :false-label="0" @change="(e)=>form.confirmValidityEndDate=''">长期有效</el-checkbox>
              </div>
              <template v-else>
                <span v-if="form.confirmAutoRenewalFlag == 1">长期有效</span>
                <span v-else>{{form.confirmValidityEndDate}}</span>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="附件">
              <upload-button v-if="editState" content="点击上传" plain @success="(e) => onUploadLogoSuccess(e, 'confirmFileList', 9999)"></upload-button>
              <!-- <div v-if="editState"  class="upload_spec">最多2个文件</div> -->
              <div v-for="(item, index) in form.confirmFileList" :key="index" v-if="form.confirmFileList && form.confirmFileList.length">
                <div class="file-list-item">
                  <div class="content" @click="viewFile(item, form.confirmFileList)" style="color:var(--base-color);cursor: pointer;">{{item.originalFileName??''}}</div>
                  <div v-if="editState" class="bnt" @click.stop="form.confirmFileList.splice(index, 1)"><i class="el-icon-close"></i></div>
                </div>
              </div>
              <div style="color:red;margin-top:10px">企业资料-确认函</div>
            </el-descriptions-item>
          </el-descriptions>
          <sub-title title="授权人信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.sqrxx ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.sqrxx = !formDataShow.sqrxx"
              ></i>
            </template>
          </sub-title>
          <el-descriptions direction="vertical" :column="3" border v-show="formDataShow.sqrxx" class="desc-content">
            <el-descriptions-item label="身份证号码" content-class-name="my-content">
                <template v-if="editState">
                  <el-input v-model="form.authUserIdCard" clearable placeholder="请输入身份证号码"></el-input>
                </template>
                <template v-else>
                  <span>{{form.authUserIdCard}}</span>
                </template>
            </el-descriptions-item>
            <el-descriptions-item label="到期日期" content-class-name="my-content">
              <div v-if="editState" class="due">
                <el-date-picker
                  v-model="form.authUserValidityEndDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  clearable
                  placeholder="选择日期"
                  :disabled="!!form.authUserAutoRenewalFlag"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
                <el-checkbox v-model="form.authUserAutoRenewalFlag" :true-label="1" :false-label="0" @change="(e)=>form.authUserValidityEndDate=''">长期有效</el-checkbox>
              </div>
              <template v-else>
                <span v-if="form.authUserAutoRenewalFlag">长期有效</span>
                <span v-else>{{form.authUserValidityEndDate}}</span>
              </template>
            </el-descriptions-item>
            <el-descriptions-item label="身份证正反面">
              <upload-button  v-if="editState" content="点击上传" :accept="['.jpg','.jpeg','.png','.gif']" plain @success="(e) => onUploadLogoSuccess(e, 'authUserFileList', 2)"></upload-button>
              <div v-if="editState" class="upload_spec">最多2个, 只能上传.gif,.jpg,.jpeg,.png文件</div>
              <div v-for="(item, index) in form.authUserFileList" :key="index" v-if="form.authUserFileList && form.authUserFileList.length">
                <div class="file-list-item">
                  <div class="content" @click="viewFile(item, form.authUserFileList)" style="color:var(--base-color);cursor: pointer;">{{item.originalFileName??''}}</div>
                  <div v-if="editState" class="bnt" @click="form.authUserFileList.splice(index, 1)"><i class="el-icon-close"></i></div>
                </div>
              </div>
              <div style="color:red;margin-top:10px">企业资料-身份证信息</div>
            </el-descriptions-item>
          </el-descriptions>
          <sub-title title="企业资质">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.qyzz ? 'el-icon-caret-bottom' : 'el-icon-caret-right'
                "
                @click="formDataShow.qyzz = !formDataShow.qyzz"
              ></i>
            </template>
            <template #buttons>
              <vxe-toolbar ref="qyzztoolbar" class="app-table-toolbar">
                <template #buttons>
                  <page-button v-if="editState && showBtn('addQyzz')" @click="papersForm={expireDate:'',autoRenewalFlag:1};visible.papersVisible=true;papersIndex='';readOnly=false" content="新增" type="text" style="margin-right: 36px;">
                    <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                  </page-button>
                </template>
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="defaultColumns2"
                    @ok="(e) => onToolOk(e, 'columns2')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.qyzz"
            :data="form.qualificationsList"
            :id="`tb_qyzz_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns2"
            min-height="180px"
            max-height="600px"
            ref="qyzztable"
          >
            <template #expireDate="{row}">
              <span v-if="row.autoRenewalFlag">长期有效</span>
              <span v-else>{{row.expireDate||''}}</span>
            </template>
            <template #fileList="{row}">
              <span class="vxe-cell--label" style="cursor: pointer;"><span v-for="(item, index) in row.fileList" :key="index" @click="viewFile(item, row.fileList)" style="color:var(--base-color)"> {{item.originalFileName}} <span v-if="index!=row.fileList.length - 1">、</span> </span></span>     
            </template>
            <template #action="{row, rowIndex}">
              <page-button type="text" v-if="!editState" @click="papersForm={...row};visible.papersVisible=true;readOnly=true">查看</page-button>
              <template v-else>
                <page-button type="text" @click="papersForm={...row};visible.papersVisible=true;papersIndex=rowIndex;readOnly=false">编辑</page-button>
                <page-button type="text" @click="form.qualificationsList.splice(rowIndex,1)">删除</page-button>
              </template>
            </template>
          
        </vxe-grid>
        <template v-show="userInfo.userType !== '03' || (userInfo.userType === '03'&&form.authStatus === 'APPROVED')">
          <sub-title title="产品信息">
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
                <template #buttons>
                  <page-button v-if="editState && showBtn('addDetail')" @click="visible.addListVisible = true" content="新增" type="text" style="margin-right: 36px;">
                    <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                  </page-button>
                </template>
                <template #tools>
                  <table-tools
                    :tools="['setting']"
                    :default-columns="defaultColumns"
                    @ok="(e) => onToolOk(e, 'columns')"
                  ></table-tools>
                </template>
              </vxe-toolbar>
            </template>
          </sub-title>
          <vxe-grid
            v-show="formDataShow.cpxx"
            :data="form.detailList"
            :id="`tb_cpxx_list_${userInfo.userId}`"
            :custom-config="{ storage: true }"
            :columns="tableColumns"
            min-height="180px"
            max-height="600px"
            ref="cpxxtable"
          >
            <template #flagSlots="{row, column}">
              <span class="vxe-cell--label">
                <page-button theme="success" v-if="parseFloat(row[column.field]) === 1">是</page-button>
                <page-button theme="danger" v-if="parseFloat(row[column.field])=== 0">否</page-button>
              </span>
            </template>
            <template #status="{row, column}">
              <span class="vxe-cell--label">
                <page-button theme="success" v-if="parseFloat(row[column.field]) === 0">启用</page-button>
                <page-button theme="danger" v-if="parseFloat(row[column.field])=== 1">禁用</page-button>
              </span>
            </template>
            <template #groundingFlag="{row, column}">
              <span class="vxe-cell--label">
                <page-button theme="success" v-if="parseFloat(row[column.field]) === 0">已上架</page-button>
                <page-button theme="danger" v-if="parseFloat(row[column.field]) === 1">未上架</page-button>
              </span>
            </template>
            <template #fileList="{row}">
              <span class="vxe-cell--label" style="cursor: pointer;"><span v-for="(item, index) in row.fileList" :key="index" @click="viewFile(item, row.fileList)"> {{item.originalFileName}} <span v-if="index!=row.fileList.length - 1">、</span> </span></span>     
            </template>
            <template
              #slot_edit_number="{
                row,
                rowIndex,
                column,
              }"
            >
              <template v-if="editState">
                <vue2-number-input
                  v-model="row[column.field]"
                  :controls="false"
                  focus-select
                  align="right"
                  :digits="getDigits(column)"
                  @input="(e)=>numberChange(e, row, column, rowIndex)"
                ></vue2-number-input>
              </template>
              <template v-else>
                <span class="vxe-cell--label">{{
                  column.formatter
                    ? column.formatter({
                        cellValue: row[column.field],
                        row,
                        rowIndex,
                        column,
                      })
                    : row[column.field]
                }}</span>
              </template>
            </template>
            <template #action="{row, rowIndex}">
              <page-button type="text" :disabled="!editState" @click="form.detailList.splice(rowIndex, 1)">删除</page-button>
            </template>
          </vxe-grid>
        </template>

        <!-- <sub-title title="登录信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.dlxx
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.dlxx = !formDataShow.dlxx"
              ></i>
            </template>
          </sub-title>
          <data-form
            v-show="formDataShow.dlxx"
            :items="descItems3"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rules"
            label-width="125px"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            ref="dataForm2"
          >
          </data-form> -->
        <template v-if="userInfo.userType !== '03'">
          <sub-title title="供应商管理信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.gysglxx
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.gysglxx = !formDataShow.gysglxx"
              ></i>
            </template>
          </sub-title>
          <data-form
            v-show="formDataShow.gysglxx"
            :items="descItems4"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rules"
            label-width="125px"
            @hidden:select="onInputBlurFormChange"
            @change:select="onInputBlurFormChange"
            @change:input="onInputBlurFormChange"
            ref="dataForm3"
          >
            <template #validityEndDate="{item}">
              <div v-if="editState" class="due">
                <el-date-picker
                  v-model="form.validityEndDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  clearable
                  placeholder="选择日期"
                  :disabled="!!form.autoRenewalFlag"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
                <el-checkbox v-model="form.autoRenewalFlag" :true-label="1" :false-label="0" @change="(e)=>form.validityEndDate=e?'9999-12-31':''">长期有效</el-checkbox>
              </div>
              <span v-else>
                <span v-if="form.autoRenewalFlag">长期有效</span>
                <span v-else>{{form.validityEndDate}}</span>
              </span>
            </template>
          </data-form>
          </template>
        </el-tab-pane>
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="!showBtn('fileOperate')"
            :bill-id="form.id"
            bill-type="GYS"
            ref="fileList"
            :menuCode="menuCode"
            @filelist-update="onFilelistUpdate"
          >
          </bill-filelist-group>
        </el-tab-pane>
        <el-tab-pane name="lxbwl" v-if="userInfo.userType !== '03'">
          <span slot="label">联系备忘录</span>
          <div class="tab-body">
            <sub-title title="联系备忘录">
              <template #buttons>
                <page-button v-if="!isChage && editState && showBtn('addMemo')" @click="memoForm={};visible.memoVisible=true;memoIndex='';readOnly=false" content="新增" type="text" style="margin-right: 36px;">
                  <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                </page-button>
              </template>
            </sub-title>
            <div class="flex-body">
              <vxe-grid
                :data="form.contactRecordsList"
                :id="`tb_memo_list_${userInfo.userId}`"
                :custom-config="{ storage: true }"
                :columns="tableColumns5"
                min-height="auto"
                ref="bwltable"
              >
              
                <template #fileList="{row}">
                  <span class="vxe-cell--label" style="cursor: pointer;"><span v-for="(item, index) in row.fileList" :key="index" @click="viewFile(item, row.fileList)" style="color:var(--base-color)"> {{item.originalFileName}} <span v-if="index!=row.fileList.length - 1">、</span> </span></span>     
                </template>
                <template #action="{row, rowIndex}">
                  <page-button type="text"  v-if="!editState" @click="memoForm={...row};visible.memoVisible=true;readOnly=true">查看</page-button>
                  <template v-else>
                    <page-button type="text" @click="memoForm={...row};visible.memoVisible=true;memoIndex=rowIndex;readOnly=false">编辑</page-button>
                    <page-button type="text" @click="form.contactRecordsList.splice(rowIndex,1)">删除</page-button>
                  </template>
                </template>
              </vxe-grid>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="bgxx">
          <span slot="label">变更信息</span>
          <div class="flex-body">
            <vxe-grid
              :data="changeList"
              :id="`tb_bgxx_list_${userInfo.userId}`"
              :custom-config="{ storage: true }"
              :columns="tableColumns4"
              min-height="auto"
              ref="bgxxtable"
            >
              <template #billState="{ row }">
                <bill-state :state="row.billState"></bill-state>
              </template>
              <template #action="{row}">
                <page-button type="text" @click="openChange(row)">查看</page-button>
              </template>
            </vxe-grid>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template #custom>
      <!-- 收款信息 -->
      <popup-form
        v-model="visible.paymentVisible"
        title="新增收款信息"
        :form-data="paymentForm"
        :data-gather="paymentDataGather"
        :readOnly="!editState"
        @ok="paymentOk"
      >
      </popup-form>
      <!-- 企业资质 -->
      <vxe-modal
        v-model="visible.papersVisible"
        :title="`${papersIndex === '' ? '新增' : '修改'}企业资质`"
        show-footer
        width="680"
        height="500"
        @close="readOnly=false;visible.papersVisible=false"
      >
        <template #default>
          <el-form
            :model="papersForm"
            ref="papersForm"
            label-width="100px"
            
            class="papers-form"
          >
            <el-form-item label="证书名称" >
              <el-input
                placeholder="请输入证书名称"
                style="width: 90%"
                v-model="papersForm.certificateName"
                :disabled="readOnly"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="证书类别" >
              <el-select v-model="papersForm.certificateType" style="width: 90%"
                placeholder="请选择证书类别"
                :disabled="readOnly"
                @change="(value) => selectChange(value, 'papersForm', descSourceList.certificateTypeList, 'certificateTypeName')"
              >
                <el-option
                  v-for="item in descSourceList.certificateTypeList"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="到期日期">
              <div class="date-picker">
                <el-date-picker
                  v-model="papersForm.expireDate"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  style="width: 90%"
                  placeholder="请选择到期日期"
                  :picker-options="pickerOptions"
                  :disabled="!!papersForm.autoRenewalFlag || readOnly"
                  clearable
                >
                </el-date-picker>
                <el-checkbox :disabled="readOnly" v-model="papersForm.autoRenewalFlag" :true-label="1" :false-label="0" @change="(e)=>papersForm.expireDate=null">长期有效</el-checkbox>
              </div>
            </el-form-item>
            <el-form-item label="附件">
              <upload-button
                v-if="!readOnly"
                type="text"
                content="+上传"
                @success="(e)=>onUploadSuccess(e, 'papersForm')"
              />
              <div class="file-list">
                <div
                  class="file-list-item"
                  v-for="(item, index) in papersForm.fileList"
                  :key="index"
                >
                  <span
                    class="file-list-item-name"
                    :title="item.originalFileName"
                    @click="onImgClick(item, papersForm.fileList)"
                  >{{ item.originalFileName }}</span>
                  <svg-icon
                    icon-class="download2"
                    size="20"
                    fill="var(--base-color)"
                    @click="downloadFile(item)"
                  />
                  <svg-icon
                    v-if="!readOnly"
                    icon-class="garbage"
                    size="20"
                    fill="var(--base-color)"
                    style="margin-left: 10px"
                    @click="onDelete(item, index)"
                  />
                </div>
              </div>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <template v-if="!readOnly">
            <page-button @click="savePapers">保存</page-button>
            <page-button @click="visible.papersVisible = false;readOnly=false">取消</page-button>
          </template>
          <template v-else>
            <page-button @click="visible.papersVisible = false;readOnly=false">关闭</page-button>
          </template>
        </template>
      </vxe-modal>
      <!-- 联系备忘录 -->
      <vxe-modal
        v-model="visible.memoVisible"
        :title="`${memoIndex === '' ? '新增' : '修改'}备忘录`"
        show-footer
        width="680"
        height="700"
        @close="readOnly=false;visible.memoVisible=false"
      >
        <template #default>
          <el-form
            :model="memoForm"
            :rules="memoRules"
            ref="memoForm"
            label-width="100px"
            class="papers-form"
          >
            <el-form-item label="联系人" prop="name" >
              <el-select class="popup-form--select" v-model="memoForm.name" style="width: 90%" filterable allow-create clearable
                :filter-method="value => selectInputFilterMethod(value, 'name')"
                :disabled="readOnly"
                @change="memoSelectChange"
              >
                <el-option v-for="(item, index) in (form.contactList || [])"
                  :key="index"
                  :value="item.name"
                  :label="item.name"
                ></el-option>
              </el-select> 
            </el-form-item>
            <el-form-item label="联系人电话" prop="mobile">
              <el-input
                placeholder="请输入联系人电话"
                style="width: 90%"
                v-model="memoForm.mobile"
                :disabled="readOnly"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="联系人职务" >
              <el-input
                placeholder="请输入联系人职务"
                style="width: 90%"
                v-model="memoForm.jobTitle"
                :disabled="readOnly"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="联系时间">
              <div class="date-picker">
                <el-date-picker
                  v-model="memoForm.time"
                  type="datetime"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  style="width: 90%"
                  placeholder="请选择联系时间"
                  clearable
                  :disabled="readOnly"
                >
                </el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="联系内容" >
              <el-input
                placeholder="请输入联系内容"
                style="width: 90%"
                type="textarea"
                v-model="memoForm.content"
                :disabled="readOnly"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="附件">
              <upload-button
                v-if="!readOnly"
                type="text"
                content="+上传"
                @success="(e)=>onUploadSuccess(e, 'memoForm')"
              />
              <div class="file-list">
                <div
                  class="file-list-item"
                  v-for="(item, index) in memoForm.fileList"
                  :key="index"
                >
                  <span
                    class="file-list-item-name"
                    :title="item.originalFileName"
                    @click="onImgClick(item, memoForm.fileList)"
                  >{{ item.originalFileName }}</span>
                  <svg-icon
                    icon-class="download2"
                    size="20"
                    fill="var(--base-color)"
                    @click="downloadFile(item)"
                  />
                  <svg-icon
                    v-if="!readOnly"
                    icon-class="garbage"
                    size="20"
                    fill="var(--base-color)"
                    style="margin-left: 10px"
                    @click="onDelete(item, index, 'memoForm')"
                  />
                </div>
              </div>
            </el-form-item>
          </el-form>
        </template>
        <template #footer>
          <template v-if="!readOnly">
            <page-button @click="saveMemo">保存</page-button>
            <page-button @click="visible.memoVisible = false;readOnly=false">取消</page-button>
          </template>
          <template v-else>
            <page-button @click="visible.memoVisible = false;readOnly=false">关闭</page-button>
          </template>
        </template>
      </vxe-modal>
      <vxe-modal
        width="80%"
        v-model="visible.addListVisible"
        resize
        title="添加明细"
        destroy-on-close
        height="90%"
        @close="visible.addListVisible = false"
        class-name="add-modal"
      >
        <material-list :menuCode="menuCode" @ok="addProductData" v-if="visible.addListVisible"></material-list>
        <!-- <product-list :menuCode="menuCode" @ok="addProductData" v-if="visible.addListVisible"></product-list> -->
      </vxe-modal>
      <vue-easy-lightbox
        :visible="previewImg"
        :imgs="imgs"
        :index="previewIndex"
        @hide="previewImg = false"
        ref="lightbox"
      ></vue-easy-lightbox>
      <!-- 变更申请 -->
      <page-drawer v-model="changeVisible"
        direction="rtr"
        width="50vw"
        :before-close="handleClose"
        destroy-on-close
        :mask-closable="false"
        :z-index="980"
      >
        <ChangeRequest 
          v-if="changeVisible" 
          :fileds="bindFileds" 
          :columns-obj="bindFiledColumns" 
          :form="billForm"
          :old-form="oldForm"
          :new-form="newForm"
          :field-list="fieldList"
          @close="handleClose"
        ></ChangeRequest>
      </page-drawer>
    </template>
  </app-page>
</template>
<script src="./index.js"></script>
<style lang="less" scoped>
@import url("./index_scoped.less");
</style>
