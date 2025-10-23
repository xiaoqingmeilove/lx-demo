import { mapState } from "vuex";
import { ApiBiddingManagement } from "@/apis";
import XEUtils from "xe-utils";
import { handleNextFocus } from "@/utils/vxe-table";
import { handleStorageColumns } from "@/utils/vxe-table";
import quotationDetails from "@/pages-components/page-quotation-details/index.vue";



const apiBiddingManagement = new ApiBiddingManagement();

export default {
    name: "bidReview",
    components: {
        quotationDetails
    },
    props: {
        formData: {
            type: Object,
            default: () => ({}),
        },
        editState: {
            type: Boolean,
            default: false,
        },
        bidConfirmItems: {
            type: Array,
            default: () => [],
        },
        bidConfirmColumns: {
            type: Array,
            default: () => [],
        },
        dbqrColumns: {
            type: Array,
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
            formDataShow: {
                jbxx: true,
                gysxx: true,
                dbqr: true,
            },
            form: {},
            cloneForm: {},
            dataForm: [],
            mergeCells: [],
            fileObj: {},
            descSourceList: {
                awardMethodList: (dict['award_method'] || []).map((x) => {
                    return { label: x.dictLabel, value: x.dictValue }
                }),
                bidResultList: (dict["bid_result"] ?? []).map((d) => {
                    return { label: d.dictLabel, value: d.dictValue };
                }),
            },
            rulesobj: {
                awardMethodCode: [{ required: true, message: "请选择授标方式" }],
            },
            lookQuotation:false,
            rowData:{}
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            console.log(this.form);
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
        handleDetail(row) {
            console.log(row);
        },
        // 定标保存
        handleSave() {
            const loading = this.loading('加载中...');
            let params = {
                id: this.form.id,
                awardList: this.form.awardList,
                awardMethodCode: this.form.awardMethodCode,
                supplierIdList: this.form.supplierList.filter(x=>x.registrationStatus == 4).map(x=>x.id),
            }
            apiBiddingManagement.putBidAwardSave(params).then(res => {
                if (res.code === 200) {
                    this.$message.success("中标结果保存成功");
                    this.$emit('init');
                } else {
                    this.$message.error(res.message);
                }
            }).catch(() => {
                this.$message.error(res.message);
            }).finally(() => {
                loading.close();
            });
        },
        // 定标提交
        handleSubmit() {
            const loading = this.loading('加载中...');
            let params = {
                id: this.form.id,
            }
            apiBiddingManagement.putBidAwardSubmit(params).then(res => {
                if (res.code === 200) {
                    this.$message.success("中标结果提交成功");
                    this.$emit('init');
                } else {
                    this.$message.error(res.message);
                }
            }).catch(() => {
                this.$message.error(res.message);
            }).finally(() => {
                loading.close();
            });
        },
        handleConfirm() {
            const row = this.$refs.table.getCheckboxRecords()
            if (!row.length) {
                this.$message.warning("请选择中标供应商");
                return;
            }
            this.$confirm('确认中标供应商吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const loading = this.loading('加载中...');
                let params = {
                    id: this.form.id,
                    awardMethodCode: this.form.awardMethodCode,
                    awardMethodName: this.form.awardMethodName,
                    supplierIdList: row.map(x => x.id),
                }
                apiBiddingManagement.putBidAwardConfirm(params).then(res => {
                    if (res.code === 200) {
                        this.form.awardList = res.data;
                        this.form.supplierList.forEach(x=>{
                            let findRow = row.find(y=>y.id == x.id);
                            if(findRow && findRow.id == x.id){
                                x.registrationStatus = 4;
                                x.registrationStatusName = "已中标";
                            } else {
                                x.registrationStatus = 5;
                                x.registrationStatusName = "未中标";
                            }
                        })
                    } else {
                        this.$message.error(res.message);
                    }
                }).finally(() => {
                    loading.close();
                });
            })

        },
        getBidAwardDetail(id) {
            const loading = this.loading('加载中...');
            let params = {
                id: id,
            }
            apiBiddingManagement.getBidAwardDetail(params).then(res => {
                if (res.code === 200) {
                    this.form = res.data;
                    this.cloneForm = XEUtils.clone(res.data);
                    this.handleMerges();
                }
            }).finally(() => {
                loading.close();
            });

        },
        handleMerges() {
            const merges = [];
            const fields = (this.dbqrColumns || []).reduce((group, item) => {
                if (item.params && item.params.merges) {
                    group.push(item.field);
                }
                return group;
            }, []);
            const tableData = [...this.form.awardList];
            fields.forEach((field) => {
                const colIndex = this.dbqrColumns.findIndex(
                    (x) => x.field === field
                );
                let startRow = 0;
                let count = 1;
                // console.log("tableData",tableData);
                for (let i = 1; i <= tableData.length; i++) {
                    const item = tableData[i];
                    if ( i < tableData.length && item && item[field] === tableData[i - 1][field] && item.materialCode === tableData[i - 1].materialCode ) {
                        count++;
                    } else {
                        if (count > 1) {
                            merges.push({
                                row: startRow,
                                rowspan: count,
                                col: colIndex,
                                colspan: 1,
                            });
                        }
                        startRow = i;
                        count = 1;
                    }
                }
            });

            this.mergeCells = [...merges];
            this.$refs.dbqrTable.setMergeCells(this.mergeCells);
        },
        // 表格小数位控制
        getDigits(field) {
            let item = this.dbqrColumns.find((x) => x.field === field);
            const { params = {} } = item;
            return item && item.params && params.hasOwnProperty("displayDigits")
                ? item.params.displayDigits
                : 0;
        },
        bidResultChange(e, row, rowIndex) {
            row.bidResultName = this.descSourceList.bidResultList.find(x => x.value == e)?.label;
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
            const { visibleData } = this.$refs.dbqrTable.getTableData();
            let list = [...visibleData];
            this.lztLoadText = (list ?? []).map((x) => x[column.field]).join("\n");
        },
        async lztOk(ztList) {
            const { field } = this.lztColumn;
            const { visibleData, tableData } = this.$refs.dbqrTable.getTableData();
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
            const { dbqrTable } = this.$refs;
            const max_row = this.form.awardList.length;
            const max_column = this.dbqrColumns.length;

            //
            const container =
                column.fixed === "left"
                    ? dbqrTable.$el.querySelector(".vxe-table--fixed-left-wrapper")
                    : column.fixed === "right"
                        ? dbqrTable.$el.querySelector(".vxe-table--fixed-right-wrapper")
                        : dbqrTable.$el;

            handleNextFocus(
                container,
                code,
                rowIndex,
                columnIndex,
                max_row,
                max_column
            );
        },
        integerInputChage(row, rowIndex, field) {
            row[field] = XEUtils.round(row[field], 0);
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
        formData: {
            handler(newVal) {
                this.getBidAwardDetail(newVal.masterId);
            },
            deep: true,
            immediate: true,
        },
        bidConfirmItems: {
            handler(newVal) {
                this.dataForm = newVal
            },
            deep: true,
            immediate: true,
        },
        editState: {
            handler(newVal) {
                // console.log('editState',newVal);
                if (newVal) {
                    this.form = XEUtils.clone(this.form);
                } else {
                    this.form = this.cloneForm;
                }
            },
        }
    },

}