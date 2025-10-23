<template>
    <div class="receipt-form">
        <el-form ref="receiptForm" :rules="rules" :model="rform" label-width="125px">
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="单据号:" prop="billNo">
                        <el-input v-model="billNo" placeholder="系统自动生成" disabled/>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="服务标题:" prop="serviceTitle">
                        <el-input v-model="serviceTitle" placeholder="请输入服务标题" disabled/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="问题类型:" prop="problemType">
                        <el-select style="width:100%" v-model="form.problemType" placeholder="请选择问题类型" disabled>
                            <el-option v-for="i in problemTypeList" :key="i.dictValue" :label="i.dictLabel" :value="i.dictValue"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item label="服务内容、过程及结果:" prop="serviceContent">
                        <el-input type="textarea" placeholder="请输入服务内容、过程及结果" :rows="3" v-model="rform.serviceContent" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="原因分析:" prop="reasonAnalysis">
                        <el-input type="textarea" placeholder="请输入原因分析" v-model="rform.reasonAnalysis" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="责任部门:" prop="liableDept">
                        <el-input v-model="rform.liableDept" placeholder="请输入责任部门" clearable/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="纠正/预防措施:" prop="preventive">
                        <el-input type="textarea" placeholder="请输入纠正/预防措施" v-model="rform.preventive" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="相关部门:" prop="relevantDepartments">
                        <el-input v-model="rform.relevantDepartments" placeholder="请输入相关部门" clearable/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="处理结果及跟踪:" prop="processingResults">
                        <el-input type="textarea" placeholder="请输入处理结果及跟踪" v-model="rform.processingResults" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="处理方式:" prop="processingMethod">
                        <el-select style="width:100%" v-model="rform.processingMethod" placeholder="请选择处理方式">
                            <el-option v-for="i in processingMethodList" :key="i.dictValue" :label="i.dictLabel" :value="i.dictValue"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="责任处理:" prop="liableProcessing">
                        <el-input type="textarea" placeholder="请输入责任处理" v-model="rform.liableProcessing" :rows="4" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="相关部门及领导:" prop="liablePerson">
                        <el-input type="textarea" placeholder="请输入相关部门及领导" v-model="rform.liablePerson" :rows="4" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-form-item label="损失费:" prop="lossFee">
                        <el-input-number style="width:calc(100% - 20px)" v-model="rform.lossFee" :controls="false" :precision="2" :min="0"></el-input-number>
                        元
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="损失等级:" prop="lossLevel">
                        <el-select style="width:100%" v-model="rform.lossLevel" placeholder="请选择损失等级">
                            <el-option v-for="i in lossLevelList" :key="i.dictValue" :label="i.dictLabel" :value="i.dictValue"/>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item label="备注:" prop="remark">
                        <el-input type="textarea" placeholder="请输入备注" v-model="rform.remark" :rows="3" maxlength="500" show-word-limit></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item label="处理前图片:" prop="beforeFileList">
                        <SysUpload :key="num" :files="rform.beforeFileList" @getFiles="arr=>getFiles(arr,0)"/>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item label="处理后图片:" prop="afterFileList">
                        <SysUpload :key="num" :files="rform.afterFileList" @getFiles="arr=>getFiles(arr,1)"/>
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
import SysUpload from '../serviceTable/sysUpload'
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()
import { ApiService } from '@/apis'
const apiService = new ApiService()

export default {
    props:['form'],
    components:{ SysUpload },
    data(){
        return {
            billNo:'',
            serviceTitle:'',
            rform:{
                afterFileIds: '',
                afterFileList: [],
                afterSalesBillId: this.form.id,
                beforeFileIds: '',
                beforeFileList: [],
                createTime: '',
                createUser: '',
                createUserId: 0,
                createUserName: '',
                liableDept: '',
                liablePerson: '',
                liableProcessing: '',
                lossFee: 0,
                lossLevel: '',
                preventive: '',
                processingMethod: '',
                processingResults: '',
                reasonAnalysis: '',
                relevantDepartments: '',
                remark: '',
                serviceContent: '',
                updateTime: '',
                updateUser: '',
                updateUserId: 0,
                updateUserName: ''
            },
            rules:{
                serviceContent: [{ required:true, message:'请输入服务内容、过程及结果' }],
                reasonAnalysis: [{ required:true, message:'请输入原因分析' }],
                liableDept: [{ required:true, message:'请输入责任部门' }],
                processingResults: [{ required:true, message:'请输入处理结果及跟踪' }],
                liableProcessing: [{ required:true, message:'请输入责任处理' }],
            },
            problemTypeList: [],
            processingMethodList:[],
            lossLevelList:[],
            num:0,
        }
    },
    methods:{
        save(){
            this.$refs.receiptForm.validate(valid => {
                if (valid) {
                    this.rform.beforeFileList?.length?
                        this.rform.beforeFileList.forEach(i=>{ i.id='';delete i.name;delete i.status;delete i.uid })
                    :''
                    this.rform.afterFileList?.length?
                        this.rform.afterFileList.forEach(i=>{ i.id='';delete i.name;delete i.status;delete i.uid })
                    :''
                    apiService.changeReceipt(this.rform).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        this.$emit('close')
                    })
                }
            })
        },
        getFiles(arr,num){
            if (arr&&arr.length) {
                this.rform[!num?'beforeFileList':'afterFileList'] = arr.map( i => { 
                    if (i?.response) {
                        return { 
                            bucketName: i.response?.data.bucketName||'',
                            id: '',
                            extensionName: i.response?.data.extensionName||'',
                            fileImageSize: i.response?.data.fileImageSize||'',
                            fileName: i.response?.data.fileName||'',
                            filePath: i.response?.data.filePath||'',
                            masterId: this.form.id||0,
                            originalFileName: i.response?.data.originalFileName||'',
                            uploadTime: i.response?.data.uploadTime||'',
                            updateUser: '',
                            updateUserName: '',
                            url:i.response?.data.url||'',
                        }
                    } else {
                        return i
                    }
                })
            } else {
                this.rform[!num?'beforeFileList':'afterFileList'] = []
            }
        }
    },
    created(){
        this.billNo = this.form.billNo
        this.serviceTitle = this.form.serviceTitle
        this.rform.problemType = this.form.problemType
        this.form.afterSalesBillReceipt?.id ? this.rform = JSON.parse(JSON.stringify(this.form.afterSalesBillReceipt)) : ''
        if (this.rform.beforeFileList?.length) {
            this.rform.beforeFileList.forEach(i=>{
                i.name = i.originalFileName
                i.url = '/minio/'+i.filePath
            })
        } else {
            this.rform.beforeFileList = []
        }
        if (this.rform.afterFileList?.length) {
            this.rform.afterFileList.forEach(i=>{
                i.name = i.originalFileName
                i.url = '/minio/'+i.filePath
            })
        } else {
            this.rform.afterFileList = []
        }
        apiSystem.getDictItem(4927286877361).then(res=>{ this.problemTypeList = res.data })
        apiSystem.getDictItem(4927286877367).then(res=>{ this.processingMethodList = res.data })
        apiSystem.getDictItem(4927286877368).then(res=>{ this.lossLevelList = res.data })
    }
}
</script>