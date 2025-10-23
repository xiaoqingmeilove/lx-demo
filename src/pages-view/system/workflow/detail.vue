<template>
    <app-page>
        <div class="workflow-detail">
            <div>
                <div class="flow-begin">
                    <el-button plain icon="el-icon-video-play">开始</el-button>
                </div>
                <div v-for="(i,j) in wfNode" :key="j">
                    <div class="wf-line"/>
                    <div class="wf-node">
                        <span>{{i.name}}</span>
                    </div>
                </div>
                <div class="wf-line"/>
                <div class="flow-end">
                    <div>已结束</div>
                </div>
            </div>
            <div>
                <sub-title title="事务操作组"/>
                <div class="flow-exec" :class="exec==i.value?'exec-selected':''" v-for="(i,j) in wfExec" :key="j" @click="exec=i.value">
                   {{i.name}}
                </div>
            </div>
            <div>
                <div class="btn-group">
                    <page-button v-if="activeTab=='1'" @click="create=true;openform=true" content="新增分组"/>
                    <page-button @click="save" content="保存"/>
                    <page-button @click="$tabs.close()" theme="info" content="关闭"/>
                </div>
                <el-tabs v-model="activeTab" class="wf-tabs">
                    <el-tab-pane name="1" class="wf-pane">
                        <span slot="label">节点信息</span>
                        <data-form ref="dataForm" :items="wfDesc" :form-data="selwf"/>
                        <div class="wf-table">
                            <vxe-grid :data="tableData" :columns="tableColumns" height="auto"
                                @checkbox-all="onCheckboxChange" @checkbox-change="onCheckboxChange"
                                :checkbox-config="{ checkRowKeys, highlight:true }">
                                <template #members="{ row }">
                                    <div>
                                        <WfMember :key="wnum" :row="row.members"/>
                                    </div>
                                </template>
                                <template #action="{ row }">
                                    <page-button type="text" @click="create=false;openform=true" content="编辑"/>
                                    <page-button type="text" @click="seldata=row;delDlg=true" content="删除"/>
                                </template>
                            
        </vxe-grid>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane name="2" class="wf-pane">
                        <span slot="label">消息信息</span>
                        <div class="wf-send">
                            <vxe-grid :data="tableData1" :columns="tableColumns1" height="auto"/>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <modal top="5vh" width="800px" title="事务操作组" :visible="openform" @close="openform=false">
            <DetailForm v-if="openform" @close="closeForm"/>
            <template slot="footer_bnt"><span/></template>
        </modal>
        <DeleteDialog @close="v=>{ delDlg=false; v?deleteWf():'' }" 
            :delObj="{ module:'事务操作组', target:seldata.name, flag:delDlg }"/>
    </app-page>
</template>
<script>
import DetailForm from './detailform'
import DeleteDialog from '../components/deleteDialog'
import WfMember from './wfmember'

export default {
    components: { DetailForm, DeleteDialog, WfMember },
    data() {
        return {
            wfNode:[
                {name:'申请人',nodeId:1},
                {name:'部门经理',nodeId:2},
                {name:'总经理',nodeId:3},
            ],
            wfExec:[
                {name:'通过',value:'pass'},
                {name:'驳回',value:'reject'},
                {name:'委托',value:'delegate'},
                {name:'传阅',value:'read'},
            ],
            exec:'pass',
            activeTab:'1',
            wfDesc:[
                { label:'节点名称', field:'nodeName' },
                { label:'节点编码', field:'nodeCode' },
            ],
            selwf:{
                nodeName:'name',
                nodeCode:'code',
            },
            tableData:[],
            tableColumns:[
                { title:'分组名称', field:'name', align:'center',width:150, ellipsis:true },
                { title:'成员列表', field:'members', align:'left', slots:{ default:'members' } },
                { title:'操作', align:'center', width:100, slots:{ default:'action' } },
            ],
            tableData1:[
                { method:'站内' }, { method:'钉钉机器人' },
                { method:'钉钉群聊' }, { method:'微信公众号' },
                { method:'邮件' }, { method:'手机短信' },
            ],
            tableColumns1:[
                { type:'checkbox', width:50, align:'center', headerAlign:'center', resizable:false },
                { title:'发送方式', field:'method', align:'center', width:120 },
                { title:'消息模板', field:'example', align:'center' },
            ],
            wnum:0,
            seldata:{},
            delDlg:false,
            openform:false,
            create:true,
            checkRowKeys:[],
            selectMethods:''
        }
    },
    methods: {
        save(){},
        onCheckboxChange(e) {
            const { records } = e
            this.selectMethods = records
        },
        deleteWf(){},
        closeForm(v){
            this.openform=false
            this.tableData.push(v)
            this.wnum+=1
        }
    }
}
</script>
<style lang="less">
@import url("./index_scoped.less");
</style>