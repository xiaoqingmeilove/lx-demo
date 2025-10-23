<template>
    <div>
        <el-form ref="cccForm" :rules="rules" :model="form" label-width="120px">
            <el-form-item label="证书编号" prop="certNo">
                <el-input v-model="form.certNo" placeholder="请输入证书编号" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="证书名称" prop="certName">
                <el-input v-model="form.certName" placeholder="请输入证书名称" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="委托人名称" prop="consignorName">
                <el-input v-model="form.consignorName" placeholder="请输入委托人名称" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="委托人地址" prop="consignorAddr">
                <el-input v-model="form.consignorAddr" placeholder="请输入委托人地址" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="制造商名称" prop="manufacturerName">
                <el-input v-model="form.manufacturerName" placeholder="请输入制造商名称" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="制造商地址" prop="menufacturerAddr">
                <el-input v-model="form.menufacturerAddr" placeholder="请输入制造商地址" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="型号" prop="model">
                <el-input v-model="form.model" placeholder="请输入型号" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="规格" prop="standard">
                <el-input v-model="form.standard" placeholder="请输入规格" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="技术标准" prop="technicalStandard">
                <el-input v-model="form.technicalStandard" placeholder="请输入技术标准" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="发证日期" prop="begDate">
                <el-date-picker style="width:100%" v-model="form.begDate" type="date" placeholder="请选择发证日期" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="有效日期至" prop="endDate">
                <el-date-picker style="width:100%" v-model="form.endDate" type="date" placeholder="请选择有效日期至" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="延续期日期至" prop="continueDate">
                <el-date-picker style="width:100%" v-model="form.continueDate" type="date" placeholder="请选择续期日期至" :disabled="isview"/>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select style="width:100%" v-model="form.status" placeholder="请选择" :disabled="isview">
                    <el-option label="正常" value="1"/>
                    <el-option label="延续" value="2"/>
                    <el-option label="撤销" value="3"/>
                    <el-option label="暂停" value="4"/>
                    <el-option label="注销" value="5"/>
                </el-select>
            </el-form-item>
            <el-form-item label="说明" prop="remark">
                <el-input v-model="form.remark" placeholder="请输入备注说明" :disabled="isview"/>
            </el-form-item>
            <el-form-item v-if="!isview" label="附件" prop="attach">
                <SysUpload :key="num" :files="fileList" @getFiles="getFiles"/>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" style="margin-right:10px" @click="saveCcc">确定</el-button>
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
    props:[ 'selObj', 'cccObj', 'isview', 'create'],
    data() {
        return {
            moment,
            form: {
                begDate: "",
                certId: 0,
                certName: "",
                certNo: "",
                clientId: 0,
                consignorAddr: "",
                consignorName: "",
                continueDate: "",
                createName: "",
                createTime: "",
                endDate: "",
                manufacturerName: "",
                menufacturerAddr: "",
                model: "",
                remark: "",
                standard: "",
                status: '1',
                sysCertificationFileList: [],
                technicalStandard: "",
                updateName: "",
                updateTime: "",
                userType: "",
                uuidNo: 0
            },
            rules: {
                certNo:[{required:true,message:'请输入证书编号'}],
                certName:[{required:true,message:'请输入证书名称'}],
                consignorName:[{required:true,message:'请输入委托人名称'}],
                consignorAddr:[{required:true,message:'请输入委托人地址'}],
                manufacturerName:[{required:true,message:'请输入制造商名称'}],
                menufacturerAddr:[{required:true,message:'请输入制造商地址'}],
                model:[{required:true,message:'请输入型号'}],
                standard:[{required:true,message:'请输入规格'}],
                technicalStandard:[{required:true,message:'请输入技术标准'}],
                begDate:[{required:true,message:'请选择发证日期'}],
                endDate:[{required:true,message:'请选择有效日期至'}],
            },
            fileList:[],
            fileListOrg:[],
            num:0,
        }
    },
    methods:{
        saveCcc() {
            this.$refs.cccForm.validate(valid=>{
                if (valid) {
                    delete this.form._X_ROW_KEY
                    this.form.begDate = moment(this.form.begDate).format('YYYY-MM-DD HH:mm:ss')
                    this.form.continueDate = moment(this.form.continueDate).format('YYYY-MM-DD HH:mm:ss')
                    this.form.endDate = moment(this.form.endDate).format('YYYY-MM-DD HH:mm:ss')
                    if (this.form.certId) {
                        if (this.fileList.length){
                            delete this.fileList[0].status
                            delete this.fileList[0].uid
                            apiSystem.addAttachCert(this.fileList[0]).then(res=>{
                                this.getCccFile()
                            })
                        } else {
                            if (this.fileListOrg?.length) {
                                apiSystem.deleteAttachCert(this.fileListOrg[0].fileId).then(res=>{
                                    this.getCccFile()
                                })
                            }
                        }
                    }
                    this.create?delete this.form.certId:''
                    apiSystem[this.create?'addProductCert':'editProductCert'](this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        if (this.create&&this.fileList.length) {
                            delete this.fileList[0].status
                            delete this.fileList[0].uid
                            this.fileList[0].masterId = res.data
                            apiSystem.addAttachCert(this.fileList[0]).then(res=>{
                                this.getCccFile()
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
                        masterId: this.cccObj?.certId||0,
                        model:'cert',
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
        getCccFile(){
            apiSystem.getAttachCert({fileId:this.cccObj.certId,model:'cert'}).then(res=>{
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
        !this.create ? this.form = JSON.parse(JSON.stringify(this.cccObj)) : ''
        this.form.clientId = this.selObj?.clientId || 0
        this.cccObj?.certId?this.getCccFile():''
    }
}
</script>