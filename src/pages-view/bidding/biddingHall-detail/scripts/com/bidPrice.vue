<template>
    <div class="out-price">
        <div class="out-price-table">
            <sub-title high title="商品出价">
                <template #description>
                    <div>请为以下商品输入您的报价（单价）</div>
                </template>
                <template #buttons>
                    <vxe-toolbar ref="toolbar" class="app-table-toolbar">
                        <template #tools>
                        <table-tools
                            :tools="['setting']"
                            :default-columns="defaultColumns"
                            @ok="(e) => onToolOk(e, 'columns')"
                        ></table-tools>
                        </template>
                    </vxe-toolbar>
                </template>
            </sub-title>
            <div class="out-price-table-main">
                <vxe-grid
                    :data="formData.detailList"
                    :id="`tb_biddingHall_detail_out_list_${userInfo.userId}`"
                    :custom-config="{ storage: true }"
                    :columns="tableColumns"
                    min-height="180px"
                    max-height="500px"
                    ref="table"
                >
                <template
                    #slot_edit_number="{
                        row,
                        rowIndex,
                        column,
                    }"
                >
                    <template v-if="readOnly">
                        <span>{{row[column.field]}}</span>
                    </template>
                    <template v-else>
                        <vue2-number-input
                            v-model="row[column.field]"
                            :controls="false"
                            focus-select
                            align="right"
                            :digits="getDigits(column)"
                            @input="(e)=>onEditNumberChange(e, row, column, rowIndex)"
                            @blur="(e)=>onEditNumberChange(e, row, column, rowIndex)"
                        ></vue2-number-input>
                    </template>
                    </template>
        </vxe-grid>
            </div>
        </div>
         <div class="out-price-form">
            <div class="out-price-form-total">
                合计总金额：{{signUpOfferAmount}}
            </div>
            <div class="out-price-form-submit">
                <page-button :disabled="readOnly" @click="ok">提交报价</page-button>
            </div>
            
         </div>
        <div class="out-price-form" v-if="false">
            <sub-title title="报价汇总" />
            <data-form
                :items="descItems"
                :form-data="signUpOffer"
                :editable="!readOnly"
                :source-list="descSourceList"
                :rules="rules"
                @change:input="changeInput"
                ref="dataForm"
            >
            </data-form>
        </div>
        <div class="out-price-footer" v-if="false">
            <template v-if="!readOnly">
                <page-button @click="close">取消</page-button>
                <page-button @click="ok">保存</page-button>
            </template>
            <template v-else>
                <page-button @click="close">关闭</page-button>
            </template>

        </div>
    </div>
</template>
<script>
import { ApiBid, ApiQuotation } from "@/apis";
import { mapState } from "vuex";
import { handleStorageColumns } from "@/utils/vxe-table";
import VXETable from "vxe-table";
import XEUtils from "xe-utils";
import moment from "moment";
const apiBid = new ApiBid()
const apiQuotation = new ApiQuotation()
function toChineseNumber(n) {  
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)){
        return "数据非法";  //判断数据是否大于0
    }
    let unit = "千百拾亿千百拾万千百拾元角分", str = "";
    n += "00";  
    let indexpoint = n.indexOf('.');  // 如果是小数，截取小数点前面的位数
    if (indexpoint >= 0){
        n = n.substring(0, indexpoint) + n.substr(indexpoint+1, 2);   // 若为小数，截取需要使用的unit单位
    }

    unit = unit.substr(unit.length - n.length);  // 若为整数，截取需要使用的unit单位
    for (let i=0; i < n.length; i++){
        str += "零壹贰叁肆伍陆柒捌玖".charAt(n.charAt(i)) + unit.charAt(i);  //遍历转化为大写的数字
    }
    return str.replace(/零(千|百|拾|角)/g, "零").replace(/(零)+/g, "零").replace(/零(万|亿|元)/g, "$1").replace(/(亿)万|壹(拾)/g, "$1$2").replace(/^元零?|零分/g, "").replace(/元$/g, "元整");
}  
export default {
    props: {
        formData: {
            type: Object,
            default: () => {}
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        menuCode: {
            type: String,
            default: 'bidding_biddingHall'
        }
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.User.userInfo ?? {},
            businessCode: (state) => state.Common.businessCode,
        }),
        signUpOfferAmount() {
            return XEUtils.toFixed(this.sum('amount'), this.getDescItemDigits('amount')); // this.signUpOffer.amount
        },
    },
    data(){
        return {
            descSourceList: {},
            rules: {},
            descItems: [],
            columns: [],
            tableColumns: [],
            defaultColumns: [],
            signUpOffer: {},
            tableData: [],
            rules:{
                quoteDescription: [{ required: true, message: '请输入报价说明', trigger: 'blur' },],
                amount: [{ required: true, message: '请输入含税总金额', trigger: 'blur' },],
                amountName: [{ required: true, message: '请输入金额大写', trigger: 'blur' },],
                untaxAmount: [{ required: true, message: '请输入不含税总价', trigger: 'blur' },],
                taxRate: [{ required: true, message: '请输入税额', trigger: 'blur' },],
            }
        }
    },
    mounted() {
        this.tableData = XEUtils.clone(this.formData?.detailList??[], true);
        this.signUpOffer = XEUtils.clone(this.formData?.signUpOffer??{}, true);
        this.setColumn();
        if(!this.readOnly) this.init();
    },
    methods: {
        init(){
            const amount = XEUtils.toFixed(this.sum('amount'), this.getDescItemDigits('amount'));
            const untaxAmount = XEUtils.toFixed(this.sum('untaxAmount'), this.getDescItemDigits('untaxAmount'));
            this.signUpOffer = {
                ...this.signUpOffer,
                amount,
                untaxAmount,
                taxRate: XEUtils.toFixed(XEUtils.subtract(amount, untaxAmount), this.getDescItemDigits('untaxAmount')),
                amountName: parseFloat(amount) ? toChineseNumber(amount) : ""
            };
        },
        async ok(){
            if(moment()>moment(this.formData.endTime)){
                this.$message.error('竞价截止时间已到，无法再次出价。');
                return
            }
            // const valid = await this.validFormData();
            // if (!valid) {
            //     this.$message.error("请填写必填项");
            //     return false;
            // }
            VXETable.modal.confirm({
                title: '提示',
                content: '确认是否出价',
                mask: true,
            }).then(type => {
                if (type === 'confirm') {
                    this.submit()
                }
            })
        },
        validFormData() {
            return new Promise((resolve, reject) => {
                this.$refs.dataForm.validate((valid) => {
                    resolve(valid);
                });
            });
        },
        submit(){
            const loading = this.$loading({
                lock: true,
                text: '保存中...',
                spinner: 'el-icon-loading',
            })
            const data = {
                ...this.formData,
                offerDetailList: [...this.formData.detailList], // [...this.tableData],
                signUpOffer: {...this.signUpOffer}
            }
            apiBid.putBiddingSignOffer(data).then(res=>{
                if(res.code === 200){
                    this.$message.success(res?.message ?? '操作成功');
                    this.$emit('ok')
                }else{
                    this.$message.error(res?.message ?? '操作失败');
                }
            }).catch(err=>{
                this.$message.error(err?.message ?? '操作失败');
            }).finally(()=>{
                loading.close();
            })
        },
        getColumnDigits(field, digits = 2){
            const find = this.columns.find(x=>x.field === field)
            if(find && find.params && find.params.displayDigits){
                return find.params.displayDigits
            }
            return digits;
        },
        getDescItemDigits(field, digits = 2){
            const find = this.descItems.find(x=>x.field === field)
            if(find && find.digits){
                return find.digits
            }
            return digits;
        },
        sum(field){
            const tableData = this.formData?.detailList ?? this.tableData
            return tableData.reduce((pre, cur) => XEUtils.add(pre, cur[field]), 0)
        },
        onEditNumberChange(e, row, column, rowIndex){
            row.untaxPrice = XEUtils.toFixed(parseFloat(row.price) / (1 + parseFloat(row.taxRate) / 100), this.getColumnDigits('untaxPrice'));
            row.amount = XEUtils.toFixed(parseFloat(row.price) * parseFloat(row.qty), this.getColumnDigits('amount'));
            row.untaxAmount = XEUtils.toFixed(parseFloat(row.untaxPrice) * parseFloat(row.qty), this.getColumnDigits('untaxAmount'));
            const amount = XEUtils.toFixed(this.sum('amount'), this.getDescItemDigits('amount'));
            const untaxAmount = XEUtils.toFixed(this.sum('untaxAmount'), this.getDescItemDigits('untaxAmount'));
            this.signUpOffer = {
                ...this.signUpOffer,
                amount,
                untaxAmount,
                taxRate: XEUtils.toFixed(XEUtils.subtract(amount, untaxAmount), this.getDescItemDigits('untaxAmount')),
                amountName: parseFloat(amount) ? toChineseNumber(amount) : ""
            };
        },
        close(){
            this.$emit('close');
        },
        changeInput(e){
            if(e && e.item && e.item.field=="amount"){
                this.signUpOffer.amountName = parseFloat(e.value) ? toChineseNumber(e.value) : "";
            }
        },
        getDigits(column) {
            return (column && column.params && column.params.displayDigits) ? column.params.displayDigits : 0;
        },
        async setColumn() {
            const data = {code: "outPriceList",corpCode: this.businessCode ?? "LX"};
            const res = await apiQuotation.getColumnsConfig(this.menuCode, data);
            const resForm = await apiQuotation.getFormsConfig(this.menuCode, data);
            if (res.code === 200 && res.data) {
                this.columns = res.data?.columns ?? [];
                this.initTableConfig();
            }
            if(resForm.code === 200 && resForm.data){
                this.descItems = resForm.data?.columns ?? [];
            }
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
    }
}
</script>
<style scoped lang="less">
.out-price{
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: auto;
    .out-price-table{
        display: flex;
        flex-direction: column;
        flex: 1;
        height: 0;
        .out-price-table-main{
            flex: 1;
            height: 0;
        }
    }
    .out-price-form{
        width: 100%;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 40px;
        background-color: #eef3fc;
        border: 1px solid #E1E4EE;
        border-top-width: 0;
        padding: 0 17px;
        .out-price-form-total {
            font-size: 16px;
            font-weight: 600;
        }
    }
    .out-price-footer{
        padding-top: 10px;
        text-align: right;
    }
}
/deep/ .el-form-item__error{
    top: 70%;
}
</style>