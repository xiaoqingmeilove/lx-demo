import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import XEUtils from "xe-utils";
import { ApiSystem } from '@/apis'

import "@wangeditor/editor/dist/css/style.css";

const apiSystem = new ApiSystem();

function filterTree(tree) {
  return tree.reduce((acc, item) => {
    if ((item.id ?? '') !== '') {
      acc.push({ ...item });
    }
    if (item.children) {
      acc.push(...filterTree(item.children));
    }
    return acc;
  }, []);
}

export default {
  props: {},
  components: { Editor, Toolbar },
  computed: {},
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      selversion: {},
      versionTree: [],

      // 富文本
      editor: null,
      editorConfig: {
        readOnly: true,
        // 所有的菜单配置，都要在 MENU_CONF 属性下
        MENU_CONF: {
          // 配置上传图片
          uploadImage: {},
        },
      }, // 编辑器的配置对象
      mode: "default", 
      editorFlag: true,
    };
  },
  activated() {
    this.getVersion();
  },
  created() {},
  mounted() {},
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor);
      if (!this.editState) {
        this.editor.disable();
      } else {
        this.editor.enable();
      }
    },
    getVersion() {
      const loading = this.$loading('加载中');
      apiSystem.getVersionTree().then(res => {
        if (res.code === 200 && res.data) {
          const list = filterTree(res.data);
          this.versionTree = res.data;
          this.selversion = list.length ? list[0] : {};
          this.$nextTick(()=>{
            if (!!this.selversion) {
              this.$refs.versionTree.setCurrentKey(this.selversion.id);
            }
          })
        } else {
          this.$message.warning(res.message);
        }
      }).catch(err => {
        this.$message.error(err.message);
      }).finally(() => {
        loading.close();
      })

    },
    nodeClick(obj) {
      this.selversion = obj;
      this.editorFlag=false;
      this.$nextTick(()=>{
        this.editorFlag=true;
      })
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
    const editor = this.editor;
    if (editor == null) return;
    editor.destroy(); // 组件销毁时 销毁编辑器
  },
};
