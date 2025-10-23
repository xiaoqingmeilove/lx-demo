import { ApiContract, ApiQuotation } from '@/apis'
import { mapState } from 'vuex'
import { handleStorageColumns, MaximizeTable } from '@/utils/vxe-table'
import { blobToFile } from '@/utils/utils';
import { findMenuByCode } from "@/utils/menu";
import XEUtils from 'xe-utils'
import moment from "moment";
import purchasepoolList from "@/pages-components/purchasePoolList/index.vue"
import contractList from "@/pages-components/contractList/index.vue"

let maximizeTable = null
const apiContract = new ApiContract();
const apiQuotation = new ApiQuotation();
export default {
  name: "purchaseOrder_takeDelivery",
  components: { purchasepoolList, contractList },
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      dict,
      menuCode: "purchaseOrder_takeDelivery",
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
        contractTypeList: (dict["contract_type"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        signatureMethodList: [],
        statusList: [
          { label: '是', value: 1 },
          { label: '否', value: 0 },
        ],
      },
      visible: {
        contractVisable: false,
        poolVisable: false,
      }
    };
  },
  created() {
    this.setColumn();
  },
  activated() {
    this.$tabs.activeTab.title = findMenuByCode(this.menuCode)?.title ?? '收货单';
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
      return;
      const loading = this.loading("导出中");
      apiContract.getSupplierExport({...this.condition}).then(res => {
        blobToFile(res, `导出${findMenuByCode(this.menuCode)?.title??'收货单'}_${moment().format("YYYYMMDDHHmm")}.xlsx`);
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
      const data = {code: "list", corpCode: this.businessCode ?? "LX"};
      const res = await apiQuotation.getColumnsConfig(this.menuCode, data);
      if(res.code === 200 && res.data && res.data.columns) {
        this.columns = [...res.data.columns];
        this.initTableConfig();
      }
      const searchRes = await apiQuotation.getSearchConfig(this.menuCode, data);
      if(searchRes.code === 200 && searchRes.data && searchRes.data.columns) {
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
      apiContract.getPurchaseOrderList(this.condition, this.tablePage.currentPage, this.tablePage.pageSize).then(res => {
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
      this.$router.push({ path: `/purchaseOrder/takeDelivery-detail/detail/${row.id}` });
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