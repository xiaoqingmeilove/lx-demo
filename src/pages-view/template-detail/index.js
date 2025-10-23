import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiSystem } from "@/apis";
import { MaximizeTable, handleStorageColumns } from "@/utils/vxe-table";
const apiQuotation = new ApiQuotation();
let maximizeTable = null;
export default {
  components: {},
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
  },
  data() {
    return {
      editState:false,
      menuCode: "template-detail",
      form: {
        billNo: "ccc-2024111101",
        billState: 2,
        id: "111",
        aaa: "ccc-2024111101ccc-",
        createUserName: "高级用户",
        createTime: "2024-11/12 10:50:50",
        submissionTime: "2024-11/12 10:50:50",
        auditDate: "2024-11/12 10:50:50",
      },
      fileBillTpye: "EA",
      formDataShow: {
        xjqd: true,
        gysbj: true,
        zzjg: true,
        czjl: true,
        fjcz: true,
      },
      columns: [],
      rulesobj: {},
      descItems: [],
      descSourceList: {
        fileList: [{}, {}],
      },
      defaultColumns: [],
    };
  },
  created() {},
  mounted() {},
  activated() {
    this.init();
  },
  methods: {
    onFilelistUpdate(file) {
      return;
      this.descSourceList.fileList = file.fileList.map((item) => {
        return {
          label: item.originalFileName,
          value: item.id + "",
          fileName: item.fileName,
          filePath: item.filePath,
          url: item?.url,
          quotedBillFileId: item?.quotedBillFileId,
        };
      });
    },
    init() {
      this.setColumn();
    },
    async setColumn() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      let data = {
        code: "detailList",
        corpCode: this.businessCode ?? "LX",
      };
      const res = await apiQuotation.getColumnsConfig(this.menuCode, data);
      if (res.code === 200 && res.data && res.data.columns) {
        let columns = res.data.columns;
        this.columns = [...columns];
        this.initTableConfig();
      }
      let dataForm = {
        code: "detailForm",
        corpCode: this.businessCode ?? "LX",
      };
      const resform = await apiQuotation.getFormsConfig(
        this.menuCode,
        dataForm
      );
      if (resform.code === 200 && resform.data && resform.data.columns) {
        let dataItems = resform.data.columns;
        this.descItems = [...dataItems];
      }

      setTimeout(() => {
        loading.close();
      }, 1000);
    },
    initTableConfig() {
      const { table, toolbar } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable();
      }
      
      this.defaultColumns = XEUtils.clone(this.columns, true);
      // maximizeTable = new MaximizeTable(this.$refs.tableSection.$el);
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
    onToolOk(e) {
      const { type, data } = e;
      const fn = this.toolMethods()[type];
      fn && fn(data);
    },
    toolMethods() {
      return {
        maximize: (data) => {
          const { maximize } = data;
          if (maximize) {
            maximizeTable.maximize();
          } else {
            maximizeTable.restoreTable();
          }
        },
        set_column: ({ columns }) => {
          this.columns = columns;
        },
      };
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
