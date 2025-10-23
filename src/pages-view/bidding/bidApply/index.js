/*
 * @Author: wmm
 * @Date: 2025-04-16 11:20:25
 * @LastEditors: wmm
 * @LastEditTime: 2025-09-23 13:50:03
 */
import { columns } from "./scripts/columns";
import { searchOptions } from "./scripts/search";
import { ApiBid, ApiQuotation } from '@/apis'
import { mapState } from 'vuex'
import { handleStorageColumns, MaximizeTable } from '@/utils/vxe-table'
import { blobToFile } from '@/utils/utils';
import { findMenuByCode } from "@/utils/menu";
import XEUtils from 'xe-utils'
import moment from "moment";

let maximizeTable = null
const apiBid = new ApiBid();
const apiQuotation = new ApiQuotation();
export default {
  name: "bidding_bidApply",
  components: {},
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    getInvolved(){
      return (value) => {
        return this.sourceList.involvedFlagList.find(x=>x.value === value)?.label ?? ''
      }
    }
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      dict,
      menuCode: "bidding_bidApply",
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
        billStatelist: (dict["bill_state"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        involvedFlagList: (dict["involved_flag"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        projectStatus: (dict["involved_flag"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
      },
    };
  },
  created() {
    this.setColumn();
  },
  activated() {
    this.$tabs.activeTab.title = findMenuByCode(this.menuCode)?.title ?? '竞价报名';
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
      return 
      const loading = this.loading("导出中");
      apiBid.getSupplierExport({...this.condition}).then(res => {
        blobToFile(res, `导出${findMenuByCode(this.menuCode)?.title??'竞价报名'}_${moment().format("YYYYMMDDHHmm")}.xlsx`);
      }).finally(() => {
        setTimeout(() => {
          loading.close();
        }, 500)
      })
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
      apiBid.getBiddingSignList(this.condition, this.tablePage.currentPage, this.tablePage.pageSize).then(res => {
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
    // 一览表双击事件 查看详情
    onCellDbClick({row}) {
      this.$router.push({ path: `/bidding/bidApply-detail/detail/${row.id}` });
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