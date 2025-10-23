import XEUtils from "xe-utils";
import moment from "moment";
import VXETable from "vxe-table";
import { mapState } from "vuex";
import { ApiQuotation, ApiBasic } from "@/apis";
import { MaximizeTable, handleStorageColumns } from "@/utils/vxe-table";
const apiQuotation = new ApiQuotation();
const apiBasic = new ApiBasic();
let maximizeTable = null;
function filterTree(tree) {
  return tree.reduce((acc, item) => {
    if ((item.value ?? '') !== '') {
      acc.push({ ...item });
    }
    if (item.children) {
      acc.push(...filterTree(item.children));
    }
    return acc;
  }, []);
}
export default {
  components: {},
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    bindTreeContent() {
      return (item) => {
        const val = this.form[item.field];
        const sourceList = this.descSourceList[item.source] ?? [];
        const list = filterTree(sourceList);
        const find = list.find(i => i.value == val);
        return find ? find.label : val;
      }
    },
    previewSrcList() {
      return (fileList) => {
        return fileList.map(item => {
          return '/' + item.url
        });
      }
    },
    bindDescItems(){
      if(this.id) return this.descItems3;
      return this.descItems1;
    }
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      menuCode: "material_detail",
      id: null,
      activeName: 'jbxx',
      editState: false,
      form: {
        qtyAccuracy: 4,
        priceAccuracy: 4,
      },
      backForm: {},
      fileBillTpye: "MC",
      formDataShow: {
        xjqd: true,
        fjcz: true,
      },
      columns: [],
      rulesobj: {
        materialTypeId: [{ required: true, message: '请选择物料分类', trigger: 'blur' },],
        materialCode: [{ required: true, message: '请填写物料代码', trigger: 'blur' },],
        materialName: [{ required: true, message: '请填写物料名称', trigger: 'blur' },],
        model: [{ required: true, message: '请填写型号', trigger: 'blur' },],
        standard: [{ required: true, message: '请填写规格', trigger: 'blur' },],
        unit: [{ required: true, message: '请选择基本计量单位', trigger: 'blur' },],
        purchaseUnit: [{ required: true, message: '请选择采购计量单位', trigger: 'blur' },],
      },
      descItems: [],
      descItems1: [],
      descItems2: [],
      descItems3: [],
      descSourceList: {
        unitList: (dict['unit']||[]).map(x=>{
          return { label: x.dictLabel, value: x.dictValue }
        }),
        voltageLevelList: (dict['voltage_level_data']||[]).map(x=>{
          return { label: x.dictLabel, value: x.dictLabel }
        }),
        purchaseTypeList: (dict['purchase_type']||[]).map(x=>{
          return { label: x.dictLabel, value: x.dictValue }
        }),
        materialTypeList: [],
        YesorNoList: [
          { label: "是", value: 1 },
          { label: "否", value: 0 },
        ],
        fileList: [],
      },
      formDataShow: {
        wlfl: true,
        jbxx: true,
        tzxx: true,
      }
    };
  },
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
  created() {
    this.setColumn();
    this.getSelectList();
  },
  mounted() { },
  activated() {
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = params.id;
      this.init();
    } else {
      this.editState = true
    }

  },
  methods: {
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
        if (this.id) {
          const res = await apiBasic.editMaterialInfoApi(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = false;
            this.$message.success(res?.message ?? "提交成功");
            return true;
          } else {
            this.$message.error(res?.message??"提交失败");
            return false;
          }
        } else {
          const res = await apiBasic.saveMaterialInfoApi(this.form);
          loading.close();
          if (res.code === 200) {
            this.editState = false;
            this.$tabs.close(null,`/material/material-content/detail/${res.data.id}`);
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
    editForm() {
      this.backForm = XEUtils.clone(this.form, true);
      this.editState = true;
    },
    cancel() {
      this.form = { ...this.backForm };
      this.editState = false;
    },
    delFile(filed, index) {
      let fileList = XEUtils.clone(this.form[filed] || []);
      fileList.splice(index, 1);
      this.form[filed] = [...fileList];
    },
    onUploadLogoSuccess(e, field) {
      let fileList = this.form[field] || [];
      this.$set(this.form, field, fileList.concat(e));
    },
    onInputBlurFormChange(e) {
      if(e && e.item && e.item.field === 'materialTypeId'){
        const find = filterTree(this.descSourceList[e.item.source]||[]).find(x=>x.id === this.form[e.item.field])
        this.$set(this.form, 'materialTypeName', find?.name ?? '');
        this.$set(this.form, 'materialTypeCode', find?.code?? '');
      }
      if(e && e.item && e.item.fieldName){
        const find = (this.descSourceList[e.item.source]||[]).find(x=>x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
    },
    onFilelistUpdate(file) {
      this.descSourceList.fileList = file.fileList.map((item) => {
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
      this.getData();
    },
    // 获取基础数据
    async getData() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      const res = await apiBasic.getMaterialInfoApi({ id: this.id });
      if (res.code === 200 && res.data) {
        this.form = { ...res.data };
      } else {
        this.$message.error(res.message);
      }
      loading.close();
    },
    treeFormat(arr, originArr){
      const list = filterTree(originArr ?? arr);
      arr.forEach(i=>{
        const find = list.find(x=> i.parentId && x.id == i.parentId);
        // i.label = i.parentId && find && find.label ? find.label + '/' + i?.name : i?.name;
        i.label = `${i.code?i.code + ' - ':''}` + i.name;
        i.value = i.id;
        if (i.children && i.children.length){
          this.treeFormat(i.children, originArr ?? arr)
        }
      })
      return arr
    },
    // 获取一览表
    getSelectList() {
      apiBasic.getMaterialListApi().then((res) => {
        if (res.code === 200 && res.data) {
          let descSourceList = { ...this.descSourceList };
          descSourceList.materialTypeList = this.treeFormat(res.data)
          this.descSourceList = { ...descSourceList };
        }
      });
    },
    validate(){
      let flag = true;
      for(let key in this.$refs){
        if(['dataForm','dataForm1','dataForm2'].includes(key)){
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
    // 保存
    async submit() {
      //修改保存
      const valid = await this.validate();
      if(!valid) return;
      if (this.id) {
        this.editQuotedYes();
      } else {
        this.editQuoted();
      }
    },
    async editQuoted() {
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      let data = {
        ...this.form,
      }
      const res = await apiBasic.saveMaterialInfoApi(data);
      loading.close();
      if (res.code === 200) {
        this.$message.success("保存成功");
        this.id = res.data.id
        this.$tabs.close(null,`/material/material-content/detail/${res.data.id}`);
      } else {
        this.$message.error(res.message, "修改失败系统异常");
      }
    },
    async editQuotedYes() {
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      let data = {
        ...this.form,
      }
      const res = await apiBasic.editMaterialInfoApi(data);
      loading.close();
      if (res.code === 200) {
        this.$message.success("修改成功");
        this.editState = false
        this.init();
      } else {
        this.$message.error(res.message, "修改失败系统异常");
      }
    },
    async setColumn() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      let dataForm = {
        code: "detailForm,detailForm1,detailForm2,detailForm3",
        corpCode: this.businessCode ?? "LX",
      };
      const resform = await apiQuotation.getFormsConfigMulti(
        this.menuCode,
        dataForm
      );
      if (resform.code === 200 && resform.data) {
        this.descItems = resform.data.detailForm?.columns ?? [];
        this.descItems1 = resform.data.detailForm1?.columns ?? [];
        this.descItems2 = resform.data.detailForm2?.columns ?? [];
        this.descItems3 = resform.data.detailForm3?.columns ?? [];
      }
      loading.close();
    },
    initTableConfig() {
      const { table, toolbar } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable();
      }

      this.defaultColumns = XEUtils.clone(this.columns, true);
      // maximizeTable = new MaximizeTable(this.$refs.tableSection.$el);
    },
    initTable() {
      const { table } = this.$refs;
      const tableColumns = this.columns.map((item) => {
        const { params = {} } = item;
        if (item.params && params.hasOwnProperty("displayDigits")) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits);
          };
        }
        return item;
      });
      this.columns = handleStorageColumns(tableColumns, table.id);
    },
    onToolOk(e) {
      const { type, data } = e;
      const fn = this.toolMethods()[type];
      fn && fn(data);
    },
    toolMethods() {
      return {
        maximize: (data) => {
          const { maximize } = data;
          if (maximize) {
            maximizeTable.maximize();
          } else {
            maximizeTable.restoreTable();
          }
        },
        set_column: ({ columns }) => {
          this.columns = columns;
        },
      };
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
};
