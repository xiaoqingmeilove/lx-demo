<template>
    <app-page>
        <el-row class="main-cont">
            <div class="left-cont">
                <div style="display: flex;flex-direction: column;height: 100%;">
                    <el-input placeholder="请输入查询内容" v-model="filterText" clearable/>
                    <el-tree ref="appTree" style="flex: 1; height: 0;" class="left-tree" default-expand-all highlight-current :data="epsData"
                        @node-click="nodeClick" :props="{label:'name', children:'child'}" :filter-node-method="filterNode" :expand-on-click-node="false"/>
                </div>
            </div>
            <div class="right-cont">
                <h2 v-if="seleps" class="select-title">{{seleps.bname}}</h2>
                <div style="position:relative"> 
                    <div class="tabs-button ">
                        <page-button content="保存" @click="save"/>
                    </div>
                    <el-tabs v-model="tabValue" style="padding:0 5px;box-sizing:border-box">
                        <el-tab-pane name="1">
                            <span slot="label">企业信息</span>
                            <data-form ref="dataForm" :items="epsDesc" :form-data="seleps">
                                <template #defaultFlag="{value}">
                                    <el-tag v-if="seleps.clientId" :type="value=='0'?'success':'danger'" size="small">
                                        {{value=='0'?'启用':'停用'}}
                                    </el-tag>
                                </template>
                            </data-form>
                            <TabLabel style="margin-top:15px" :label="'添加应用'" />
                            <el-transfer v-model="tfvalue" :data="tfdata" :titles="['可选应用', '已选应用']"/>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-row>
    </app-page>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import TabLabel from '../components/tabLabel'

export default {
    name: 'appEnable',
    components: { TabLabel },
    data() {
        return {
            tabValue: '1',
            seleps: {
                bname:'',
                socialUnifiedCreditCode:'',
                orgName:'',
                regAddressAdministrativeCode:'',
                regAddress:'',
                legalRepresentative:'',
                legalRepresentativeTel:'',
                defaultFlag:''
            },
            epsData:[],
            epsDesc:[
                { label:'企业名称', field:'bname' },
                { label:'社会统一信用代码', field:'socialUnifiedCreditCode' },
                { label:'所属组织', field:'orgName' },
                { label:'行政区域', field:'regAddressAdministrativeCode' },
                { label:'注册地址', field:'regAddress' },
                { label:'法定代表人', field:'legalRepresentative' },
                { label:'联系电话', field:'legalRepresentativeTel' },
                { label:'启用状态', field:'defaultFlag', slot:'defaultFlag' },
            ],
            tfvalue:[],
            tfdata:[],
            filterText:'',
            orgName:''
        }
    },
    watch: {
      filterText(val) {
        this.$refs.appTree.filter(val)
      }
    },
    methods:{
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1
        },
        nodeClick(obj){
            apiSystem.detailAps(obj.id).then(res=>{
                this.seleps = res.data
                this.seleps?.sysOrganizationId ?
                    apiSystem.detailOrg(this.seleps.sysOrganizationId).then(res=>{
                        this.orgName = res.data?.orgName||''
                    }) : ''
            })
            apiSystem.getApplyTree().then(res=>{
                this.tfdata = res.data.map(i=>{
                    return { key:i.id, label:i.name }
                })
                this.tfvalue = []
                apiSystem.getCheckApply(obj.id).then(res=>{
                    this.tfvalue = res.data.map(i=>i.applyId)
                })
            })
        },
        save() {
            let arr = this.tfvalue.filter(j=>!!j).map(i=>{
                return {
                    applyId: i,
                    applyName: this.tfdata.find(a=>a.key==i).label,
                    enterpriseId: this.seleps.clientId,
                    enterpriseName: this.seleps.deptName,
                    id: i.id||''
                }
            })
            !arr.length ? arr=[{
                applyId: '',
                applyName: '',
                enterpriseId: this.seleps.clientId,
                enterpriseName: '',
                id: ''
            }] : ''
            apiSystem.saveCheckApply(arr).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
            })
        },
    },
    created() {
        apiSystem.getApsTree().then(res=>{ this.epsData = res.data })
    }
}
</script>
<style>
@import "../style/system.css";
</style>
<style lang="less" scoped>
/deep/ .el-transfer-panel {
    width: calc(50% - 100px)
}
</style>