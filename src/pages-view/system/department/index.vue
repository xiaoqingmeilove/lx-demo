<template>
    <app-page>
        <el-row class="main-cont">
            <div class="left-cont">
                <div class="add-button">
                    <page-button type="text" @click="create=true;deptDlg=true" icon="el-icon-circle-plus-outline" content="新增部门" />
                </div>
                <div>
                    <el-input placeholder="请输入查询内容" v-model="filterText" clearable/>
                    <el-tree class="left-tree" default-expand-all highlight-current :data="deptData" ref="deptTree"
                        @node-click="nodeClick" :props="{label:'name'}" :expand-on-click-node="false" :filter-node-method="filterNode">
                        <template slot-scope="{data}">
                            <div>
                                <img :src="require(`/static/images/${data.deptId?'Group-392@2x':data.clientId?'Group-391@2x':'Group-390@2x'}.png`)" alt="image">
                                <span style="margin-left:3px">{{data.name}}</span>
                            </div>
                        </template>
                    </el-tree>
                </div>
            </div>
            <div class="right-cont">
                <div v-if="seldept" class="select-title">{{seldept.deptName||seldept.bname||seldept.orgName}}</div>
                <div style="position:relative"> 
                    <div class="tabs-button ">
                        <page-button content="新增部门" type="primary" @click="create=true;deptDlg=true"/>
                        <page-button content="修改部门" :disabled="!seldept||!seldept.deptId" type="primary" @click="create=false;deptDlg=true"/>
                        <page-button content="删除部门" :disabled="!seldept||!seldept.deptId" type="primary" @click="delDlg=true"/>
                    </div>
                    <el-tabs v-model="tabkey">
                        <el-tab-pane name="1">
                            <span slot="label">部门信息</span>
                            <data-form ref="dataForm" :items="deptDesc" :form-data="seldept">
                                <template #status="{value}">
                                    <el-tag v-if="seldept.deptId" :type="value=='0'?'success':'danger'" size="small">
                                        {{value=='0'?'启用':'停用'}}
                                    </el-tag>
                                </template>
                            </data-form>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div style="flex:1;height:1px">
                    <TabLabel style="margin-top:15px" v-if="tableData.length" :label="'部门列表'" />
                    <div v-if="tableData.length" class="app-table-container" style="height:calc(100% - 50px)">
                        <div class="app-table-body" style="height:inherit">
                            <vxe-grid :data="tableData" :columns="tableColumns" height="auto" ref="table">
                                <template #status="{ row }">
                                    <page-button :theme="row.status=='0'?'success':'danger'">
                                        {{row.status=='0'?'启用':'停用'}}
                                    </page-button>
                                </template>
                            
        </vxe-grid>
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
        <modal width="500px" :title="(create?'新增':'修改')+'部门'" :visible="deptDlg" @close="deptDlg=false">
            <DeptForm v-if="deptDlg" :deptObj="seldept" :deptTree="deptData" :create="create" @close="closeForm"/>
            <template slot="footer_bnt"><span/></template>
        </modal>
        <DeleteDialog @close="v=>{ delDlg=false; v?deleteDept():'' }" 
            :delObj="{ module:'部门', target:seldept?seldept.deptName:'', flag:delDlg }"/>
    </app-page>
</template>
<script>
import DeptForm from './form'
import DeleteDialog from '../components/deleteDialog'
import TabLabel from '../components/tabLabel'
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    name: 'department',
    components: { DeptForm, DeleteDialog, TabLabel },
    data() {
        return {
            tabkey: '1',
            deptDlg: false,
            delDlg: false,
            seldept: {
                deptName:'',
                deptCode:'',
                parentName:'',
                bname:'',
                orderNum:'',
                status:'',
                remark:''
            },
            deptData: [],
            create: '',
            deptDesc:[
                { label:'部门名称', field:'deptName' },
                { label:'部门编码', field:'deptCode' },
                { label:'上级部门', field:'parentName' },
                { label:'所属企业', field:'bname' },
                { label:'显示顺序', field:'orderNum' },
                { label:'启用状态', field:'status', slot:'status' },
                { label:'备注说明', field:'remark' },
            ],
            tableData: [],
            tableOrg: [],
            tableColumns: [
                { title:'部门名称', field:'deptName', align:'center' },
                { title:'部门编码', field:'deptCode', align:'center' },
                { title:'上级部门', field:'parentName', align:'center' },
                { title:'所属企业', field:'bname', align:'center' },
                { title:'启用状态', field:'status', align:'center', slots:{ default:'status' } },
                { title:'备注说明', field:'remark', align:'center' },
            ],
            tablePage: {
                currentPage: 1,
                pageSize: 20,
                total: 0,
            },
            filterText:'',
        }
    },
    watch: {
      filterText(val) {
        this.$refs.deptTree.filter(val)
      }
    },
    methods:{
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1
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
            this.deptDlg = false
            v&&this.seldept?.deptId ? apiSystem.detailDept(this.seldept.deptId).then(res=>{
                this.seldept = res.data
            }) : ''
            v ? this.getTreeData() : ''
        },
        nodeClick(obj){
            this.seldept = obj
            obj?.deptId ?
                apiSystem.detailDept(obj.deptId).then(res=>{
                    this.seldept = res.data
                }) : this.seldept = { bname:this.seldept?.bname||'', orgName:this.seldept?.orgName||'' }
            if (obj?.clientId) {
                this.tableOrg = obj.children
                this.tableData = this.tableRange(this.tableOrg)
                this.tablePage.total = this.tableOrg.length
            } else {
                this.tableData = []
                this.tableOrg = []
            }
        },
        deleteDept() {
            apiSystem.deleteDept(this.seldept.deptId).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.seldept = undefined
                this.getTreeData()
            })
        },
        getTreeData() {
            apiSystem.getDeepDeptTree().then(res=>{
                this.deptData = this.treeFormat(res.data)
            })
        },
        treeFormat(arr){
            (arr || []).forEach(i => {
                i.name =  i?.deptName || i?.bname || i?.orgName
                i.id = i?.id || i?.deptId || i?.clientId
                i.children = i?.sysDeps || i?.deptChildren|| i?.enterpriseChildren || []
                this.treeFormat(i.children)
            })
            return arr
        }
    },
    created() {
        this.getTreeData()
    }
}
</script>
<style>
@import "../style/system.css";
</style>