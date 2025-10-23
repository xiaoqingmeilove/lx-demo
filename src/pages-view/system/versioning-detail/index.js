import { descItems } from "./script/data/descltems.js";
import { mapState } from "vuex";
import { ApiSystem, ApiCommon } from "@/apis";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import XEUtils from "xe-utils";
import moment from "moment";
import VXETable from "vxe-table";
import "@wangeditor/editor/dist/css/style.css";

const apiSystem = new ApiSystem();

export default {
  props: {},
  components: { Editor, Toolbar },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      descItems,
      dict,
      id: null,
      activeName: "first",
      editState: true,
      visible: false,
      form: {},
      backForm: {},
      descSourceList: {},
      rules: {},
      attachList: [],
      backAttachList: [],

      // 富文本
      editor: null,
      addEditor: null,
      putEditor: null,
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

      versionList: [],
    };
  },
  activated() {},
  created() {
    let {
      params: { id },
    } = this.$route;
    console.log(this.$route);
    if (id) {
      this.id = id;
      this.editState = false;
      this.$tabs.activeTab.title = "修改版本";
    } else {
      this.$tabs.activeTab.title = "新增版本";
    }
    this.getVersionList();
  },
  mounted() {},
  computed: {
    ...mapState({
      userInfo: (state) => state.User.userInfo ?? {},
    }),
    bindTreeContent () {
      return (item) => {
        const list = this.filterTree(this[item.source]);
        const find = list.find(i => i.id == this.form[item.field]);
        return find ? find.versionNumber : this.form[item.field];
      }
    },
  },
  watch: {
    deep: true,
  },
  methods: {
    updateImage(file, insertFn) {
      ApiCommon
        .uploadFile(file)
        .then((res) => {
          if (res.code === 200) {
            const { url } = res.data;
            insertFn(url);
          } else {
            this.$message.error(res.message || "上传失败");
          }
        })
        .catch((err) => {
          this.$message.error(err.message || "上传失败");
        });
    },
    //富文本
    onAddCreated(editor) {
      this.addEditor = Object.seal(editor);
      if (!this.editState) {
        this.addEditor.disable();
      } else {
        this.addEditor.enable();
      }
    },
    addQuoted() {
      const loading = this.loading('保存中');
      const data = {
        "details": this.form.details,
        "parentId": this.form.parentId||0,
        "releaseType": this.form.releaseType,
        "releaseDate": this.form.releaseDate,
        "versionNumber": this.form.versionNumber,
      };
      apiSystem.putAddVersion(data).then(res=>{
        console.log(res, "res");
        if(res.code === 200){
          this.$message.success(res.message);
          this.$tabs.close(null, `/system/versioning-detail/detail/${res.data}`);
        }else{
          this.$message.warning(res.message);
        }
      }).catch(err=>{
        this.$message.error(err.message)
      }).finally(()=>{
        loading.close();
      })
    },
    editQuoted() {
      const loading = this.loading('保存中');
      const data = {
        "id": this.form.id,
        "details": this.form.details,
        "parentId": this.form.parentId||0,
        "releaseType": this.form.releaseType,
        "releaseDate": this.form.releaseDate,
        "versionNumber": this.form.versionNumber,
      };
      apiSystem.putEditVersion(data).then(res=>{
        if(res.code === 200){
          this.$message.success(res.message);
          this.getVersionList();
          this.editState = false;
          this.addEditor.disable();
        }else{
          this.$message.warning(res.message);
        }
      }).catch(err=>{
        this.$message.error(err.message)
      }).finally(()=>{
        loading.close();
      })
    },
    submit(state) {
      // 保存
      if (state === 1) {
        //新增
        this.addQuoted();
      } else if (state === 2) {
        //修改保存
        this.editQuoted();
      }
    },
    // 修改
    editForm() {
      this.backForm = XEUtils.clone(this.form, true);
      this.editState = true;
      this.addEditor.enable();
    },
    // 取消
    cancel() {
      this.editState = false;
      this.form = { ...this.backForm };
      this.addEditor.disable();
    },
    getVersionList(){
      const loading = this.loading("加载中")
      apiSystem.getVersionTree().then(res => {
        if(res.code == 200 && res.data){
          this.versionList = res.data;
          const list = this.filterTree(res.data);
          const find = list.find(x=>x.id == this.id);
          if(!!find){
            this.form = {...find, parentId: find.parentId==0?"":find.parentId};
          }
        }else{
          this.$message.error(res.message);
        }
      }).catch((err) => {
        this.$message.error(err.message||"获取一览表异常");
      }).finally(() => {
        loading.close()
      });
    },
    filterTree(tree) {
      return tree.reduce((acc, item) => {
        if ((item.id ?? '') !== '') {
          acc.push({ ...item });
        }
        if (item.children) {
          acc.push(...this.filterTree(item.children));
        }
        return acc;
      }, []);
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
  },
  beforeDestroy() {
    const editor = this.addEditor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时 销毁编辑器
  },
};
