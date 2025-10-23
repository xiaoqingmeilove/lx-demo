<template>
    <div class="loc-form">
        <div style="height:40px">
            <TabLabel :label="'场地信息'" >
                <template #tail>
                    <page-button :disabled="!!!selObj" style="float:right" @click="sview=false;locDlg=true" content="新增" />
                </template>
            </TabLabel>
        </div>
        <div style="flex:1;height:1px">
            <div class="app-table-container" style="margin-top:10px;height:calc(100% - 35px)">
                <div class="app-table-body" style="height:inherit">
                    <vxe-grid :data="tableData" :columns="tableColumns" height="auto" ref="table">
                        <template #action="{ row }">
                            <page-button type="text" @click="isview=true;rowObj=row;locDlg=true" content="查看" />
                            <page-button type="text" @click="isview=false;rowObj=row;locDlg=true" content="编辑" />
                            <page-button type="text" @click="delDlg=true;rowObj=row" content="删除" />
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

        <modal width="500px" :title="(!!!rowObj?'新增':isview?'查看':'修改')+'场地信息'" :visible="locDlg" @close="locDlg=false;rowObj=''">
            <LocForm v-if="locDlg" :locObj="selObj" :isview="isview" :row="rowObj" @close="closeLoc"/>
            <template slot="footer_bnt"><span/></template>
        </modal>

        <DeleteDialog @close="v=>{ delDlg=false; v?deleteRow():'' }" 
            :delObj="{ module:'场地信息', target:rowObj.productName, flag:delDlg }"/>
    </div>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()

import LocForm from './locForm'
import TabLabel from '../components/tabLabel'
import DeleteDialog from '../components/deleteDialog'

export default {
    components: { TabLabel, LocForm, DeleteDialog },
    props: [ 'selObj' ],
    data() {
        return {
            locDlg:false,
            isview:false,
            rowObj:'',
            tableData:[],
            tableColumns:[
                { field:'productName', title:'场地名称', align:'center' },
                { field:'productAddr', title:'场地地址', align:'center' },
                { field:'productUse', title:'场地用途', align:'center' },
                { field:'proMonitor', title:'负责人', align:'center' },
                { field:'proMonitorTel', title:'负责人电话', align:'center' },
                { field:'proMonitorEmail', title:'负责人邮箱', align:'center' },
                { title:'操作', align:'center', slots:{ default:'action' } },
            ],
            tablePage: {
                currentPage: 1,
                pageSize: 20,
                total: 0,
            },
            delDlg:false,
        }
    },
    methods: {
        pageChange(){},
        closeLoc(v){
            this.locDlg=false
            this.rowObj=''
            v?this.getLocTable():''
        },
        deleteRow(){
            apiSystem.delLocation(this.rowObj.productAddrId).then(res=>{
                this.$message[res.code==200?'success':'warning'](res.message)
                this.getLocTable()
            })
        },
        getLocTable(){
            if (this.selObj?.clientId) {
                apiSystem.getLocation(this.selObj.clientId).then(res=>{
                    this.tableData = res.data
                    this.tablePage.total = res.data.length
                })
            }
        }
    },
    created() {
        this.getLocTable()
    }
}
</script>
<style lang="less">
.loc-form {
    display:flex;
    flex-direction:column;
    height:100%;
}
</style>