import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiBasic } from "@/apis";
import {  handleStorageColumns } from "@/utils/vxe-table";
import { VXETable } from "vxe-table";
const apiBasic = new ApiBasic();
const apiQuotation = new ApiQuotation();
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
  },
  data() {
    return {
      menuCode:"material_detail",
      searchOptions:[],
      sourceList:{
        YesorNoList:[
          { label: "是", value: 1 },
          { label: "否", value: 0 },
        ],
        materialTypeList: [],
      },
      columns:[],
      defaultColumns: [],
      tableData:[],
      
      condition:{},
      pagination: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize")
          ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20
          : 20,
        total: 0,
        showTotal: () => `共${this.pagination.total}条`,
      }, // 一览表分页配置
      batchStatusVisible: false,
      batchStatusForm: {},
      dataGather: [
        {
          config: [
            { label: '是否禁用', field: 'status', type: 'radio', source: 'YesorNoList' },
          ]
        },
      ],
    };
  },
  created() {
    this.setColumn();
    this.getSelectList();
  },
  mounted() {},
  activated() {
    this.init();
  },
  methods: {
    batchStatus(){
      const list = this.$refs.listtable.getCheckboxRecords();
      if (!list.length) {
        this.$message({
          message: "请选择要操作的物料",
          type: "warning",
        });
        return;
      }
      this.batchStatusVisible = true;
      this.batchStatusForm = {
        status: 0,
        idList: list.map(i=>i.id),
      }
    },
    onSetPopupOk(data){
      console.log(data, ":data");
      
      const loading = this.$loading({
        lock: true,
        text: "请求中...",
        spinner: "el-icon-loading",
      });
      apiBasic.putMaterialInfoBatchApply(data).then((res) => {
        if(res.code === 200) {
          this.$message({
            message: res.message ?? "操作成功",
            type: "success", 
          })
          this.batchStatusVisible = false;
          this.init();
        }else{
          this.$message({
            message: res.message ?? "操作失败",
            type: "error",
          });
        }
      }).catch((err) => {
        this.$message({
          message: err.message?? "操作失败",
          type: "error",
        }); 
      }).finally(()=>{
        loading.close();
      })
    },
    init(){
      this.getList();
    },
    // 获取一览表
    treeFormat(arr, originArr){
      const list = filterTree(originArr ?? arr);
      arr.forEach(i=>{
        const find = list.find(x=> i.parentId && x.id == i.parentId);
        i.labelName = i.parentId && find && find.label ? find.label + '/' + i?.name : i?.name;
        i.label = `${i.code?i.code + ' - ':''}` + i.name;
        i.value = i.id;
        if (i.children && i.children.length){
          this.treeFormat(i.children, originArr ?? arr)
        }
      })
      return arr
    },
    getSelectList() {
      apiBasic.getMaterialListApi().then((res) => {
        if (res.code === 200 && res.data) {
          let sourceList = { ...this.sourceList };
          sourceList.materialTypeList = this.treeFormat(res.data)
          this.sourceList = { ...sourceList };
        }
      });
    },
    async setColumn() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      let data = {
        code: "list",
        corpCode: this.businessCode ?? "LX",
      };
      const res = await apiQuotation.getColumnsConfig(this.menuCode, data);
      if (res.code === 200 && res.data && res.data.columns) {
        let columns = res.data.columns;
        this.columns = [...columns];
        this.initTableConfig();
      }
      const searchRes = await apiQuotation.getSearchConfig(this.menuCode,data);
      if (searchRes.code === 200 && searchRes.data && searchRes.data.columns) {
        let searchOptions= searchRes.data.columns;
        this.searchOptions = [...searchOptions];
      }
      loading.close();
    },
    initTableConfig() {
      const { listtable, toolbar } = this.$refs;
      if (listtable) {
        listtable.connect(toolbar);
        this.initTable();
      }
      
      this.defaultColumns = XEUtils.clone(this.columns, true);
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
      this.columns = handleStorageColumns(tableColumns, listtable.id);
    },
    getRowSelection({ checked }) {
      // 获取产品清单已选中数据
      this.columnSelectList = this.$refs.listtable.getCheckboxRecords();
      //console.log(this.columnSelectList)
    },
    onSearch(value) {
      const condition = { ...value };
      this.condition = { ...condition, materialTypeId: this.condition.materialTypeId || null };
      this.pagination.currentPage = 1;
      this.getList();
    },
    // 一览表重置
    onReset() {
      this.condition = {materialTypeId: null};
      this.pagination.currentPage = 1;
      this.getList();
    },
    // 删除分类
    Delmaterial(row){
      VXETable.modal
      .confirm({
        title: "提示",
        content: "确定删除该物料分类？",
        mask: true,
      })
      .then(async (type) => {
        if (type === "confirm") {
          const loading = this.$loading({
            lock: true,
            text: "删除中",
            spinner: "el-icon-loading",
          });
          let obj = []
          obj.push(row.id)
          apiBasic
            .delMaterialInfoApi(obj)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success("操作成功");
              } else {
                this.$message.error(res.message);
              }
            })
            .finally(() => {
              this.init();
              loading.close();
            });
        }
      });
    },
    // 获取一览表
    getList() {
      const loading = this.loading("加载中");
      apiBasic
        .getMaterialInfoListApi(
          this.condition,
          this.pagination.currentPage,
          this.pagination.pageSize
        ).then((res) => {
          if (res.code == 200 && res.data) {
            this.tableData = res.data.records ?? [];
            this.$refs.listtable.clearCheckboxRow();
            this.columnSelectList = []
            this.pagination.total = res.data.total;
            this.pagination.currentPage = res.data.current;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.$message.error("获取一览表异常");
        })
        .finally(() => {
          loading.close();
        });
    },
    // 一览表分页change事件
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
      this.getList();
    },
    
    // 删除
    DelmaterialInfo(row){
      VXETable.modal
      .confirm({
        title: "提示",
        content: "确定删除该物料档案？",
        mask: true,
      })
      .then(async (type) => {
        if (type === "confirm") {
          const loading = this.$loading({
            lock: true,
            text: "删除中",
            spinner: "el-icon-loading",
          });
          let obj = []
          obj.push(row.id)
          apiBasic
            .delMaterialInfoApi(obj)
            .then((res) => {
              if (res.code === 200) {
                this.$message.success("操作成功");
              } else {
                this.$message.error(res.message);
              }
            })
            .finally(() => {
              this.init();
              loading.close();
            });
        }
      });
    },
    // 一览表双击事件
    onCellDbClick(e) {
      const { row } = e;
      this.$router.push({
        path: `/material/material-content/detail/${row.id}`,
      });
    },
    editClick(row) {
      console.log(row)
      this.$router.push({
        path: `/material/material-content/detail/${row.id}`,
      });
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
