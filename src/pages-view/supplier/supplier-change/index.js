import { columns } from "./scripts/columns";
import { searchOptions } from "./scripts/search";
import { ApiBasic, ApiQuotation } from '@/apis'
import { mapState } from 'vuex'
import { handleStorageColumns, MaximizeTable } from '@/utils/vxe-table'
import { blobToFile } from '@/utils/utils';
import { findMenuByCode } from "@/utils/menu";
import XEUtils from 'xe-utils'
import moment from "moment";

let maximizeTable = null

const apiBasic = new ApiBasic();
const apiQuotation = new ApiQuotation();
export default {
  name: "supplier_supplierChange",
  components: {},
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    showBtn(){
      return (name) => {
        let find = this.allBtnControlList?.find((x) => x.btnCode == name)
       return find ?? false;
      }
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      dict,
      moment,
      menuCode: "supplier_supplierChange",
      columns: [],
      tableColumns: [],
      defaultColumns: [],
      searchOptions: [],
      tableData: [],
      condition: {},
      tablePage: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20 : 20,
        total: 0,
        showTotal: () => `共${this.tablePage.total}条`,
      },
      sourceList: {
        billStateList: (dict["bill_state"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        supplierStateList: (dict["supplier_auth_status"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue, color: d.remark }
        }),
        supplierTypeList: (dict["supplier_type"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        flagList: [{label: '是',value:1}, {label: '否',value:0}],
        authStatusList: (dict["supplier_auth_status"]??[]).map(d=>{
          return {label: d.dictLabel, value: d.dictValue}
        }),
        supplierClassificationList: (dict["supplier_classification"]??[]).map(d=>{
          return {label: d.dictLabel, value: d.dictValue}
        }),
        supplyClassificationList: (dict["supply_classification"]??[]).map(d=>{
          return {label: d.dictLabel, value: d.dictValue}
        }),
      },
      allBtnControlList: [],
    };
  },
  created() {
    this.setColumn();
  },
  activated() {
    // this.$tabs.activeTab.title = findMenuByCode(this.menuCode)?.title ?? '供应商变更';
    this.getList();
  },
  beforeRouteLeave(to, from, next) {
    this.closePopup();
    next();
  },
  mounted() {},
  methods: {
    closePopup(){
      const { tools } = this.$refs;
      const { setting } = tools?.$refs;
      setting && setting.cancel();
    },
    exprot(){
      const loading = this.loading("导出中");
      apiBasic.getAccessExport({...this.condition}).then(res => {
        blobToFile(res, `导出${findMenuByCode(this.menuCode)?.title??'供应商准入'}_${moment().format("YYYYMMDDHHmm")}.xlsx`);
      }).finally(() => {
        setTimeout(() => {
          loading.close();
        }, 500)
      })
    },
    showBtnConfig() {
      let data = {
        param: {
          listBtnView: 1,
        },
      };
      apiQuotation.postDetailBtnList(this.menuCode, data).then((res) => {
        if (res.code === 200) {
          this.allBtnControlList = res.data ?? [];
        } else {
          this.$message.error(res.message);
        }
      });
    },
    initTableConfig() {
      const { table, toolbar } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable();
      }
      this.defaultColumns = XEUtils.clone(this.columns, true);
      maximizeTable = new MaximizeTable(this.$refs.tableSection.$el);
    },
    async setColumn() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      const tasks = [];
      tasks.push(apiQuotation.getColumnsConfig(this.menuCode, {code: "list", corpCode: this.businessCode ?? "LX"}));
      tasks.push(apiQuotation.getSearchConfig(this.menuCode, {code: "search", corpCode: this.businessCode ?? "LX"}));
      const responses = await Promise.all(tasks);
      responses.map(res => {
        if (res.code === 200 && res.data && res.data.columns) {
          if (res.data.code === 'search') {
            this.searchOptions = [...res.data.columns];
          } else {
            let columns = res.data.columns;
            this.columns = [...columns];
            this.initTableConfig();
          }
        }
      })
      loading.close();
    },
    initTable() {
      const { table } = this.$refs
      const tableColumns = this.columns.map(item => {
        if (item.params && item.params.displayDigits) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, item.params.displayDigits)
          }
        }
        return item
      })
      this.tableColumns = handleStorageColumns(tableColumns, table.id)
    },
    getList(callback) {
      const loading = this.loading('加载中');
      apiBasic.getSupplierChange(this.condition, this.tablePage.currentPage, this.tablePage.pageSize).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data?.records ?? []
          this.tablePage.total = res.data.total;
          typeof callback === 'function' && callback();
        } else {
          this.$message.error(res.message || "获取数据异常");
        }
      }).catch(err => {
        this.$message.error(err.message || "获取数据异常")
      }).finally(() => {
        loading.close()
      })
    },
    toSupplierRegister(row) {
      this.$router.push({ path: `/supplier/supplierRegister-detail/detail/${row.masterId}` });
    },
    // 一览表双击事件 查看详情
    onCellDbClick({row}) {
      this.$router.push({ path: `/supplier/supplierChange-detail/detail/${row.id}` });
    },
    // 查询
    onSearch(value) {
      const condition = XEUtils.clone(value, true);
      this.tablePage.currentPage = 1;
      this.condition = { ...condition };
      this.getList();
    },

    // 分页
    handlePageChange(e) {
      const { pageSize, currentPage } = e;
      let pageSizeObj = localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize")) : {};
      pageSizeObj[this.$route.name] = pageSize;
      localStorage.setItem("pageSize", JSON.stringify(pageSizeObj));
      this.tablePage = {
        ...this.tablePage,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.getList();
    },
    onReset() {
      this.condition = {};
      this.tablePage.currentPage = 1,
      this.getList();
    },

    // 表格工具
    handleColumns(columns) {
      return columns.map(item => {
        if (item.digits) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, item.digits)
          }
        }
        return item
      })
    },
    onToolOk(e) {
      const { type, data } = e
      const fn = this.toolMethods()[type]
      fn && fn(data)
    },
    toolMethods() {
      return {
        set_column: ({columns}) => {
          this.tableColumns = columns;
        }
      }
    },
    // 加载组件功能
    loading(text) {
      const loading = this.$loading({
        lock: true,
        text,
        spinner: 'el-icon-loading',
      })
      return loading
    },
  },
};