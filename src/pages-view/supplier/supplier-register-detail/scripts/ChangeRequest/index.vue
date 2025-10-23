<template>
  <div class="body">
    <div class="title">
      <h3>{{title}}</h3>
      <i class="el-icon-close icon" @click="close"></i>
    </div>
    <div class="content">
      <sub-title title="变更基本信息" high></sub-title>
      <data-form :items="descItems" :form-data="form" :editable="true" label-width="80px">
        <template #billState>
          <bill-state :state="form.billState"></bill-state>
        </template>
      </data-form>
      <sub-title title="变更明细" high></sub-title>
      <div class="body-table">
        <vxe-grid
          :data="bindTableData"
          :custom-config="{ storage: true }"
          :columns="tableColumns"
          height="auto"
          ref="bgxqtable"
        >
          <template #oldValue="{row, column}">
            <span
              v-if="bindView(row)"
              style="color:var(--base-color);cursor: pointer;"
              @click="openView(row, 'old')"
            >{{row[column.field]}}</span>
            <span v-else>{{row[column.field]}}</span>
          </template>
          <template #newValue="{row, column}">
            <span
              v-if="bindView(row)"
              style="color:var(--base-color);cursor: pointer;"
              @click="openView(row, 'new')"
            >{{row[column.field]}}</span>
            <span v-else>{{row[column.field]}}</span>
          </template>
        </vxe-grid>
      </div>
    </div>
    <div class="footer">
      <page-button @click="close">关闭</page-button>
    </div>
    <vxe-modal
      width="58%"
      v-model="visible"
      resize
      :title="modaltitle"
      destroy-on-close
      height="50%"
      :transfer="false"
      @close="visible = false"
    >
      <template v-if="bindColumns.length">
        <vxe-grid
          :id="`tb_gggl_list_qqq`"
          :data="bindList"
          :custom-config="{ storage: true }"
          :columns="bindColumns"
          height="auto"
        >
          <template #slot_required="{column}">
            <span>{{column.title}}</span>
          </template>
          <template #slot_edit_flag="{row, column}">
            <span>{{row[column.field]?'是':'否'}}</span>
          </template>
          <template #slot_edit_input="{row, column}">
            <span>{{row[column.field]}}</span>
          </template>
          <template #expireDate="{row}">
            <span v-if="row.autoRenewalFlag">长期有效</span>
            <span v-else>{{row.expireDate||''}}</span>
          </template>
          <template #fileList="{row}">
            <span class="vxe-cell--label" style="cursor: pointer;">
              <span
                v-for="(item, index) in row.fileList"
                :key="index"
                @click="viewFile(item, row.fileList)"
                style="color:var(--base-color)"
              >
                {{item.originalFileName}}
                <span v-if="index!=row.fileList.length - 1">、</span>
              </span>
            </span>
          </template>
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
          <template #slot_edit_number="{ row, rowIndex, column, }">
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
        </vxe-grid>
      </template>
      <template v-else>
        <div class="file-list">
          <div class="file-list-item" v-for="(item, index) in bindList" :key="index">
            <span
              class="file-list-item-name"
              :title="item.originalFileName"
              @click="onImgClick(item, bindList)"
            >{{ item.originalFileName }}</span>
            <svg-icon
              icon-class="download2"
              size="20"
              fill="var(--base-color)"
              @click="downloadFile(item)"
            />
          </div>
        </div>
      </template>
    </vxe-modal>
    <vue-easy-lightbox
      :visible="previewImg"
      :imgs="imgs"
      :index="previewIndex"
      @hide="previewImg = false"
      ref="lightbox"
    ></vue-easy-lightbox>
  </div>
</template>
<script>
import { previewFile } from "@/utils/utils";
import VueEasyLightbox from "vue-easy-lightbox";
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
export default {
  name: "ChangeRequest",
  props: {
    title: {
      type: String,
      default: "变更记录"
    },
    fileds: {
      type: Array,
      default: () => []
    },
    columnsObj: {
      type: Object,
      default: () => {}
    },
    form: {
      type: Object,
      default: () => {}
    },
    oldForm: {  
      type: Object,
      default: () => {}
    },
    newForm: {
      type: Object,
      default: () => {}
    },
    fieldList: {
      type: Array,
      default: () => []
    }
  },
  components: { VueEasyLightbox },
  computed: {
    bindList() {
      const { changeField, old } = this.fieldObj;
      return old === "old" ? this.oldForm[changeField] : this.newForm[changeField];
    },
    bindColumns() {
      return (this.columnsObj[this.fieldObj.changeField] || []).filter(
        x => x.field != "action"
      );
    },
    bindView() {
      return row => {
        return [
          "bankList",
          "contactList",
          "qualificationsList",
          "authUserFileList",
          "businessLicenseFileList",
          "confirmFileList",
          "detailList",
          "contactRecordsList",
        ].includes(row.changeField);
      };
    },
    bindTableData() {
      const oldRest = {
        bankList: { value: this.oldForm.bankList && this.oldForm.bankList.length ? "查看变更前开户信息" : "" },
        detailList: { value: this.oldForm.detailList && this.oldForm.detailList.length ? "查看变更前产品信息" : "" },
        contactList: { value: this.oldForm.contactList && this.oldForm.contactList.length ? "查看变更前联系人信息" : "" },
        contactRecordsList: { value: this.oldForm.contactRecordsList && this.oldForm.contactRecordsList.length ? "查看变更前联系备忘录" : "" },
        qualificationsList: { value: this.oldForm.qualificationsList && this.oldForm.qualificationsList.length ? "查看变更前企业资质" : "" },
        authUserFileList: { value: this.oldForm.authUserFileList && this.oldForm.authUserFileList.length ? "查看变更前授权人信息-身份证正反面" : "" },
        businessLicenseFileList: { value: this.oldForm.businessLicenseFileList && this.oldForm.businessLicenseFileList.length ? "查看变更前营业执照-附件" : "" },
        confirmFileList: { value: this.oldForm.confirmFileList && this.oldForm.confirmFileList.length ? "查看变更前营业执照-确认函附件" : "" },
        businessLicenseValidityEndDate: {
          value: this.oldForm.businessLicenseAutoRenewalFlag
            ? "长期有效"
            : this.oldForm.businessLicenseValidityEndDate
        },
        confirmValidityEndDate: {
          value: this.oldForm.confirmAutoRenewalFlag
            ? "长期有效"
            : this.oldForm.confirmValidityEndDate
        },
        authUserValidityEndDate: {
          value: this.oldForm.authUserAutoRenewalFlag
            ? "长期有效"
            : this.oldForm.authUserValidityEndDate
        },
        validityEndDate: {
          value: this.oldForm.autoRenewalFlag ? "长期有效" : this.oldForm.validityEndDate
        },
        areaCodeList: { value: this.oldForm.areaCodeListName }
      };
      const newRest = {
        bankList: { value: this.newForm.bankList && this.newForm.bankList.length ? "查看变更后开户信息" : "" },
        detailList: { value: this.newForm.detailList && this.newForm.detailList.length ? "查看变更后产品信息" : "" },
        contactList: { value: this.newForm.contactList && this.newForm.contactList.length ? "查看变更后联系人信息" : "" },
        contactRecordsList: { value: this.newForm.contactRecordsList && this.newForm.contactRecordsList.length ? "查看变更后联系备忘录" : "" },
        qualificationsList: { value: this.newForm.qualificationsList && this.newForm.qualificationsList.length ? "查看变更后企业资质" : "" },
        authUserFileList: { value: this.newForm.authUserFileList && this.newForm.authUserFileList.length ? "查看变更后授权人信息-身份证正反面" : "" },
        businessLicenseFileList: { value: this.newForm.businessLicenseFileList && this.newForm.businessLicenseFileList.length ? "查看变更后营业执照-附件" : "" },
        confirmFileList: { value: this.newForm.confirmFileList && this.newForm.confirmFileList.length ? "查看变更后营业执照-确认函附件" : "" },
        businessLicenseValidityEndDate: {
          value: this.newForm.businessLicenseAutoRenewalFlag
            ? "长期有效"
            : this.newForm.businessLicenseValidityEndDate
        },
        confirmValidityEndDate: {
          value: this.newForm.confirmAutoRenewalFlag
            ? "长期有效"
            : this.newForm.confirmValidityEndDate
        },
        authUserValidityEndDate: {
          value: this.newForm.authUserAutoRenewalFlag
            ? "长期有效"
            : this.newForm.authUserValidityEndDate
        },
        validityEndDate: {
          value: this.newForm.autoRenewalFlag ? "长期有效" : this.newForm.validityEndDate
        },
        areaCodeList: { value: this.newForm.areaCodeListName }
      };
      const list = this.fieldList.reduce((acc, item) => {
        const find = this.fileds.find(i => i.field === item);
        const readValue = (descItem, data) => {
          if(descItem.fieldName) return data[descItem.fieldName];
          return data[descItem.field];
        }
        if (find) {
          if(find.type === 'number' && parseFloat(this.oldForm[item]) === parseFloat(this.newForm[item])) return acc;
          const obj = {
            type: !this.oldForm[item] && this.newForm[item] ? "添加" : this.oldForm[item] && !this.newForm[item] ? "删除" :"修改",
            changeField: item,
            changeFieldName: find?.label,
            oldValue: oldRest[item] ? oldRest[item].value : readValue(find, this.oldForm),
            newValue: newRest[item] ? newRest[item].value : readValue(find, this.newForm)
          };
          acc.push(obj);
        }
        return acc;
      }, []);
      return list;
    }
  },
  data() {
    return {
      descItems: [
        { label: "企业名称", field: "supplierName", type: "", width: "50%" },
        { label: "申请人", field: "createUserName", type: "", width: "50%" },
        { label: "申请时间", field: "submissionTime", type: "", width: "50%" },
        { label: "审核人", field: "auditorName", type: "", width: "50%" },
        { label: "审核状态", field: "billState", type: "", width: "50%", slot: "billState" },
        { label: "审核时间", field: "auditDate", type: "", width: "50%" },
        { label: "审核备注", field: "rejectionReason", type: "", width: "50%" }
      ],
      tableColumns: [
        { title: "变更类型", field: "type", align: "left", width: 100 },
        {
          title: "变更字段",
          field: "changeFieldName",
          align: "left",
          minWidth: 150
        },
        {
          title: "变更旧值",
          field: "oldValue",
          align: "left",
          minWidth: 150,
          slots: { default: "oldValue" }
        },
        {
          title: "变更新值",
          field: "newValue",
          align: "left",
          minWidth: 150,
          slots: { default: "newValue" }
        }
      ],
      modaltitle: "变更记录",
      visible: false,
      fieldObj: {},
      previewImg: false,
      previewIndex: 0,
      imgs: []
    };
  },
  methods: {
    downloadFile(item) {
      const { originalFileName, url } = item;
      const a = document.createElement("a");
      a.style.display = "none";
      a.download = originalFileName;
      a.href = url;
      a.click();
    },
    onImgClick(item, fileList = []) {
      const fileType = file => {
        let fileName = file.fileName ?? "";
        let ext =
          fileName &&
          fileName.split(".")[fileName.split(".").length - 1].toLowerCase();
        return IMG_EXT.includes(ext);
      };
      if (fileType(item)) {
        this.imgs = fileList
          .filter(x => fileType(x))
          .map(i => {
            return {
              alt: i.originalFileName,
              src: i.url,
              title: i.originalFileName
            };
          });
        this.previewImg = true;
        this.$nextTick(() => {
          const { lightbox } = this.$refs;
          const { $el } = lightbox;
          document.body.appendChild($el);
          this.previewIndex = this.imgs.findIndex(x => x.src === item.url);
        });
      }
    },
    viewFile(item, fileList = []) {
      let fileName = item.fileName ?? "";
      let ext =
        fileName &&
        fileName.split(".")[fileName.split(".").length - 1].toLowerCase();
      if (IMG_EXT.includes(ext)) {
        this.onImgClick(item, fileList);
        return;
      }
      previewFile(item.url);
    },
    openView(row, old = "old") {
      this.fieldObj = {
        changeField: row.changeField,
        old
      };
      this.visible = true;
      this.modaltitle = `${old == "old" ? "变更前" : "变更后"}${
        row.changeFieldName
      }`;
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

<style lang="less" scoped>
.body {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border-radius: 50px 0 0 50px;
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid #ebeef5;
    .icon {
      cursor: pointer;
    }
  }
  .footer {
    padding: 15px;
    border-top: 1px solid #ebeef5;
    text-align: right;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 0;
    padding: 0 10px;
    .body-table {
      flex: 1;
      height: 0;
      padding: 10px 0;
    }
  }
}
.file-list {
  width: 90%;

  .file-list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    line-height: 19px;
    border: 1px solid #dcdcdc;
    border-radius: 4px;
    padding: 10px;
    margin-bottom: 10px;
    cursor: pointer;

    &:hover {
      border-color: var(--base-color);
    }

    .file-list-item-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>