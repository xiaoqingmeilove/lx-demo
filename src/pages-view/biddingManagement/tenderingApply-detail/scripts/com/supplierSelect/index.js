import { mapState } from "vuex";
import { ApiBiddingManagement } from "@/apis";
import XEUtils from "xe-utils";
import supplierList from "@/pages-components/supplierList/index.vue";
import quotationDetails from "@/pages-components/page-quotation-details/index.vue";
import { handleStorageColumns } from "@/utils/vxe-table";


const apiBiddingManagement = new ApiBiddingManagement();

export default {
    name: "supplierSelect",
    components: {
        supplierList,
        quotationDetails
    },
    props: {
        form: {
            type: Object,
            default: () => ({}),
        },
        columnsData: {
            type: Array,
            default: () => [],
        },

        editState: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState({
            menus: (state) => state.User.menus ?? [],
            userInfo: (state) => state.User.userInfo ?? {},
            businessCode: (state) => state.Common.businessCode,
        }),
    },
    data() {
        return {
            formDataShow: {
                gys: true,
                gysbg: true,
                gyskp: false,
            },
            descSourceList: {
                suggestedFlag: [
                    { label: '是', value: 1 },
                    { label: '否', value: 0 },
                ],
            },
            addSupplierVisible: false,
            lookQuotation:false,
            localForm: {},
            rowData:{},
            columns:[],
            defaultColumns: [],
            combineOptions: [
                { label: "是否推荐入围", value: "suggestedFlag", type: "select" ,source: "suggestedFlag"},
                { label: "推荐理由", value: "suggestedRemark" },
            ],

        }
    },
    mounted() {
        this.init();
    },
    methods: {
        // 批量填充成功
        onCombineOptionsOk({ field, value }) {
            const selectedRows = this.$refs.table.getCheckboxRecords();
            if (selectedRows.length === 0) {
                this.$message.warning("请选中需填充产品！");
                return;
            }
            selectedRows.forEach((item, index) => {
                let rowindex = this.$refs.table.getRowIndex(item);
                this.$set(this.localForm.supplierList[rowindex], field, value);
            });
            this.$message.success("填充成功");
        },
        onCellDbClick(data){
            let row = data.row
            if( row.bidFlag != '1'){
                this.$message.warning("该供应商未报价");
                return false
            }
            this.onHoverClick(row)
        },
        onHoverClick(row){
            this.rowData = row
            this.lookQuotation = true
        },
        addSupplierData(data) {
            const dataClone = XEUtils.clone(data || [], true);
            console.log('dataClone' , dataClone);
            let form = { ...this.localForm };
            let supplierList = form.supplierList ?? [];
            const list = dataClone.filter(f => !supplierList.some(s => s.supplierId == f.supplierId));
            if (!list.length) {
                this.$message.warning("选择供应商已添加，请重新选择供应商");
                return
            }
            if (list) {
                list.map(item => {
                    item.id = null
                })
                supplierList = supplierList.concat(list);
                form.supplierList = supplierList;
                this.localForm = { ...form };
                this.$emit("update:form", this.localForm);
                this.$message.success("添加成功");
            };
        },
        gysSubmit() {
            const loading = this.loading("提交中");
            apiBiddingManagement.putShotlistSubmit({ id: this.localForm.id }).then(res => {
                if (res.code === 200) {
                    this.$message.success("供应商入围提交成功");
                    this.$emit("init");
                } else {
                    this.$message.error(res.message);
                }
            }).finally(() => {
                loading.close();
            });
        },
        gysSave() {
            const loading = this.loading("保存中");
            apiBiddingManagement.putShotlistEdit(this.localForm).then(res => {
                if (res.code === 200) {
                    this.$message.success("供应商入围保存成功");
                    this.$emit("init");
                } else {
                    this.$message.error(res.message);
                }
            }).finally(() => {
                loading.close();
            });
        },
        init() {
            this.initTableConfig();
        },
        initTableConfig() {
            const { table, toolbar } = this.$refs;
            console.log('table',this.$refs)
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
    watch: {
        form: {
            handler(newVal) {
                this.localForm = XEUtils.clone(newVal, true);
                if(newVal.bizFlowStatus>2){
                    this.formDataShow.gysbg = false;
                    this.formDataShow.gyskp = true;
                }
            },
            deep: true,
            immediate: true,
        },
        columnsData: {
            handler(newVal) {
                this.columns = newVal
            },
            deep: true,
            immediate: true,
        },
        
    },

}