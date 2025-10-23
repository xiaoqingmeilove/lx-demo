<template>
    <div style="height:100%;overflow-y:auto">
        <el-descriptions :column="2" contentClassName="desc-cont"
            :labelStyle="{width:'10%',color:'#333333',background:'#FAFAFA'}" border size="medium">
            <template #title>
                <TabLabel :label="'基础信息'" />
            </template>
            <template #extra>
                <page-button v-if="(baseEdit&&create)||(selObj&&selObj.clientId)" :content="baseEdit?'保存':'修改'" @click="save"/>
                <page-button v-if="baseEdit" content="取消" @click="cancelEdit"/>
            </template>
            <el-descriptions-item v-for="(i,j) in baseInfo" :key="j">
                <template slot="label">
                    <div v-if="modelType.includes(i.key)">{{i.name}}
                        <div style="color:rgb(200,200,200);font-size:12px">{{i.key=='logo'?'推荐尺寸256x256':'二维码图片'}}</div>
                    </div>
                    <span v-else>{{i.name}}</span>
                </template>
                <div v-if="!baseEdit">
                    <div v-if="modelType.includes(i.key)">
                        <img style="cursor:pointer" @click="pictype=i.key;showpic=true" v-if="imgUrl[i.key]" height="60" width="60" :src="imgUrl[i.key]" alt="image">
                    </div>
                    <div v-else-if="i.key=='defaultFlag'">
                        <el-tag v-if="apsForm&&apsForm.clientId" size="small" :type="apsForm[i.key]=='0'?'success':'danger'">
                            {{apsForm[i.key]=='0'?'启用':'停用'}}
                        </el-tag>
                    </div>
                    <span v-else-if="i.key=='sysOrganizationId'">{{apsForm.orgName}}</span>
                    <span v-else>{{apsForm[i.key]}}</span>
                </div>
                <div v-else>
                    <SysUpload v-if="modelType.includes(i.key)" :files="fileList[i.key]" @getFiles="v=>getFiles(v,i.key)"/>
                    <el-tree ref="orgtree" v-else-if="i.key=='sysOrganizationId'" style="width:100%;max-height:150px;overflow:auto" 
                        highlight-current :data="orgData" show-checkbox node-key="id" check-strictly :default-checked-keys="defkey"
                        @check="checkClick" :props="{label:'orgName',children:'children'}" :expand-on-click-node="false"/>
                    <span v-else-if="i.key=='defaultFlag'">
                        <el-radio v-model="apsForm[i.key]" :label="0">启用</el-radio>
                        <el-radio v-model="apsForm[i.key]" :label="1">停用</el-radio>
                    </span>
                    <el-date-picker style="width:100%" v-else-if="i.key=='foundDate'" v-model="apsForm[i.key]" type="date" placeholder="选择成立日期"/>
                    <el-input v-else v-model="apsForm[i.key]" :placeholder="'请输入'+i.name "/>
                </div>
            </el-descriptions-item>
        </el-descriptions>
        <el-descriptions style="margin-top:10px" :column="2" contentClassName="desc-cont"
            :labelStyle="{width:'10%',color:'#333333',background:'#FAFAFA'}" border size="medium">
            <template #title>
                <TabLabel :label="'关键人信息'"/>
            </template>
            <template #extra>
                <page-button :disabled="!!!selObj" :content="keyEdit?'保存':'修改'" @click="saveEdit"/>
                <page-button v-if="keyEdit" content="取消" @click="baseEdit=false;keyEdit=false;$emit('close')"/>
            </template>
            <el-descriptions-item v-for="(i,j) in keyMan" :key="j" :label="i.name">
                <span v-if="!keyEdit">{{apsForm[i.key]}}</span>
                <el-input v-if="keyEdit" v-model="apsForm[i.key]" :placeholder="'请输入'+i.name "/>
            </el-descriptions-item>
        </el-descriptions>
        <el-dialog :visible.sync="showpic" width="1200px" @close="showpic=false" destroy-on-close :append-to-body="true" :modal-append-to-body="false">
            <template #title>
                <h2>查看图片</h2><el-divider/>
            </template>
            <div style="width:100%;oveflow:auto">
                <img v-if="showpic" :src="imgUrl[pictype]" alt=""/>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()
import TabLabel from '../components/tabLabel'
import moment from 'moment'
import SysUpload from '../components/sysUpload.vue'

export default {
    props: ['selObj', 'create', 'selAps'],
    components: { TabLabel, SysUpload },
    data() {
        return {
            moment,
            baseEdit:false,
            keyEdit:false,
            apsForm:{
                areaOrgName: "",
                bankAccount: "",
                bankAccountNumber: "",
                bname: "",
                clientId: 0,
                contact: "",
                contactCardNo: "",
                contactEmail: "",
                contactMail: "",
                contactPerson: "",
                contactTelNum: "",
                createName: "",
                createTime: "",
                dataScope: "",
                defaultFlag: 0,
                delFlag: 0,
                enterAncestors: "",
                firmPersons: 0,
                foundDate: "",
                industryType: "",
                intro: "",
                lat: 0,
                legalCardNo: "",
                legalCardType: "",
                legalRepresentative: "",
                legalRepresentativeTel: "",
                logo: "",
                lon: 0,
                longDistanceAreacode: "",
                netAddr: "",
                officialWebsite: "",
                orderNum: 0,
                orgCode: "",
                orgName: "",
                parentBname: "",
                parentId: 0,
                productSpecies: "",
                productValue: "",
                regAddress: "",
                regAddressAdministrativeCode: "",
                regAddressCno: "",
                remark: "",
                shortBname: "",
                socialUnifiedCreditCode: "",
                sort: 0,
                sysEnterprises: [],
                sysOrganizationId: 0,
                telnum: "",
                updateName: "",
                updateTime: ""
            },
            baseInfo:[
                { name:'企业Logo', key:'logo' }, { name:'企业名称', key:'bname' }, { name:'社会统一信用码', key:'socialUnifiedCreditCode' },
                { name:'企业简称', key:'shortBname' }, { name:'产值规模', key:'productValue' }, { name:'行业类型', key:'industryType' },
                { name:'企业人数', key:'firmPersons' }, { name:'产品种类', key:'productSpecies' }, { name:'行政区域', key:'regAddressAdministrativeCode' },
                { name:'注册地址', key:'regAddress' }, { name:'通讯地址', key:'netAddr' }, { name:'邮政编码', key:'regAddressCno' },
                { name:'经度', key:'lon' }, { name:'纬度', key:'lat' }, { name:'所属机关', key:'parentBname' },
                { name:'所属联盟协会', key:'areaOrgName' }, { name:'成立日期', key:'foundDate' }, { name:'所属组织', key:'sysOrganizationId' },
                { name:'企业官网', key:'officialWebsite' }, { name:'企业微信', key:'wechart' }, { name:'企业微信公众号', key:'public' }, { name:'企业微信小程序', key:'app' },
                { name:'企业简介', key:'intro' }, { name:'备注说明', key:'remark' }, { name:'显示顺序', key:'orderNum' }, 
                 { name:'启用状态', key:'defaultFlag' },
            ],
            keyMan:[
                { name:'法人姓名', key:'legalRepresentative' }, { name:'法人电话', key:'legalRepresentativeTel' }, { name:'法人证件类型', key:'legalCardType' },
                { name:'法人证件号码', key:'legalCardNo' }, { name:'管理员姓名', key:'contactPerson' }, { name:'管理员电话', key:'contactTelNum' },
                { name:'管理员邮箱', key:'contactMail' }, 
                // { name:'管理员微信号', key:'hh' },
            ],
            fileList:{ logo:[], wechart:[], public:[], app:[] },
            fileListOrg:{ logo:[], wechart:[], public:[], app:[] },
            imgUrl:{ logo:'', wechart:'', public:'', app:'' },
            showpic:false,
            pictype:'',
            orgData:[],
            defkey:[],
            modelType:['logo','wechart','public','app'],
        }
    },
    methods:{
        save(){
            this.baseEdit=!this.baseEdit
            if (!this.baseEdit) {
                this.apsForm.foundDate = this.apsForm.foundDate?moment(this.apsForm.foundDate).format('YYYY-MM-DD HH:mm:ss'):''
                if (this.selObj?.clientId) {
                    this.modelType.forEach(i=>{
                        if (this.fileList[i].length){
                            delete this.fileList[i][0].status
                            delete this.fileList[i][0].uid
                            apiSystem.addAttachEps(this.fileList[i][0]).then(res=>{
                                this.getEpsLogo(i)
                            })
                        } else {
                            if (this.fileListOrg[i]?.length) {
                                apiSystem.deleteAttachEps(this.fileListOrg[i][0].fileId).then(res=>{
                                    this.getEpsLogo(i)
                                })
                            }
                        }
                    })
                }
                this.create?delete this.apsForm.clientId:''
                apiSystem[this.create?'addAps':'editAps'](this.apsForm).then(res=>{
                    this.$message[res.code==200?'success':'warning'](res.message)
                    apiSystem.detailAps(this.apsForm?.clientId||res.data).then(res=>{
                        this.apsForm = res.data
                        this.defkey = [this.apsForm.sysOrganizationId]
                    })
                    this.modelType.forEach(i=>{
                        if (this.create && this.fileList[i].length) {
                            this.fileList[i][0].masterId = res.data
                            delete this.fileList[i][0].status
                            delete this.fileList[i][0].uid
                            apiSystem.addAttachEps(this.fileList[i][0]).then(res=>{
                                this.getEpsLogo(i)
                            })
                        }
                    })
                    this.create?this.$emit('close'):''
                })
            }
        },
        cancelEdit() {
            this.baseEdit=false
            this.keyEdit=false
            this.$emit('close')
        },
        saveEdit() {
            this.keyEdit=!this.keyEdit
            if (!this.keyEdit) {
                apiSystem[this.selObj?.clientId?'editAps':'addAps'](this.apsForm).then(res=>{
                    this.$message[res.code==200?'success':'warning'](res.message)
                    this.create?this.$emit('close'):''
                })
            }
        },
        getFiles(arr,model){
            if (arr.length) {
                this.fileList[model] = arr.map( i => { 
                    return { 
                        bucketName: i.response?.data.bucketName||'',
                        fileId: 0,
                        fileName: i.response?.data.fileName||'',
                        filePath: i.response?.data.filePath||'',
                        fileType: i.raw.type,
                        masterId: this.selObj?.clientId||0,
                        model,
                        oprTable: '',
                        sourceFileName: i.response?.data.originalFileName||'',
                        type: '',
                        uploadTime: '',
                        uploadUse: '',
                        uploadUseName: ''
                    }               
                })
            } else {
                this.fileList[model] = []
            }
        },
        getEpsLogo(model){
            apiSystem.getAttachEps({fileId:this.apsForm.clientId,model}).then(res=>{
                if (res.data.length) {
                    this.imgUrl[model] = '/minio/'+res.data[0].filePath
                    res.data.forEach(i=>{
                        i.name = i.sourceFileName;
                        i.url = '/minio/'+i.filePath
                    })
                    this.fileList[model] = res.data
                    this.fileListOrg[model] = JSON.parse(JSON.stringify(this.fileList[model]))
                } else {
                    this.imgUrl[model] = ''
                    this.fileList[model] = []
                    this.fileListOrg[model] = []
                }
            })
        },
        checkClick(data,checked){
            if(checked.checkedKeys.length) {
                this.apsForm.sysOrganizationId = data.id
                this.apsForm.orgName = data.orgName
                this.apsForm.orgCode = data.orgCode
                checked ? this.$refs.orgtree[0].setCheckedNodes([data]) : ''
            } else {
                this.apsForm.sysOrganizationId = 0
                this.apsForm.orgName = ''
                this.apsForm.orgCode = ''
            }
        }
    },
    created() {
        if (this.create) {
            this.baseEdit = true
            this.keyEdit = true
            this.selAps ? this.defkey = [this.selAps.id] : ''
            this.apsForm.sysOrganizationId = this.selAps.id
        } else if (!this.create && this.selObj?.clientId) {
            this.apsForm = JSON.parse(JSON.stringify(this.selObj))
            this.defkey = [this.apsForm.sysOrganizationId]
            this.modelType.forEach(i=>{this.getEpsLogo(i)})
        }
        apiSystem.getOrgTree().then(res=>{ 
            if (res.data.length) {
                // res.data.pop()
                this.orgData=res.data 
            }
        })
    }
}
</script>
<style lang="less" scoped>
/deep/ .el-descriptions__header {
    margin-bottom: 8px
}
</style>