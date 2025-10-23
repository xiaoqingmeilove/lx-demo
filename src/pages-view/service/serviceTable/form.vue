<template>
    <div class="service-form">
        <el-form ref="serviceForm" :rules="rules" :model="form" label-width="120px">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="单据号" prop="billNo">
                        <el-input v-model="form.billNo" placeholder="系统自动生成" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="服务标题" prop="serviceTitle">
                        <el-input v-model="form.serviceTitle" placeholder="请输入服务标题" clearable/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="单据类型" prop="sourceBillType">
                        <el-select style="width:100%" v-model="form.sourceBillType" placeholder="请选择单据类型" clearable @change="getBillTypeName">
                            <el-option v-for="i in sourceBillTypeList" :key="i.dictValue" :label="i.dictLabel" :value="i.dictValue"/>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="业务单据" prop="sourceBillNo">
                        <el-input v-model="form.sourceBillNo" placeholder="请输入业务单据" clearable>
                            <el-button slot="append" type="primary" class="search-btn" @click="autoFill">查询</el-button>
                        </el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="关联客户" prop="customerName">
                        <el-autocomplete style="width:100%" v-model="form.customerName" :fetch-suggestions="querySearch" placeholder="请输入或选择客户名称">
                            <template slot-scope="{ item }"><div>{{ item.value }}</div></template>
                        </el-autocomplete>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="关联项目" prop="sourceProjectName">
                        <el-input v-model="form.sourceProjectName" placeholder="请输入关联项目" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="问题类型" prop="problemType">
                        <el-select style="width:100%" v-model="form.problemType" placeholder="请选择问题类型">
                            <el-option v-for="i in problemTypeList" :key="i.dictValue" :label="i.dictLabel" :value="i.dictValue"/>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="优先级" prop="priority">
                        <el-radio-group v-model="form.priority">
                            <el-radio-button :label="i.dictValue" v-for="i in priorityList" :key="i.dictValue">{{i.dictLabel}}</el-radio-button>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="要求解决的日期" prop="customerFinishDate">
                        <el-date-picker style="width:100%" v-model="form.customerFinishDate" type="datetime" placeholder="请选择日期时间"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="信息来源" prop="infoSources">
                        <el-select style="width:100%" v-model="form.infoSources" placeholder="请选择信息来源">
                            <el-option v-for="i in infoSourcesList" :key="i.dictValue" :label="i.dictLabel" :value="i.dictValue"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="业务员" prop="salesName">
                        <el-input v-model="form.salesName" placeholder="请输入业务员" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="业务员电话" prop="salesTel">
                        <el-input v-model="form.salesTel" placeholder="请输入业务员电话" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="联系人" prop="contactsName">
                        <el-input v-model="form.contactsName" placeholder="请输入联系人" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="联系电话" prop="contactsPhone">
                        <el-input v-model="form.contactsPhone" placeholder="请输入联系电话" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="所在区域" prop="areaCodeList">
                        <pca-cascader v-model="form" data-type="string" :check-strictly="false" style="width:100%" placeholder="请选择所在区域"></pca-cascader>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="详细地址" prop="detailAddress">
                        <el-input v-model="form.detailAddress" placeholder="请输入详细地址" clearable></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item label="问题描述" prop="problemDescription">
                        <el-input type="textarea" placeholder="请输入问题描述" :rows="3" v-model="form.problemDescription" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item label="涉及产品" prop="afterSalesBillProductList">
                        <el-button style="float:left" type="text" icon="el-icon-circle-plus-outline" @click="addproduct">添加产品</el-button>
                    </el-form-item>
                    <div class="service-product">
                        <vxe-grid :data="form.afterSalesBillProductList" :columns="columns" :height="(!form.afterSalesBillProductList.length?90:40)+form.afterSalesBillProductList.length*41">
                            <template #slot_edit_number="{ row, column }">
                                <el-input-number style="width:100%" v-model="row[column.field]" :min="1" :controls="false" label="请输入"></el-input-number>
                            </template>
                            <template #slot_edit_input="{ row, column }">
                                <el-input placeholder="请输入" v-model="row[column.field]"></el-input>
                            </template>
                            <template #operation="{ rowIndex }">
                                <el-button type="text" @click="delproduct(rowIndex)">删 除</el-button>
                            </template>
        </vxe-grid>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item label="上传附件" prop="afterSalesBillFileList">
                        <SysUpload :key="num" :files="form.afterSalesBillFileList" @getFiles="getFiles"/>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div style="text-align:center">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="primary" @click="$emit('close')">关闭</el-button>
        </div>
    </div>
</template>
<script>
import SysUpload from './sysUpload'
import moment from 'moment'
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()
import { ApiService } from '@/apis'
const apiService = new ApiService()

export default {
    props: ['create', 'data'],
    components:{ SysUpload },
    data() {
        return {
            id:0,
            num:0,
            columns:[
                { title: '序号', field: 'rowNum', width: 80, minWidth: 70, align: 'center' },
                { title: '型号', field: 'model', minWidth: 70, align: 'center', slots:{default: "slot_edit_input"} },
                { title: '规格', field: 'standard', minWidth: 70, align: 'center', slots:{default: "slot_edit_input"} },
                { title: '电压', field: 'voltageLevel', width: 120, minWidth: 70, align: 'center', slots:{default: "slot_edit_input"} },
                { title: '标准类型', field: 'standardType', minWidth: 70, align: 'center', slots:{default: "slot_edit_input"} },
                { title: '数量', field: 'qty', width: 120, minWidth: 70, align: 'center', slots:{default: "slot_edit_number"} },
                { title: '操作',  width: 160, minWidth: 70, align: 'center', slots:{default: "operation"} },
            ],
            form:{
                acceptTime: "",
                afterSalesBillFileList: [],
                afterSalesBillProductList: [],
                areaCodeList: "",
                areaCodeListName: '',
                countryCode: '',
                billNo: "",
                billState: 0,
                contactsName: "",
                contactsPhone: "",
                createTime: "",
                customerFinishDate: moment(new Date()),
                customerName: "",
                customerNo: "",
                detailAddress: "",
                id: '',
                infoSources: '',
                priority: '276',
                problemDescription: "",
                problemFileIds: "",
                problemType: "",
                salesName: "",
                salesTel: "",
                serviceTitle: "",
                sourceBillNo: "",
                sourceBillType: '',
                sourceBillTypeName: "",
                sourceProjectName: "",
                updateTime: ""
            },
            rules:{
                serviceTitle: [{ required:true, message:'请选择服务标题' }],
                customerName: [{ required:true, message:'请选择关联客户' }],
                sourceProjectName: [{ required:true, message:'请选择关联项目' }],
                problemType: [{ required:true, message:'请选择问题类型' }],
                priority: [{ required:true, message:'请选择优先级' }],
                infoSources: [{ required:true, message:'请选择信息来源' }],
                salesName: [{ required:true, message:'请填写业务员' }],
                salesTel: [{ required:true, message:'请填写业务员电话' }],
                contactsName: [{ required:true, message:'请填写联系人' }],
            },
            standardTypeList: [], //标准类型
            infoSourcesList: [], //信息来源
            problemTypeList: [],  //问题类型
            sourceBillTypeList: [], //单据类型 
            priorityList: [], //优先级
            customerList: [], //客户列表
        }
    },
    methods:{
        querySearch(queryString, cb) {
            apiService.getobtainDistributor({state:1}).then(res => { 
                this.customerList = res.data.map(i=> { return { value:i.franchiserName } })
                var results = queryString ? this.customerList.filter(this.createFilter(queryString)) : this.customerList;
                cb(results)
            })
        },
        createFilter(queryString) {
            return text => {
                return !!text.value?!text.value.indexOf(queryString.toLowerCase()):''
            }
        },
        getBillTypeName(val){
            this.form.sourceBillTypeName = this.sourceBillTypeList.find(i=>i.dictValue==val)?.dictLabel||''
        },
        addproduct(){
            this.form.afterSalesBillProductList.push({
               rowNum:this.form.afterSalesBillProductList.length+1,model:'',qty:'',standard:'',standardType:'',voltageLevel:''
            })
        },
        delproduct(index){
            this.form.afterSalesBillProductList.splice(index,1)
            this.form.afterSalesBillProductList.forEach((i,j)=>{ i.rowNum = j+1 })
        },
        autoFill(){
            let obj = {
                sourceBillNo: this.form.sourceBillNo || '',
                sourceBillType: this.form.sourceBillType || '',
            }
            if (!!obj.sourceBillNo && !!obj.sourceBillType) {
                apiService.getCustomerInfo(obj).then(res=>{
                    this.form.customerName = res.data.customerName||''
                    this.form.sourceProjectName = res.data.sourceProjectName||''
                    this.form.salesName = res.data.salesName||''
                    this.form.salesTel = res.data.salesTel||''
                    this.form.contactsName = res.data.contactsName||''
                    this.form.contactsPhone = res.data.contactsPhone||''
                    this.form.areaCodeList = res.data.areaCodeList||''
                    this.form.detailAddress = res.data.detailAddress||''
                    this.form.areaCodeListName = res.data.areaCodeListName||''
                    this.$set(this.form, 'countryCode', res.data?.countryCode ?? '')
                })
            } else {
                this.$message.warning('请填写业务单据与报价类型')
            }
        },
        save() {
            this.$refs.serviceForm.validate(valid => {
                if (valid) {
                    this.form.customerFinishDate = moment(this.form.customerFinishDate).format('YYYY-MM-DD HH:mm:ss')
                    this.form.afterSalesBillProductList.length?
                        this.form.afterSalesBillProductList.forEach(i=>delete i._X_ROW_KEY)
                    :''
                    this.form.afterSalesBillFileList.length?
                        this.form.afterSalesBillFileList.forEach(i=>{ delete i.name;delete i.status;delete i.uid })
                    :''
                    !this.form.id?delete this.form.id:''
                    apiService[this.form?.id?'updatePostSalesService':'addPostSalesService'](this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        this.$emit('close',true)
                    })
                }
            })
        },
        getFiles(arr){
            if (arr.length) {
                this.form.afterSalesBillFileList = arr.map( i => { 
                    if (i?.response) {
                        return { 
                            bucketName: i.response?.data.bucketName||'',
                            id: '',
                            extensionName: i.response?.data.extensionName||'',
                            fileImageSize: i.response?.data.fileImageSize||'',
                            fileName: i.response?.data.fileName||'',
                            filePath: i.response?.data.filePath||'',
                            masterId: this.form?.id||0,
                            originalFileName: i.response?.data.originalFileName||'',
                            uploadTime: i.response?.data.uploadTime||'',
                            updateUser: '',
                            updateUserName: '',
                            url: i.response?.data.url||'',
                        }
                    } else {
                        return i
                    }
                })
            } else {
                this.form.afterSalesBillFileList = []
            }
        },
    },
    created(){
        apiSystem.getDictItem(4927286877360).then(res=>{ this.sourceBillTypeList = res.data })
        apiSystem.getDictItem(4927286877361).then(res=>{ this.problemTypeList = res.data })
        apiSystem.getDictItem(4927286877362).then(res=>{ this.priorityList = res.data })
        apiSystem.getDictItem(4927286877363).then(res=>{ this.infoSourcesList = res.data })
        // apiService.getobtainDistributor({state:1}).then(res=>{ this.customerList = res.data.map(i=>i.franchiserName) })
        this.data?.id?this.form = JSON.parse(JSON.stringify(this.data)):''

    }
}
</script>
<style lang="less" scoped>
.service-form {
    .el-form-item {
        margin-bottom: 18px
    }
}
.service-product {
    width:910px;
    margin-left:50px;
    position:relative;
    bottom:15px
}
.search-btn {
    background:#1890ff !important;
    color:white !important;
    border-radius:0;
}
</style>