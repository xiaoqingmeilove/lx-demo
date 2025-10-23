import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiBuy, ApiContract } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { blobToFile } from "@/utils/utils";
import VXETable from "vxe-table";
import splicinAddress from "@/pages-components/splicinAddress/index.vue";
const apiQuotation = new ApiQuotation();
const apiBuy = new ApiBuy();
const apiContract = new ApiContract();
export default {
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
      menuCode: "buyingLead_purchaseNeedPool",
      searchOptions: [],
      sourceList: {
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
      sourceState: "WKS",
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
    toBidManagementClick(){
      const selectedRows = this.$refs.table.getCheckboxRecords();
      if (selectedRows.length === 0) {
        this.$message.warning("请选中需直接采购的需求！");
        return;
      }
      let ids = selectedRows.map((mapx) => {
        return mapx.id;
      });
      const loading = this.$loading({
        lock: true,
        text: "招标申请中",
        spinner: "el-icon-loading",
      });
      apiBuy.postRequirementsAdd(ids).then((res) => {
        if (res.code == 200 && res.data) {
          if (res.data) {
            this.$router.push({
              path: `/biddingManagement/tenderingApply-edit/${res.data?.billId}`,
            });
          }
        } else {
          this.$message.error(res.message || "操作失败");
        }
      }).finally(() => {
        loading.close();
      });
    },
    toDirectPurchasing() {
      console.log(this.sourceState)
      const selectedRows = this.$refs.table.getCheckboxRecords();
      if (selectedRows.length === 0) {
        this.$message.warning("请选中需直接采购的需求！");
        return;
      }
      let stateflag = selectedRows.some((x) => x.matchPriceFlag == 0);
      if (stateflag) {
        this.$message.error("请选择已匹配价格库的需求！ ");
        return;
      }
      let ids = selectedRows.map((mapx) => {
        return mapx.id;
      });
      let params = {
        ids: ids,
      }
      const loading = this.$loading({
        lock: true,
        text: "直接采购中",
        spinner: "el-icon-loading",
      });
      apiContract.postRequirementsAdd(params).then((res) => {
        if (res.code == 200 && res.data) {
          if (res.data) {
            this.$router.push({
              path: `/purchaseOrder/orderApply-detail/${res.data?.id}`,
            });
          }
        } else {
          this.$message.warning(res.message || "操作失败");
        }
      }).finally(() => {
        loading.close();
      });
    },
    toBidClick() {
      const selectedRows = this.$refs.table.getCheckboxRecords();
      if (selectedRows.length === 0) {
        this.$message.warning("请选中需竞价的需求！");
        return;
      }
      let ids = selectedRows.map((mapx) => {
        return mapx.id;
      });
      apiBuy.postBiddingApply(ids).then((res) => {
        if (res.code == 200 && res.data) {
          this.$router.push({
            path: `/bidding/bidInvite-detail/detail/${res.data}`,
          });
        } else {
          this.$message.warning(res.message || "操作失败");
        }
      });
    },
    toSeekClick() {
      const selectedRows = this.$refs.table.getCheckboxRecords();

      // 暂时取消校验


      // if (selectedRows.length === 0) {
      //   this.$message.warning("请选中需询价的需求！");
      //   return;
      // }
      // let stateflag = selectedRows.some((x) => x.sourcingState !== "WKS");
      // console.log(stateflag, 'stateflag');
      // if (stateflag) {
      //   this.$message.error("请选择寻源进度为未开始！ ");
      //   return;
      // }
      // let sourcingflag = selectedRows.some(
      //   (x) => x.sourcingMethod != "enquiry" && x.sourcingMethod != "auction"
      // );
      // if (sourcingflag) {
      //   this.$message.error("请选择寻源方式为询比价或竞价！");
      //   return; 
      // }
      let materialName = selectedRows.map((x) => x.materialName);
      let ids = selectedRows.map((mapx) => {
        return mapx.id;
      });
      VXETable.modal
        .confirm({
          title: "提示",
          content: `确定合并询价 : ${materialName}`,
          mask: true,
          width: 600,
        })
        .then(async (type) => {
          if (type === "confirm") {
            const loading = this.$loading({
              lock: true,
              text: "合并中",
              spinner: "el-icon-loading",
            });
            apiBuy.postPoolToSeek({ ids }).then((res) => {
              if (res.code == 200 && res.data) {
                this.$router.push({
                  path: `/seekContrast/enquiryApply-detail/${res.data.id}`,
                });
              } else {
                this.$message.warning(res.message || "操作失败");
              }
            }).finally(() => {
              loading.close();
            });
          }
        });
    },
    // 导出一览表
    exportExec() {
      const loading = this.$loading({
        lock: true,
        text: "导出中",
        spinner: "el-icon-loading",
      });
      apiBuy
        .getPurchasePoolListExport(this.condition)
        .then((res) => {
          if (res) {
            blobToFile(res, `${this.$route.meta.title}_${moment().format("YYYYMMDDHHmm")}.xlsx`);
          } else {
            this.$message.warning("导出失败！");
          }
        })
        .finally(() => {
          setTimeout(() => {
            loading.close();
          }, 2000);
        });
    },
    onCellDbClick(e) {
      return;
      //  详情关门了，不让进
      const { row } = e;
      this.$router.push({
        path: `/buyingLead/purchaseNeedPool-detail/${row.id}`,
      });
    },
    init() {
      this.setColumn();
      this.getList();
    },

    getList() {
      const loading = this.loading("加载中");
      const condition = {
        ...this.condition,
        sourceState: this.sourceState == "ALL" ? '' : this.sourceState
      };
      apiBuy .getPurchasePoolList(condition, this.pagination.currentPage, this.pagination.pageSize).then((res) => {
          if (res.code == 200 && res.data) {
            this.tableData = res.data.records ?? [];
            this.pagination.total = res.data.total;
            this.pagination.currentPage = res.data.current;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(() => {
          this.$message.error("获取一览表异常");
        })
        .finally(() => {
          loading.close();
        });
    },
   
    pageChange(e) {
      const { pageSize, currentPage } = e;
      console.log( pageSize, currentPage )
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
      console.log("this.pagination",this.pagination)
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
