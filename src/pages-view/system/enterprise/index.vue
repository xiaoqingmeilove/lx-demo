<template>
    <app-page>
        <el-row class="main-cont">
            <div class="left-cont">
                <div class="add-button">
                    <page-button type="text" @click="selaps=undefined;create=true;num+=1" icon="el-icon-circle-plus-outline" content="新增企业" />
                </div>
                <div>
                    <el-input placeholder="请输入查询内容" v-model="filterText" clearable/>
                    <el-tree class="left-tree" default-expand-all highlight-current :data="apsTree" ref="apsTree" :filter-node-method="filterNode"
                        @node-click="nodeClick" :props="{label:'name', children:'enterpriseChildren'}" :expand-on-click-node="false">
                        <template slot-scope="{data}">
                            <div>
                                <img :src="require(`/static/images/${data.clientId?'Group-391@2x':'Group-390@2x'}.png`)" alt="image"/>
                                <span style="margin-left:3px">{{data.name}}</span>
                            </div>
                        </template>
                    </el-tree>
                </div>
            </div>
            <div class="right-cont">
                <h2 v-if="selaps" class="select-title">{{selaps.name}}</h2>
                <div style="position:relative;height:100%"> 
                    <div class="tabs-button">
                        <page-button @click="create=true;num+=1" content="新增企业" />
                        <page-button v-if="selaps&&selaps.clientId" @click="delDlg=true" content="删除企业" />
                    </div>
                    <el-tabs v-model="tabValue" @tab-click="tabClk" class="aps-desc-tab">
                        <el-tab-pane name="0">
                            <span slot="label">企业信息</span>
                            <ApsInfo v-if="!selaps||(selaps&&selaps.clientId)||create" :key="num" :create="create" :selAps="selaps" :selObj="selobj" @close="closeInfo"/>
                            <OrgInfo v-else :key="onum" :selaps="selaps"/>
                        </el-tab-pane>
                        <el-tab-pane name="1">
                            <span slot="label">场地信息</span>
                            <ApsLoc :key="lnum" :selObj="selobj"/>
                        </el-tab-pane>
                        <el-tab-pane name="2">
                            <span slot="label">资质信息</span>
                            <ApsCred :key="cnum" :selObj="selobj"/>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-row>
        <DeleteDialog @close="v=>{ delDlg=false; v?deleteAps():'' }" 
            :delObj="{ module:'企业', target:selaps?selaps.name:'', flag:delDlg }"/>
    </app-page>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import DeleteDialog from '../components/deleteDialog'
import ApsInfo from './apsInfo'
import ApsLoc from './apsLoc'
import ApsCred from './apsCred'
import OrgInfo from './apsOrg'

export default {
    name: 'enterprise',
    components: { DeleteDialog, ApsInfo, ApsLoc, ApsCred, OrgInfo },
    data() {
        return {
            create: false,
            tabValue: '0',
            apsDlg: false,
            delDlg: false,
            selaps: undefined,
            selapsOrg: undefined,
            selobj: undefined,
            apsTree: [],
            num: 0,
            lnum: 0,
            cnum: 0,
            onum: 0,
            filterText:'',
        }
    },
    watch: {
      filterText(val) {
        this.$refs.apsTree.filter(val)
      }
    },
    methods:{
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1
        },
        tabClk(v) {
            this.tabValue = v.index
            v=='0' ? this.num += 1 : v=='1' ? this.lnum += 1 : this.cnum += 1
        },
        nodeClick(obj){
            this.selaps = obj
            obj?.clientId ? '' : this.onum+=1
            apiSystem.detailAps(obj?.id||obj?.clientId).then(res=>{
                this.selobj = res.data
                this.selapsOrg = JSON.parse(JSON.stringify(this.selobj))
                this.num += 1
                this.lnum += 1
                this.cnum += 1
            })
        },
        deleteAps() {
            apiSystem.deleteAps(this.selaps.clientId).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.getApsTree()
                this.delDlg=false
                this.selobj = undefined
                this.num += 1
                this.lnum += 1
                this.cnum += 1
            })
        },
        getApsTree(){
            // apiSystem.getApsTree().then(res=>{ 
            //     this.apsTree = res.data 
            // })
            apiSystem.getOrgTree().then(res=>{ 
                this.apsTree = res.data 
                if (res.data?.length) {
                    this.apsTree.forEach(i=>{
                        i.name = i.orgName
                        i?.enterpriseChildren?.length?
                        i.enterpriseChildren.forEach(j=>{
                            j.name = j.bname
                        }):''
                    })
                }
            })
        },
        closeInfo(){
            this.create = false
            this.getApsTree()
            this.selobj?.clientId ?
                apiSystem.detailAps(this.selobj.clientId).then(res=>{
                    this.selobj = res.data
                    this.num+=1
                }) :''
        }
    },
    created() {
        this.getApsTree()
    }
}
</script>
<style lang="less">
.aps-desc-tab  {
    height:100%;
    .el-tabs__content {
        height:calc(100% - 55px);
        // overflow-y:scroll;
        > * {
            height:100%;
        }
    }
}
</style>
<style>
@import '../style/system.css';
</style>