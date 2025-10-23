import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiBasic, ApiSystem } from "@/apis";
import {  handleStorageColumns } from "@/utils/vxe-table";
import { VXETable } from "vxe-table";
const apiQuotation = new ApiQuotation();
const apiBasic = new ApiBasic();
const apiSystem = new ApiSystem();
export default {
  components: {},
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    previewSrcList(){
      return (fileList) => {
        return fileList.map(item => {
          return '/'+ item.url
        });
      }
    }
  },
  data() {
    return {
      menuCode:"material_list",
      editState: false,
      form: {},
      descItems: [],
      rules: {
        name: [{ required: true, message: "请输入物料分类名称", trigger: "blur" },],
        code: [{ required: true, message: "请输入物料分类编码", trigger: "blur" },],
      },
      sourceList: {
        flagList: [{label: '启用',value:0}, {label: '停用',value:1}],
        YesorNoList:[
          { label: "是", value: 1 },
          { label: "否", value: 0 },
        ],
        principalUserList: [],
        materialTree: [],
      },
      columns: [],
      defaultColumns: [],
      tableColumns: [],
      searchOptions: [],
      condition:{},
      tableData:[],
      pagination: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize")
          ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20
          : 20,
        total: 0,
        showTotal: () => `共${this.pagination.total}条`,
      }, // 一览表分页配置
      filterText: '',
      defaultExpandedKeys: [],
      materialTree: [],
      backMaterialTree: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      draggable: false,
      dataGather: [
        {
          config: [
            { label: '负责人', field: 'principalUserId', type: 'selectinput', source: 'principalUserList' },
          ]
        },
      ],
      statusDataGather: [
        {
          config: [
            { label: '启用状态', field: 'status', type: 'radio', source: 'flagList' },
          ]
        },
      ],
      addDataGather: [
        {
          config: [
            { label: '物料分类代码', field: 'code', type: 'input' },
            { label: '负责分类名称', field: 'name', type: 'input' },
            { label: '负责人', field: 'principalUserId', type: 'selectinput', source: 'principalUserList' },
            { label: '启用状态', field: 'status', type: 'radio', source: 'flagList' },
            { label: '上级分类', field: 'parentId', type: 'selecttree', source: 'materialTree' },
          ]
        },
      ],
      addVisible: false,
      statusVisible: false,
      principalUserVisible: false,
      addForm: {status: 0, parentId: null},
      principalUserForm: {},
      statusForm: {status: 0},
      principalUserRules: {
        principalUserId: [{ required: true, message: "请选择负责人", trigger: "change" },],
      },
      statusRules: {
        status: [{ required: true, message: "请选择状态", trigger: "change" },],
      },
      addRules: {
        name: [{ required: true, message: "请输入物料分类名称", trigger: "blur" },],
        code: [{ required: true, message: "请输入物料分类编码", trigger: "blur" },],
      },
      checkedNodes: [],
      tabName: "wlmx",
    };
  },
  created() {
    this.setColumn();
    this.getSelectList();
  },
  mounted() {},
  activated() {
    this.init(()=>{
      // this.defaultExpandedKeys = this.materialTree.map(item => item.id);
    });
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    getMaterialTypeDetail(){
      if(this.form.id){
        const loading = this.loading('加载中...')
        apiBasic.getMaterialTypeDetail(this.form.id).then(res=>{
          if(res.code === 200) {
            this.form = res.data || {};
            this.editState = false;
          }else{
            this.$message.error(res.message ?? "获取详情失败")
          }
        }).catch(err=>{
          this.$message.error(err?.message ?? "获取详情失败");
        }).finally(()=>{
          loading.close();
        })
      }
    },
    onUploadLogoSuccess(e, field) {
      let fileList = this.form[field] || [];
      this.$set(this.form, field, fileList.concat(e));
    },
    delFile(filed, index){
      let fileList = XEUtils.clone(this.form[filed]||[]);
      fileList.splice(index, 1);
      this.form[filed] = [...fileList];
    },
    onAddOk(data){
      const find = this.sourceList.principalUserList.find(item => item.userId === data.principalUserId);
      const obj = {...data,parentId: data.parentId||0,  principalUserName: find?.nickName ?? '', principalUser: find?.userName ?? ''};
      const loading = this.loading('保存中...');
      apiBasic.saveMaterialApi(obj).then(res=>{
        if(res.code === 200){
          this.$message.success(res.message ?? "保存成功");
          this.addVisible = false;
          this.init();
        }else{
          this.$message.error(res.message ?? "保存失败")
        }
      }).catch(err=>{
        this.$message.error(err?.message ?? "保存失败");
      }).finally(()=>{
        loading.close();
      })
    },
    batchSetPrincipalUser(){
      this.checkedNodes = this.$refs.tree.getCheckedNodes();
      console.log(this.checkedNodes, "node 获取");
      if(!this.checkedNodes.length) return this.$message.warning("请选择分类");
      this.principalUserVisible = true;
    },
    batchStatus(){
      this.checkedNodes = this.$refs.tree.getCheckedNodes();
      if(!this.checkedNodes.length) return this.$message.warning("请选择分类");
      this.statusVisible = true;
    },
    onPrincipalUserOk(data) {
      //TODO
      const find = this.sourceList.principalUserList.find(item => item.userId === data.principalUserId);
      const obj = {...data, principalUserName: find?.nickName ?? '', principalUser: find?.userName ?? ''};
      const list = this.checkedNodes.reduce((pre, cur) => {
        pre.push({...cur, ...obj}); return pre;
      }, []);
      this.submit(list);
      this.principalUserVisible = false;
    },
    onStatusOk(data){
      const list = this.checkedNodes.reduce((pre, cur) => {
        pre.push({...cur, ...data}); return pre;
      }, []);
      this.submit(list);
      this.statusVisible = false;
    },
    handleDrop(before, after){
      VXETable.modal.confirm({
        title: "提示",
        content: `确定移动【${before.data.name??'分类'}】到新分类吗？`,
        mask: true,
      }).then(async (type) => {
        if (type === "confirm") {
          const loading = this.loading('保存中...');
          const tree = this.$refs.tree;
          this.defaultExpandedKeys = this.getAllExpandedKeys(tree.store.root);
          apiBasic.postMaterialTree(this.materialTree).then(res=>{
            if(res.code === 200){
              this.$message.success(res.message ?? "保存成功");
              this.init();
            }else{
              this.$message.error(res.message ?? "保存失败")
            }
          }).catch(err=>{
            this.$message.error(err?.message ?? "保存失败");
          }).finally(()=>{
            setTimeout(()=>loading.close(),300);
          });
        }else{
          this.materialTree = XEUtils.clone(this.backMaterialTree, true);
          if(!Object.keys(this.form).length && this.materialTree.length){
            this.form = this.materialTree[0] || {};
          }
          this.defaultExpandedKeys = this.materialTree.map(item => item.id);
          this.$nextTick(() => {
            if(this.$refs.tree){
              this.form && this.$refs.tree && this.$refs.tree.setCurrentNode(this.form);
              const obj =  this.$refs.tree.getCurrentNode();
              this.form = {...obj};
            }
          });
        }
      });
    },
    editForm(){
      this.draggable = true;
      this.editState = true;
      this.backForm = XEUtils.clone(this.form, true);
    },
    save(){
      this.$refs.dataForm.validate(valid => {
        if(valid){
          this.submit([this.form]);
        }else{
          this.$message.error("请填写必填项！");
        }
      });
    },
    submit(data){
      const loading = this.loading('保存中...');
      const tree = this.$refs.tree;
      this.defaultExpandedKeys = this.getAllExpandedKeys(tree.store.root);
      apiBasic.editMaterialApi(data).then(res=>{
        if(res.code === 200){
          this.$message.success(res.message ?? "保存成功");
          this.getMaterialTypeDetail();
          this.editState = false;
        }else{
          this.$message.error(res.message ?? "保存失败")
        }
      }).catch(err=>{
        this.$message.error(err?.message ?? "保存失败");
      }).finally(()=>{
        setTimeout(()=>loading.close(), 500);
      })
    },
    cancel(){
      this.draggable = false;
      this.editState = false;
      this.form = {...this.backForm};
    },
    onInputBlurFormChange(e){
      if(e && e.item && e.item.field === 'principalUserId'){
        const find = (this.sourceList[e.item.source]||[]).find(x=>x.userId === this.form[e.item.field])
        this.$set(this.form, 'principalUserName', find?.nickName ?? '');
        this.$set(this.form, 'principalUser', find?.userName ?? '');
      }
    },
    handleDragEnter(node, event){
      event.expanded = true;
    },
    nodeClick(obj) {
      this.form = {...obj};
      this.getMaterialTypeDetail();
      if(this.tabName === 'wlmx' && this.form && this.form.id){
        this.getTableList();
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    expandClick(expanded = false){
      const tree = this.$refs.tree;
      this.clearAllExpanded(tree.store.root, expanded);
    },
    clearAllExpanded(node, expanded = false){
      (node.childNodes||[]).forEach(item=>{
        item.expanded = expanded;
        if(item.childNodes && item.childNodes.length){
          this.clearAllExpanded(item, expanded);
        }
      })
    },
    getAllExpandedKeys(node){
      let expandedKeys = [];
      const traverseNodes = (currentNode) => {
        if(currentNode.expanded) {
          expandedKeys.push(currentNode.key);
        }
        if(currentNode.childNodes && currentNode.childNodes.length){
          currentNode.childNodes.forEach(child => traverseNodes(child));
        }
      }
      traverseNodes(node);
      return expandedKeys;
    },
    getSelectList(){
      apiSystem.getOrderUsersList().then(res=>{
        let sourceList = { ...this.sourceList };
        sourceList.principalUserList = (res.data?.inquiryUser ?? []).map((i) => {
          return {
            ...i,
            label: i.nickName,
            value: i.userId,
          };
        });
        this.sourceList = { ...sourceList };
      })
    },
    init(callback = null){
      this.getList(callback);
    },
    async setColumn() {
      let data = {
        code: "list",
        corpCode: this.businessCode ?? "LX",
      };
      const res = await apiQuotation.getFormsConfigMulti(this.menuCode, data);
      if (res.code === 200 && res.data && res.data) {
        this.descItems = res.data.list?.columns ?? [];
      }
      const resTable = await apiQuotation.getColumnsConfig(this.menuCode, data);
      if (resTable.code === 200 && resTable.data && resTable.data.columns) {
        let columns = resTable.data.columns;
        this.columns = [...columns];
        this.initTableConfig();
      }
      const searchRes = await apiQuotation.getSearchConfig(this.menuCode,data);
      if (searchRes.code === 200 && searchRes.data && searchRes.data.columns) {
        let searchOptions= searchRes.data.columns;
        this.searchOptions = [...searchOptions];
      }
    },
    initTableConfig() {
      const { listtable, toolbar } = this.$refs;
      if (listtable) {
        listtable.connect(toolbar);
        this.initTable();
      }
      this.defaultColumns = XEUtils.clone(this.columns, true);
    },
    initTable() {
      const { listtable } = this.$refs;
      const tableColumns = this.columns.map((item) => {
        const { params = {} } = item;
        if (item.params && params.hasOwnProperty("displayDigits")) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits);
          };
        }
        return item;
      });
      this.tableColumns = handleStorageColumns(tableColumns, listtable.id);
    },
    tabClick(){
      if(this.tabName === 'wlmx' && this.form && this.form.id){
        this.getTableList();
      }
    },
    getTableList(){
      if(!this.form.id) return this.tableData = [];
      const loading = this.loading("加载中");
      apiBasic.getMaterialInfoListApi({...this.condition, materialTypeId: this.form.id}, this.pagination.currentPage, this.pagination.pageSize).then((res) => {
        if (res.code == 200 && res.data) {
          this.tableData = res.data?.records ?? [];
          this.pagination.total = res.data.total;
          this.pagination.currentPage = res.data.current;
        } else {
          this.$message.error(res.message??"获取一览表异常");
        }
      }).catch((err) => {
        this.$message.error(err.message??"获取一览表异常");
      }).finally(() => {
        loading.close();
      });
    },
    onSearch(value) {
      const condition = { ...value };
      this.condition = { ...condition };
      this.pagination.currentPage = 1;
      this.getTableList();
    },
    // 一览表重置
    onReset() {
      this.condition = {};
      this.pagination.currentPage = 1;
      this.getTableList();
    },
    pageChange(e) {
      const { pageSize, currentPage } = e;
      let pageSizeObj = localStorage.getItem("pageSize")
        ? JSON.parse(localStorage.getItem("pageSize"))
        : {};
      pageSizeObj[this.$route.name] = pageSize;
      localStorage.setItem("pageSize", JSON.stringify(pageSizeObj));
      this.pagination = {
        ...this.pagination,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.getTableList();
    },
    toMaterialDetail(row){
      if (!row.id) return
      this.$router.push({
        path: `/material/material-content/detail/${row.id}`,
      });
    },
    // 删除分类
    delmaterial(){
      this.batchDelmaterial([this.form.id], ()=>{
        this.form = {};
      })
    },
    batchDel(){
      const checkedNodes = this.$refs.tree.getCheckedNodes(true);
      this.batchDelmaterial(checkedNodes.map(i=>i.id))
    },
    batchDelmaterial(data, callback){
      VXETable.modal
      .confirm({
        title: "提示",
        content: "确定删除物料分类？",
        mask: true,
      }).then(async (type) => {
        if (type === "confirm") {
          const loading = this.$loading({
            lock: true,
            text: "删除中",
            spinner: "el-icon-loading",
          });
          const tree = this.$refs.tree;
          this.defaultExpandedKeys = this.getAllExpandedKeys(tree.store.root);
          apiBasic.delMaterialApi(data).then((res) => {
            if (res.code === 200) {
              callback && typeof callback === "function" && callback();
              this.$message.success("删除成功");
              this.init();
            } else {
              this.$message.error(res.message??'删除失败');
            }
          }).catch(err=>{
            this.$message.error(err.message??'删除失败')
          }).finally(() => {
            loading.close();
          });
        }
      });
    },
    filterTree (tree) {
      tree.forEach(i=>{
        i.label = `${i.code?i.code + ' - ':''}` + i.name;
        i.value = i.id;
        if (i.children && i.children.length > 0){
          this.filterTree(i.children)
        }
      })
      return tree
    },
    // 获取一览表
    getList(callback) {
      const loading = this.loading("加载中");
      apiBasic.getMaterialListApi().then((res) => {
        if (res.code == 200) {
          this.materialTree = this.filterTree(res.data || []);
          this.backMaterialTree = XEUtils.clone(this.materialTree, true);
          const sourceList = { ...this.sourceList };
          sourceList.materialTree = XEUtils.clone(this.materialTree, true);
          this.sourceList = { ...sourceList };
          if(!Object.keys(this.form).length && this.materialTree.length){
            this.form = this.materialTree[0] || {};
          }
          this.$nextTick(() => {
            if(this.$refs.tree){
              this.form && this.$refs.tree && this.$refs.tree.setCurrentNode(this.form);
              const obj =  this.$refs.tree.getCurrentNode();
              this.form = {...obj};
            }
          });
          callback && typeof callback === 'function' && callback();
          if(this.tabName === 'wlmx' && this.form && this.form.id){
            this.getTableList();
          }
          this.getMaterialTypeDetail();
        } else {
          this.$message.error(res.message??"获取分类异常");
        }
      }).catch((err) => {
        this.$message.error(err.message??"获取分类异常");
      }).finally(() => {
        loading.close();
      });
    },
    onToolOk(e) {
      const { type, data } = e;
      const fn = this.toolMethods()[type];
      fn && fn(data);
    },
    toolMethods() {
      return {
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
