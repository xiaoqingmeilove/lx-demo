<template>
    <div>
        <el-form ref="certForm" :rules="rules" :model="form" label-width="80px">
            <el-form-item label="证书名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入证书名称" :disabled="view"/>
            </el-form-item>
            <el-form-item label="获得时间" prop="acquisitionTime">
                <el-date-picker style="width:100%" v-model="form.acquisitionTime" type="date" placeholder="请选择获得时间" :disabled="view"/>
            </el-form-item>
            <el-form-item label="颁发机构" prop="licenseOffice">
                <el-input v-model="form.licenseOffice" placeholder="请输入颁发机构" :disabled="view"/>
            </el-form-item>
            <el-form-item label="附件信息" prop="attach">
                <SysUpload :key="num" :files="fileList" @getFiles="getFiles"/>
            </el-form-item>
        </el-form>
        <div>
            <el-button type="primary" style="margin-right:10px" @click="save">确定</el-button>
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
    props: ['row', 'create', 'view', 'id'],
    data() {
        return {
            moment,
            form: {
                acquisitionTime: '',
                employeeId:this.id,
                id: '',
                licenseOffice: '',
                name: ''
            },
            rules: {
                name: [{ required:true, message:'请输入证书名称' }],
                acquisitionTime: [{ required:true, message:'请选择获得时间' }],
                licenseOffice: [{ required:true, message:'请输入颁发机构' }],
            },
            fileList:[],
            num:0,
        }
    },
    methods:{
        save() {
            this.$refs.certForm.validate(valid => {
                if (valid) {
                    delete this.form._X_ROW_KEY
                    this.form.acquisitionTime = moment(this.acquisitionTime).format('YYYY-MM-DD 00:00:00')
                    if (!this.create) {
                        if (this.fileList.length){
                            delete this.fileList[0].status
                            delete this.fileList[0].uid
                            apiSystem.addAttachEmployee(this.fileList[0])
                        } else {
                            if (this.fileListOrg?.length) {
                                apiSystem.deleteAttachEmployee(this.fileListOrg[0].fileId)
                            }
                        }
                    } else {
                        delete this.form.id
                    }
                    apiSystem[this.create?'addEmployeeCert':'editEmployeeCert'](this.form).then(res=>{
                        this.$message[res.code==200?'success':'warning'](res.message)
                        if (this.create&&this.fileList.length) {
                            delete this.fileList[0].status
                            delete this.fileList[0].uid
                            this.fileList[0].masterId = res.data
                            apiSystem.addAttachEmployee(this.fileList[0])
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
                        masterId: this.form.id,
                        model: 'cert',
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
        getEmpCert(){
            apiSystem.getAttachEmployee({fileId:this.row.id,model:'cert'}).then(res=>{
                if (res?.data?.length) {
                    res.data.forEach(i=>{
                        i.name = i.sourceFileName
                        i.url = '/minio/'+i.filePath
                    })
                    this.fileList = res.data
                    this.fileListOrg = JSON.parse(JSON.stringify(this.fileList))
                    this.num += 1
                } else {
                    this.fileList = []
                    this.fileListOrg = []
                }
            })
        }
    },
    created(){ 
        !this.create?this.form = JSON.parse(JSON.stringify(this.row)):''
        !this.create?this.getEmpCert():''
    }
}
</script>