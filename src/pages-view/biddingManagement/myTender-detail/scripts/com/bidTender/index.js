import { mapState } from "vuex";
import { ApiBiddingManagement } from "@/apis";
import { handleNextFocus } from "@/utils/vxe-table";
import XEUtils from "xe-utils";
import FilelistList from "@/Controls/filelist-list/index.vue";
import { handleStorageColumns } from "@/utils/vxe-table";


const apiBiddingManagement = new ApiBiddingManagement();
export default {
    name: "bidTender",
    components: { FilelistList },
    props: {
        formData: {
            type: Object,
            default: () => ({}),
        },
        editState: {
            type: Boolean,
            default: false,
        },
        columns: {
            type: Array,
            default: () => [],
        },
        allBtnControlList: {
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
        calcSum() {
            return (code, data) => {
                if ((data || []).length) {
                    return data.reduce((total, cur) => {
                        let n = cur[code] || 0;
                        n = Number(n);
                        return XEUtils.add(total, n);
                    }, 0);
                }
            };
        },
        formatNumber() {
            return (value, digits) => {
                const decimal = this.getDecimalPlaces(value);
                const newValue = digits ? XEUtils.toFixed(value, decimal > digits ? decimal : digits) : (value || '').toString();
                return newValue.replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","))
            }
        },
        showfooter() {
            return (column = 'columns') => this[column].some(item => item.params && item.params.addFooter);
        },
        showBtn() {
            return (name) => {
                let find = this.allBtnControlList?.find((x) => x.btnCode == name);
                return find ?? false;
            };
        },

    },
    data() {
        const dict = this.$store.state.Common.dict;
        return {
            dict,
            formDataShow: {
                wlmxbj: true,
                bidBusinessFileList: true,
                bidTechnicalFileList: true,
                bidLetterFileList: true,
            },
            form: {
            },
            descSourceList: {
                taxRateList: (dict['tax_rate'] || []).map(x => {
                    return { label: x.dictLabel, value: x.dictValue }
                }),
            },
            btnControl:{},
            combineOptions: [
                { label: "申请数量", value: "qty", type: "number", toFixed: 2 },
                { label: "单价(元)", value: "price", type: "number", toFixed: 2 },
                { label: "税率%", value: "taxRate", type: "select", toFixed: 2 ,source: "taxRateList"},

                // {
                //     label: "需求日期", value: "purchaseDate", type: "date", props: {
                //         pickerOptions: {
                //             disabledDate(current) {
                //                 return current < moment().subtract(1, "day");
                //             },
                //         },
                //     }
                // },
            ],
            // bidBusinessFileList: [],
            // bidTechnicalFileList: [],
            // bidLetterFileList: [],
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
        },
        getBidTender() {
            const loading = this.loading("加载中...");
            let params = {
                id: this.formData.id,
            }
            apiBiddingManagement.getBidTender(params).then(res => {
                if (res.code == 200) {
                    this.form = res.data;
                    // this.bidBusinessFileList = res.data.bidBusinessFileList || [];
                    // this.bidTechnicalFileList = res.data.bidTechnicalFileList || [];
                    // this.bidLetterFileList = res.data.bidLetterFileList || [];
                }
            }).finally(() => {
                loading.close();
            })
        },
        tbSave() {
            const loading = this.loading("加载中...");
            apiBiddingManagement.postBidSave(this.form).then(res => {
                if (res.code == 200) {
                    this.$message.success(res.message);
                    this.$emit("init");
                }
            }).finally(() => {
                loading.close();
            })
        },
        tbSubmit() {
            const loading = this.loading("加载中...");
            apiBiddingManagement.putBidSubmit(this.form).then(res => {
                if (res.code == 200) {
                    this.$message.success(res.message);
                    this.$emit("init");
                }
            }).finally(() => {
                loading.close();
            })
        },
        // 批量填充成功
        onCombineOptionsOk({ field, value }) {
            const selectedRows = this.$refs.table.getCheckboxRecords();
            if (selectedRows.length === 0) {
                this.$message.warning("请选中需填充产品！");
                return;
            }
            selectedRows.forEach((item, index) => {
                console.log('item' , item);
                let rowindex = this.$refs.table.getRowIndex(item);
                this.$set(this.form.detailList[rowindex], field, value);
                this.inputChange(this.form.detailList[rowindex], rowindex, this.columns.find(x => x.field == field));
            });
            this.$message.success("填充成功");
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
        // 表尾
        footerMethod({ columns, data }) {
            const footerData = [
                columns.map((column, _columnIndex) => {
                    if (_columnIndex == 0) {
                        return `合计`;
                    }
                    if (column.params && column.params.addFooter) {
                        const sum = this.calcSum(column.property, data) || '';
                        if (column.params.displayDigits) {
                            return column.params.commafy
                                ? this.formatNumber(sum, column.params.displayDigits)
                                : column.params.percent
                                    ? `${XEUtils.toFixed(sum * 100, column.params.displayDigits)}%`
                                    : XEUtils.toFixed(sum, column.params.displayDigits);
                        }
                        if (column.params.percent) {
                            return `${sum * 100}%`;
                        }
                        return column.params.commafy ? this.formatNumber(sum) : sum;
                    }
                    return null;
                }),
            ];
            return footerData;
        },
        getDecimalPlaces(num) {
            if (!num) return 0;
            const strNum = num.toString();
            if (strNum.includes('.')) {
                return strNum.split('.')[1].length;
            }
            return 0;
        },
        onEventUpload({ files, groupId, next }, target) {
            this.form[target].push(files[0]);
        },
        onEventDeleteFile({ item, index, next }, target) {
            this.form[target].splice(index, 1);
        },
        // 表格小数位控制
        getDigits(field) {
            let item = this.columns.find((x) => x.field === field);
            const { params = {} } = item;
            return item && item.params && params.hasOwnProperty("displayDigits")
                ? item.params.displayDigits
                : 0;
        },
        upDownMove(e, rowIndex, columnIndex, column) {
            this.inputFocus(e, rowIndex, columnIndex, column);
        },
        inputChange(row, rowIndex, column) {
            console.log('inputChange', row, rowIndex, column);
            if (column.field == "price" || column.field == "qty") {
                row.amount = (row.price * row.qty).toFixed(2);
                row.taxAmount = (row.price - (row.price / (1 + row.taxRate / 100))).toFixed(2);
            }
            if (column.field == "taxRate") {
                row.taxAmount = (row.price - (row.price / (1 + row.taxRate / 100))).toFixed(2);
            }

        },
        inputFocus(e, rowIndex, columnIndex, column, row) {
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
            // this.columns = handleStorageColumns(tableColumns, table.id);
        },
    },
    watch: {
        formData: {
            handler(newVal) {
                this.getBidTender();
            },
            deep: true,
            immediate: true,
        },
        columns: {
            handler(newVal) {
                this.initTable();
            },
            deep: true,
            immediate: true,
        },
    },

}