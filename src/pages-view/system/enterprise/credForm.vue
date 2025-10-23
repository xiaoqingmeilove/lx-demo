<template>
    <div>
        <el-form ref="credForm" :rules="rules" :model="form" label-width="120px">
            <el-form-item label="证书编号" prop="otherNo">
                <el-input v-model="form.otherNo" placeholder="请输入证书编号" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="证书名称" prop="otherName">
                <el-input v-model="form.otherName" placeholder="请输入证书名称" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="发证机关" prop="licenseOffice">
                <el-input v-model="form.licenseOffice" placeholder="请输入发证机关" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="发证日期" prop="begDate">
                <el-date-picker style="width:100%" v-model="form.begDate" type="date" placeholder="请选择发证日期" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="有效日期至" prop="endDate">
                <el-date-picker style="width:100%" v-model="form.endDate" type="date" placeholder="请选择有效日期至" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="延续期日期至" prop="continueDate">
                <el-date-picker style="width:100%" v-model="form.continueDate" type="date" placeholder="请选择延续期日期至" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="证书内容" prop="licenseContent">
                <el-input v-model="form.licenseContent" placeholder="请输入证书内容" :disabled="isview"/>
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
            <el-button type="primary" style="margin-right:10px" @click="saveCred">确定</el-button>
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
    components: { SysUpload },
    props: ['selObj', 'credObj', 'isview', 'create'],
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
                licenseOffice: "",
                otherId: 0,
                otherName: "",
                otherNo: "",
                remark: "",
                status: 1,
                sysOtherCertificationFile: [],
                updateName: "",
                updateTime: "",
                userType: "",
                uuidNo: 0
            },
            rules: {
                otherNo:[{required:true,message:'请输入证书编号'}],
                otherName:[{required:true,message:'请输入证书名称'}],
                licenseOffice:[{required:true,message:'请输入发证机关'}],
                begDate:[{required:true,message:'请选择发证日期'}],
                endDate:[{required:true,message:'请选择有效日期至'}],
                licenseContent:[{required:true,message:'请输入证书内容'}],
            },
            fileList:[],
            fileListOrg:[],
            num:0,
        }
    },
    methods:{
        saveCred() {
            this.$refs.credForm.validate(valid=>{
                if (valid) {
                    delete this.form._X_ROW_KEY
                    this.form.begDate = this.form.begDate?moment(this.form.begDate).format('YYYY-MM-DD HH:mm:ss'):''
                    this.form.continueDate = this.form.continueDate?moment(this.form.continueDate).format('YYYY-MM-DD HH:mm:ss'):''
                    this.form.endDate = this.form.endDate?moment(this.form.endDate).format('YYYY-MM-DD HH:mm:ss'):''
                    if (this.form.otherId) {
                        if (this.fileList.length){
                            delete this.fileList[0].status
                            delete this.fileList[0].uid
                            apiSystem.addAttachOther(this.fileList[0]).then(res=>{
                                this.getOtherFile()
                            })
                        } else {
                            if (this.fileListOrg?.length) {
                                apiSystem.deleteAttachOther(this.fileListOrg[0].fileId).then(res=>{
                                    this.getOtherFile()
                                })
                            }
                        }
                    }
                    this.create?delete this.form.otherId:''
                    apiSystem[this.create?'addProductOtherCert':'editProductOtherCert'](this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        if (this.create&&this.fileList.length) {
                            delete this.fileList[0].status
                            delete this.fileList[0].uid
                            this.fileList[0].masterId = res.data
                            apiSystem.addAttachOther(this.fileList[0]).then(res=>{
                                this.getOtherFile()
                            })
                        }
                        this.$emit('close',true)
                    })
                } else {
                    this.$message.warning('请填写必填项')
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
                        masterId: this.credObj?.otherId||0,
                        model:'other',
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
        getOtherFile(){
            apiSystem.getAttachOther({fileId:this.credObj.otherId,model:'other'}).then(res=>{
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
        !this.create ? this.form = JSON.parse(JSON.stringify(this.credObj)) : ''
        this.form.clientId = this.selObj?.clientId || 0
        this.credObj?.otherId?this.getOtherFile():''
    }
}
</script>