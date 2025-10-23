<template>
  <app-page>
    <bill-btns :form="form" title="采购商品" filed="materialName" jumpUrl="/material/material-detail">
      <template #state>
        <page-button v-if="form.status === 0" theme="success">启用</page-button>
        <page-button v-if="form.status === 1" theme="danger">禁用</page-button>
      </template>
      <template #buttons>
        <page-button theme="special" @click="editForm" v-if="!editState">修改</page-button>
        <page-button v-if="editState" @click="submit">保存</page-button>
        <page-button v-if="id && editState" @click="cancel">取消</page-button>
        <page-button @click="$tabs.close()">关闭</page-button>
      </template>
    </bill-btns>

    <div class="view-section tab-view-section" auto>
      <el-tabs v-model="activeName" flex ref="tabs">
        <el-tab-pane name="jbxx">
          <span slot="label">基本信息</span>
          <sub-title title="物料分类">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.wlfl
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.wlfl = !formDataShow.wlfl"
              ></i>
            </template>
          </sub-title>
          <data-form
            v-show="formDataShow.wlfl"
            :items="descItems"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj"
            ref="dataForm"
          >
            <template #select_tree="{ item }">
              <template v-if="!editState">
                <div class="popup-form--span">
                  <span
                    class="data-form--value"
                    :title="bindTreeContent(item)"
                  >{{ bindTreeContent(item) }}</span>
                </div>
              </template>
              <template v-else>
                <el-select-tree
                  v-model="form[item.field]"
                  style="width: 100%;"
                  filterable
                  clearable
                  check-strictly
                  :data="descSourceList[item.source]"
                  :props="{label:'label',value:'id',children:'children'}"
                  @change="onInputBlurFormChange({ item })"
                ></el-select-tree>
              </template>
            </template>
          </data-form>
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
            :items="bindDescItems"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj"
            ref="dataForm1"
          >
            <template #select_tree="{ item }">
              <template v-if="!editState">
                <div class="popup-form--span">
                  <span
                    class="data-form--value"
                    :title="bindTreeContent(item)"
                  >{{ bindTreeContent(item) }}</span>
                </div>
              </template>
              <template v-else>
                <el-select-tree
                  v-model="form[item.field]"
                  style="width: 100%;"
                  filterable
                  clearable
                  :data="descSourceList[item.source]"
                  @change="onInputBlurFormChange({ item })"
                ></el-select-tree>
              </template>
            </template>
            <template #slot_checkbox="{item}">
              <template v-if="editState">
                <el-checkbox v-model="form[item.field]" :true-label="1" :false-label="0" style="margin-left: 6px;">
                  <span v-if="form[item.field] === 1">是</span>
                  <span v-else>否</span>
                </el-checkbox>
              </template>
              <template v-else>
                <span style="margin-left: 6px;">{{form[item.field] === 1 ? '是' : '否'}}</span>
              </template>
            </template>
            <template #fileList="{item}">
              <div class="upload_box">
                <div class="uploadBox">
                  <div class="imgBox" v-for="(file, index) in (form[item.field]||[])" :key="index">
                    <el-image
                      style="width:100%;height:100%;"
                      :src="'/'+ file.url"
                      :preview-src-list="previewSrcList(form[item.field]||[])"
                    ></el-image>
                    <div class="img-bnt">
                      <i v-if="editState" class="el-icon-close" @click="delFile(item.field, index)"></i>
                    </div>
                  </div>
                  <upload-button
                    v-if="editState"
                    class="uploadBtn"
                    multiple
                    :accept="['.jpg','.jpeg','.png','.gif']"
                    content="+"
                    plain
                    @success="(e) => onUploadLogoSuccess(e, item.field)"
                  ></upload-button>
                </div>
                <div v-if="editState" class="upload_spec">只能上传.gif,.jpg,.jpeg,.png文件</div>
              </div>
            </template>
          </data-form>
          <sub-title title="拓展信息">
            <template #beforeIcon>
              <i
                :class="
                  formDataShow.tzxx
                    ? 'el-icon-caret-bottom'
                    : 'el-icon-caret-right'
                "
                @click="formDataShow.tzxx = !formDataShow.tzxx"
              ></i>
            </template>
          </sub-title>
          <data-form
            v-show="formDataShow.tzxx"
            :items="descItems2"
            :form-data="form"
            :editable="editState"
            :source-list="descSourceList"
            :rules="rulesobj"
            ref="dataForm2"
          >
            <template #slot_checkbox="{item}">
              <template v-if="editState">
                <el-checkbox v-model="form[item.field]" :true-label="1" :false-label="0" style="margin-left: 6px;">
                  <span v-if="form[item.field] === 1">是</span>
                  <span v-else>否</span>
                </el-checkbox>
              </template>
              <template v-else>
                <span style="margin-left: 6px;">{{form[item.field] === 1 ? '是' : '否'}}</span>
              </template>
            </template>
            <template #fileList="{item}">
              <div class="upload_box">
                <div class="uploadBox">
                  <div class="imgBox" v-for="(file, index) in (form[item.field]||[])" :key="index">
                    <el-image
                      style="width:100%;height:100%;"
                      :src="'/'+ file.url"
                      :preview-src-list="previewSrcList(form[item.field]||[])"
                    ></el-image>
                    <div class="img-bnt">
                      <i v-if="editState" class="el-icon-close" @click="delFile(item.field, index)"></i>
                    </div>
                  </div>
                  <upload-button
                    v-if="editState"
                    class="uploadBtn"
                    multiple
                    :accept="['.jpg','.jpeg','.png','.gif']"
                    content="+"
                    plain
                    @success="(e) => onUploadLogoSuccess(e, item.field)"
                  ></upload-button>
                </div>
                <div v-if="editState" class="upload_spec">只能上传.gif,.jpg,.jpeg,.png文件</div>
              </div>
            </template>
          </data-form>
        </el-tab-pane>
        <el-tab-pane name="fjxx">
          <span slot="label">附件信息</span>
          <bill-filelist-group
            :read-only="true"
            :bill-id="form.id"
            :bill-type="fileBillTpye"
            ref="fileList"
            :menuCode="menuCode"
            @filelist-update="onFilelistUpdate"
          ></bill-filelist-group>
        </el-tab-pane>
      </el-tabs>
    </div>
  </app-page>
</template>
<script src="./index.js"></script>
<style scoped lang="less">
.statetype {
  font-size: 12px;
  color: #333;
}
.imgBox {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  border: #ccc 1px dashed;

  .img-bnt {
    position: absolute;
    top: 2px;
    right: 6px;
    cursor: pointer;
    display: none;
  }

  &:hover .img-bnt {
    display: block;
  }
}
.uploadBox {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
}
.uploadBtn {
  ::v-deep .upload-button-btn {
    width: 100px !important;
    height: 100px !important;
    border: #ccc 1px dashed;
    background-color: #fbfdff !important;
    color: #595959;
    font-size: 36px;

    &:hover {
      border-color: var(--base-color);
    }
  }
}

.upload_spec {
  font-size: 12px;
  color: #858585;
}
</style>
