<template>
    <app-page>
        <el-row class="main-cont">
            <div class="left-cont">
                <TabLabel :label="'应用列表'" />
                <div v-for="i in applyData" :key="i.key">
                    <el-radio v-model="curapp" :label="i.id" border>{{i.name}}</el-radio>
                </div>
            </div>
            <div class="right-cont">
                <h2 v-if="selapp" class="select-title">{{selapp.name}}</h2>
                <div style="position:relative"> 
                    <div class="tabs-button ">
                        <page-button v-if="!(!create&&isEdit)" @click="createSave" :content="isEdit?'保存':'新增'"/>
                        <page-button v-if="!(create&&isEdit)" :disabled="!!!selapp.id" @click="updateSave" :content="isEdit?'保存':'修改'"/>
                        <page-button v-if="!isEdit" :disabled="!!!selapp.id" @click="delDlg=true" content="删除"/>
                        <page-button v-if="isEdit" @click="cancel" content="取消"/>
                    </div>
                    <el-tabs v-model="tabkey" style="padding:0 5px;box-sizing:border-box">
                        <el-tab-pane name="1">
                            <span slot="label">应用信息</span>
                            <el-form ref="appForm" :rules="rules" :model="selapp">
                                <data-form ref="dataForm" :items="appDesc" :form-data="selapp" :editable="isEdit" :rules="rulesobj" />
                            </el-form>
                        </el-tab-pane>
                    </el-tabs> 
                </div>
            </div>
        </el-row>
        <DeleteDialog @close="v=>{ delDlg=false;v?deleteApp():'' }" 
            :delObj="{ module:'应用', target:selapp?selapp.name:'', flag:delDlg }"/>
    </app-page>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import DeleteDialog from '../components/deleteDialog'
import TabLabel from '../components/tabLabel'

export default {
    name: 'application',
    components: { TabLabel, DeleteDialog },
    data() {
        return {
            tabkey: '1',
            curapp: {
                logo:'',
                backImage:'',
                name:'',
                code:'',
                systemUrl:'',
                enterpriseName:'',
                filingInformation:''
            },
            delDlg: false,
            applyData: [],
            isEdit: false,
            create: false,
            appDesc: [
                { label:'系统Logo', field:'logo', type:'input' },
                { label:'登录页背景', field:'backImage', type:'input' },
                { label:'系统名称', field:'name', type:'input' },
                { label:'系统编码', field:'code', type:'input' },
                { label:'系统地址', field:'systemUrl', type:'input' },
                { label:'企业名称', field:'enterpriseName', type:'input' },
                { label:'备案信息', field:'filingInformation', type:'input' },
            ],
            rulesobj:{
                name:[{required:true,message:'请输入系统名称'}],
                code:[{required:true,message:'请输入系统编码'}],
            },
            selapp: {
                backImage: '',
                code: '',
                enterpriseName: '',
                filingInformation: '',
                id: 0,
                logo: '',
                name: '',
                sysDictionariesList: [],
                systemUrl: ''
            },
            selappOrg: {},
            rules:{
                name: [{ required:true, message:'请输入系统名称' }],
                code: [{ required:true, message:'请输入系统编码' }]
            },
        }
    },
    watch:{
        curapp:{
            handler(newV,oldV) {
                if (newV) {
                    apiSystem.detailApply(newV).then(res=>{
                        this.selapp = res.data
                        this.selappOrg = JSON.parse(JSON.stringify(this.selapp))
                    })
                } 
            }
        }
    },
    methods:{
        createSave() {
            this.create=true
            if (!this.isEdit) {
                this.isEdit=true
                this.selapp = {
                    backImage: '',
                    code: '',
                    enterpriseName: '',
                    filingInformation: '',
                    id: 0,
                    logo: '',
                    name: '',
                    sysDictionariesList: [],
                    systemUrl: ''
                }
            } else {
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        apiSystem.saveApply(this.selapp).then(res=>{
                            this.$message.success(res.message)
                            this.isEdit=!this.isEdit
                            this.getTreeData(true)
                            this.selapp = {
                                backImage: '',
                                code: '',
                                enterpriseName: '',
                                filingInformation: '',
                                id: 0,
                                logo: '',
                                name: '',
                                sysDictionariesList: [],
                                systemUrl: ''
                            }
                        }) 
                    } else {
                        this.$message.warning('请输入必填项')
                    }
                })
            }
        },
        updateSave() {
            this.create=false
            if (!this.isEdit) {
                this.isEdit=true
            } else {
                this.$refs.dataForm.validate(valid => {
                    if (valid) {
                        apiSystem.editApply(this.selapp).then(res=>{
                            this.$message.success(res.message)
                            this.isEdit=!this.isEdit
                            this.getTreeData()
                        })
                    } else {
                        this.$message.warning('请输入必填项')
                    }
                })
            }
        },
        cancel() {
            this.create=false
            this.isEdit=false
            this.selapp=this.selappOrg
        },
        deleteApp() {
            this.delDlg=false
            apiSystem.deleteApply(this.selapp.id).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.getTreeData(true)
            })
        },
        getTreeData(jump=false) {
            apiSystem.getApplyTree().then(res=>{
                this.applyData = res.data
                jump ? this.curapp = this.applyData[this.applyData.length-1]?.id:''
            })
        }
    },
    created() {
        this.getTreeData()
    }
}
</script>
<style lang="less" scoped>
.el-radio {
    width: 180px;
    margin-top: 10px;
    margin-right: 10px;
    padding: 0;
    /deep/ .el-radio__input {
        display:none
    }
}
</style>
<style>
@import '../style/system.css';
</style>