import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiBiddingManagement, ApiQuotation } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
const apiBiddingManagement = new ApiBiddingManagement();
const apiQuotation = new ApiQuotation();
export default {
  name: "biddingManagement_supplierApply",
  components: {},
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    showBtn() {
      return (name) => {
        let find = this.allBtnControlList?.find((x) => x.btnCode == name);
        if(name == 'signUp'){
          console.log('find' , find ?? false);
        }
        return find ?? false;
      };
    },
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      menuCode: "biddingManagement_supplierApply",
      searchOptions: [],
      sourceList: {
        statelist: (dict["bill_state"] || []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        purchaseMethodList: (dict["tender_purchase_method"] || []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        bizFlowStatusList: (dict["tender_biz_flow_status"] || []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        registrationStatusList: (dict["tender_registration_status"] || []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        yesNoList: [
          { label: "是", value: 1, },
          { label: "否", value: 0, }
        ],
        quoteState: [
          { label: "待报价", value: 0 },
          { label: "已报价", value: 1 },
        ],
      },
      condition: {},
      columns: [],
      defaultColumns: [],
      tableData: [],
      id: null,
      form: {},
      timer: null,
      timeDifference: '',
      allBtnControlList: [],
    };
  },
  created() { },
  mounted() { },
  activated() {
    const { params, query } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
      this.init();
      this.showBtnConfig();
    } else { }
  },
  methods: {
    signUp() {
      this.$confirm("确定报名吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const loading = this.loading("报名中");
        let data = {
          id: this.id,
        }
        apiBiddingManagement.postSignUp(data).then((res) => {
          if (res.code == 200) {
            this.$message.success("报名成功");
            // this.init()
            this.$router.go(0);
            // this.$router.push({
            //   path: `/biddingManagement/myTender`,
            // });
          } else {
            this.$message.error(res.message);
          }
        }).catch((err) => {
          this.$message.error("报名失败");
        }).finally(() => {
          loading.close();
        });
      });
    },
    rejectSignUp() {
      this.$prompt('请输入拒绝原因', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^[^\s]+$/,
        inputErrorMessage: '请填写拒绝原因'
      }).then(({ value }) => {
        const loading = this.loading("拒绝报名中");
        let data = {
          id: this.id,
          remark: value,
        }
        apiBiddingManagement.postRejectSignUp(data).then((res) => {
          if (res.code == 200) {
            this.$message.success("拒绝报名成功");
            this.init()
          } else {
            this.$message.error(res.message);
          }
        }).catch((err) => {
          this.$message.error("拒绝报名失败");
        }).finally(() => {
          loading.close();
        });
      })
    },

    init() {
      this.setColumn();
      this.getList();
      this.showBtnConfig();
    },
    getList() {
      const loading = this.loading("加载中");
      let params = { id: this.id }
      apiBiddingManagement.getSupplierApplyDetail(params).then((res) => {
        if (res.code == 200 && res.data) {
          this.form = res.data;
          this.readSecond();
        } else {
          this.$message.error(res.message);
        }
      }).catch((err) => {
        this.$message.error("获取一览表异常");
      }).finally(() => {
        loading.close();
      });
    },
    showBtnConfig() {
      let data = {
        param: {
          id: this.id ?? null,
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
    // 计算时间差
    calculateTimeDifference(endTime) {
      if (!endTime) {
        return '';
      }
      const start = new Date();
      const end = new Date(endTime).setHours(23, 59, 59, 999);
      const diffMs = end - start;
      if (diffMs <= 0) {
        return '已过期';
      }
      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30.44);
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      const remainingDays = Math.floor(days % 30.44);
      const remainingHours = hours % 24;
      const remainingMinutes = minutes % 60;
      const remainingSeconds = seconds % 60;

      let time = {
        years: years ? years + '年' : '',
        months: remainingMonths ? remainingMonths + '月' : '',
        days: remainingDays ? remainingDays + '日' : '',
        hours: remainingHours ? remainingHours + '时' : '',
        minutes: remainingMinutes ? remainingMinutes + '分' : '',
        seconds: remainingSeconds ? remainingSeconds + '秒' : ''
      }
      let srt = `${time.years}${time.months}${time.days}${time.hours}${time.minutes}${time.seconds}`
      return srt;
    },
    // 读秒
    readSecond() {
      this.timer = setInterval(() => {
        this.timeDifference = this.calculateTimeDifference(this.form.deadlineTime);
      }, 1000);
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
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
  }
}
