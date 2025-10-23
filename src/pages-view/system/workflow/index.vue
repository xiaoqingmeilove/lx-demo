<template>
    <app-page>
        <div class="view-section">
            <search-component v-model="condition" :options="searchOptions" :source-list="sourceList" @search="d=>getUser(d)" @reset="getUser()"/>
        </div>
        <div class="view-section" auto>
            <div class="app-table-container" style="padding:5px">
                <vxe-toolbar>
                    <template #buttons>
                        <div style="flex:1"><sub-title high title="工作流模块信息"/></div>
                        <div class="tab-tail">
                            <page-button content="新增" @click="openform=true"/>
                            <!-- <table-icon @showSearch="searchshow = !searchshow" /> -->
                        </div>
                    </template>
                </vxe-toolbar>
                <div class="app-table-body">
                    <vxe-table :tree-config="{transform:true, rowField:'id', parentField:'parentId', expandAll:true}" border="inner" :height="height" :data="tableData" :columns="tableColumns" resizable ref="table" @cell-dblclick="onCellDbClick">
                        <vxe-column field="applyName" title="模块名称" tree-node align="center" />
                        <vxe-column field="applyCode" title="模块编码" align="center" />
                        <vxe-column field="wfModuleCode" title="模型代码" align="center" />
                        <vxe-column field="status" title="是否启用" align="center">
                            <template #default="{ row }">
                                <page-button v-if="row.status!==''" :theme="row.status==0?'success':'danger'">{{row.status==0?'启用':'停用'}}</page-button>
                            </template>
                        </vxe-column>
                        <vxe-column field="beginDate" title="启用时间" width="160" align="center" />
                        <vxe-column field="endDate" title="禁用时间" width="160" align="center" />
                        <vxe-column title="操作" width="120" align="center">
                            <template #default="{ row }">
                                <page-button v-if="row.status>0" :content="row.status?'启用':'停用'" @click="changeStatus"/>
                            </template>
                        </vxe-column>
                    </vxe-table> 
                </div>
            </div>
        </div>
        <modal width="500px" title="新建工作流配置" :visible="openform" @close="openform=false">
            <wfForm v-if="openform" @close="closeForm"/>
            <template slot="footer_bnt"><span/></template>
        </modal>
    </app-page>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()
import wfForm from './form'

export default {
    name: 'workflow',
    components: { wfForm },
    data() {
        return {
            height:0,
            condition:{},
            searchOptions: [
                { label:'模块名称', field:'applyName', type:'input', isDefault:true },
            ],
            tableColumns: [
                { field:'applyName', title:'模块名称', align:'center' },
                { field:'applyCode', title:'模块编码', align:'center' },
                { field:'wfModuleCode', title:'模型代码', align:'center' },
                { field:'status', title:'是否启用', align:'center', slots:{ default:'status' } },
                { field:'beginTime', title:'启用时间', align:'center', width:160 },
                { field:'endTime', title:'禁用时间', align:'center', width:160 },
                { title:'操作', align:'center', slots:{ default:'operation' } },
            ],
            tableData: [],
            tableData: [
                { id: 10000, parentId: null, applyName: '日程管理', applyCode: 'calendar', wfModuleCode: 'calendar_001', status:0, beginDate:'2020-01-01 00:00:00', endDate:'2023-01-01 00:00:00' },
                { id: 10050, parentId: null, applyName: '专项报价', applyCode: 'market_quote_newApply', wfModuleCode: '', status:'', beginDate:'', endDate:'' },
                { id: 24300, parentId: 10050, applyName: '专项报价', applyCode: 'market_quote_newApply', wfModuleCode: 'WF_SUN_newApply_V1.0', status:0, beginDate:'2020-01-01 00:00:00', endDate:'2023-01-01 00:00:00' },
                { id: 24301, parentId: 10050, applyName: '专项报价', applyCode: 'market_quote_newApply', wfModuleCode: 'WF_SUN_newApply_V2.0', status:1, beginDate:'2020-01-01 00:00:00', endDate:'2023-01-01 00:00:00' },
                { id: 10051, parentId: null, applyName: '项目报备', applyCode: 'market_quote_information', wfModuleCode: '', status:'', beginDate:'', endDate:'' },
                { id: 24302, parentId: 10051, applyName: '项目报备', applyCode: 'market_quote_information', wfModuleCode: 'WF_SUN_information_V1.0', status:1, beginDate:'2020-01-01 00:00:00', endDate:'2023-01-01 00:00:00' },
                { id: 24303, parentId: 10051, applyName: '项目报备', applyCode: 'market_quote_information', wfModuleCode: 'WF_SUN_information_V2.0', status:1, beginDate:'2020-01-01 00:00:00', endDate:'2023-01-01 00:00:00' },
                { id: 24304, parentId: 10051, applyName: '项目报备', applyCode: 'market_quote_information', wfModuleCode: 'WF_SUN_information_V3.0', status:1, beginDate:'2020-01-01 00:00:00', endDate:'2023-01-01 00:00:00' },
                { id: 24305, parentId: 10051, applyName: '项目报备', applyCode: 'market_quote_information', wfModuleCode: 'WF_SUN_information_V4.0', status:1, beginDate:'2020-01-01 00:00:00', endDate:'2023-01-01 00:00:00' },
                { id: 24306, parentId: 10051, applyName: '项目报备', applyCode: 'market_quote_information', wfModuleCode: 'WF_SUN_information_V5.0', status:0, beginDate:'2020-01-01 00:00:00', endDate:'2023-01-01 00:00:00' },
            ],
            searchshow:false,
            sourceList:{},
            openform:false,
        }
    },
    methods:{
        changeStatus() {},
        pageChange(obj){
            this.tablePage.currentPage = obj.currentPage
            this.tablePage.pageSize = obj.pageSize
            this.tableData = this.tableOrg.slice((this.tablePage.currentPage-1)*this.tablePage.pageSize,this.tablePage.currentPage*this.tablePage.pageSize)
            this.$forceUpdate()
        },
        getUser(data={}) {
            this.tablePage.currentPage = 1
            apiSystem.getUser(data).then(res=>{
                this.tablePage.total = res.data.total
                this.tableOrg = res.data.records
                this.tableData = this.tableOrg.slice((this.tablePage.currentPage-1)*this.tablePage.pageSize,this.tablePage.currentPage*this.tablePage.pageSize)
            })
        },
        onCellDbClick(e) {
            this.$router.push({ path:`/system/workflow/${e.row.id}` })
        },
        closeForm(){
            this.openform=false
        }
    },
    created(){
        this.height = document.documentElement.clientHeight - 300
    }
}
</script>
<style>
@import '../style/system.css';
</style>
<style lang="less">
.vxe-buttons--wrapper {
    position: relative;
}
.tab-tail {
    position:absolute;
    display:flex;
    right:0
}
</style>