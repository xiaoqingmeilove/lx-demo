<template>
  <div class="leading">
    <modal
      title="批量导入"
      :visible.sync="dialogVisible"
      width="30%"
      @ok="ok"
      @cancel="onCancel"
      @close="handleClose"
    >
      <el-upload
        class="upload-demo"
        ref="upload"
        accept=".xls,.xlsx"
        :action="uploadUrl"
        :on-change="handleClick"
        :show-file-list="false"
        :auto-upload="false"
      >
        <!-- 导入的excel表格  -->
        <div class="file">
          <span>选择文件：</span>
          <el-input v-model="fileName" size="small" class="fileInp"></el-input>
        </div>
      </el-upload>
      <div class="infoWarp">
        <el-checkbox
          v-model="isChecked"
          @change="isCheckedChange"
          class="checked"
        ></el-checkbox>
        <span>同时生成用户信息</span>
      </div>
      <template #footer-title>
        <div class="download" @click="downloadTemp">
          点击下载
          <page-button type="text">《{{ downloadTempTitle }}》 </page-button>
        </div>
      </template> 
    </modal>
  </div>
</template>

<script>
/**
 * 基本参数
 * 
 * uploadUrl                  上传路径
 * downloadTempTitle          下载模板名称
 * 
 * 
 * 事件名称
 * 
 * download                   点击下载模板时的回调
 * ok                         确定按钮回调                                                                           
 * cancel                     取消按钮回调
 * close                      关闭回调
 */
import XLSX from "xlsx";
export default {
  name: "leadingComponent",
  props: {
    uploadUrl: {
      type: String,
      default: "",
    },
    downloadTempTitle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      dialogVisible: false,
      fileName: null,
      isChecked: false,
      fileData: null,
      file: null,
    };
  },
  created() {
    this.dialogVisible = true;
  },
  methods: {
    // 下载模板
    downloadTemp() {
      this.$emit("download");
    },
    // 选择框变化
    isCheckedChange() {
      this.$emit('checkChange', this.isChecked);
    },
    ok() {
      // 将数据传给父组件
      this.$emit("ok", this.file, this.fileData);
    },
    onCancel() {
      this.$emit("cancel");
    },
    handleClose() {
      this.dialogVisible = false;
      this.$emit("handleClose");
    },

    handleClick(file, fileList) {
      console.log(file, fileList, "file");
      this.file = file;
      let files = { 0: file.raw }; // 取到File
      this.readExcel(files);
    },
    readExcel(files) {
      // 表格导入
      console.log(files, "表格导入");
      if (files.length <= 0) {
        // 没有文件
        console.log(files, "没有文件");
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        // 文件格式不对
        console.log(files, "文件格式不对");
        this.$message.error(`上传格式不正确，请上传${this.accept}格式`);
        return false;
      } else {
        // 更新文件名称
        console.log(files, "更新文件名称");
        this.fileName = files[0].name;
      }
      console.log(files, "FileReader");
      const fileReader = new FileReader();

      fileReader.onload = (event) => {
        try {
          const result = event.target.result;
          // 以二进制流方式读取得到整份excel表格对象
          const workbook = XLSX.read(result, {
            type: "binary",
          });

          const wsname = workbook.SheetNames[0]; // 取第一张表
          const data = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // 生成表格内容 json
          this.fileData = [...data];
          // 重写数据
          this.$refs.upload.value = "";
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
  },
};
</script>

<style lang="less" scoped>
.leading {
  position: relative;
  margin-bottom: 15px;
  .infoWarp {
    display: flex;
    align-items: center;
    padding-top: 20px;
    .checked {
      margin-right: 10px;
    }
  }
  .download { 
    font-size: 12px;
    color: #a2a2a2;
    span {
      cursor: pointer;
    }
  }
}

/deep/ .el-upload {
  width: 100%;
  .file {
    display: flex;
    align-items: center;
    width: 100%;
    .fileInp {
      width: 80%;
      .el-input__inner {
        font-size: 14px;
        color: #bbbbbb;
      }
    }
    span{
      margin-right: 10px;
    }
  }
} 
/deep/ .el-input__inner:focus {
  border-color: #e1e3e7;
}
/deep/ .el-upload:focus {
  color: inherit;
}
</style>