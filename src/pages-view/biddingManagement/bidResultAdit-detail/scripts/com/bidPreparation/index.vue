<!--
 * @Author: wmm
 * @Date: 2025-07-18 10:01:25
 * @LastEditors: wmm
 * @LastEditTime: 2025-08-08 13:59:00
-->
<template>
  <div>
    <!-- <sub-title title="标书编制">
      <template #beforeIcon>
        <i :class="formDataShow.bsbz ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
          @click="formDataShow.bsbz = !formDataShow.bsbz"></i>
      </template>
      <template #buttons>
       
      </template>
    </sub-title> -->
    <data-form 
      v-show="formDataShow.bsbz"
      :items="descItems"
      :form-data="formData"
      :source-list="descSourceList"
      ref="dataForm"
    >
    </data-form>
    <sub-title title="商务标附件">
      <template #beforeIcon>
        <i :class="formDataShow.swbfj ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.swbfj = !formDataShow.swbfj"></i>
      </template>
    </sub-title>
    <div class="file-list" v-show="formDataShow.swbfj">
      <FilelistList
        v-bind="$attrs"
        v-on="$listeners"
        :readOnly="!editState"
        :showEditName="false"
        :file-list="businessFileList"
        @event:upload="onEventUpload($event, 'businessFileList')"
        @event:delete-file="onEventDeleteFile($event, 'businessFileList')"
        manual
      >
        <template #buttons>
          <slot name="buttons"></slot>
        </template>
        <template #operations="data">
          <slot name="operations" v-bind="{ ...data }"></slot>
        </template>
      </FilelistList>
    </div>
    <sub-title title="技术标附件" v-if="formData.bidScope != 'tenderBusinessExpert'">
      <template #beforeIcon>
        <i :class="formDataShow.jsbfj ? 'el-icon-caret-bottom' : 'el-icon-caret-right' " @click="formDataShow.jsbfj = !formDataShow.jsbfj"></i>
      </template>
    </sub-title>
    <div class="file-list" v-if="formData.bidScope != 'tenderBusinessExpert'" v-show="formDataShow.jsbfj">
      <FilelistList
        v-bind="$attrs"
        v-on="$listeners"
        :readOnly="!editState"
        :showEditName="false"
        :file-list="technicalFileList"
        @event:upload="onEventUpload($event, 'technicalFileList')"
        @event:delete-file="onEventDeleteFile($event, 'technicalFileList')"
        manual
      >
        <template #buttons>
          <slot name="buttons"></slot>
        </template>
        <template #operations="data">
          <slot name="operations" v-bind="{ ...data }"></slot>
        </template>
      </FilelistList>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { ApiBiddingManagement } from "@/apis";
import FilelistList from "@/Controls/filelist-list/index.vue";

const apiBiddingManagement = new ApiBiddingManagement();
export default {
  name: 'bidPreparation',
  components: { FilelistList },
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    showBtn() {
      return (name) => {
        let find = this.allBtnControlList?.find((x) => x.btnCode == name);
        return find ?? false;
      };
    }
  },
  props: {
    formData: {
      type: Object
    },
    editState: {
      type: Boolean,
      default: false
    },
    pBusinessFileList: {
      type: Array
    },
    pTechnicalFileList: {
      type: Array
    },
  },
  watch: {
    pBusinessFileList(newVal) {
      this.businessFileList = newVal;
    },
    pTechnicalFileList(newVal) {
      this.technicalFileList = newVal;
    }
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      allBtnControlList: [],
      technicalFileList: [],
      businessFileList: [],
      // editState: false,
      form: {},
      descItems: [
        {
          "label": "招标范围",
          "field": "bidScope",
          "fieldName": "bidScopeName",
          "required": true,
          "type": "selectinput",
          "source": "bidScopeList",
          "width": "33%"
        }
      ],
      descSourceList: {
        bidScopeList: (dict["tender_bid_scope"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }), //招标范围
      },
      formDataShow: {
        bsbz: true,
        swbfj: true,
        jsbfj: true
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.technicalFileList = this.formData.technicalFileList
      this.businessFileList = this.formData.businessFileList
      console.log(this.businessFileList)
    },
    showBtnConfig() {
      let data = {
        param: {
            id: this.id ?? null,
        },
      };
      apiQuotation.postDetailBtnList(this.menuCode, data).then((res) => {
          if (res.code === 200) {
              this.allBtnControlList = res.data ?? [];
          } else {
              this.$message.error(res.message);
          }
      });
  },
    editClick() {
      this.editState = true;
    },
    cancel() {
      this.editState = false;
    }, 
    onEventUpload({ files, groupId, next }, target) {
      this[target].push(files[0]);
    },
    onEventDeleteFile({ item, index, next }, target) {
      this[target].splice(index, 1);
    },
    // 加载组件功能
    loading(text) {
      const loading = this.$loading({
        lock: true,
        text,
        spinner: "el-icon-loading",
      });
      return loading;
    },
    /**
     * @description: 标书保存
     * @param {type}
     * @return {type}
     */
    async editSave() {
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      const params = { 
        id: this.formData.id,
        technicalFileList: this.technicalFileList,
        businessFileList: this.businessFileList
      };

      await apiBiddingManagement.putDocEdit(params).then((res) => {
        if (res.code === 200) {
          this.$message.success("保存成功");
        } else {
          this.$message.error(res.message);
        }
      }).finally(() => {
          loading.close();
      });
    },
    /**
     * @description: 标书提交
     * @param {type}
     * @return {type}
     */
    async editSubmit() {
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
      });
      const params = { 
        id: this.formData.id
      };
      await apiBiddingManagement.putDocSubmit(params).then((res) => {
        if (res.code === 200) {
            this.$message.success("提交成功");
            this.init();
        } else {
            this.$message.error(res.message);
        }
      }).finally(() => {
          loading.close();
      });
    }

  }
}
</script>
<style scoped lang="less"></style>