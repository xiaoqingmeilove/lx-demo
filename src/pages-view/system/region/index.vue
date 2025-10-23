<template>
    <app-page>
        <el-row class="main-cont">
            <div class="left-cont">
                <div class="add-buttons">
                    <page-button type="text" @click="selaps=undefined;create=true;num+=1" icon="el-icon-circle-plus-outline" content="新增区域" />
                    <page-button type="text" @click="getApsTree(),getApsTrees()" icon="el-icon-refresh" content="更新区域目录" />
                </div>
                <div>
                    <el-input placeholder="请输入查询内容" v-model="filterText" clearable/>
                    <el-tree class="left-tree" :default-expand-all="false" highlight-current :data="apsTree" ref="apsTree" :filter-node-method="filterNode"
                        @node-click="nodeClick" :props="{label:'name', children:'children'}" :expand-on-click-node="false">
                        <template slot-scope="{data}">
                            <div>
                                <span style="margin-left:3px">{{data.name}}</span>
                            </div>
                        </template>
                    </el-tree>
                </div>
            </div>
            <div class="right-cont">
                <div style="position:relative;height:100%"> 
                    <div class="tabs-button">
                        <file-button
                            @change="onFileSelect"
                            content="导入"
                        ></file-button>
                        <page-button @click="postExport" content="导出" />
                        <page-button @click="create=true;num+=1" content="新增区域" />
                        <page-button v-if="selaps&&selaps.code" @click="edit=true;num+=1" content="修改区域" />
                        <page-button v-if="selaps&&selaps.code" @click="delDlg=true" content="删除区域" />
                    </div>
                    <el-tabs v-model="tabValue" class="aps-desc-tab">
                        <el-tab-pane name="0">
                            <span slot="label">项目区域维护</span>
                            <ApsInfo :key="num" :create="create" :selAps="selaps" :selObj="selobj" @close="closeInfo"/>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </div>
        </el-row>
        <modal :title="'新增区域信息'" width="600px"  :visible="create" @close="create=false">
            <RoleForm v-if="create" :apsTrees="apsTrees" :businessCode="businessCode" @closeForm="closeRole"/>
            <template slot="footer_bnt"><span/></template>
        </modal>
        
        <modal :title="'修改区域信息'" width="600px" :visible="edit" @close="edit=false">
            <EditForm v-if="edit" :apsTrees="apsTrees" :roleItem="selobj" :businessCode="businessCode" @closeForm="closeEdit"/>
            <template slot="footer_bnt"><span/></template>
        </modal>
        
        <DeleteDialog @close="v=>{ delDlg=false; v?deleteAps():'' }" 
            :delObj="{ module:'区域', target:selaps?selaps.name:'', flag:delDlg }"/>
    </app-page>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()
import { mapState } from "vuex"

import DeleteDialog from '../components/deleteDialog'
import ApsInfo from './apsInfo'
import RoleForm from './roleForm'
import EditForm from './editForm'
import { blobToFile } from '@/utils/utils'

export default {
    name: 'region',
    components: { DeleteDialog, ApsInfo, RoleForm, EditForm },
    data() {
        return {
            create: false,
            edit:false,
            tabValue: '0',
            apsDlg: false,
            delDlg: false,
            selaps: undefined,
            selapsOrg: undefined,
            selobj: undefined,
            apsTree: [],
            apsTrees: [],
            num: 0,
            lnum: 0,
            cnum: 0,
            onum: 0,
            filterText:'',
        }
    },
    computed: {
        ...mapState({
            businessCode: (state) => state.Common.businessCode,
        }),
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
        closeRole(v) {
            this.create = false
            v?this.getApsTree():''
        },
        closeEdit(v){
           this.edit = false
           //v?this.getApsTree():''
           v?this.nodeClick(this.selaps):''
        },
        nodeClick(obj){
            this.selaps = obj
            obj?.code ? '' : this.onum+=1
            apiSystem.getRegionDetails(obj?.code).then(res=>{
                this.selobj = res.data
                this.selapsOrg = JSON.parse(JSON.stringify(this.selobj))
                this.num += 1
                this.lnum += 1
                this.cnum += 1
            })
        },
        deleteAps() {
            apiSystem.deleteRegionDatails(this.selaps.code).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.getApsTree()
                this.delDlg=false
                this.selobj = undefined
                this.num += 1
                this.lnum += 1
                this.cnum += 1
            })
        },
        onFileSelect(e) {
            const loading = this.$loading({
                lock: true,
                text: "导入中",
                spinner: "el-icon-loading",
            });
            apiSystem
            .postimportRegionDetailUrl(e[0])
            .then((res) => {
            if (res.code === 200) {
                this.$message.success("导入成功");
                this.getApsTree();
                this.getApsTrees();
            } else {
                // 导入失败
                this.$message.warning(res.message);
            }
            })
            .finally(() => {
            loading.close();
            });
        },
        async postExport(){
            const loading = this.$loading({
                lock: true,
                text: "导出中",
                spinner: "el-icon-loading",
            });
            apiSystem.postRegionDetailExport().then(res => {
                blobToFile(res, `项目区域维护文件.xlsx`);
            }).catch(err=>{
                this.$message.error("导出失败");
            }).finally(() => {
                setTimeout(() => {
                loading.close();
                }, 500)
            })
        },
        
        getApsTrees(){
            let token = localStorage.getItem('token')
            apiSystem.getRegionTrees(token).then(res=>{ 
                this.apsTrees = res.data 
            })
        },
        getApsTree(){
            const loading = this.$loading({
                lock: true,
                text: "更新中",
                spinner: "el-icon-loading",
            });
            let token = localStorage.getItem('token')
            apiSystem.getRegionTree(token).then(res=>{ 
                this.apsTree = res.data 
                if (res.data?.length) {
                    this.apsTree.forEach(i=>{
                        i.name = i.name
                        i?.children?.length?
                        i.children.forEach(j=>{
                            j.name = j.name
                        }):''
                    })
                }
            }).finally(() => {
                setTimeout(() => {
                loading.close();
                }, 500)
            })
        },
        closeInfo(){
            this.create = false
            this.getApsTree()
            this.selobj?.id ?
                apiSystem.detailAps(this.selobj.id).then(res=>{
                    this.selobj = res.data
                    this.num+=1
                }) :''
        }
    },
    created() {
        this.getApsTree()
        this.getApsTrees()
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