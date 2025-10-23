<template>
    <div>
        <vxe-modal
            v-model="salesObj.flag"
            :width="width"
            @close="$emit('close',false)"
        >
            <template #title>
                <span class="del-title">{{salesObj.title}}业务员 </span>
                <span style="margin-left: 10px;display: inline-block;">
                    <img :src="require(`/static/images/ic-guanlian.png`)" alt="img">
                    <page-button style="margin-left: 5px" type="text" @click="addUserDlg=true">关联用户</page-button>
                </span>
            </template>
            <template #default>
                <el-form ref="roleForm" :rules="rules" :model="salesObj.form" label-width="120px">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="所属区域" prop="salesmanManagerId">
                                <el-select-tree
                                    v-model="salesObj.form.salesmanManagerId"
                                    class="popup-form--selecttree"
                                    filterable
                                    clearable
                                    check-strictly
                                    node-key="id"
                                    size="small"
                                    :props="{label:'name', children:'children'}"
                                    :data="formList.regionList"
                                >
                                </el-select-tree>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="业务员姓名" prop="name">
                                <el-input v-model="salesObj.form.name" placeholder="请输入业务员姓名" size="small"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="业务员编码">
                                <el-input v-model="salesObj.form.code" placeholder="请输入业务员编码" size="small"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="用户名">
                                <el-input v-model="salesObj.form.userName" disabled placeholder="请输入用户名" size="small"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="手机号" >
                                <el-input v-model="salesObj.form.phone" disabled placeholder="请输入手机号" size="small"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="身份证" >
                                <el-input v-model="salesObj.form.identity" disabled placeholder="请输入身份证" size="small"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="微信号">
                                <el-input v-model="salesObj.form.webchatNo" disabled placeholder="请输入微信号" size="small"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮箱">
                                <el-input v-model="salesObj.form.email" disabled placeholder="请输入邮箱" size="small"/>
                            </el-form-item>
                        </el-col>
                    </el-row>
                     <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="性别">
                               <el-select v-model="salesObj.form.sex" disabled placeholder="请选择" size="small" style="width: 100%;">
                                    <el-option
                                        v-for="item in formList.sexList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型">
                                <el-select v-model="salesObj.form.type" placeholder="请选择" size="small" style="width: 100%;">
                                    <el-option
                                        v-for="item in formList.typeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                     <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="显示顺序">
                                <el-input-number
                                    v-model="salesObj.form.orderNum"
                                    :controls="false"
                                    :min="0"
                                    placeholder="请输入显示顺序"
                                    size="small"
                                    style="width:100%"
                                >
                                </el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="区域经理">
                                <el-radio-group v-model="salesObj.form.managerAdmin">
                                    <el-radio v-for="(item, index) in formList.managerAdmin" :key="index" :label="item.value" >{{item.label}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                     <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="备注">
                                <el-input v-model="salesObj.form.remark" type="textarea" placeholder="请输入备注" size="small"/>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="启用状态">
                                <el-radio-group v-model="salesObj.form.status">
                                    <el-radio v-for="(item, index) in formList.status" :key="index" :label="item.value" >{{item.label}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="个人基价任务量">
                                <el-input v-model="salesObj.form.personalBasePriceTaskLoad" placeholder="请输入个人基价任务量" size="small"
                                  type="number"
                                />
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12" v-if="businessCode==='TYDL'">
                            <el-form-item label="业务类型">
                                <el-select v-model="salesObj.form.quoteType" placeholder="请选择" size="small" style="width: 100%;" @change="quoteTypeChange">
                                    <el-option
                                        v-for="item in formList.quoteTypeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col> -->
                    </el-row>
                </el-form>
                <div style="margin:25px 0 10px; text-align:right">
                    <page-button theme="default" @click="$emit('close')">取消</page-button>
                    <page-button @click="submit">保存</page-button>
                </div>
            </template>

        </vxe-modal>
        <vxe-modal
            v-model="addUserDlg"
            title="关联用户"
            width="700"
            :mask="false"
        >
            <add-member v-if="addUserDlg" :roleObj="regionObj" :selectRole="salesObj.form.userId?[{...salesObj.form}]:[]" :associated="true" ok-text="确定" @Ok="addUserOk" @close="addUserDlg=false"></add-member>
        </vxe-modal>

    </div>
</template>
<script>
import addMember from './addMember.vue'
import { ApiSystem } from '@/apis'
import { mapState } from 'vuex'
const apiSystem = new ApiSystem()
export default {
    name: 'addSales',
    props: {
        salesObj: {
            type: Object,
            default() {
                return {
                    title: '新增',
                    form: {},
                    flag: false
                }
            },
            required: true
        },
        regionList: {
            type: Array,
            default: ()=>[],
        },
        width: {
            type: Number,
            default: 800
        }
    },
    components: {
        addMember,
    },
    computed: {
        ...mapState({
            businessCode: (state) => state.Common.businessCode,
        }),
    },
    data(){
        const dict = this.$store.state.Common.dict
        return {
            addUserDlg: false,
            regionObj: {},
            tableOrg: [],
            rules: {
                name: [{ required: true, message: "请输入业务员姓名" },],
                salesmanManagerId: [{ required: true, message: "请选择所属区域" }],
                // identity: [
                //     {
                //         validator: (rule, value, callback) => {
                //             let resObj = this.IdCodeValid(value);
                //             if (!resObj?.pass && value) {
                //                 callback(new Error(resObj.msg || '身份证格式错误'))
                //             } else {
                //                 callback()
                //             }
                //         }
                //     }
                // ],
                // phone: [
                //     {
                //         validator: (rule, value, callback) => {
                //             if (!/^[0-9]*$/.test(value) && value) {
                //                 callback(new Error('请输入数字'))
                //             } else {
                //                 callback()
                //             }
                //         }
                //     }
                // ],
            },
            formList: {
                regionList: [],
                managerAdmin: [{ label: '是', value: 1 }, { label: '否', value: 0 }],
                status: [{ label: '启用', value: "0" }, { label: '停用', value: "1" } ],
                sexList:[{ label: '女', value: "1" }, { label: '男', value: "0" }],
                typeList:[{ label: '内部', value: 1 }, { label: '外部', value: 2 }],
                quoteTypeList: (dict["quote_type"] ?? []).map((d) => {
                    return { label: d.dictLabel, value: d.dictValue };
                }),
            }
        }
    },
    activated(){},
    created(){
        this.formList.regionList = this.regionList ? [...this.regionList] : []
    },
    methods:{
        quoteTypeChange(e){
            const find = this.formList.quoteTypeList.find(x=>x.value === e);
            if(find){
                this.salesObj.form.quoteTypeName = find.label;
            }
        },
        submit(){
            this.$refs.roleForm.validate((valid, obj) => {
                if (valid) {
                    this.$emit('ok', this.salesObj)
                } else {
                    const flag = Object.keys(obj).includes('identity');
                    this.$message.warning(flag?'请检查身份证号格式':'请检查必填项');
                    return false;
                }
            });
        },
        addUserOk(data){
            if(!!data){
                apiSystem.getUserInfo(data.id).then(res=>{
                    if(res.code===200){
                        this.addUserDlg=false;
                        const form = {...this.salesObj.form};
                        const obj = {
                            userId: data.id,
                            userName: res.data?.userName ?? data.name,
                            name: res.data?.nickName ?? '',
                            phone: res.data?.phone ?? '',
                            identity: res.data?.personId ?? '',
                            webchatNo: res.data?.webchatNo ?? '',
                            email: res.data?.email ?? '',
                            sex: res?.data.sex ?? '',

                            // phone: form.phone ? form.phone : res.data?.phone,
                            // identity: form.identity ? form.identity : res.data?.personId,
                            // webchatNo: form.webchatNo ? form.webchatNo : res.data?.webchatNo,
                            // email: form.email ? form.email : res.data?.email,
                            // sex: form.sex ? form.sex : res.data?.sex,
                        }
                        this.salesObj.form={...this.salesObj.form, ...obj}
                    }else{
                        this.$message.warning(res.message||'查询用户异常')
                    }
                }).catch(err=>{
                    this.$message.error(err.message||'查询用户异常')
                })
            }
        },
        // 判断身份证号码是否正确
        IdCodeValid (code) {
            var city = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江 ", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外 " };
            var row = {
                'pass': true,
                'msg': '验证成功'
            };
            if (!code || !/^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(code)) {
                row = {
                'pass': false,
                'msg': '身份证号格式错误'
                };
            } else if (!city[code.substr(0, 2)]) {
                row = {
                'pass': false,
                'msg': '身份证号地址编码错误'
                };
            } else {
                //18位身份证需要验证最后一位校验位
                if (code.length == 18) {
                code = code.split('');
                //加权因子
                var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
                //校验位
                var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                var sum = 0;
                var ai = 0;
                var wi = 0;
                for (var i = 0; i < 17; i++) {
                    ai = code[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                if (parity[sum % 11] != code[17].toUpperCase()) {
                    row = {
                    'pass': false,
                    'msg': '身份证号校验位错误'
                    };
                }
                }
            }
            return row;
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-form-item__error {
  top: 70% !important;
}
/deep/ .el-input-number.is-without-controls .el-input__inner{
    text-align: left;
}
</style>
