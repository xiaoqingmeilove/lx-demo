<template>
  <el-dialog
    width="500px"
    custom-class="dialog-body"
    :destroy-on-close="true"
    :visible.sync="modalVisible"
    :before-close="cancel"
    :append-to-body="true"
    :modal-append-to-body="false"
  >
    <div class="body">
      <el-checkbox-group v-model="checkList" @change="checkboxChange">
        <el-checkbox v-for="(item, index) in list" :key="index" :label="item">
          <div style="flex: 1; padding: 0 10px">
            <div style="font-size: 14px; color: #595959; font-weight: 700">
              <span style="margin-right: 20px">{{ item.name }}</span>
              <span>{{ item.tel }}</span>
            </div>
            <div
              :title="item.deliveryAddress"
              style="
                font-size: 12px;
                color: #a4a4a4;
                font-weight: 400;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                word-break: break-all;
                white-space: normal;
              "
            >
              {{ item.areaCodeListName }} {{ item.deliveryAddress }}
            </div>
          </div>

          <!-- <page-button
            v-if="item.defaultFlag"
            content="默认"
            theme="primary"
            disabled
            size="small"
          ></page-button> -->
          <div class="defaultBtn" v-if="item.defaultFlag">默认</div>
        </el-checkbox>
      </el-checkbox-group>
    </div>
    <footer>
      <page-button @click="submit" :disabled="checkList.length == 0"
        >确定</page-button
      >
      <page-button @click="cancel"  theme="default" >取消</page-button>
    </footer>
    <template #title>
      <div style="font-size: 16px; color: #595959; font-weight: 700">
        选择收货地址
      </div>
    </template>
  </el-dialog>
  <!-- <header>选择收货地址</header> -->
</template>
<script>
export default {
  name: "selectAddress",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      checkList: [],
      modalVisible: false,
    };
  },
  watch: {
    visible(newVal) {
      this.modalVisible = newVal;
    },
  },
  computed: {},
  created() {
    this.modalVisible = this.visible;
  },
  methods: {
    checkboxChange(e) {},
    submit() {
      //
      this.$emit("submit", this.checkList);
      this.checkList = [];
    },
    cancel() {
      this.$emit("cancel");
      this.checkList = [];
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-dialog {
  max-height: 500px;
  display: flex;
  flex-direction: column;
  .el-dialog__body {
    padding: 15px !important;
    height: 0;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}
.el-dialog {
 
  .body {
    height: 0;
    flex: 1;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    .el-checkbox-group{
      height: 100%;
      overflow: hidden;
      overflow-y: auto;
    }
    .el-checkbox {
      width: 100%;
      display: flex;
      flex-direction: initial;
      align-items: center;
      border: 1px solid #d2d2d2;
      margin-bottom: 10px;
      padding: 10px;
      border-radius: 5px;
      /deep/.is-focus{
      border-color: var(--base-color);
      .el-checkbox__inner {
        border-color: var(--base-color);        
      }
    }
    /deep/.el-checkbox__inner:hover {
    border-color:var(--base-color);
}
      /deep/.el-checkbox__inner {
        border-radius: 50%;
        background-color: #fafafa;
      }
      /deep/.el-checkbox__label {
        flex: 1;
        display: flex;
        align-items: center;
        margin-left: 15px;
      }
    }
    .defaultBtn {
      font-size: 10px;
      height: 16px;
      line-height: 16px;
      color: var(--base-color);
      border-radius: 4px;
      border: 1px solid var(--base-color);
      // background-color: #b6dcff;
    }
   
    .is-checked {
      background-color: #fafafa;
      /deep/.el-checkbox__inner {
        background-color: var(--base-color);
        border-color: var(--base-color);
        color: var(--base-color);
        
      }
      /deep/.el-checkbox__label {
        color: #606266;
      }
      
    }
    
  }

  footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
