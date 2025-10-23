<template>
    <app-page>
        <el-row class="main-cont">
            <div class="left-cont">
                <div class="add-button">
                    <page-button type="text" @click="create=true;dictDlg=true" icon="el-icon-circle-plus-outline" content="新增字典" />
                </div>
                <div>
                    <el-input placeholder="请输入查询内容" v-model="filterText" clearable/>
                    <el-tree class="left-tree" default-expand-all highlight-current :data="dictData" ref="dictTree" :filter-node-method="filterNode"
                    @node-click="nodeClick" :props="{label:'name', children:'sysDictionariesList'}" :expand-on-click-node="false"/>
                </div>
            </div>
            <div class="right-cont">
                <div>
                    <h2 v-if="seldict" class="select-title">{{seldict.name}}</h2>
                    <div style="position:relative"> 
                        <div class="tabs-button ">
                            <page-button @click="create=true;dictDlg=true" content="新增字典" />
                            <page-button :disabled="!seldict||!seldict.applyId" @click="create=false;dictDlg=true" content="修改字典" />
                            <page-button :disabled="!seldict||!seldict.applyId" @click="delDlg=true" content="删除字典" />
                        </div>
                        <el-tabs v-model="tabValue" style="padding:0 5px;box-sizing:border-box">
                            <el-tab-pane name="1">
                                <span slot="label">字典信息</span>
                                <data-form ref="dataForm" :items="dictDesc" :form-data="seldict">
                                    <template #status="{value}">
                                        <el-tag v-if="seldict.applyId" :type="value=='0'?'success':'danger'" size="small">
                                            {{value=='0'?'启用':'停用'}}
                                        </el-tag>
                                    </template>
                                </data-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
                <div style="flex:1;height:0">
                    <table-section ref="tableSection" style="height:100%">
                        <div class="app-table-container" auto>
                        <div class="app-table-header">
                            <sub-title :title="seldict&&!seldict.applyId?'字典列表':'字典明细'"></sub-title>
                            <vxe-toolbar ref="toolbar" class="app-table-toolbar">
                                <template #buttons>
                                    <page-button v-if="seldict&&seldict.applyId" @click="create=true;dictItemDlg=true" content="新增明细" />
                                </template>
                                <template #tools>
                                    <table-tools :tools="['setting']" :default-columns="seldict&&seldict.applyId?defaultItemColumns:defaultColumns" @ok="(e)=>onToolOk(e, seldict&&seldict.applyId?'tableItemColumns':'tableColumns')"></table-tools>
                                </template>
                            </vxe-toolbar>
                        </div>
                        <div class="app-table-body"> 
                            <vxe-grid 
                                :id="seldict&&!seldict.applyId?`tb_zdlb__${userInfo.userId}`:`tb_zdmx__${userInfo.userId}`"
                                :data="tableData" 
                                :columns="seldict&&seldict.applyId?tableItemColumns:tableColumns" 
                                height="auto" 
                                ref="table"
                            >
                                <template #status="{ row }">
                                    <page-button :theme="row.status=='0'?'success':'danger'">{{ row.status=='0'?'启用':'停用' }}</page-button>
                                </template>
                                <template #editFlag="{ row }">
                                    {{ row.editFlag=='0'?'是':'否' }}
                                </template>
                                <template #defaultFlag="{ row }">
                                    {{ row.defaultFlag=='0'?'是':'否' }}
                                </template>
                                <template #action="{ row }">
                                    <page-button type="text" @click="create=false;dictView=true;dictRow=row;dictItemDlg=true" content="查看" />
                                    <page-button type="text" @click="create=false;dictView=false;dictRow=row;dictItemDlg=true" content="修改" />
                                    <page-button type="text" @click="dictRow=row;delItemDlg=true" content="删除" />
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
                    </table-section>
                </div>
            </div>
        </el-row>

        <vxe-modal 
            v-model="dictItemDlg"
            :title="(create?'新增':dictView?'查看':'修改')+'字典明细'"
            width="600"
            @close="dictItemDlg=false"
        >
            <DictItemForm v-if="dictItemDlg" :isview="dictView" :mid="seldict.id" :dictObj="dictRow" :create="create" @close="closeItemForm"/>
        </vxe-modal>
        <vxe-modal 
            v-model="dictDlg"
            :title="(create?'新增':seldict?'查看':'修改')+'字典'"
            width="600"
            @close="dictDlg=false"
        >
            <DictForm v-if="dictDlg" :dictObj="seldict" :dictTree="dictData" :create="create" @close="closeForm"/>
        </vxe-modal>
        <DeleteDialog @close="v=>{ delItemDlg=false; v?deleteDictItem():'' }" 
            :delObj="{ module:'字典明细', target:dictRow?dictRow.name:'', flag:delItemDlg }"/>
        <DeleteDialog @close="v=>{ delDlg=false; v?deleteDict():'' }" 
            :delObj="{ module:'字典', target:seldict?seldict.name:'', flag:delDlg }"/>
    </app-page>
</template>
<script>
import { ApiSystem } from '@/apis'
import { mapState } from "vuex";
import { MaximizeTable, handleStorageColumns } from "@/utils/vxe-table";
const apiSystem = new ApiSystem()

import DictForm from './form'
import DictItemForm from './itemForm'
import DeleteDialog from '../components/deleteDialog'
import TabLabel from '../components/tabLabel'

export default {
    name: 'dictionary',
    components: { DictForm, DictItemForm, DeleteDialog, TabLabel },
    data() {
        return {
            tabValue: '1',
            delDlg: false,
            seldict: {
                applyName:'',
                dictCode:'',
                name:'',
                code:'',
                status:''
            },
            dictData: [],
            dictView: false,
            dictRow: false,
            dictDlg: false,
            dictItemDlg: false,
            delItemDlg: false,
            create: '',
            dictDesc: [
                { label:'所属应用', field:'applyName' },
                { label:'所属模块', field:'dictCode' },
                { label:'字典名称', field:'name' },
                { label:'字典编码', field:'code' },
                { label:'启用状态', field:'status', slot:'status' },
            ],
            tableData: [],
            tableOrg: [],
            tableItemColumns: [
                { field:'dictValue', title:'标签编码', align:'center' },
                { field:'dictLabel', title:'标签名', align:'center' },
                { field:'score', title:'分值', align:'center' },
                { field:'remark', title:'备注', align:'center' },
                { field:'editFlag', title:'是否可编辑', align:'center', slots:{ default:'editFlag' } },
                { field:'defaultFlag', title:'是否默认', align:'center', slots:{ default:'defaultFlag' } },
                { field:'orderNum', title:'展示顺序', align:'center' },
                { field:'status', title:'启用状态', align:'center', slots:{ default:'status' } },
                { field:'action', title:'操作', align:'center', slots:{ default:'action' } },
            ],
            tableColumns: [
                { field:'name', title:'字典名称', align:'center' },
                { field:'code', title:'字典编码', align:'center' },
                { field:'orderNum', title:'展示顺序', align:'center' },
                { field:'status', title:'启用状态', align:'center', slots:{ default:'status' } },
            ],
            defaultItemColumns:[
                { field:'dictValue', title:'标签编码', align:'center' },
                { field:'dictLabel', title:'标签名', align:'center' },
                { field:'score', title:'分值', align:'center' },
                { field:'remark', title:'备注', align:'center' },
                { field:'editFlag', title:'是否可编辑', align:'center', slots:{ default:'editFlag' } },
                { field:'defaultFlag', title:'是否默认', align:'center', slots:{ default:'defaultFlag' } },
                { field:'orderNum', title:'展示顺序', align:'center' },
                { field:'status', title:'启用状态', align:'center', slots:{ default:'status' } },
                { field:'action', title:'操作', align:'center', slots:{ default:'action' } },
            ],
            defaultColumns:[
                { field:'name', title:'字典名称', align:'center' },
                { field:'code', title:'字典编码', align:'center' },
                { field:'orderNum', title:'展示顺序', align:'center' },
                { field:'status', title:'启用状态', align:'center', slots:{ default:'status' } },
            ],
            tablePage: {
                currentPage: 1,
                pageSize: localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20 : 20,
                total: 0,
            },
            filterText:'',
            defaultlinkColumns: [],
        }
    },
    watch: {
      filterText(val) {
        this.$refs.dictTree.filter(val)
      }
    },
    computed: {
        ...mapState({
            userInfo: (state) => state.User.userInfo ?? {},
            businessCode: (state) => state.Common.businessCode,
        }),
    },
    mounted() {
        const { table, toolbar } = this.$refs;
        if (table) {
            table.connect(toolbar);
            this.initTable();
        }
    },
    methods:{
        initTable(){
            const { table } = this.$refs;
            this.tableColumns = handleStorageColumns(this.tableColumns, `tb_zdlb__${this.userInfo.userId}`);
            this.tableItemColumns = handleStorageColumns(this.tableItemColumns, `tb_zdmx__${this.userInfo.userId}`);
        },
        onToolOk(e, columnField) {
            const { type, data } = e;
            const fn = this.toolMethods(columnField)[type];
            fn && fn(data);
        },
        toolMethods(columnField) {
            return {
                set_column: ({ columns }) => {
                    this[columnField] = [...columns];
                },
            };
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1
        },
        tableRange(arr) {
            const {currentPage, pageSize} = this.tablePage
            return JSON.parse(JSON.stringify(arr)).slice((currentPage-1)*pageSize,currentPage*pageSize)
        },
        pageChange(obj) {
            let pageSizeObj = localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize")) : {};
            pageSizeObj[this.$route.name] = obj.pageSize;
            localStorage.setItem("pageSize", JSON.stringify(pageSizeObj));
            this.tablePage.currentPage = obj.currentPage
            this.tablePage.pageSize = obj.pageSize
            this.tableData=this.tableRange(this.tableOrg)
        },
        closeForm(v) {
            this.dictDlg = false
            v&&this.seldict?.applyId ? apiSystem.detailDict(this.seldict.id).then(res=>{
                this.seldict = res.data
            }) : ''
            v ? this.getTreeData() : ''
        },
        closeItemForm(v){
            this.dictItemDlg = false
            this.dictView = false
            v ? apiSystem.getDictItem(this.seldict.id).then(res=>{
                this.tableOrg = res.data
                this.tableData = this.tableRange(this.tableOrg)
                this.tablePage.total = this.tableOrg.length
            }):''
        },
        nodeClick(obj){
            this.seldict = obj
            obj?.applyId ?
                apiSystem.detailDict(obj.id).then(res=>{
                    this.seldict = res.data
                    apiSystem.getDictItem(obj.id).then(res=>{
                        this.tableOrg = res.data
                        this.tableData = this.tableRange(this.tableOrg)
                        this.tablePage.total = this.tableOrg.length
                    })
                }) : 
                this.tableData = []
                apiSystem.getApplyDict(obj.id).then(res=>{
                    this.tableOrg = res.data
                    this.tableData = this.tableRange(this.tableOrg)
                    this.tablePage.total = this.tableOrg.length
                })
        },
        deleteDict() {
            apiSystem.deleteDict(this.seldict.id).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.seldict = undefined
                this.getTreeData()
            })
        },
        deleteDictItem() {
            apiSystem.deleteDictItem(this.dictRow.id).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.dictRow = undefined
                apiSystem.getDictItem(this.seldict.id).then(res=>{
                    this.tableOrg = res.data
                    this.tableData = this.tableRange(this.tableOrg)
                    this.tablePage.total = this.tableOrg.length
                })
            })
        },
        getTreeData() {
            apiSystem.getDictTree().then(res=>{
                this.dictData = res.data
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
<style lang="less" scoped>
/deep/ .app-table-container .app-table-header {
    padding: 0;
}
/deep/.flex-table-section {
    display: flex;
    flex-direction: column;
    box-shadow: none;

    .app-table-body {
     flex: 1;
    }

    .app-table-container {
     flex: 1;
     height: 0;
    }
}
::v-deep .el-form-item__error {
  top: 57%;
}
</style>