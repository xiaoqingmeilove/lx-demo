import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiBuy, ApiBiddingManagement, ApiSystem } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { handleNextFocus } from "@/utils/vxe-table";
import { previewFile } from '@/utils/utils';
import VXETable from "vxe-table";
import VueEasyLightbox from "vue-easy-lightbox";
import FilelistList from "@/Controls/filelist-list/index.vue";


const apiQuotation = new ApiQuotation();
const apiBiddingManagement = new ApiBiddingManagement();
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
export default {
    components: {
        VueEasyLightbox,
        FilelistList
    },
    props: {
        formData: {
            type: Object,
            default: () => ({}),
        },
        rowData: {
            type: Object,
            default: () => [],
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
        const dict = this.$store.state.Common.dict;
        return {
            dict,
            moment,
            menuCode: "bidding_tenderingApply",
            formDataShow: {
                cgmx: true,
            },
            form:{},
            columns: [],
        };
    },
   
    created() {
      this.init()
     },
    mounted() { },
    activated() {
      
    },
    methods: {
        // 表格小数位控制
        getDigits(field) {
            let item = this.columns.find((x) => x.field === field);
            const { params = {} } = item;
            return item && item.params && params.hasOwnProperty("displayDigits")
                ? item.params.displayDigits
                : 0;
        },
        init() {
          this.setColumn()
          this.getDetail();
        },
        getDetail() {
            if( !this.formData?.id ||  !this.rowData?.id){
                this.$message.error('数据异常');
                return false
            }
            const loading = this.$loading({
                lock: true,
                text: "加载中",
                spinner: "el-icon-loading",
            });
            let params ={
                id: this.formData?.id,
                supplierId: this.rowData?.id
            }
            apiBiddingManagement.getBidSupplierDetail(params).then((res) => {
                if (res.code === 200 && res.data) {
                    this.form = { ...res.data };
                } else {
                    this.$message.error(res.message);
                }
            }).finally(() => {
                loading.close();
            });
        },
   
        async setColumn() {
            const loading = this.$loading({
                lock: true,
                text: "正在加载",
                spinner: "el-icon-loading",
            });
            let data = {
                code: "quotationDetail",
                corpCode: this.businessCode ?? "LX",
            };
            const res = await apiQuotation.getColumnsConfigMulti('biddingManagement_myTender', data);
            if (res.code === 200 && res.data && res.data) {
                this.columns = [...res.data.quotationDetail.columns];
                this.initTableConfig();
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
                set_column: ({ columns }) => {
                    this.columns = columns;
                },
            };
        },
        validFormData() {
            return new Promise((resolve, reject) => {
                this.$refs.dataForm.validate((valid) => {
                    resolve(valid);
                });
            });
        },
     
 
        lztClose() {
            this.lztVisible = false;
            this.lztColumn = {};
            this.lztLoadText = "";
        },
        lztOpen(column) {
            if (!this.editState) return;
            this.lztVisible = true;
            this.lztColumn = column;
            const { visibleData } = this.$refs.table.getTableData();
            let list = [...visibleData];
            this.lztLoadText = (list ?? []).map((x) => x[column.field]).join("\n");
        },
        async lztOk(ztList) {
            const { field } = this.lztColumn;
            const { visibleData, tableData } = this.$refs.table.getTableData();
            if (ztList.length) {
                ztList.forEach((item, index) => {
                    if (visibleData[index]) {
                        visibleData[index][field] =
                            this.lztColumn &&
                                this.lztColumn.params &&
                                this.lztColumn.params.displayDigits
                                ? XEUtils.toFixed(item, this.lztColumn.params.displayDigits)
                                : item;
                    }
                });
                this.$message.success("操作成功");
                this.lztText = "";
                this.lztVisible = false;
                this.lztColumn = {};
                this.lztLoadText = "";
            }
        },
        upDownMove(e, rowIndex, columnIndex, column) {
            this.inputFocus(e, rowIndex, columnIndex, column);
        },
        inputFocus(e, rowIndex, columnIndex, column) {
            const { code } = e;
            const { table } = this.$refs;
            const max_row = this.form.detailList.length;
            const max_column = this.columns.length;

            //
            const container =
                column.fixed === "left"
                    ? table.$el.querySelector(".vxe-table--fixed-left-wrapper")
                    : column.fixed === "right"
                        ? table.$el.querySelector(".vxe-table--fixed-right-wrapper")
                        : table.$el;

            handleNextFocus(
                container,
                code,
                rowIndex,
                columnIndex,
                max_row,
                max_column
            );
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
