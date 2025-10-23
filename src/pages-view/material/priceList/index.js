import { ApiBasic, ApiQuotation } from '@/apis'
import { mapState } from 'vuex'
import { handleStorageColumns } from '@/utils/vxe-table'
import { blobToFile } from '@/utils/utils';
import { findMenuByCode } from "@/utils/menu";
import XEUtils from 'xe-utils'
import moment from "moment";

const apiBasic = new ApiBasic();
const apiQuotation = new ApiQuotation();
export default {
  name: "material_priceList",
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
    formatDate(){
      return (row, column) =>{
        return row[column.field] ? moment(row[column.field]).format("YYYY-MM-DD") : '';
      }
    },
    remainDay(){
      return (row) => {
        if(!row.validityEndDate) return {days: '', style: {}};
        const dateTime = moment(row.validityEndDate, "YYYY-MM-DD HH:mm:ss");
        let validityEndDate = row.validityEndDate;
        if (dateTime.isValid()) {
          if (dateTime.hours() === 0 && dateTime.minutes() === 0 && dateTime.seconds() === 0) {
            validityEndDate = dateTime.hours(23).minutes(59).seconds(59).format("YYYY-MM-DD HH:mm:ss");
          }
        } else {
          validityEndDate = moment(validityEndDate, "YYYY-MM-DD").hours(23).minutes(59).seconds(59).format("YYYY-MM-DD HH:mm:ss");
        }
        const days = moment(validityEndDate).diff(moment(), 'days');
        return {
          days,
          style: {
            color: days < Number(this.warnDays) ? 'red' : '#595959',
          },
        };
      }
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      dict,
      menuCode: "material_priceList",
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
        purchaseTypeList: (dict["purchase_type"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue, color: d.remark }
        }),
        flagList: [{label: '是',value:1}, {label: '否',value:0}],
      },
      warnDays: (dict["sys_config"] || []).find(x=>x.dictValue === 'warning_days')?.dictLabel ?? 30,
      allBtnControlList: [],
      importVisable: false,
    };
  },
  created() {
    this.setColumn();
  },
  activated() {
    this.$tabs.activeTab.title = findMenuByCode(this.menuCode)?.title ?? '价目表';
    this.getList();
  },
  beforeRouteLeave(to, from, next) {
    this.closePopup();
    next();
  },
  mounted() {},
  methods: {
    // 批量导入
    importOk(e){
      const loading = this.$loading({
        lock: true,
        text: '导入中',
        spinner: 'el-icon-loading',
      })
      apiBasic.postPriceImport(e[0]).then(res => {
        if(res.code === 200){
          this.getList();
        }else{
          this.$message.error(res.message);
        }
      }).finally(() => {
        loading.close()
      })
    },
    closePopup(){
      const { tools } = this.$refs;
      const { setting } = tools?.$refs;
      setting && setting.cancel();
      this.importVisable = false;
    },
    exprot(){
      return
      const loading = this.loading("导出中");
      apiBasic.getAccessExport({...this.condition}).then(res => {
        blobToFile(res, `导出${findMenuByCode(this.menuCode)?.title??'价目表'}_${moment().format("YYYYMMDDHHmm")}.xlsx`);
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
      apiBasic.getPriceList(this.condition, this.tablePage.currentPage, this.tablePage.pageSize).then(res => {
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
      this.$router.push({ path: `/material/priceList-detail/detail/${row.id}` });
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