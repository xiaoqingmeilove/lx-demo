import { columns } from "./scripts/columns";
import { searchOptions } from "./scripts/search";
// import { ApiLogistics, ApiQuotation } from '@/apis'
import { mapState } from 'vuex'
import { handleStorageColumns, MaximizeTable } from '@/utils/vxe-table'
import { blobToFile } from '@/utils/utils';
import { findMenuByCode } from "@/utils/menu";
import XEUtils from 'xe-utils'
import moment from "moment";

let maximizeTable = null
// const apiLogistics = new ApiLogistics();
export default {
  name: "supplier_supplierType",
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
      menuCode: "supplier_supplierType",
      columns: columns,
      tableColumns: [],
      defaultColumns: [],
      searchOptions: searchOptions,
      tableData: [],
      condition: {},
      tablePage: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20 : 20,
        total: 0,
        showTotal: () => `共${this.tablePage.total}条`,
      },
      sourceList: {
        statelist: (dict["transport_status"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        shipstatelist: [],
      },
      allBtnControlList: [],
    };
  },
  created() {},
  activated() {
    this.$tabs.activeTab.title = findMenuByCode(this.menuCode)?.title ?? '供应商类型';
    this.getList();
  },
  beforeRouteLeave(to, from, next) {
    this.closePopup();
    next();
  },
  mounted() {
    this.initTableConfig();
  },
  methods: {
    closePopup(){
      const { tools } = this.$refs;
      const { setting } = tools?.$refs;
      setting && setting.cancel();
    },
    exprot(){
      const loading = this.loading("导出中");
      const ids = this.$refs.table.getCheckboxRecords().map(x=>x.transportId).join(',');
      return 
      apiLogistics.getTransportBizExport({...this.condition, ids}).then(res => {
        blobToFile(res, `导出${findMenuByCode(this.menuCode)?.title??'供应商类型'}_${moment().format("YYYYMMDDHHmm")}.xlsx`);
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
      let data = {
        code: "list",
        corpCode: this.businessCode ?? "LX",
      };
      let search = {
        code: "search",
        corpCode: this.businessCode ?? "LX",
      };
      const tasks = [];
      tasks.push(apiQuotation.getColumnsConfig(this.menuCode, data));
      tasks.push(apiQuotation.getSearchConfig(this.menuCode, search));
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
      return
      const loading = this.loading('加载中');
      apiLogistics.getTransportBizList(this.condition, this.tablePage.currentPage, this.tablePage.pageSize).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data?.records ?? []
          this.tablePage.total = res.data.total;
          typeof callback === 'function' && callback(checkList);
        } else {
          this.$message.error(res.message || "获取数据异常");
        }
      }).catch(err => {
        this.$message.error(err.message || "获取数据异常")
      }).finally(() => {
        loading.close()
      })
    },
    // 一览表双击事件 查看详情
    onCellDbClick({row}) {
      // this.$router.push({ path: `/logistics/inquiryList-detail/detail/${row.id}` });
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
        maximize: data => {
          const { maximize } = data
          if (maximize) {
            maximizeTable.maximize()
          } else {
            maximizeTable.restoreTable()
          }
        },
        set_column: ({columns}) => {
          this.tableColumns = columns;
          this.$nextTick(()=>{
            this.handleMerges();
          })
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