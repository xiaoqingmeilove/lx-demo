import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { columns } from "./scripts/columns";
import { descItems, descItems1 } from "./scripts/descItems";
import { findMenuByCode } from "@/utils/menu";
import { ApiBid, ApiQuotation } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";

const apiBid = new ApiBid()
const apiQuotation = new ApiQuotation()
export default {
  name: "bidding_supplierApply_detail",
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    showfooter(){
      return (column='columns') => this[column].some(item => item.params && item.params.addFooter);
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      menuCode: "bidding_supplierApply",
      activeName: 'jbxx',
      editState: false,
      backForm: {},
      moment,
      descItems: descItems,
      descItems1: descItems1,
      columns: [],
      tableColumns: [],
      defaultColumns: [],
      id: null,
      form: {
        detailList: []
      },
      offerForm: {},
      formDataShow: {
        cpxx: true,
        bjhz: true,
      },
      descSourceList: {},
      visible: {},
      allBtnControlList: [],
    };
  },
  created() {
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
    }
    this.setColumn();
  },
  mounted() {},
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '竞价报名'}详情`;
    if (this.id) {
      this.init();
    }else{
      this.editState = true;
    }
  },
  methods: {
    formatNumber(value, digits) {
      const newValue = XEUtils.toFixed(value, digits);
      return newValue.replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","))
    },
    calcSum(data, code) {
      if (data.length) {
        return data.reduce((total, cur) => {
          let n = cur[code] || 0;
          n = Number(n);
          return total + n;
        }, 0);
      }
    },
    footerMethod({columns, data}) {
      const footerData = [
        columns.map((column, _columnIndex) => {
          if (_columnIndex == 0) {
            return "合计";
          }
          if (column.params && column.params.addFooter) {
            return column.params.commafy ? this.formatNumber(this.calcSum(data, column.property), column.params.displayDigits) : XEUtils.toFixed(this.calcSum(data, column.property), column.params.displayDigits);
          }
          return null;
        }),
      ];
      return footerData;
    },
    showBtnConfig() {
      apiQuotation.postDetailBtnList(this.menuCode, {param: { id: this.id ?? null }}).then((res) => {
        if (res.code === 200) {
          this.allBtnControlList = res.data ?? [];
        } else {
          this.$message.error(res.message);
        }
      });
    },
    onUploadSuccess(e, field) {
      const fileList = XEUtils.clone(this[field].fileList || [], true);
      this.$set(this[field], "fileList", fileList.concat([{ ...e[0] }]));
    },
    getDetail() {
      const loading = this.loading('请求中');
      apiBid.getHallDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.form = res.data || {};
          this.offerForm = res.data.offerList && res.data.offerList.length ? res.data.offerList[0] : {};
        } else {
          this.$message.error(res.message ?? "获取失败");
        }
      }).catch((err) => {
        this.$message.error(err.message ?? "获取失败");
      }).finally(() => {
        loading.close();
      });
    },
    onFilelistUpdate(file) {
      this.descSourceList.fileList = (file?.fileList??[]).map((item) => {
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
      this.getDetail();
    },
    initTableConfig() {
      const { table, toolbar } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable('columns', 'tableColumns', table.id);
      }
      this.defaultColumns = XEUtils.clone(this.columns, true);
    },
    initTable(column, tableColumn, tableId) {
      const tableColumns = this[column].map((item) => {
        if (item.params) {
          item.formatter = ({ cellValue, row, column }) => {
            if(item.params.displayDigits){
              var value = XEUtils.toFixed(cellValue, item.params.displayDigits);
            }else{
              var value = cellValue;
            }
            return cellValue!=null ? item.params.percent ? `${value}%` : value : cellValue;
          };
        }
        return item;
      });
      this[tableColumn] = handleStorageColumns(tableColumns, tableId);
    },
    async setColumn() {
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, {code: "detailList",corpCode: this.businessCode ?? "LX"});
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, {code: "detailForm,detailForm1",corpCode: this.businessCode ?? "LX"});
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.initTableConfig();
      }
      if(resForm.code === 200 && resForm.data){
        this.descItems = resForm.data.detailForm?.columns ?? [];
        this.descItems1 = resForm.data.detailForm1?.columns ?? [];
      }
    },
    onToolOk(e, column) {
      const { type, data } = e
      const fn = this.toolMethods(column)[type]
      fn && fn(data)
    },
    toolMethods(column) {
      return {
        set_column: ({columns}) => {
          this[column] = [...columns]
        }
      }
    },
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
