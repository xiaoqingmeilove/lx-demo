<template>
    <app-page>
        <el-row class="main-cont">
            <div class="left-cont">
                <div class="add-button">
                    <page-button type="text" @click="create=true;orgDlg=true" icon="el-icon-circle-plus-outline" content="新增组织" />
                </div>
                <div>
                    <el-input placeholder="请输入查询内容" v-model="filterText" clearable/>
                    <el-tree class="left-tree" ref="orgTree" default-expand-all highlight-current :data="orgData" 
                        @node-click="nodeClick" :props="{label:'orgName'}" :expand-on-click-node="false" :filter-node-method="filterNode">
                        <template slot-scope="{data}">
                            <div>
                                <img :src="require('/static/images/Group-390@2x.png')" alt="image">
                                <span style="margin-left:3px">{{data.orgName}}</span>
                            </div>
                        </template>
                    </el-tree>
                </div>
            </div>
            <div class="right-cont">
                <div>
                    <div v-if="selorg" class="select-title">{{selorg.orgName}}</div>
                    <div style="position:relative"> 
                        <div class="tabs-button">
                            <page-button @click="create=true;orgDlg=true" content="新增组织"/>
                            <page-button :disabled="!selorg" @click="create=false;orgDlg=true" content="修改组织"/>
                            <page-button :disabled="!selorg" @click="delDlg=true" content="删除组织"/>
                        </div>
                        <el-tabs v-model="tabValue">
                            <el-tab-pane name="1">
                                <span slot="label">组织信息</span>
                                <data-form ref="dataForm" :items="orgDesc" :form-data="selorg">
                                    <template #parentId>
                                       <span>{{parentName}}</span>
                                    </template>
                                    <template #status="{value}">
                                        <el-tag v-if="selorg.id" :type="value=='0'?'success':'danger'" size="small">
                                            {{value=='0'?'启用':'停用'}}
                                        </el-tag>
                                    </template>
                                </data-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
                <div style="flex:1;height:1px">
                    <TabLabel style="margin-top:15px" v-if="tableData?.length" :label="'组内企业信息'" />
                    <div v-if="tableData?.length" class="app-table-container" style="height:calc(100% - 50px)">
                        <div class="app-table-body" style="height:inherit">
                            <vxe-grid :data="tableData" :columns="tableColumns" height="auto" ref="table" />
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
                </div>
            </div>
        </el-row>

        <modal width="500px" :title="(create?'新增':'修改')+'组织'" :visible="orgDlg" @close="orgDlg=false">
            <OrgForm v-if="orgDlg" :create="create" :orgObj="selorg" @close="closeForm"/>
            <template slot="footer_bnt"><span/></template>
        </modal>

        <DeleteDialog @close="v=>{ delDlg=false; v?deleteOrg():'' }" 
            :delObj="{ module:'组织', target:selorg?.orgName||'', flag:delDlg }"/>
    </app-page>
</template>
<script>
import OrgForm from './form'
import DeleteDialog from '../components/deleteDialog'
import TabLabel from '../components/tabLabel'
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    name:'organization',
    components: { OrgForm, DeleteDialog, TabLabel },
    data() {
        return {
            tabValue: '1',
            orgDlg: false,
            selorg: {
                orgName:'',
                orgCode:'',
                parentId:'',
                administrativeDivision:'',
                address:'',
                status:'',
                remark:''
            },
            create: true,
            delDlg: false,
            tableColumns: [
                { title:'企业名称', field:'bname', align:'center' },
                { title:'社会统一信用代码', field:'socialUnifiedCreditCode', align:'center' },
                { title:'行政区域', field:'regAddressAdministrativeCode', align:'center' },
                { title:'注册地址', field:'regAddress', align:'center' },
                { title:'法定代表人', field:'legalRepresentative', align:'center' },
                { title:'联系电话', field:'legalRepresentativeTel', align:'center' },
            ],
            tableData: [],
            tableOrg: [],
            orgData: [],
            orgDesc:[
                { label:'组织名称', field:'orgName' },
                { label:'组织编码', field:'orgCode' },
                { label:'上级组织', field:'parentId', slot:'parentId' },
                { label:'行政区域', field:'administrativeDivision' },
                { label:'组织地址', field:'address' },
                { label:'启用状态', field:'status', slot:'status' },
                { label:'备注说明', field:'remark' },
            ],
            tablePage: {
                currentPage: 1,
                pageSize: 20,
                total: 0,
            },
            parentName:'',
            filterText:'',
        }
    },
    watch: {
      filterText(val) {
        this.$refs.orgTree.filter(val)
      }
    },
    methods:{
        filterNode(value, data) {
            if (!value) return true;
            return data.orgName.indexOf(value) !== -1
        },
        tableRange(arr) {
            const {currentPage, pageSize} = this.tablePage
            return JSON.parse(JSON.stringify(arr)).slice((currentPage-1)*pageSize,currentPage*pageSize)
        },
        pageChange(obj) {
            this.tablePage.currentPage = obj.currentPage
            this.tablePage.pageSize = obj.pageSize
            this.tableData=this.tableRange(this.tableOrg)
        },
        closeForm(v) {
            this.orgDlg = false
            v ? apiSystem.getOrgTree().then(res=>{
                this.orgData = res.data
                if (this.selorg?.id) {
                    apiSystem.detailOrg(this.selorg.id).then(res=>{
                        this.selorg = res.data
                    })                    
                }
            }) : ''
        },
        nodeClick(obj) {
            this.selorg=obj
            apiSystem.detailOrg(this.selorg?.parentId||0).then(res=>{
                this.parentName = res.data?.orgName||''
            })
            apiSystem.getOrgAps(this.selorg.id).then(res=>{
                this.tableOrg = res.data
                this.tableData = this.tableRange(this.tableOrg)
                this.tablePage.total = this.tableOrg.length
            })
        },
        deleteOrg() {
            this.delDlg=false
            apiSystem.deleteOrg(this.selorg.id).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.selorg = undefined
                this.parentName = ''
                this.getOrgTree()
            })
        },
        filterHandler(value, row, column) {
            const property = column['property']
            return row[property] === value
        },
        getOrgTree(){
            apiSystem.getOrgTree().then(res=>{
                this.orgData = res.data
            })
        }
    },
    created() {
        this.getOrgTree()
    }
}
</script>
<style>
@import "../style/system.css";
</style>