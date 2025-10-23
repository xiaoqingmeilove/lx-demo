import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { findMenuByCode } from "@/utils/menu";
import { ApiContract, ApiQuotation, ApiCommon } from "@/apis";
import VXETable from "vxe-table";
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

const apiContract = new ApiContract();
const apiQuotation = new ApiQuotation()
export default {
  name: "contract_contractTemplate_detail",
  components: { Editor, Toolbar },
  async beforeRouteLeave(to, from, next) {
    if (to.name == "login") {
      next();
      return;
    }
    if (this.editState) {
      let state = await this.closePage();
      state ? next() : next(false);
    } else {
      next();
    }
  },
  async beforeRouteUpdate(to, from, next) {
    if (to.name == "login") {
      next();
      return;
    }
    if (this.editState) {
      let state = await this.closePage();
      state ? next() : next(false);
    } else {
      next();
    }
  },
  async beforePageLeave(tab, type) {
    let state = null;
    if (this.editState && !["unload", "leave"].includes(type)) {
      state = await this.closePage();
    }
    return new Promise((resolve, reject) => {
      if (["unload", "leave"].includes(type)) {
        resolve();
      } else {
        if (this.editState) {
          state ? resolve() : reject();
        } else {
          resolve();
        }
      }
    });
  },
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
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      menuCode: "contract_contractTemplate",
      editState: false,
      backForm: {},
      moment,
      descItems: [],
      id: null,
      form: {
        enableFlag: 1,
        content: "",
      },
      formDataShow: {
        lxrxx: true,
        skxx: true,
      },
      rules: {},
      descSourceList: {
        contractTypeList: (dict["contract_type"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        signatureMethodList: (dict["signing_method"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        tagInformationList: (dict["contract_tags"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        fileList: [],
      },
      allBtnControlList: [],
      activeName: 'jbxx',
      editor: null,
      toolbarConfig: {
        excludeKeys: ["fullScreen", "group-video", "emotion"],
      },
      editorConfig: {
        placeholder: "请输入内容...",
        readOnly: true,
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {
            customUpload: this.updateImage,
          },
        },
      }, // 编辑器的配置对象
      mode: "default", // or 'simple'
      billDescItems: [
        { label: "创建人", field: "createUserName", type: "", width: "20%" },
        { label: "单据时间", field: "createTime", type: "", width: "20%" },
        { label: "更新人", field: "updateUserName", type: "", width: "20%" },
        { label: "更新时间", field: "updateTime", type: "", width: "20%" },
      ],
    };
  },
  created() {
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
    }
    this.setColumn();
  },
  mounted() {},
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '合同模板'}详情`;
    if (this.id) {
      this.init();
    }else{
      this.editState = true;
      this.showBtnConfig();
    }
  },
  methods: {
    setStatus(enableFlag) {
      const loading = this.loading(enableFlag ? "启用中..." : "停用中...");
      apiContract.putContractTemplateStatus({ids: this.id, enableFlag}).then(res => {
        if(res.code === 200){
          this.$message.success(res.message || '操作成功');
          this.init();
        }else{
          this.$message.error(res.message || '操作失败');
        }
      }).catch(err=>{
        this.$message.error(err.message || '操作失败');
      }).finally(() => {
        setTimeout(() => {loading.close()}, 1000);
      })
    },
    updateImage(file, insertFn) {
      ApiCommon.uploadFile(file).then(res => {
        if (res.code === 200) {
          const { url } = res.data;
          insertFn(url);
        } else {
          this.$message.error(res.message || '上传失败');
        }
      }).catch(err => {
        this.$message.error(err.message || '上传失败');
      })
    },
    //富文本
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
      this.$nextTick(()=>{
        if (!this.editState) {
          this.editor.disable();
        } else {
          this.editor.enable();
        }
      });
    },
    onInputBlurFormChange(e) {
      if (e && e.item && e.item.fieldName) {
        const find = (this.descSourceList[e.item.source]||[]).find(x=>x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
    },
    async closePage() {
      const res = await VXETable.modal.confirm({
        title: "提示",
        content: "存在修改状态页面，请确认是否保存！",
        mask: true,
        confirmButtonText: "保存",
      });
      if (res === "confirm") {
        // 修改关闭保存
        const flag = await this.validate();
        if(!flag) return false;
        const loading = this.loading('保存中...');
        if (this.editState && this.id) {
          const res = await apiContract.putContractTemplateEdit(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = false;
            this.editor && this.editor.disable();
            this.$message.success(res?.message ?? "保存成功");
            return true;
          } else {
            this.$message.error(res?.message??"修改失败系统异常");
            return false;
          }
        } else {
          const res = await apiContract.postContractTemplateAdd(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = false;
            this.$tabs.close(null,`/contract/contractTemplate-detail/detail/${res.data}`);
            this.$message.success(res?.message??"保存成功");
            return true;
          } else {
            this.$message.error(res?.message??"修改失败系统异常");
            return false;
          }
        }
      }
      if (res === "cancel") {
        if (!this.id) {
          this.$tabs.close();
        } else {
          this.cancel();
        }
        return true;
      }
    },
    cancel() {
      this.editState = false;
      this.form = { ...this.backForm };
      this.editor.disable();     //设置为只读，不可编辑 
    },
    showBtnConfig() {
      apiQuotation.postDetailBtnList(this.menuCode, {param: { id: this.id ?? null }}).then((res) => {
        if (res.code === 200) {
          this.allBtnControlList = res.data ?? [];
        } else {
          this.$message.error(res.message);
        }
      });
    },
    validate(){
      let flag = true;
      for(let key in this.$refs){
        if(key == 'dataForm'){
          this.$refs[key].validate && this.$refs[key].validate(valid=>{
            if (!valid){
              flag = false;
            } 
          })
        }
      }
      if (!flag) {
        this.$message.warning('请填写必填字段');
      }
      return new Promise((resolve, reject) => {
        resolve(flag);
      });
    },
    async editSave(){
      const flag = await this.validate();
      if(!flag) return;
      const loading = this.loading('保存中...');
      apiContract.putContractTemplateEdit(this.form).then(res=>{
        if(res.code === 200){
          this.init();
          this.editState=false;
          this.editor.disable();
          this.$message.success(res?.message || '保存失败');
        }else{
          this.$message.error(res?.message || '保存失败')
        }
      }).catch(err=>{
        this.$message.error(err?.message || '保存失败')
      }).finally(()=>{
        loading.close()
      })
    },
    async addSave(){
      const flag = await this.validate();
      if(!flag) return;
      const loading = this.loading('保存中...');
      apiContract.postContractTemplateAdd(this.form).then(res=>{
        if(res.code === 200 && res.data){
          this.$tabs.close(null,`/contract/contractTemplate-detail/detail/${res.data.id}`);
          this.$message.success(res?.message || '保存失败');
        }else{
          this.$message.error(res?.message || '保存失败')
        }
      }).catch(err=>{
        this.$message.error(err?.message || '保存失败')
      }).finally(()=>{
        loading.close()
      })
    },
    editClick() {
      this.editState = true;
      this.backForm = XEUtils.clone(this.form, true);
      this.editor.enable();   //取消只读， 可编辑
    },
    getDetail() {
      const loading = this.loading('请求中');
      apiContract.getContractTemplateDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.form = res.data || {};
        } else {
          this.$message.error(res.message ?? "获取失败");
        }
      }).catch((err) => {
        this.$message.error(err.message ?? "获取失败");
      }).finally(() => {
        setTimeout(() => {loading.close()}, 1000);
      });
    },
    onFilelistUpdate(file) {
      this.descSourceList.fileList = (file?.fileList??[]).map((item) => {
        return {
          label: item.originalFileName,
          value: item.id + "",
          fileName: item.fileName,
          filePath: item.filePath,
          url: item?.url,
          quotedBillFileId: item?.quotedBillFileId,
        };
      });
    },
    init() {
      this.getDetail();
      this.showBtnConfig();
    },
    async setColumn() {
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, {code: "detailForm",corpCode: this.businessCode ?? "LX"});
      if(resForm.code === 200 && resForm.data){
        this.descItems = resForm.data.detailForm?.columns ?? [];
      }
    },
    onToolOk(e, column) {
      const { type, data } = e
      const fn = this.toolMethods(column)[type]
      fn && fn(data)
    },
    toolMethods(column) {
      return {
        set_column: ({columns}) => {
          this[column] = [...columns]
        }
      }
    },
    loading(text) {
      const loading = this.$loading({
        lock: true,
        text,
        spinner: 'el-icon-loading',
      })
      return loading
    },
  },
  beforeDestroy() {
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时 销毁编辑器
  },
};
