<template>
    <div class="user-form">
        <sub-title title="用户信息">
            <template #buttons>
                <page-button @click="save" :content="isEdit?'保存':'修改'" />
                <page-button v-if="isEdit" @click="cancelEdit" content="取消" />
                <page-button v-if="!isEdit&&userId" @click="delDlg=true" content="删除" />
                <page-button @click="$tabs.close()" content="关闭" />
            </template>
        </sub-title>
        <div style="background:#fff">
            <descriptions-form v-if="showdesc" ref="userForm" :rules="rules" :editable="isEdit" :items="descItems" :item-model="userForm" :source-list="descSourceList">
                <template #avatar/>
                <template #userName>
                    <el-input v-if="isEdit" v-model="userForm.userName" :placeholder="'请输入用户名'" :disabled="!!userId"/>
                    <span v-else>{{userForm.userName}}</span>
                </template>
                <template #roleIds>
                    <!-- <el-input v-if="isEdit&&userId" v-model="userForm.roleIds" :placeholder="'请输入用户名'" :disabled="!!userId"/> -->
                    <el-select v-if="isEdit" v-model="userForm.roleIds" multiple placeholder="请选择用户角色">
                        <el-option v-for="i in allroles" :key="i.roleId" :label="i.roleName" :value="i.roleId"/>
                    </el-select>
                    <span v-else>{{userForm.roleIds&&userForm.roleIds.length?getRoleName(userForm.roleIds):''}}</span>
                </template>
                <template #password>
                    <page-button v-if="userId" @click="restDlg=true" content="重置密码"/>
                    <el-input v-if="isEdit&&!userId" v-model="userForm.password" disabled :placeholder="'系统自动生成'" show-password/>
                </template>
                <template #openStatus="{ value }">
                    <el-tag :type="!value?'success':'danger'" :disable-transitions="true" size="small">{{!value ? '启用': '禁用'}}</el-tag>
                </template>
            </descriptions-form>
        </div>
        <sub-title title="职员信息" />
        <div style="background:#fff">
            <el-descriptions :column="4" contentClassName="desc-cont cont-1-4"
                :labelStyle="{width:'10%',color:'#333333',background:'#FAFAFA'}" border size="medium">
                <el-descriptions-item v-for="i in credData" :key="i.key" :label="i.label">
                    <div v-if="empForm">
                        <span v-if="i.key=='sex'">{{!!empForm[i.key]?'男':'女'}}</span>
                        <span v-else-if="i.key=='birthday'||i.key=='hiredate'">{{empForm[i.key]?moment(empForm[i.key]).format('YYYY-MM-DD HH:mm:ss'):''}}</span>
                        <span v-else-if="i.key=='organizationId'">{{empForm.organizeName}}</span>
                        <span v-else-if="i.key=='clientId'">{{empForm.enterpriseName}}</span>
                        <span v-else-if="i.key=='departmentId'">{{empForm.deptName}}</span>
                        <span v-else-if="i.key=='postId'">{{empForm.postName}}</span>
                        <span v-else-if="i.key=='status'">
                            {{empForm[i.key]=='0'?'实习':empForm[i.key]=='1'?'在职':empForm[i.key]=='2'?'离职':empForm[i.key]=='3'?'退休':''}}
                        </span>
                        <div v-else-if="i.key=='openStatus'">
                            <el-tag :type="empForm.openStatus=='0'?'success':'danger'">
                                {{empForm[i.key]=='0'?'启用':'禁用'}}
                            </el-tag>
                        </div>
                        <span v-else>{{empForm[i.key]}}</span>
                    </div>
                </el-descriptions-item>
            </el-descriptions>
        </div>
        <sub-title title="证件/证书">
            <template #buttons>
                <page-button @click="papersForm={};papersVisible=true;papersIndex=''" content="新增" />
            </template>
        </sub-title>
        <div style="flex:1;height:0;background:#fff">
            <vxe-grid 
                :data="tableData"
                :columns="columns" 
                height="auto" 
                ref="table"
            >
                <template #files="{row}">
                    <span class="vxe-cell--label"><span v-for="(item, index) in row.fileList" :key="index" @click="previewFile(item.url)"> {{item.originalFileName}} <span v-if="index!=row.fileList.length - 1">、</span> </span></span>     
                </template>
                <template #action="{row, rowIndex}">
                    <page-button type="text" content="修改" @click="papersForm={...row};papersVisible=true;papersIndex=rowIndex"/>
                    <page-button type="text" content="删除" @click="delCert(row, rowIndex)"/>
                </template>
            
        </vxe-grid>
        </div>
        <!-- <TabLabel :label="'资质信息'"/>
        <div class="desc-block" style="flex:1;height:1px">
            <div class="app-table-container" style="height:calc(100% - 20px)">
                <div class="app-table-body" style="height:inherit">
                    <vxe-grid :data="tableData" :columns="tableColumns" height:="auto" ref="table"/>
                </div>
                <div class="app-table-footer">
                    <vxe-pager
                        :current-page.sync="tablePage.currentPage"
                        :page-size.sync="tablePage.pageSize"
                        :total="tablePage.total"
                        @page-change="pageChange"
                    />
                </div>
            </div>
        </div> -->
        <DelDialog @close="v=>{ delDlg=false; v?deleteUser():'' }" :delObj="{ module:'用户', target:userForm.userName, flag:delDlg }"/>

        <modal title="重置密码" :visible="restDlg" @close="restDlg=false">
            <template #title>
                <h2>重置密码</h2>
                <el-divider/>
            </template>
            <span style="margin-right:5px">确定要重置密码</span>
            <span style="color:red;font-size:18px">{{userForm.userName}}</span>
            <div style="margin-top:25px">
                <el-button type="danger" style="margin-right:10px" @click="resetPasswd">确认重置</el-button>
                <el-button @click="restDlg=false">取消</el-button>
            </div>
            <template slot="footer_bnt"><span/></template>
        </modal>
        <vxe-modal
            v-model="papersVisible" 
            :title="papersIndex===''?'新增':'修改'" 
            show-footer
            width="680"
            height="500"
        >
            <template #default>
                <el-form :model="papersForm" :rules="papersRules" ref="papersForm" label-width="120px" size="small" class="papers-form">
                <el-form-item label="证件/证书名称" prop="name">
                   <el-input
                        placeholder="请输入证件/证书名称"
                        v-model="papersForm.name"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="获得时间">
                    <el-date-picker
                        v-model="papersForm.acquisitionTime"
                        type="date"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        style="width: 100%"
                        placeholder="请选择获得时间"
                        :pickerOptions="{
                            disabledDate(current) {
                                return current > moment();
                            },
                        }"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="颁发机构">
                   <el-input
                        placeholder="请输入颁发机构"
                        v-model="papersForm.licenseOffice"
                    >
                    </el-input>
                </el-form-item>
                <el-form-item label="附件">
                    <upload-button
                        v-if="!readOnly"
                        type="text"
                        content="+上传"
                        @success="onUploadSuccess"
                    />
                    <div class="file-list">
                    <div
                        class="file-list-item"
                        v-for="(item, index) in papersForm.fileList"
                        :key="index"
                    >
                        <span class="file-list-item-name" :title="item.originalFileName" @click="onImgClick(item)">{{ item.originalFileName }}</span>
                        <svg-icon icon-class="download2" size="20" fill="var(--base-color)" @click="downloadFile(item)" />
                        <svg-icon v-if="!readOnly" icon-class="garbage" size="20" fill="var(--base-color)" style="margin-left: 10px" @click="onDelete(item, index)" />
                    </div>
                    </div>
                </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <page-button theme="white" @click="papersVisible=false">取消</page-button>
                <page-button @click="savePapers">保存</page-button>
            </template>
        </vxe-modal>
        <vue-easy-lightbox
            :visible="previewImg"
            :imgs="imgs"
            :index="previewIndex"
            @hide="previewImg = false"
            ref="lightbox"
        ></vue-easy-lightbox>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()
import TabLabel from '../components/tabLabel'
import DelDialog from '../components/deleteDialog'
import moment from 'moment'
import XEUtils from "xe-utils";
import VueEasyLightbox from "vue-easy-lightbox";

const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
import { MIME_TYPE } from '@/Controls/filelist-group-tem/mime'

export default {
    name: 'user_detail',
    components: { TabLabel, DelDialog, VueEasyLightbox },
    data() {
        return {
            moment,
            showdesc:false,
            isEdit:false,
            delDlg:false,
            restDlg:false,
            userForm:{
                accountType: 0,
                avatar: '',
                birthday: '',
                clientId: 0,
                createName: '',
                createTime: '',
                dataScope: '',
                delFlag: '',
                deptId: 0,
                deptName: '',
                email: '',
                employeeId: '',
                loginDate: '',
                loginIp: '',
                nickName: '',
                orgId: 0,
                password: '',
                personId: '',
                phone: '',
                postCodes: [],
                postGroup: '',
                postIds: [],
                remark: '',
                roleGroup: '',
                roleIds: [],
                roleName: '',
                roles: [],
                salt: '',
                searchValue: '',
                sex: '0',
                status: '0',
                sysDeptIds: [],
                sysDeptNames: [],
                sysPosts: [],
                updateName: '',
                updateTime: '',
                userId: 0,
                userName: '',
                webchatNo:''
            },
            userOrg:{},
            rules:{
                userName: [{ required:true, message:'请输入用户账号' }],
                nickName: [{ required:true, message:'请输入用户名称' }],
                phone: [{ required:true, message:'请输入电话' }],
                password: [{ required:true, message:'请输入密码' }],
                // personId: [{ required:true, message:'请输入身份证号' }],
                // birthday: [{ required:true, message:'请输入生日' }],
                // email: [{ required:true, message:'请输入邮箱' }],
            },
            empForm:false,
            allroles:[],
            descSourceList: {
                sex: [
                    { label:'男', value:'0' },
                    { label:'女', value:'1' }
                ],
                employees:[],
                roles:[],
                status:[
                    { label:'启用', value:'0' },
                    { label:'停用', value:'1' },
                ]
            },
            descItems: [
                { label:'头像', field:'avatar', slot:'avatar' },
                { label:'用户账号', field:'userName', type:'input', required:true, slot:'userName' },
                { label:'密码', field:'password', slot:'password', required:true },
                { label:'用户名称', field:'nickName', type:'input', required:true },
                { label:'性别', field:'sex', type:'radio', source:'sex' },
                { label:'生日', field:'birthday', type:'datetime' },
                { label:'身份证号', field:'personId', type:'input' },
                { label:'电话', field:'phone', type:'input', required:true },
                { label:'邮箱', field:'email', type:'input' },
                { label:'微信openid', field:'openIds', type:'' },
                { label:'微信号', field:'webchatNo', type:'input' },
                { label:'启用状态', field:'status', type:'radio', source:'status' },
                { label:'关联职员', field:'employeeId', type:'select', source:'employees' },
                { label:'角色', field:'roleIds', type:'selectmulti', source:'roles', slot:'roleIds' },
            ],
            userInfo: [
                { label:'头像', key:'avatar' }, { label:'用户名', key:'userName' }, { label:'密码', key:'password' }, 
                { label:'姓名', key:'nickName' }, { label:'性别', key:'sex' }, { label:'生日', key:'birthday' }, 
                { label:'身份证号', key:'personId' }, { label:'电话', key:'phone' }, { label:'邮箱', key:'email' },
                { label:'微信号', key:'webchatNo' },  { label:'启用状态', key:'status' }, { label:'关联职员', key:'employeeId' },
                { label:'角色', key:'roleIds' }
            ],
            credData: [
                { label:'姓名', key:'name' }, { label:'性别', key:'sex' },{ label:'出生日期', key:'birthday' }, 
                { label:'身份证号', key:'personId' }, { label:'入职日期', key:'hiredate' }, 
                { label:'成员状态', key:'status' },{ label:'电话', key:'phone' }, { label:'邮箱', key:'email' }, 
                { label:'微信号', key:'webchatNo' }, { label:'学历', key:'education' },{ label:'所属组织', key:'organizationId' }, 
                { label:'所属企业', key:'clientId' }, { label:'所属部门', key:'departmentId' }, { label:'所属岗位', key:'postId' },
                { label:'岗位性质', key:'positionType' }, { label:'职称', key:'rank' }, { label:'技能等级', key:'skillLevel' }, 
                { label:'工作地点', key:'workplace' }, { label:'启用状态', key:'openStatus' }
            ],
            tableData:[],
            tableColumns: [
                { field:'name', title:'证书名称', align:'center' },
                { field:'acquisitionTime', title:'获得时间', align:'center' },
                { field:'licenseOffice', title:'颁发机构', align:'center' },
                // { field:'attach', title:'附件信息', align:'center', slots:{ default:'attach' }  },
            ],
            tablePage: {
                currentPage: 1,
                pageSize: 20,
                total: 0,
            },
            allemp:[],
            userId:0,
            bindEmp:'',

            columns: [
                { field:'name', title:'证件/证书名称', align:'left' },
                { field:'acquisitionTime', title:'获得时间', width: '160px', align:'center' },
                { field:'licenseOffice', title:'颁发机构', align:'left' },    
                { field:'files', title:'附件信息', align:'left', slots:{ default:'files' } },    
                { field:'action', title:'操作', width: '100px', align:'center', slots: {default: 'action'} },    
            ],
            papersForm:{},
            papersRules: {
                name: [{ required:true, message:'请输入证件/证书名称' }],
            },
            papersIndex:'',
            readOnly: false,
            papersVisible:false,
            previewImg: false,
            previewIndex: 0,
            imgs: [],
        }
    },
    watch:{
        allroles(val) {
            val&&val.length ? 
                this.descSourceList.roles=val.map(i=>{
                    return { label:i.roleName, value:i.roleId }
                })
            :''
        },
        allemp(val) {
            val&&val.length ? 
                this.descSourceList.employees=val.map(i=>{
                    return { label:i.name, value:i.id }
                })
            :''
        }
    },
    methods: {
        delCert(row, rowIndex){
            if(row.id){
                const loading = this.$loading({
                    lock: true,
                    text: "删除中...",
                    spinner: "el-icon-loading",
                });
                apiSystem.deleteDelUserCert({id: row.id}).then(res=>{
                    if(res.code === 200){
                        this.getUserCert();
                        this.$message.success(res?.message??'操作成功');
                    }else{
                        this.$message.error(res?.message??'删除异常');
                    }
                }).catch(err=>{
                    this.$message.error(err?.message??'删除异常');
                }).finally(()=>{
                    loading.close();
                })
            }else{
                this.tableData.splice(rowIndex,1);
            }
        },
        getUserCert(){
            const loading = this.$loading({
                lock: true,
                text: "加载中...",
                spinner: "el-icon-loading",
            });
            apiSystem.getUserCert(this.userId).then(res=>{
                if(res.code === 200){
                    this.tableData=res.data;
                }else{
                    this.$message.error(res?.message??'获取证书信息异常');
                }
            }).catch(err=>{
                this.$message.error(err?.message??'获取证书信息异常');
            }).finally(()=>{
                loading.close();
            })
        },
        savePapers(state){
            this.$refs.papersForm.validate((valid) => {
                if (valid) {
                    if(!this.userId){
                        if(this.papersIndex===''){
                            this.tableData.push({...this.papersForm});
                        }else{
                            this.tableData.splice(this.papersIndex,1,{...this.papersForm})
                        }
                        this.papersVisible=false;
                    }else{
                        const loading = this.$loading({
                            lock: true,
                            text: "保存中...",
                            spinner: "el-icon-loading",
                        });
                        let data = {...this.papersForm}
                        if(this.papersIndex==='') data.userId = this.userId;
                        apiSystem[this.papersIndex===''?'putSaveUserCert':'putEitUserCert'](data).then(res=>{
                            if(res.code === 200){
                                this.getUserCert();
                                this.papersVisible=false;
                                this.$message.success(res?.message??'操作成功');
                            }else{
                                this.$message.error(res?.message??'操作异常');
                            }
                        }).catch(err=>{
                            this.$message.error(err?.message??'操作异常');
                        }).finally(()=>{
                            loading.close();
                        })
                    }
                } else {
                    this.$message.error('请检查必填项');
                    return false;
                }
            });
        },
        onUploadSuccess(e) {
            const fileList = XEUtils.clone(this.papersForm.fileList||[], true);
            this.$set(this.papersForm, "fileList", fileList.concat([{...e[0]}]));
        },
        getFileExtensionFromUrl(url) {
            const match = url.match(/[^\/\\&\?]+\.(?:[^\/\\&\?]+)(?=[\?&]|\s|$)/)
            if (match) {
                const filename = match[0]
                return filename.split('.').pop()
            }
            return null
        },
        previewFile(url) {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                const ext = this.getFileExtensionFromUrl(url)
                const mime = MIME_TYPE[ext]
                if (mime) {
                    const fileUrl = URL.createObjectURL(new Blob([blob], { type: MIME_TYPE[ext]}))
                    window.open(fileUrl, '_blank')
                } else {
                    window.open(url, '_blank')
                }
                })
                .catch(error => this.$message.error('文件转换失败'));
        },
        onImgClick(item) {
          const fileType = (file) => {
            let fileName = file.fileName ?? "";
            let ext = fileName && fileName
            .split(".")
            [fileName.split(".").length - 1].toLowerCase();
            return IMG_EXT.includes(ext);
          };
          if (fileType(item)) {
            this.imgs = (this.papersForm.fileList || [])
            .filter((x) => fileType(x))
            .map((i) => {
                return {
                    alt: i.originalFileName,
                    src: i.url,
                    title: i.originalFileName,
                };
            });
            this.previewImg = true;
            this.$nextTick(() => {
            const { lightbox } = this.$refs;
            const { $el } = lightbox;
            document.body.appendChild($el);
            this.previewIndex = this.imgs.findIndex((x) => x.src === item.url);
            });
          }
        },
        downloadFile(item) {
            const { originalFileName, url } = item;
            const a = document.createElement("a");
            a.style.display = "none";
            a.download = originalFileName;
            a.href = url;
            a.click();
        },
        onDelete(item, index) {
            let fileList = XEUtils.clone(this.papersForm.fileList||[], true);
            fileList.splice(index, 1);
            this.papersForm.fileList = [...fileList];
        },
        pageChange(){},
        getRoleName(arr){
            return arr.map(i=>this.allroles.find(a=>a.roleId==i)?.roleName).join(',')
        },
        cancelEdit() {
            this.isEdit=false
            this.userId?this.userForm=JSON.parse(JSON.stringify(this.userOrg)):this.$tabs.close()
        },
        save() {
            if (this.isEdit) {
                this.$refs.userForm.validate(valid => {
                    if (valid) {
                        this.userForm.birthday = this.userForm.birthday || ''
                        const { avatar, birthday, clientId, deptId, email, employeeId, nickName, personId, phone, roleIds, sex, userId, userName, webchatNo, status } = this.userForm
                        let obj = { avatar, birthday, clientId, deptIds:deptId?[deptId]:[], email, employeeId, nickName, personId, phone, rodes:roleIds, sex, userId, userName, webchatNo, status }
                        !this.userId?delete this.userForm.userId:''
                        apiSystem[this.userId?'editUser':'addUser'](this.userId?obj:{...this.userForm, userCertificationList: this.tableData.map(x=>{delete x._X_ROW_KEY;return x})}).then(async res=>{
                            this.$message[res.code==200?'success':'warning'](res.message)
                            if (res.code==200) {
                                this.isEdit = false
                                // !this.userId?this.$router.replace({ path: `/system/user/`+res.data }) : location.reload()

                                if(this.userId){
                                    const res = await apiSystem.detailUser(this.userId)
                                    if(res.code===200){
                                        this.userForm = res.data;
                                        this.userOrg = JSON.parse(JSON.stringify(res.data));
                                        this.bindEmp = this.allemp.find(i=>i.id==this.userForm.employeeId)?.name||''
                                        apiSystem.detailEmployee(res.data.employeeId).then(res=>{
                                            if(res.code === 200){
                                                this.empForm = res.data
                                            }
                                        })
                                        apiSystem.getCertList(res.data.employeeId).then(res=>{
                                            if(res.code === 200){
                                                this.tableData = res.data
                                                this.tablePage.total = res.data?.length ?? 0
                                            }
                                        })
                                    }else{
                                        this.$message.error(err.message||'操作异常')
                                    }
                                }else{
                                    this.$tabs.close(null, `/system/user/${res.data}`);
                                }
                            }
                        })
                    }
                })
            } else {
                this.isEdit=true
            }
        },
        deleteUser() {
            apiSystem.deleteUser(this.userId).then(res=>{
                this.delDlg = false
                this.$message[res.code==200?'success':'warning'](res.message)
                if(res.code===200) this.$tabs.close()
            })
        },
        resetPasswd() {
            this.restDlg=false
            apiSystem.resetPassword(this.userId).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
            })
        },
    },
    mounted(){
        setTimeout(()=>{ this.showdesc=true },600)
    },
    created() {
        apiSystem.getEmployee({page:1,size:99999}).then(res=>{ this.allemp = res.data.records })
        apiSystem.getRoleList().then(res=>{ this.allroles = res.data.records })
        const { params } = this.$route
        this.userId = params.id-0
        this.isEdit = !!!this.userId
        this.userOrg = JSON.parse(JSON.stringify(this.userForm))
        if(Object.keys(this.rules).includes('password')){
            this.rules.password = [{ required: this.userId ? true : false, message:'请输入密码' }];
        }
        this.userId ?
            apiSystem.detailUser(this.userId).then(res=>{
                this.userForm = res.data
                this.userForm.birthday = this.userForm.birthday||undefined
                this.userOrg = JSON.parse(JSON.stringify(res.data))
                if (res.data.employeeId) {
                    this.bindEmp = this.allemp.find(i=>i.id==this.userForm.employeeId)?.name||''
                    apiSystem.detailEmployee(res.data.employeeId).then(res=>{
                        this.empForm = res.data
                    })
                    // apiSystem.getCertList(res.data.employeeId).then(res=>{
                    //     this.tableData = res.data
                    //     this.tablePage.total = res.data.length
                    // })
                }
            }) : ''
        if(this.userId) this.getUserCert();
    }
}
</script>
<style>
@import '../style/system.css';
</style>
<style lang="less" scoped>
.desc-block {
    padding:10px;
    box-sizing:border-box;
}
.user-form {
    padding:15px;
    box-sizing:border-box;
    position:relative;
    display:flex;
    flex-direction: column;
    height:100%;
}
.descriptions-form {
    /deep/ tbody:last-child {
        tr td div {
            width:auto !important
        }
    }
}
.file-list {
    width: 100%;
    .file-list-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 390px;
      line-height: 19px;
      border: 1px solid #dcdcdc;
      border-radius: 4px;
      padding: 10px;
      margin-bottom: 10px;
      cursor: pointer;
      &:hover{
        border-color: var(--base-color);
      }
      .file-list-item-name{
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
.papers-form{
  /deep/ .el-form-item__error {
    top: 65%;
  }
}
</style>