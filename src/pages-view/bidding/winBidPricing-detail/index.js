import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiBid } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { findMenuByCode } from "@/utils/menu";
import VXETable from "vxe-table";
import columnPasting from "@/pages-components/columnPasting/index.vue";
const apiQuotation = new ApiQuotation();
const apiBid = new ApiBid();
export default {
  name: 'bidding_winBidPricing_detail',
  components: { columnPasting },
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    showBtn() {
      return (name) => {
        let find = this.allBtnControlList?.find((x) => x.btnCode == name);
        return find ?? false;
      };
    },
    showfooter(){
      return (column='columns') => this[column].some(item => item.params && item.params.addFooter);
    },
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      menuCode: "bidding_winBidPricing",
      activeName: 'jbxx',
      fileBillTpye: "HJ",
      id: null,
      allBtnControlList: [],
      editState: false,
      form: {
        detailList:[],
      },
      formDataShow: {
        cgmx: true,
        fjcz: true,
        gysbjqd:true,
        zbjg:true
      },
      backForm: {},
      columns: [],
      mergeCells: [],
      supplierColumns: [],
      supplierTableColumns: [],
      summaryColumns: [],
      summaryTableColumns: [],
      supplierDefaultColumns: [],
      summaryDefaultColumns: [],
      rulesobj: {},
      descItems: [],
      descSourceList: {
        fileList: [],
        awardMethodList:(dict["award_method"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        bidResultList: (dict["bid_result"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
      },
      defaultColumns: [],
    };
  },
  created() {
    this.setColumn();
  },
  mounted() {},
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '竞价中标查询'}详情`;
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
      this.init();
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
    handleMerges() {
      const merges = [];
      const fields = (this.summaryTableColumns||[]).reduce((group, item)=>{
        if(item.params && item.params.merges){
          group.push(item.field);
        }
        return group;
      }, []);
      const tableData = XEUtils.clone(this.form.detailsList||[], true);
      fields.forEach(field => {
        const colIndex = this.summaryColumns.findIndex(x => x.field === field)
        let startRow = 0
        let count = 1

        for (let i = 1; i <= tableData.length; i++) {
          const item = tableData[i]
          if (i < tableData.length
            && (item.businessBillNo === tableData[i - 1].businessBillNo)
            && (item[field] === tableData[i - 1][field])
          ) {
            count++
          } else {
            if (count > 1) {
              merges.push({
                row: startRow,
                rowspan: count,
                col: colIndex,
                colspan: 1
              })
            }
            startRow = i
            count = 1
          }
        }
      });
      this.mergeCells = [...merges];
    },
    getSelectList() {
      apiBid.getApplicants(this.id).then(res=>{
        if(res.code === 200){
          const supplierList = (res.data || []).map(x=>{
            return {...x, label: x.businessLicense, value: x.businessLicense}
          });
          this.$set(this.descSourceList, 'supplierList', supplierList);
        }
      })
    },
    onFilelistUpdate(file) {
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
      this.getDetail();
      // this.showBtnConfig();
    },
    getDetail() {
      const loading = this.loading('加载中');
      apiBid.getBidDetail(this.id).then((res) => {
        if (res.code === 200 && res.data) {
          this.form = { ...res.data };
          this.$nextTick(()=>{
            this.handleMerges();
          })
        } else {
          this.$message.error(res?.message ?? '请求异常');
        }
      }).catch(err=>{
        this.$message.error(err?.message ?? '请求异常');
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
      const data = {
        code: "supplierDetailList,summaryList",
        corpCode: this.businessCode ?? "LX",
      };
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, data);
      if (res.code === 200 && res.data) {
        const  supplierColumns = res.data.supplierDetailList?.columns??[];
        const summaryColumns = res.data.summaryList?.columns??[];
        this.supplierColumns = [...supplierColumns];
        this.summaryColumns = [...summaryColumns];
        this.initTableConfig();
      }
      const dataForm = {
        code: "detailForm",
        corpCode: this.businessCode ?? "LX",
      };
      const resform = await apiQuotation.getFormsConfig(
        this.menuCode,
        dataForm
      );
      if (resform.code === 200 && resform.data && resform.data.columns) {
        const dataItems = resform.data.columns;
        this.descItems = [...dataItems];
      }
      this.handleMerges();
    },
    initTableConfig() {
      const { suppliertoolbar, supplierTable, summarytoolbar, summarytable } = this.$refs;
      if (supplierTable) {
        supplierTable.connect(suppliertoolbar);
        this.initTable('supplierColumns', 'supplierTableColumns', supplierTable.id);
      }
      if (summarytable) {
        summarytable.connect(summarytoolbar);
        this.initTable('summaryColumns', 'summaryTableColumns', summarytable.id);
      }
      this.supplierDefaultColumns = XEUtils.clone(this.supplierColumns, true);
      this.summaryDefaultColumns = XEUtils.clone(this.summaryColumns, true);
    },
    initTable(column, tableColumn, tableId) {
      const tableColumns = this[column].map((item) => {
        const { params = {} } = item;
        if (item.params && params.hasOwnProperty("displayDigits")) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits);
          };
        }
        return item;
      });
      this[tableColumn] = handleStorageColumns(tableColumns, tableId);
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
          if(column === "summaryTableColumns") this.$nextTick(()=>this.handleMerges())
        }
      }
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
