<template>
  <vxe-modal v-model="visible" width="700" title="新建问题" resize @close="onCancel">
    <template #default>
      <el-form label-position="top" :model="form" :rules="rules" ref="form" style="padding: 0 20px;">
        <el-form-item label="问题标题"  prop="title">
          <el-input v-model="form.title" placeholder="请输入问题标题" clearable  size="small"></el-input>
        </el-form-item>
        <el-form-item label="问题分类" prop="questionType">
          <el-select v-model="form.questionType" placeholder="请选择问题分类" clearable size="small" style="width: 100%;">
            <el-option
              v-for="item in descSourceList.questionTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述" prop="content">
          <el-input v-model="form.content" :rows="5" type="textarea" placeholder="请详细描述您的问题" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <template slot="label">附件上传<span style="font-size: 12px;">（支持jpg、png、pdf、docx格式，且不超过5MB）</span></template>
          <el-upload
            class="upload-demo"
            action="/api/file/notAuthFile/upload"
            multiple
            :limit="5"
            :file-list="fileList"
            :on-change="handleChange"
            :on-remove="handleRemove"
          >
            <el-button size="small" type="primary">点击上传附件</el-button>
            <!-- <div slot="tip" class="el-upload__tip">支持jpg、png、pdf、docx格式，且不超过5MB</div> -->
          </el-upload>
        </el-form-item>

      </el-form>
      <div class="view-footer">
        <page-button @click="onSubmit">确定</page-button>
        <page-button @click="onCancel">取消</page-button>
      </div>
    </template>
  </vxe-modal>
</template>
<script>
import { mapState } from "vuex";
import { ApiBiddingManagement } from "@/apis";

const apiBiddingManagement = new ApiBiddingManagement();
export default {
  name: 'answeringQuestion',
  components: {},
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),

  },
  props: {
    id: {
      type: [String, Number],
      default: null,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  watch: {

  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      form: {
        title: '',
        questionType: '',
        content: '',
      },
      fileList: [],
      rules: {
        title: [
          { required: true, message: '请输入问题标题', trigger: 'blur' },
        ],
        questionType: [
          { required: true, message: '请选择问题分类', trigger: 'change' }
        ],
        
      },
      descSourceList: {
        questionTypeList: (dict["tender_question_type"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }), //问题分类
      },
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

    },
    handleChange(file, fileList){
      console.log(file, fileList, "handleChange-file");
      this.fileList = fileList;
    },
    handleSuccessFile( file, fileList) {
      console.log(file, fileList, "handleSuccessFile-file");
      // this.fileList = fileList.filters(item => item.response.code == '200').map((item) => item.response.data);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList, "handleRemove-file");
      this.fileList = fileList;
    },
    onSubmit() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          console.log("submit!",  this.form);
          await this.addQuestionApi()
          this.$emit("ok", this.form);
          this.restData()

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    async addQuestionApi() { 
      const loading = this.$loading({
        lock: true,
        text: "提交中",
        spinner: "el-icon-loading",
      });
      const params = { 
        ...this.form,
        questionTypeName: this.descSourceList.questionTypeList.find(item => item.value === this.form.questionType)?.label??'',
        masterId: this.id,
        fileList: this.fileList.map(item => item.response.data)
      }
      console.log("params", params);
      const res = await apiBiddingManagement.postAddAnswer(params)
      if (res.code === 200) { 
        this.$message.success("提交成功")
      } else {
        this.$message.error(res.message)
      }
      loading.close();
    },
    restData() {
      this.form = {
        title: '',
        questionType: '',
        content: '',
      }
      this.fileList = []
    },
    onCancel() { 
      this.$emit("close");
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
  }
}
</script>
<style scoped lang="less">
// /deep/ .el-form-item{
//   margin-bottom: 0;
// }
/deep/.el-form--label-top .el-form-item__label {
  padding: 0;
}
</style>