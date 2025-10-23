import { ApiContract, ApiQuotation, ApiBiddingManagement } from '@/apis'
import { mapState } from 'vuex'
import { handleStorageColumns, MaximizeTable } from '@/utils/vxe-table'
import { blobToFile } from '@/utils/utils';
import { findMenuByCode } from "@/utils/menu";
import XEUtils from 'xe-utils'
import moment from "moment";
const apiQuotation = new ApiQuotation();
const apiBiddingManagement = new ApiBiddingManagement();

export default {
    name: "biddingManagement_bidReview_detail",
    components: {  },
    props: {
        formData: {
            type: Object,
            default: () => ({}),
        },
    },
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
            menuCode: "biddingManagement_bidReview_detail",
            form: {},
            cloneForm: {},
            headerRadio: "按专家查看",
            searchValue: "",
            columns: [],
            tableColumns: [],
            viewDetailList3: [],
            viewDetailList4: [],
            defaultColumns: {
                viewDetailList3: [],
                viewDetailList4: [],
            },
        };
    },

    mounted() {
        this.setColumn();
    },
    methods: {
      
        async setColumn() {
            const loading = this.$loading({
                lock: true,
                text: "正在加载",
                spinner: "el-icon-loading",
            });
            let data = {
                code: "viewDetailList3,viewDetailList4",
                corpCode: this.businessCode ?? "LX",
            };
            const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, data);
            if (res.code === 200 && res.data && res.data) {
                this.viewDetailList3 = [...res.data.viewDetailList3.columns];
                this.viewDetailList4 = [...res.data.viewDetailList4.columns];
                this.initTableConfig();
            }
            setTimeout(() => {
                loading.close();
            }, 1000);
        },
        initTable() {
            const { table } = this.$refs
            const tableColumns3 = this.viewDetailList3.map(item => {
                if (item.params && item.params.displayDigits) {
                    item.formatter = ({ cellValue, row, column }) => {
                        return XEUtils.toFixed(cellValue, item.params.displayDigits)
                    }
                }
                return item
            })
            const tableColumns4 = this.viewDetailList4.map(item => {
                if (item.params && item.params.displayDigits) {
                    item.formatter = ({ cellValue, row, column }) => {
                        return XEUtils.toFixed(cellValue, item.params.displayDigits)
                    }
                }
                return item
            })
            this.tableColumns = {
                viewDetailList3: handleStorageColumns(tableColumns3, table.id),
                viewDetailList4: handleStorageColumns(tableColumns4, table.id)
            }
        },
        getList(id) {
            const loading = this.loading('加载中');
            const data = {
                id: id,
            }
          apiBiddingManagement.getBidReviewDetail(data).then(res => {
            if(res.code === 200 && res.data){
                this.form = res.data
                this.cloneForm = XEUtils.clone(this.form, true)
                loading.close()
            }
          }).catch(err => {
            this.$message.error(err.message || "获取数据异常")
          }).finally(() => {
            loading.close()
          })
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
        initTableConfig() {
            const { table, toolbar } = this.$refs;
            if (table) {
                table.connect(toolbar);
                this.initTable();
            }

            // this.defaultColumns = XEUtils.clone(this.columns, true);
        },
        footerMethod() {
            const footerData = this.viewDetailList3.map((item, index) => {
              if (index === 0) return "最终得分";
              if (item.sum) {
                return this.calcSum(this.form.expertList, item.field);
              }
              return "";
            });
            return [footerData];
          },
          // 表尾
        footerMethod({ columns, data }) {
            const footerData = [
                columns.map((column, _columnIndex) => {
                    if (_columnIndex === 0) {
                    return "最终得分";
                    }
                    if (column.params && column.params.addFooter) {

                    return column.params.commafy ? this.formatNumber(this.calcSum(data, column.property), column.params.displayDigits) : XEUtils.toFixed(this.calcSum(data, column.property), column.params.displayDigits);
                    }
                    
                    return null;
                }),
            ];
            return footerData;
        },
        // 输出统计数据
        calcSum(data, code) {
            if (data.length) {
            return data.reduce((total, cur) => {
                let n = cur[code] || 0;
                n = Number(n);
                return total + n;
            }, 0);
            }
        },
        // 格式化千分位
        formatNumber(value, digits) {
            const newValue = XEUtils.toFixed(value, digits);
            return newValue.replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","))
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
    watch: {
        formData: {
            handler(newVal) {
                this.getList(newVal.masterId);
            },
            deep: true,
            immediate: true,
        },
    },
};