import moment from "moment";
import { ApiSystem } from "@/apis";
import { mapState } from "vuex";
import XEUtils from "xe-utils";
import VXETable from "vxe-table";
import { descItems1 } from "./scripts/data/descItems.js";
import { MaximizeTable, handleStorageColumns } from "@/utils/vxe-table";
import { columns,headerList,defaultList,formColumns ,searchColumns} from "./scripts/data/column";
import mixin_table from "./scripts/mixins/table";
let maximizeTable = null;

const apiSystem = new ApiSystem();

const corpCodeList = [
  {
    label: "美和",
    value: "MHXL",
  },
  {
    label: "固达",
    value: "GDDL",
  },
  {
    label: "中联",
    value: "ZLDL",
  },
  {
    label: "缆新",
    value: "LX",
  },
];
const fixedList = [
  {
    label: "左固定",
    value: "left",
  },
  {
    label: "右固定",
    value: "right",
  },
];
const alignList = [
  {
    label: "居左",
    value: "left",
  },
  {
    label: "居中",
    value: "center",
  },
  {
    label: "居右",
    value: "right",
  },
];
const configTypeList = [
  {
    label: "table",
    value: "table",
  },
  {
    label: "form",
    value: "form",
  },
  {
    label: "search",
    value: "search",
  },
];
const enableList = [
  {
    label: "true",
    value: "true",
  },
  {
    label: "false",
    value: "false",
  },
];


export default {
  mixins: [mixin_table],
  watch: {},
  components: {},
  computed: {
    ...mapState({
      userInfo: (state) => state.User.userInfo ?? {},
    }),
    showSlot(){
      return (slots) => {
        return  slots ? slots:'未配置插槽';
      }
    },
    bindColumns(){
      if(this.form.configType == 'table'){
        return this.columns
      }else if(this.form.configType == 'form'){
        return this.formColumns
      }else if(this.form.configType == 'search'){
        return this.searchColumns
      }
      return []
    },
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      showEdit:localStorage.getItem("showConfig")  ?? false,
      formColumns,
      searchColumns,
      slotsIndex:null,
      slotsFormVisible:false,
      slotsObj: {},
      slotsDataGather:[
        {
          config:[
            {
              label: "内容插槽",
              field: "default",
              type: "selectinput",
              source: "defaultList",
              props: { allowCreate: true,clearable:true, placeholder: "请输入或选择" },
            },
            {
              label: "头部插槽",
              field: "header",
              type: "selectinput",
              source: "headerList",
              props: { allowCreate: true,clearable:true, placeholder: "请输入或选择" },
            },
          ]
        }
      ],
      columns,
      descItems1,
      combineOptions: [
        {
          label: "默认固定方式",
          value: "fixed",
          type: "select",
          source: "fixedList",
        },
        {
          label: "居中方式",
          value: "align",
          type: "select",
          source: "alignList",
        },
        {
          label: "是否可拖动大小",
          value: "resizable",
          type: "select",
          source: "enableList",
        },
        {
          label: "默认是否展示(必填)",
          value: "visible",
          type: "select",
          source: "enableList",
        },
        {
          label: "是否支持排序",
          value: "sortable",
          type: "select",
          source: "enableList",
        },
        {
          label: "是否支持筛选",
          value: "filterEnabled",
          type: "select",
          source: "enableList",
        },
      ],
      defaultColumns: [],
      tableData:[],
      id:null,
      form:{},
      editState:false,
      descSourceList: {
        corpCodeList: [...corpCodeList],
        configTypeList: [...configTypeList],
        headerList:[...headerList],
        defaultList:[...defaultList],
      },
      tableSourceList:{
        fixedList:[...fixedList],
        alignList:[...alignList],
        enableList:[...enableList]
      },
      backForm:{},
      backData:[],
      addRowNum: 1,
    };
  },
  created() {},
  mounted() {
    const { table, toolbar } = this.$refs;
    if (table) {
      table.connect(toolbar);
      this.initTable();
    }
    this.defaultColumns = XEUtils.clone(this.columns, true);
    maximizeTable = new MaximizeTable(this.$refs.tableSection.$el);
  },
  activated() {
    const { params, query } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
      this.init();
    }
  },
  watch: {},
  methods: {
    slotsFormOk(data){
      this.tableData[this.slotsIndex].slots = {...data};
      this.slotsFormVisible = false;
    },
    slotsClick(slots,index){
      this.slotsFormVisible = true;
      this.slotsObj = slots;
      this.slotsIndex = index;
    },
    addDtailList() {
      const list = new Array(Number(this.addRowNum)).fill(null).map((x) => {
        return {
          width:150,
          minWidth: 70,
          resizable:true,
          visible:true,
          align:"left",
        };
      });
      let detailList = [...this.tableData];
      detailList = detailList.concat(list);
      this.reloadTableData(detailList);
    },
     // 批量填充
     onCombineOptionsOk({ field, value }) {
      const selectedRows = this.$refs.table.getCheckboxRecords();
      if (selectedRows.length === 0) {
        this.$message.warning("请选中需填充产品！");
        return;
      }
      const detailList = [...this.tableData];
      selectedRows.forEach((item, index) => {
          let rowindex = this.$refs.table.getRowIndex(item);
          detailList[rowindex][field] = value;
      });
      this.reloadTableData(detailList);
      this.$message.success("填充成功");
    },
    getDigits(field) {
      let item = this.columns.find((x) => x.field === field);
      return item && item.params && item.params.displayDigits
        ? item.params.displayDigits
        : 0;
    },
    submit(){
      let tableData = [...this.tableData];
      tableData.forEach(item => {
        if(!Number(item.width)){
          delete item.width;
        }
        delete item._X_ROW_KEY;
      })
      let obj = {
        ...this.form,
        columns:this.tableData,
      }
      apiSystem.putTableColumnConfig(obj).then((res) => {
        if (res.code == 200) {
          this.editState = false;
          this.init();
          this.$message.success(res.message);
        } else {
          this.$message.error(res.message);
        }
      });
    },
     // 修改按钮
     editForm() {
      this.backForm = XEUtils.clone(this.form, true);
      this.backData =  XEUtils.clone(this.tableData, true);
      this.editState = true;
    },
    // 修改取消
    cancel() {
      this.editState = false;
      this.form = { ...this.backForm};
      this.tableData = [...this.backData];
      this.reloadTableData(this.tableData);
    },
    init(){
      this.getDetail();
    },
    getDetail(){
      apiSystem.getTableColumnConfigDetail({id:this.id}).then(res => {
        if(res.code === 200 && res.data){ 
          this.form = {...res.data}
          let tableData = res.data.columns ?? [];
          this.reloadTableData(tableData);
        }
      })
    },
    initTable() {
      const { table } = this.$refs;
      const tableColumns = columns.map((item) => {
        if (item.params && item.params.displayDigits) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, item.params.displayDigits);
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
      };
    },
    reloadTableData(data) {
      const { table } = this.$refs;
      const rows = table.getCheckboxRecords().map((row) => {
        return table.getRowIndex(row);
      });
      this.tableData = data;

      table.reloadData(data);
      for (let i = 0; i < rows.length; i++) {
        table.setCheckboxRow(data[rows[i]], true);
      }
    },
  },
};
