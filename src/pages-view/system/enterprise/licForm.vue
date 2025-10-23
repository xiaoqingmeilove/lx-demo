<template>
    <div>
        <el-form ref="licForm" :rules="rules" :model="form" label-width="130px">
            <el-form-item label="生产许可证编号" prop="licenseNo">
                <el-input v-model="form.licenseNo" placeholder="请输入生产许可证编号" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="生产许可证名称" prop="licenseName">
                <el-input v-model="form.licenseName" placeholder="请输入生产许可证名称" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="发证机关" prop="licenseOffice">
                <el-input v-model="form.licenseOffice" placeholder="请输入发证机关" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="主导产品" prop="productName">
                <el-input v-model="form.productName" placeholder="请输入主导产品" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="发证日期" prop="begDate">
                <el-date-picker style="width:100%" v-model="form.begDate" type="date" placeholder="请选择发证日期" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="有效日期至" prop="endDate">
                <el-date-picker style="width:100%" v-model="form.endDate" type="date" placeholder="请选择有效日期至" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="延续有效期至" prop="continueDate">
                <el-date-picker style="width:100%" v-model="form.continueDate" type="date" placeholder="请选择延续有效期至" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="生产地址" prop="productAddr">
                <el-input v-model="form.productAddr" placeholder="请输入生产地址" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="许可证内容" prop="licenseContent">
                <el-input v-model="form.licenseContent" placeholder="请输入许可证内容" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select style="width:100%" v-model="form.status" placeholder="请选择" :disabled="isview">
                    <el-option label="失效" :value="0"/>
                    <el-option label="有效" :value="1"/>
                    <el-option label="延续" :value="2"/>
                </el-select>
            </el-form-item>
            <el-form-item label="备注说明" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入备注说明" :disabled="isview"/>
            </el-form-item>
            <el-form-item v-if="!isview" label="附件" prop="attach">
                <SysUpload :key="num" :files="fileList" @getFiles="getFiles"/>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" style="margin-right:10px" @click="saveLic">确定</el-button>
            <el-button type="primary" @click="$emit('close',false)">取消</el-button>
        </div>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import moment from 'moment'
import SysUpload from '../components/sysUpload.vue'

export default {
    components:{ SysUpload },
    props:[ 'selObj', 'licObj', 'isview', 'create'],
    data() {
        return {
            moment,
            form: {
                begDate: "",
                clientId: 0,
                continueDate: "",
                createName: "",
                createTime: "",
                endDate: "",
                licenseContent: "",
                licenseId: 0,
                licenseName: "",
                licenseNo: "",
                licenseOffice: "",
                productAddr: "",
                productName: "",
                remark: "",
                status: 1,
                sysProductLicenseFileList: [],
                updateName: "",
                updateTime: "",
                userType: "",
                uuidNo: 0
            },
            rules: {
                licenseNo:[{required:true,message:'请输入生产许可证编号'}],
                licenseName:[{required:true,message:'请输入生产许可证名称'}],
                licenseOffice:[{required:true,message:'请输入发证机关'}],
                productName:[{required:true,message:'请输入主导产品'}],
                productAddr:[{required:true,message:'请输入生产地址'}],
                licenseContent:[{required:true,message:'请输入许可证内容'}],
                begDate:[{required:true,message:'请选择发证日期'}],
                endDate:[{required:true,message:'请选择有效日期至'}],
            },
            fileList:[],
            fileListOrg:[],
            num:0,
        }
    },
    methods:{
        saveLic() {
            this.$refs.licForm.validate(valid=>{
                if (valid) {
                    delete this.form._X_ROW_KEY
                    this.form.begDate = moment(this.form.begDate).format('YYYY-MM-DD HH:mm:ss')
                    this.form.continueDate = moment(this.form.continueDate).format('YYYY-MM-DD HH:mm:ss')
                    this.form.endDate = moment(this.form.endDate).format('YYYY-MM-DD HH:mm:ss')
                    if (this.form.licenseId) {
                        if (this.fileList.length){
                            delete this.fileList[0].status
                            delete this.fileList[0].uid
                            apiSystem.addAttachProd(this.fileList[0]).then(res=>{
                                this.getLicFile()
                            })
                        } else {
                            if (this.fileListOrg?.length) {
                                apiSystem.deleteAttachProd(this.fileListOrg[0].fileId).then(res=>{
                                    this.getLicFile()
                                })
                            }
                        }
                    }
                    this.create?delete this.form.licenseId:''
                    apiSystem[this.create?'addProductLic':'editProductLic'](this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        if (this.create&&this.fileList.length) {
                            delete this.fileList[0].status
                            delete this.fileList[0].uid
                            this.fileList[0].masterId = res.data
                            apiSystem.addAttachProd(this.fileList[0]).then(res=>{
                                this.getLicFile()
                            })
                        }
                        this.$emit('close',true)
                    })
                } else {
                    this.$message.warning('请输入必填项')
                }
            })
            
        },
        getFiles(arr){
            if (arr.length) {
                this.fileList = arr.map( i => { 
                    return { 
                        bucketName: i.response?.data.bucketName||'',
                        fileId: 0,
                        fileName: i.response?.data.fileName||'',
                        filePath: i.response?.data.filePath||'',
                        fileType: i.raw.type,
                        masterId: this.licObj?.licenseId||0,
                        model:'lic',
                        oprTable: '',
                        sourceFileName: i.response?.data.originalFileName||'',
                        type: '',
                        uploadTime: '',
                        uploadUse: '',
                        uploadUseName: ''
                    }               
                })
            } else {
                this.fileList = []
            }
        },
        getLicFile(){
            apiSystem.getAttachProd({fileId:this.licObj.licenseId,model:'lic'}).then(res=>{
                if (res.data.length) {
                    res.data.forEach(i=>{
                        i.name = i.sourceFileName;
                        i.url = '/minio/'+i.filePath
                    })
                    this.fileList = res.data
                    this.fileListOrg = JSON.parse(JSON.stringify(this.fileList))
                    this.num+=1
                } else {
                    this.fileList = []
                    this.fileListOrg = []
                }
            })
        }
    },
    created() {
        !this.create ? this.form = JSON.parse(JSON.stringify(this.licObj)) : ''
        if (this.selObj?.clientId) {
            this.form.clientId = this.selObj?.clientId
            this.getLicFile()
        }
    }
}
</script>