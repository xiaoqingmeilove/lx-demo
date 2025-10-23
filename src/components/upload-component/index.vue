<template>
  <div class="upload">
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      :limit="limit"
      :multiple="multiple"
      :accept="accept"
      :show-file-list="false"
      :on-change="handleChange"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <page-button>{{ bntText }}</page-button>
      <div slot="tip">
        <slot name="tip"></slot>
      </div>
    </el-upload>
    <!-- 文件列表 -->
    <div class="fileWarp">
      <div v-for="(item, index) in fileList" :key="index" class="fileItem">
        <i class="el-icon-document"></i>
        <span>{{ item.name }}</span>
        <i class="icon">
          <i class="el-icon-close" @click="handleRemove(item, fileList)"></i>
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑文件名"
            placement="top-start"
          >
            <i class="el-icon-edit" @click="editFile(item)"></i>
          </el-tooltip>
        </i>
      </div>
    </div>
    <!-- 修改文件弹出框 -->
    <modal
      title="编辑文件名"
      :visible.sync="dialogVisible"
      width="30%"
      @ok="submit"
      @cancel="handleClose"
      @close="handleClose"
    >
      <el-form
        :model="editFileObj"
        ref="fileForm"
        label-width="80px"
        class="inp"
      >
        <el-form-item
          label="文件名称"
          prop="name"
          :rules="[{ required: true, message: '文件名不能为空' }]"
        >
          <el-input
            v-model="fileName"
            placeholder="请编辑文件名"
            size="small"
          ></el-input>
        </el-form-item>
      </el-form> 
    </modal>
  </div>
</template>

<script>  
/**
 * 基本参数
 * 
 * bntText        按钮文本
 * limit          最大上传数量
 * accept         上传文件类型
 * multiple       是否支持多选
 * 
 * 事件名称
 * 
 * change         添加文件时的回调
 * remove         删除回调
 */
export default {
  name: "uploadComponent",
  props: { 
    uploadUrl: {
      type: String,
      default: '',
    },
    bntText: {
      type: String,
      default: "点击上传",
    },
    limit: {
      type: Number,
      default: null,
    },
    accept: {
      type: String,
      default: "*",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  created() {},
  data() {
    return {
      fileList: [],
      dialogVisible: false,
      editFileObj: null,
      fileName: null,
    };
  },
  methods: {
    // 点击已上传文件列表触发编辑
    editFile(file) {
      console.log(file, "editFile");
      this.dialogVisible = true;
      this.fileName = file.name;
      this.editFileObj = { ...file };
    },
    // 文件名修改保存
    submit() {
      let file = { ...this.editFileObj };
      file.name = this.fileName;
      let findIndex = this.fileList.findIndex(
        (x) => x.name === this.editFileObj.name
      );
      this.fileList.splice(findIndex, 1, file);
      this.dialogVisible = false;
      this.$emit("change", file, findIndex, this.fileList);
    },
    // 关闭弹框
    handleClose() {
      this.dialogVisible = false;
    },
    // 文件上传
    handleChange(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.$emit("change", file, this.fileList);
    },
    // 上传文件之前
    beforeUpload(file) {
      // 获取文件的扩展名
      const fileSuffix = file.name.substring(file.name.lastIndexOf("."));
      const whiteList = [...this.accept.split(",")];

      // 判断上传类型是否正确
      if (this.accept !== "" && whiteList.indexOf(fileSuffix) === -1) {
        this.$message.warning("暂不支持此类型的文件上传");
        return false;
      }
    },

    // 文件删除
    handleRemove(file, fileList) {
      let findIndex = this.fileList.findIndex(
        (x) => x.name === this.editFileObj.name
      );
      fileList = fileList.filter((item) => item.name !== file.name);
      this.fileList = fileList;
      this.$emit("remove", file, findIndex, fileList);
    },
    // 文件上传超过上传数量
    handleExceed(files, fileList) {
      this.$message.warning(`最多上传 ${this.limit} 个文件`);
    },
  },
  
   
};
</script>

<style lang="less" scoped>
/deep/ .el-upload-list {
  min-width: 300px;
}
.fileWarp {
  min-width: 300px;
  margin-top: 15px;
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  .fileItem {
    width: 100%;
    padding: 5px;
    &:hover {
      cursor: pointer;
      background-color: #f5f7fa;
      span {
        color: #409eff; 
          
      }
    }
    span {
      margin-left: 5px;
    }
    .icon {
      font-size: 14px;
      float: right;
      i:nth-last-of-type(1) {
        color: #409eff; 
        padding-left: 5px; 
      }
    }
  }
}
.inp { 
  /deep/ .el-input {
    width: 80%;
  }
}
.dialog-footer {
  margin: 30px 0 15px;
}
/deep/ .el-dialog__header {
  border-bottom: 1px solid #e0e0e0;
}
/deep/ .el-dialog__body {
  padding: 20px;
}
/deep/ .el-input__inner:focus {
  border-color: #e1e3e7;
}
/deep/ .el-form-item__label {
  text-align: left;
  font-size: 13px;
  font-weight: normal;
}
/deep/ .el-form-item{
  margin-bottom: 0;
}
</style>