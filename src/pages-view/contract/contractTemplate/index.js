import { ApiContract, ApiQuotation } from '@/apis'
import { mapState } from 'vuex'
import { handleStorageColumns, MaximizeTable } from '@/utils/vxe-table'
import { blobToFile } from '@/utils/utils';
import { findMenuByCode } from "@/utils/menu";
import XEUtils from 'xe-utils'
import moment from "moment";

const apiContract = new ApiContract();
const apiQuotation = new ApiQuotation();
export default {
  name: "contract_contractTemplate",
  components: {},
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
      menuCode: "contract_contractTemplate",
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
        contractTypeList: (dict["contract_type"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        signatureMethodList: (dict["signing_method"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
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
    this.$tabs.activeTab.title = findMenuByCode(this.menuCode)?.title ?? '合同模板';
    this.getList();
  },
  beforeRouteLeave(to, from, next) {
    this.closePopup();
    next();
  },
  mounted() {},
  methods: {
    setStatus(enableFlag) {
      const list = this.$refs.table.getCheckboxRecords();
      if(!list.length){
        this.$message.warning('请选择模板');
        return;
      }
      const loading = this.loading(enableFlag ? "启用中..." :"停用中...");
      const ids = list.map(d => d.id).join(",");
      apiContract.putContractTemplateStatus({ids, enableFlag}).then(res => {
        if(res.code === 200){
          this.$message.success('操作成功');
          this.getList();
        }else{
          this.$message.error(res.message || '操作失败');
        }
      }).catch(err=>{
        this.$message.error(err.message || '操作失败');
      }).finally(() => {
        setTimeout(() => {loading.close()}, 1000);
      })
    },
    add(){
      this.$router.push({ path: "/contract/contractTemplate-detail/detail" });
    },
    closePopup(){
      const { tools } = this.$refs;
      const { setting } = tools?.$refs;
      setting && setting.cancel();
    },
    exprot(){
      return;
      const loading = this.loading("导出中");
      apiContract.getSupplierExport({...this.condition}).then(res => {
        blobToFile(res, `导出${findMenuByCode(this.menuCode)?.title??'合同模板'}_${moment().format("YYYYMMDDHHmm")}.xlsx`);
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
      apiContract.getContractTemplateList(this.condition, this.tablePage.currentPage, this.tablePage.pageSize).then(res => {
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
        setTimeout(() => {loading.close()}, 1000);
      })
    },
    // 一览表双击事件 查看详情
    onCellDbClick({row}) {
      this.$router.push({ path: `/contract/contractTemplate-detail/detail/${row.id}` });
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