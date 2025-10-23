<template>
    <div class="emp-form">
        <TabLabel :label="'职员信息'">
            <template #tail>
                <div style="float:right">
                    <span v-if="!id&&isEdit" style="margin-right:10px">
                        <el-checkbox v-model="createUser">同时生成用户信息</el-checkbox>
                        <el-tooltip class="item" effect="dark" content="初始用户名，密码均为手机号" placement="top-start">
                            <i style="font-size:14px" class="el-icon-question"/>
                        </el-tooltip>
                    </span>
                    <page-button v-if="!empForm.sysUserId&&id" @click="userDlg=true" content="生成用户" />
                    <page-button @click="save" :content="isEdit?'保存':'修改'" />
                    <page-button v-if="isEdit" @click="cancelEdit" content="取消" />
                    <page-button v-if="!isEdit&&!!id" @click="delDlg=true" content="删除" />
                </div>
            </template>
        </TabLabel>
        <div class="desc-block">
            <descriptions-form v-if="showdesc" ref="employeeForm" :rules="descRules" :editable="isEdit" :items="descItems" :item-model="empForm"
                :source-list="descSourceList" :value-formatters="descFormatters" @change:select="onDescFormSelectChange">
                <template #avatar>
                    <img v-if="!isEdit&&imgUrl" style="cursor:pointer" @click="showpic=true" height="50" width="50" :src="imgUrl" alt="image">
                    <SysUpload v-if="isEdit" :files="fileList" @getFiles="getFiles"/>
                </template>
                <template #openStatus="{ value }">
                    <el-tag v-if="!isEdit" :type="!value?'success':'danger'" :disable-transitions="true" size="small">{{!value ? '启用': '禁用'}}</el-tag>
                    <div v-else>
                        <el-radio v-model="empForm.openStatus" :label="0">启用</el-radio>
                        <el-radio v-model="empForm.openStatus" :label="1">停用</el-radio>
                    </div>
                </template>
            </descriptions-form>
        </div>
        <TabLabel :label="'资质信息'">
            <template #tail>
                <page-button :disabled="!id" style="float:right" @click="certc=true;certv=false;certDlg=true" content="新增" />
            </template>
        </TabLabel>
        <div class="desc-block" style="flex:1;height:1px">
            <div class="app-table-container" style="height:100%">
                <div class="app-table-body" style="height:inherit">
                    <vxe-grid :data="tableData" :columns="tableColumns" height="auto" ref="table">
                        <template #attach="{ row }">
                            <page-button @click="showCertPic(row)" content="查看" />
                        </template>
                        <template #action="{ row }">
                            <page-button type="text" @click="certc=false;certv=true;certrow=row;certDlg=true" content="查看"/>
                            <page-button type="text" @click="certc=false;certv=false;certrow=row;certDlg=true" content="编辑"/>
                            <page-button type="text" @click="delcert=true;certrow=row" content="删除"/>
                        </template>
                        <template #pager>
                            <vxe-pager
                                :current-page.sync="tablePage.currentPage"
                                :page-size.sync="tablePage.pageSize"
                                :total="tablePage.total"
                                @page-change="pageChange"
                            />
                        </template>
                    
        </vxe-grid>
                </div>
            </div>
        </div>
        <DeleteDialog @close="v=>{ delDlg=false; v?deleteEmployee():'' }" :delObj="{ module:'职员', target:empForm.name, flag:delDlg }"/>
        <modal width="500px" :title="(certc?'新增':certv?'查看':'修改')+'资质信息'" :visible="certDlg" @close="certDlg=false">
            <CredForm v-if="certDlg" :row="certrow" :id="id" :create="certc" :view="certv" @close="closeForm"/>
            <template slot="footer_bnt"><span/></template>
        </modal>
        <modal width="500px" title="生成用户" :visible="userDlg" @close="userDlg=false">
            确定要生成用户?
            <div style="font-size:12px;color:rgb(220,220,220)">初始用户名、密码均为手机号</div>
            <template slot="footer_bnt">
                <page-button @click="toUser" content="确定" />
                <page-button @click="userDlg=false" content="取消" />
            </template>
        </modal>

        <el-dialog :visible.sync="showpic" width="1200px" @close="showpic=false" destroy-on-close :append-to-body="true" :modal-append-to-body="false">
            <template #title>
                <h2>查看图片</h2><el-divider/>
            </template>
            <div style="width:100%;oveflow:auto">
                <img v-if="showpic" :src="imgUrl" alt=""/>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="showcertpic" width="1200px" @close="showcertpic=false" destroy-on-close :append-to-body="true" :modal-append-to-body="false">
            <template #title>
                <h2>查看图片</h2><el-divider/>
            </template>
            <div style="width:100%;oveflow:auto">
                <img v-if="showcertpic" :src="imgCertUrl" alt=""/>
            </div>
        </el-dialog>
        <DeleteDialog @close="v=>{ delcert=false; v?deleteCert():'' }" 
            :delObj="{ module:'资质信息', target:certrow.name, flag:delcert }"/>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import TabLabel from '../components/tabLabel'
import DeleteDialog from '../components/deleteDialog'
import moment from 'moment'
import CredForm from './credForm'
import SysUpload from '../components/sysUpload.vue'

export default {
    components: { TabLabel, DeleteDialog, CredForm, SysUpload },
    data() {
        return {
            moment,
            showdesc:false,
            id:0,
            isEdit:false,
            delDlg:false,
            orgList:[],
            epsList:[],
            deptList:[],
            postList:[],
            empForm:{
                birthday: '',
                businessTypeId: 0,
                clientId: '',
                code: '',
                createUser: true,
                departmentId: '',
                deptName: '',
                education: '',
                email: '',
                enterpriseName: '',
                hiredate: '',
                id: 0,
                name: '',
                openStatus: 0,
                organizationId: '',
                organizeName: '',
                personId: '',
                phone: '',
                positionType: '',
                postId: '',
                postName: '',
                rank: '',
                sex: true,
                skillLevel: '',
                status: 1,
                sysUserId: 0,
                userType: '',
                webchatNo: '',
                workplace: ''
            },
            empOrg:{},
            descRules:{
                name: [{ required:true, message:'请输入职员姓名' }],
                code: [{ required:true, message:'请输入职员工号' }],
                phone: [{ required:true, message:'请输入电话' }],
                birthday: [{ required:true, message:'请输入生日' }],
                email: [{ required:true, message:'请输入邮箱' }],
                personId: [{ required:true, message:'请输入身份证号码' }],
            },
            descFormatters: {
                birthday: (value, item) => { return value?moment(value).format('YYYY-MM-DD HH:mm:ss'):'' },
                hiredate: (value, item) => { return value?moment(value).format('YYYY-MM-DD HH:mm:ss'):'' }
            },
            descSourceList: {
                sex: [
                    { label:'男', value:true },
                    { label:'女', value:false }
                ],
                status: [
                    { label:'实习', value:0 },
                    { label:'在职', value:1 },
                    { label:'离职', value:2 },
                    { label:'退休', value:3 },
                ],
                organizations:[],
                clients:[],
                departments:[],
                posts:[],
                openStatus:[
                    { label:'启用', value:0 },
                    { label:'停用', value:1 },
                ]
            },
            descItems: [
                { label:'头像', field:'avatar', slot:'avatar' },
                { label:'姓名', field:'name', type:'input', required:true },
                { label:'工号', field:'code', type:'input', required:true },
                { label:'性别', field:'sex', type:'radio', source:'sex' },
                { label:'出生日期', field:'birthday', type:'datetime', formatterName:'birthday', required:true },
                { label:'身份证号', field:'personId', type:'input' },
                { label:'入职日期', field:'hiredate', type:'datetime', formatterName:'hiredate' },
                { label:'职员状态', field:'status', type:'select', source:'status' },
                { label:'电话', field:'phone', type:'input', required:true },
                { label:'邮箱', field:'email', type:'input', required:true },
                { label:'微信号', field:'webchatNo', type:'input' },
                { label:'学历', field:'education', type:'input' },
                { label:'所属组织', field:'organizationId', type:'select', source:'organizations' },
                { label:'所属企业', field:'clientId', type:'select', source:'clients' },
                { label:'所属部门', field:'departmentId', type:'select', source:'departments' },
                { label:'所属岗位', field:'postId', type:'select', source:'posts' },
                { label:'岗位性质', field:'positionType', type:'input' },
                { label:'职称', field:'rank', type:'input' },
                { label:'技能等级', field:'skillLevel', type:'input' },
                { label:'工作地点', field:'workplace', type:'input' },
                { label:'启用状态', field:'openStatus', type:'radio', source:'openStatus', slot:'openStatus'  },
            ],
            tableData:[],
            tableColumns: [
                { field:'name', title:'证书名称', align:'center' },
                { field:'acquisitionTime', title:'获得时间', align:'center' },
                { field:'licenseOffice', title:'颁发机构', align:'center' },
                { title:'附件信息', align:'center', slots:{ default:'attach' }  },
                { field:'action', title:'操作', align:'center', slots:{ default:'action' }  },
            ],
            tablePage: {
                currentPage: 1,
                pageSize: 20,
                total: 0,
            },
            createUser:false,
            userDlg:false,
            certDlg:false,
            certc:false,
            certv:false,
            certrow:{},
            fileList:[],
            imgUrl:'',
            imgCertUrl:'',
            showpic:false,
            showcertpic:false,
            delcert:false,
        }
    },
    watch: {
        orgList(val) { 
            val?
                this.descSourceList.organizations = val.length ? val.map(i=>{
                    return { label:i.orgName, value:i.id }
                }) : []
            : ''
        },
        epsList(val) { 
            val?
                this.descSourceList.clients = val.length ? val.map(i=>{
                    return { label:i.bname, value:i.clientId }
                }) : []
            : ''
        },
        deptList(val) { 
            val?
                this.descSourceList.departments = val.length ? val.map(i=>{
                    return { label:i.deptName, value:i.deptId }
                }) : []
            : ''
        },
        postList(val) { 
            val?
                this.descSourceList.posts = val.length ? val.map(i=>{
                    return { label:i.postName, value:i.postId }
                }) : []
            : ''
        },
    },
    methods: {
        onDescFormSelectChange(e) {
            console.log('onDescFormSelectChange', e)
            switch(e.item.field) {
                case 'organizationId': {
                    apiSystem.getOrgAps(e.value).then(res=>{ this.epsList = res.data })
                    this.empForm.organizeName = this.orgList.find(i=>i.id==e.value)?.orgName || ''
                };break
                case 'clientId': {
                    apiSystem.getDeptList({clientId:e.value}).then(res=>{ this.deptList = res.data.deptChildren })
                    this.empForm.enterpriseName = this.epsList.find(i=>i.clientId==e.value)?.bname || ''
                };break
                case 'departmentId': {
                    apiSystem.getDeptPost(e.value).then(res=>{ this.postList = res.data })
                    this.empForm.deptName = this.deptList.find(i=>i.deptId==e.value)?.deptName || ''
                };break
                case 'postId': {
                    this.empForm.postName = this.postList.find(i=>i.postId==e.value)?.postName || ''
                }
            }
        },
        pageChange(){},
        toUser(){
            apiSystem.employeeToUser([this.id]).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                apiSystem.detailEmployee(this.id).then(res=>{
                    this.empForm = res.data
                    this.empOrg = JSON.parse(JSON.stringify(res.data))
                    this.getCert()
                    if (this.empForm.organizationId) {
                        apiSystem.getOrgAps(this.empForm.organizationId).then(res=>{ this.epsList = res.data })
                    }
                    if (this.empForm.clientId) {
                        apiSystem.getDeptList({clientId:this.empForm.clientId}).then(res=>{ this.deptList = res.data.deptChildren })
                    }
                    if (this.empForm.departmentId) {
                        apiSystem.getDeptPost(this.empForm.departmentId).then(res=>{ this.postList = res.data })
                    }
                    this.getEmpLogo()
                })
                this.userDlg=false
            })
        },
        cancelEdit() {
            this.isEdit=false
            if (this.id) {
                this.empForm=JSON.parse(JSON.stringify(this.empOrg))
            } else {
                this.$tabs.close()
            }
        },
        showCertPic(row){
            apiSystem.getAttachEmployee({fileId:row.id,model:'cert'}).then(res=>{
                if (res.data.length) {
                    this.imgCertUrl = '/minio/'+res.data[0].filePath
                    this.showcertpic = true
                } else {
                    this.$message.warning('未上传附件')
                    this.imgCertUrl = ''
                }
            })
        },
        save() {
            if (this.isEdit) {
                this.$refs.employeeForm.validate(valid => {
                    if (valid) {
                        this.isEdit = false
                        this.empForm.birthday = this.empForm.birthday?moment(this.empForm.birthday).format('YYYY-MM-DD'):''
                        this.empForm.hiredate = this.empForm.hiredate?moment(this.empForm.hiredate).format('YYYY-MM-DD'):''
                        this.empForm.organizationId = this.empForm.organizationId||0
                        this.empForm.departmentId = this.empForm.departmentId||0
                        this.empForm.clientId = this.empForm.clientId||0
                        this.empForm.postId = this.empForm.postId||0
                        !this.id?delete this.empForm.id:''
                        apiSystem[this.id?'editEmployee':'addEmployee'](this.empForm,this.createUser).then(res=>{
                            this.$message[res.code==200?'success':'warning'](res.message)
                            if (!this.id) {
                                this.id = res.data
                                if (this.fileList?.length) {
                                    delete this.fileList[0].status
                                    delete this.fileList[0].uid
                                    this.fileList[0].masterId = res.data
                                    apiSystem.addAttachEmployee(this.fileList[0]).then(res=>{
                                        this.$router.replace({ path: `/system/employee/`+this.id })
                                    })
                                } else {
                                    this.$router.replace({ path: `/system/employee/`+this.id })
                                }
                            } else {
                                if (this.fileList.length){
                                    delete this.fileList[0].status
                                    delete this.fileList[0].uid
                                    apiSystem.addAttachEmployee(this.fileList[0]).then(res=>{
                                        this.getEmpLogo()
                                    })
                                } else {
                                    if (this.fileListOrg?.length) {
                                        apiSystem.deleteAttachEmployee(this.fileListOrg[0].fileId).then(res=>{
                                            this.getEmpLogo()
                                        })
                                    }
                                }
                                this.getEmpDetail();
                                // location.reload()
                            }
                        })
                    } else {
                        // this.$message.warning('请填写必填项')
                    }
                })
            } else {
                this.isEdit=true
            }
        },
        deleteEmployee() {
            apiSystem.deleteEmployee(this.empForm.id||this.id).then(res=>{
                this.delDlg = false
                this.$message[res.code==200?'success':'warning'](res.message)
                this.$tabs.close()
                this.$router.push({ path: `/system/employee` })
            })
        },
        changeOrg(v) {
            apiSystem.getOrgAps(v).then(res=>{ this.epsList = res.data })
            this.empForm.organizeName = this.orgList.find(i=>i.id==v)?.orgName || ''
        },
        changeEps(v) {
            apiSystem.getDeptList({clientId:v}).then(res=>{ this.deptList = res.data.deptChildren; })
            this.empForm.enterpriseName = this.epsList.find(i=>i.clientId==v)?.bname || ''
        },
        changeDept(v) {
            apiSystem.getDeptPost(v).then(res=>{ this.postList = res.data })
            this.empForm.deptName = this.deptList.find(i=>i.deptId==v)?.deptName || ''
        },
        changePost(v) {
            this.empForm.postName = this.postList.find(i=>i.postId==v)?.postName || ''
        },
        getCert(){
            apiSystem.getCertList(this.empForm.id).then(res=>{
                this.tableData = res.data
                this.tablePage.total = res.data.length
            })
        },
        closeForm(v){
            this.certDlg = false
            v?this.getCert():''
        },
        deleteCert() {
            apiSystem.deleteEmployeeCert(this.certrow.id).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.getCert()
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
                        masterId: this.empForm.id,
                        model: 'logo',
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
        getEmpLogo(){
            apiSystem.getAttachEmployee({fileId:this.id,model:'logo'}).then(res=>{
                if (res?.data?.length) {
                    this.imgUrl = '/minio/'+res.data[0].filePath
                    res.data.forEach(i=>{
                        i.name = i.sourceFileName;
                        i.url = '/minio/'+i.filePath
                    })
                    this.fileList = res.data
                    this.fileListOrg = JSON.parse(JSON.stringify(this.fileList))
                } else {
                    this.imgUrl = ''
                    this.fileList = []
                    this.fileListOrg = []
                }
            })
        },
        getEmpDetail() {
            apiSystem.detailEmployee(this.id).then(res=>{
                this.empForm = res.data
                this.empForm.organizationId = this.empForm.organizationId||''
                this.empForm.departmentId = this.empForm.departmentId||''
                this.empForm.clientId = this.empForm.clientId||''
                this.empForm.postId = this.empForm.postId||''
                this.empOrg = JSON.parse(JSON.stringify(this.empForm))
                this.getCert()
                if (this.empForm.organizationId) {
                    apiSystem.getOrgAps(this.empForm.organizationId).then(res=>{ this.epsList = res.data })
                }
                if (this.empForm.clientId) {
                    apiSystem.getDeptList({clientId:this.empForm.clientId}).then(res=>{ this.deptList = res.data.deptChildren })
                }
                if (this.empForm.departmentId) {
                    apiSystem.getDeptPost(this.empForm.departmentId).then(res=>{ this.postList = res.data })
                }
                this.getEmpLogo()
            })
        }
    },
    mounted(){
        setTimeout(()=>{ this.showdesc=true },600)
    },
    created() {
        const { params } = this.$route
        this.id = params.id-0
        this.isEdit = !!!this.id
        this.id ? this.getEmpDetail() : ''
        apiSystem.getOrgTree().then(res=>{ this.orgList = res.data })
    },
    beforeDestroy() {
        this.isEdit = false
    }
}
</script>
<style lang="less" scoped>
.desc-block {
    padding:10px;
    box-sizing:border-box
}
.emp-form {
    padding:15px;
    box-sizing:border-box;
    position:relative;
    display:flex;
    flex-direction:column;
    height:100%;
}
</style>