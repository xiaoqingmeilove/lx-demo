import { ApiContract, ApiQuotation } from '@/apis'
import { mapState } from 'vuex'
import { handleStorageColumns, MaximizeTable } from '@/utils/vxe-table'
import { blobToFile } from '@/utils/utils';
import { findMenuByCode } from "@/utils/menu";
import XEUtils from 'xe-utils'
import moment from "moment";

let maximizeTable = null
const apiContract = new ApiContract();
const apiQuotation = new ApiQuotation();
export default {
  name: "purchaseOrder_enquiryPlan",
  components: {},
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    getColorAndName() {
      return (row, column, list) => {
        const find = list.find(f => f.value == row[column.field]);
        return find || { color: '#f56c6c', label: row[column.field] || '未知' };
      }
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      dict,
      menuCode: "purchaseOrder_enquiryPlan",
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
        orderBizFlowStatus: (dict["order_biz_flow_status"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue, color: d.remark }
        }),
        billStateList: (dict["bill_state"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue, color: d.remark }
        }),
        contractTypeList: (dict["contract_type"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        signatureMethodList: [],
        statusList: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
    };
  },
  created() {
    this.setColumn();
  },
  activated() {
    this.$tabs.activeTab.title = findMenuByCode(this.menuCode)?.title ?? '要货计划';
    this.getList();
  },
  beforeRouteLeave(to, from, next) {
    this.closePopup();
    next();
  },
  mounted() { },
  methods: {
    toOrderDetail(row) {
      this.$router.push({
        path: `/purchaseOrder/orderApply-detail/${row.orderBillId}`,
      });
    },
    onCheckboxChange(e) {
      console.log('onCheckboxChange', e);
    },
    toDeliveryClick() {
      const select = this.$refs.table.getCheckboxRecords();
      const rowselect = XEUtils.uniq(select, 'batchNo');
      if (rowselect && !rowselect.length) {
        this.$message.warning("请选择订单批次!");
        return;
      }
      if (rowselect && rowselect.length !== 1) {
        this.$message.warning("请选择同一笔订单批次发货!");
        return;
      }

      this.$confirm('确定要创建发货单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const ids = select.map(row => row.id);
        this.createDelivery(ids);
      })
    },

    createDelivery(ids) {
      const loading = this.loading("创建中...");
      apiContract.createDelivery({ ids: ids }).then(res => {
        if (res.code === 200) {
          this.$message.success("创建成功!");
          console.log('res.data', res.data);
          this.$router.push({
            path: `/purchaseOrder/delivery-detail/detail/${res.data.id}`,
          });
        } else {
          this.$message.error(res.message || "创建失败!");
        }
      }).catch(err => {
        this.$message.error(err.message || "创建失败!");
      }).finally(() => {
        setTimeout(() => loading.close(), 1000);
      })

    },
    closePopup() {
      const { tools } = this.$refs;
      const { setting } = tools?.$refs;
      setting && setting.cancel();
    },
    exprot() {
      const loading = this.loading("导出中");
      apiContract.getPageExport({ ...this.condition }).then(res => {
        blobToFile(res, `导出${findMenuByCode(this.menuCode)?.title ?? '要货计划'}_${moment().format("YYYYMMDDHHmm")}.xlsx`);
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
      const data = { code: "list", corpCode: this.businessCode ?? "LX" };
      const res = await apiQuotation.getColumnsConfig(this.menuCode, data);
      if (res.code === 200 && res.data && res.data.columns) {
        this.columns = [...res.data.columns];
        this.initTableConfig();
      }
      const searchRes = await apiQuotation.getSearchConfig(this.menuCode, data);
      if (searchRes.code === 200 && searchRes.data && searchRes.data.columns) {
        this.searchOptions = [...searchRes.data.columns];
      }
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
      apiContract.getDetailPageList(this.condition, this.tablePage.currentPage, this.tablePage.pageSize).then(res => {
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
    // 查询
    onSearch(value) {
      const condition = XEUtils.clone(value, true);
      this.tablePage.currentPage = 1;
      this.condition = { ...condition };
      this.getList();
    },
    calculateDaysDifference(date) {
      if (!date) return '';
      const targetDate = new Date(date);
      const currentDate = new Date();
      const diffTime = targetDate.getTime() - currentDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
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
        set_column: ({ columns }) => {
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