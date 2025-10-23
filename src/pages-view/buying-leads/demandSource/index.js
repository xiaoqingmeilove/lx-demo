import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiBuy } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { blobToFile } from "@/utils/utils";
import VXETable from "vxe-table";
import splicinAddress from "@/pages-components/splicinAddress/index.vue";
const apiQuotation = new ApiQuotation();
const apiBuy = new ApiBuy();
export default {
  name: "demandSource",
  components: { splicinAddress },
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      menuCode: "buyingLead_demandSource",
      searchOptions: [],
      sourceList: {
        sourcingStateList: (dict["sourcing_state"] || []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        statelist: (dict["bill_state"] || []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        sourcingMethodList: (dict["sourcing_method"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }), //寻源方式
        sourcingStateList: (dict["sourcing_state"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }), //寻源进度
        yesNoList: [{ label: "是", value: 1, }, { label: "否", value: 0, }],
      },
      condition: {},
      columns: [],
      defaultColumns: [],
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize")
          ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20
          : 20,
        total: 0,
        showTotal: () => `共${this.pagination.total}条`,
      },
    };
  },
  created() { },
  mounted() { },
  activated() {
    this.init();
  },
  methods: {
    init() {
      this.setColumn();
      this.getList();
    },
    getList() {
      const loading = this.loading("加载中");
      apiBuy.getPurchasePoolList(this.condition, this.pagination.currentPage, this.pagination.pageSize)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.tableData = res.data.records ?? [];
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
    async setColumn() {
      const loading = this.loading("正在加载");
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
      const searchRes = await apiQuotation.getSearchConfig(this.menuCode, data);
      if (searchRes.code === 200 && searchRes.data && searchRes.data.columns) {
        let searchOptions = searchRes.data.columns;
        this.searchOptions = [...searchOptions];
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
    onSearch(value) {
      this.condition = { ...value };
      this.pagination.currentPage = 1;
      this.getList();
    },
    // 一览表重置
    onReset() {
      this.condition = {};
      this.pagination.currentPage = 1;
      this.getList();
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
