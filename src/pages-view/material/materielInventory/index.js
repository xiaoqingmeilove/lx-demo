import { blobToFile } from '@/utils/utils';
import moment from "moment"
import { ApiBasic, ApiQuotation, ApiSystem } from '@/apis'
import XEUtils from 'xe-utils'
import { mapState } from 'vuex'
import { handleStorageColumns } from '@/utils/vxe-table'
import { findMenuByCode } from "@/utils/menu";
const apiQuotation = new ApiQuotation();
const apiSystem = new ApiSystem();
const apiBasic = new ApiBasic();
export default {
  name: "material_materielInventory",
  components: {},
  data() {
    const dict = this.$store.state.Common.dict
    return {
      dict,
      menuCode: 'material_materielInventory',
      columns: [],
      tableColumns: [],
      defaultColumns: [],
      warningList: [],
      tableData: [],
      tablePage: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20 : 20,
        total: 0,
        showTotal: () => `共${this.tablePage.total}条`,
      },
      searchOptions: [],
      sourceList: {
        stateList: [
          { label: "库存不足", value: 1 },
          { label: "库存正常", value: 0 },
        ],
        typeList: [
          { label: "安全库存", value: 0 },
          { label: "库存上限", value: 2 },
          { label: "库存下限", value: 1 },
        ],
        contactList: (dict['MsgType'] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        inviteUserList: [],
      },
      visible: false,
      setFormData: {},
      setRules: {
        warningType: [{ required: true, message: '请选择库存类型', trigger: 'blur' }],
        warningRatio: [{ required: true, message: '请输入预警阈值', trigger: 'blur' }],
        remindMethodObj: [{ required: true, message: '请选择通知方式', trigger: 'blur' }],
        remindUserObj: [{ required: true, message: '请选择通知人员', trigger: 'blur' }],
      },
      dataGather: [
        {
          config: [
            { label: '库存类型', field: 'warningType', type: 'radio', source: 'typeList' },
            { label: '预警阈值(%)', field: 'warningRatio', type: 'number' },
            { label: '通知方式', field: 'remindMethodObj', type: 'checkboxGroup', source: 'contactList' },   // , output: 'string'
            { label: '通知人员', field: 'remindUserObj', type: 'selectinput', props: { multiple: true, 'collapse-tags': true }, source: 'inviteUserList' },
            // { label: '关闭提醒天数', field: 'stopDays', type: 'number', inputSuffix: '天数'},
            { label: '关闭日期', field: 'startDate', slot: 'dateRange' },
          ]
        },
      ],
      time: '',
      endingDate: '',
    };
  },
  created() {
    this.setColumn();
    this.getSelectList();
  },
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '物料库存管理'}`;
    this.init();
  },
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    itemStyle() {
      return item => {
        let style = {}
        style.width = item.width || '50%'
        return style
      }
    },
    bindItemValue() {
      return (item) => {
        return '';
      };
    },
    bindItemClass() {
      return (item) => {
        if (item.slot) {
          return 'middle-title1'
        }
        return ''
      }
    }
  },
  mounted() { },
  methods: {
    async refresh() {
      const res = await apiBasic.getMaterialStockCheckWarning();
      this.init();
    },
    init() {
      this.getList();
      this.getWarningList();
    },

    // 预警转订单
    warningToOrder(ids) {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      let params = {
        ids: ids
      }
      apiBasic.getMaterialWarningOrder(params).then(res => {
        if (res.code === 200 && res.data) {
          this.$message.success(res.message ?? '转订单成功');
          const id = res.data.id
          this.$router.push({ path: `/purchaseOrder/orderApply-detail/${id}` });
        } else {
          this.$message.error(res.message ?? '转订单失败');
        }
      }).catch(err => {
        this.$message.error(err.message ?? '转订单失败');
      }).finally(() => {
        loading.close();
      })
    },
    onSetPopupOk(data) {
      let obj = { ...data };
      if (this.endingDate && this.endingDate.length) {
        obj.startDate = this.endingDate[0] ?? '';
        obj.endDate = this.endingDate[1] ?? '';
      }
      console.log(obj, 'obj');
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      apiBasic.postMaterialStockConfigSave(obj).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message ?? '设置成功');
          this.visible = false;
          this.init();
        } else {
          this.$message.error(res.message ?? '设置失败');
        }
      }).catch(err => {
        this.$message.error(err.message ?? '设置失败');
      }).finally(() => {
        loading.close();
      })
    },
    setRow(row) {
      this.visible = true;
      const config = row.config || null;
      this.setFormData = config ? { ...config, masterIdObj: [row.id], } : {
        masterIdObj: [row.id],
        warningType: 0,
        warningRatio: (this.dict["sys_config"] ?? []).find(d => d.dictValue === 'warning_ratio')?.dictLabel ?? 0,
        remindMethodObj: (this.dict['MsgType'] ?? []).filter(d => !Number(d.defaultFlag)).map(d => d.dictValue),
      };
      this.endingDate = config && config.startDate && config.endDate ? [config.startDate, config.endDate] : '';
    },
    batchSet() {
      const list = this.$refs.table.getCheckboxRecords();
      if (!list.length) {
        this.$message.warning('请选择要设置的物料');
        return;
      }
      this.visible = true;
      this.setFormData = {
        warningType: 0,
        masterIdObj: list.map(x => x.id),
        warningRatio: (this.dict["sys_config"] ?? []).find(d => d.dictValue === 'warning_ratio')?.dictLabel ?? 0,
        remindMethodObj: (this.dict['MsgType'] ?? []).filter(d => !Number(d.defaultFlag)).map(d => d.dictValue),
      };
      this.endingDate = '';
    },
    batchPurchaseOne(row) {
      if (row && row.id) {
        this.$confirm('确认转采购订单吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          this.warningToOrder([row.id]);
        });
      }
    },
    batchPurchaseList() {
      const list = this.$refs.table.getCheckboxRecords();
      if (!list.length) {
        this.$message.warning('请选择要采购的物料');
        return;
      }
      this.$confirm('确认转采购订单吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        let ids = list.map(x => x.id);
        this.warningToOrder(ids);
      });
    },
    getSelectList() {
      apiSystem.getOrderUsersList().then(res => {
        let sourceList = { ...this.sourceList };
        sourceList.inviteUserList = (res.data?.inquiryUser ?? []).map((i) => {
          return {
            ...i,
            label: i.nickName,
            value: i.userId,
          };
        });
        this.sourceList = { ...sourceList };
      })
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
    initTableConfig() {
      const { table, toolbar } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable();
      }
      this.defaultColumns = XEUtils.clone(this.columns, true);
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
    getWarningList() {
      apiBasic.getMaterialStockWarningList().then(res => {
        if (res.code === 200) {
          this.warningList = res.data || [];
        } else {
          this.$message.warning(res.message);
        }
      }).catch(err => {
        this.$message.error(err.message || "获取数据异常")
      })
    },
    getList() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      apiBasic.getMaterialStockList(this.condition, this.tablePage.currentPage, this.tablePage.pageSize).then(res => {
        if (res.code === 200) {
          this.tableData = [...res.data.records];
          this.tablePage.total = res.data.total;
          this.time = moment().format("YYYY-MM-DD HH:mm:ss");
        } else {
          this.$message.warning(res.message);
        }
      }).catch(err => {
        this.$message.error(err.message || "获取数据异常")
      }).finally(() => {
        loading.close();
      });
    },
    // 查询
    onSearch(value) {
      const condition = XEUtils.clone(value, true);
      this.tablePage.currentPage = 1;
      this.condition = { ...condition };
      this.init();
    },
    onReset() {
      this.condition = {};
      this.tablePage.currentPage = 1,
        this.init();
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
      this.init();
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
          this.tableColumns = columns
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