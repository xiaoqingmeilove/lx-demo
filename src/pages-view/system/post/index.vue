<template>
    <app-page>
        <el-row class="main-cont">
            <div class="left-cont">
                <div class="add-button">
                    <page-button type="text" @click="create=true;postDlg=true" icon="el-icon-circle-plus-outline" content="新增岗位" />
                </div>
                <div>
                    <el-input placeholder="请输入查询内容" v-model="filterText" clearable/>
                    <el-tree class="left-tree" default-expand-all highlight-current :data="postData" ref="postTree"
                        @node-click="nodeClick" :props="{label:'name'}" :expand-on-click-node="false" :filter-node-method="filterNode">
                        <template slot-scope="{data}">
                            <div>
                                <img :src="require(`/static/images/${data.postId?'Group-393@2x':data.deptId?'Group-392@2x':data.clientId?'Group-391@2x':'Group-390@2x'}.png`)" alt="image">
                                <span style="margin-left:3px">{{data.name}}</span>
                            </div>
                        </template>
                    </el-tree>
                </div>
            </div>
            <div class="right-cont">
                <div>
                    <h2 v-if="selpost" class="select-title">{{selpost.postName||selpost.deptName||selpost.bname||selpost.orgName}}</h2>
                    <div style="position:relative"> 
                        <div class="tabs-button ">
                            <page-button @click="create=true;postDlg=true" content="新增岗位"/>
                            <page-button :disabled="!selpost||!selpost.postId" @click="create=false;postDlg=true" content="修改岗位"/>
                            <page-button :disabled="!selpost||!selpost.postId" @click="delDlg=true" content="删除岗位"/>
                        </div>
                        <el-tabs v-model="tabValue" style="padding:0 5px;box-sizing:border-box">
                            <el-tab-pane name="1">
                                <span slot="label">岗位信息</span>
                                <data-form ref="dataForm" :items="postDesc" :form-data="selpost">
                                    <template #status="{value}">
                                        <el-tag v-if="selpost.postId" :type="value=='0'?'success':'danger'" size="small">
                                            {{value=='0'?'启用':'停用'}}
                                        </el-tag>
                                    </template>
                                </data-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
                <div style="flex:1;height:1px">
                    <TabLabel style="margin-top:15px" v-if="tableData.length" :label="'岗位列表'" />
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

        <modal width="500px" :title="(create?'新增':'修改')+'岗位'" :visible="postDlg" @close="postDlg=false">
            <PostForm v-if="postDlg" :create="create" :postObj="selpost" @close="closeForm"/>
            <template slot="footer_bnt"><span/></template>
        </modal>

        <DeleteDialog @close="v=>{ delDlg=false; v?deletePost():'' }" 
            :delObj="{ module:'岗位', target:selpost?selpost.postName:'', flag:delDlg }"/>
    </app-page>
</template>
<script>
import PostForm from './form'
import DeleteDialog from '../components/deleteDialog'
import TabLabel from '../components/tabLabel'
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

export default {
    name: 'post',
    components: { PostForm, DeleteDialog, TabLabel },
    data() {
        return {
            height: 0,
            tabValue: '1',
            postDlg: false,
            delDlg: false,
            selpost: {
                postName:'',
                postCode:'',
                deptName:'',
                postSort:'',
                status:'',
                remark:''
            },
            create: '',
            postData: [],
            postDesc:[
                { label:'岗位名称', field:'postName' },
                { label:'岗位编码', field:'postCode' },
                { label:'所属部门', field:'deptName' },
                { label:'显示顺序', field:'postSort' },
                { label:'启用状态', field:'status', slot:'status' },
                { label:'备注说明', field:'remark' },
            ],
            tableData: [],
            tableOrg: [],
            tableColumns: [
                { field:'postName', title:'岗位名称', align:'center' },
                { field:'postCode', title:'岗位编码', align:'center' },
                { field:'deptName', title:'所属部门', align:'center' },
                { field:'postSort', title:'显示顺序', align:'center' },
                { field:'status', title:'启用状态', align:'center', slots:{ default:'status' } },
                { field:'remark', title:'备注说明', align:'center' },
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
        this.$refs.postTree.filter(val)
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
            this.postDlg = false
            v?this.getTreeData():''
        },
        nodeClick(obj) {
            this.selpost = obj
            this.tableData = []
            obj?.postId ?
                apiSystem.detailPost(obj.id).then(res=>{
                    this.selpost = res.data
                }) :
                obj?.deptId ? 
                    apiSystem.getDeptPost(obj.deptId).then(res=>{
                        this.tableOrg = res.data
                        this.tableData = this.tableRange(this.tableOrg)
                        this.tablePage.total = this.tableOrg.length
                    }) :
                    obj?.clientId ? 
                        apiSystem.getApsPost(obj.clientId).then(res=>{
                            this.tableOrg = res.data
                            this.tableData = this.tableRange(this.tableOrg)
                            this.tablePage.total = this.tableOrg.length
                        }) : ''
        },
        deletePost() {
            this.delDlg = false
            apiSystem.deletePost(this.selpost.postId).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.selpost = undefined
                this.getTreeData()
            })
        },
        treeFormat(arr){
            (arr || []).forEach(i=>{
                i.name = i?.postName || i?.deptName || i?.bname || i?.orgName
                i.id = i?.postId || i?.deptId || i?.clientId || i?.id
                i.children = i?.sysPostsChildren || i?.deptChildren || i?.enterpriseChildren || []
                this.treeFormat(i.children)
            })
            return arr
        },
        getTreeData() {
            apiSystem.getDeepPostTree().then(res=>{
                this.postData = this.treeFormat(res.data)
            })
        },
    },
    created() {
        this.getTreeData()
    }
}
</script>
<style>
    @import "../style/system.css";
</style>