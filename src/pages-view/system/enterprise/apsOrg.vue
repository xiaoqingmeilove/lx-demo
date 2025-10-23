<template>
    <div class="org-cont">
        <div> 
            <data-form ref="dataForm" :items="orgDesc" :form-data="selaps">
                <template #status="{value}">
                    <el-tag v-if="selaps.id" :type="value=='0'?'success':'danger'" size="small">
                        {{value=='0'?'启用':'停用'}}
                    </el-tag>
                </template>
            </data-form>
        </div>
        <div style="flex:1;height:1px" >
            <TabLabel style="margin-top:15px" v-if="tableData?.length" :label="'组内企业信息'" />
            <div v-if="tableData?.length" class="aps-table">
                <div class="app-table-body" style="height:inherit">
                    <vxe-grid :data="tableData" :columns="tableColumns" height="auto" ref="table" />
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TabLabel from '../components/tabLabel'
export default {
    props:['selaps'],
    components: { TabLabel },
    data() {
        return {
            tableColumns: [
                { title:'企业名称', field:'bname', align:'center' },
                { title:'社会统一信用代码', field:'socialUnifiedCreditCode', align:'center' },
                { title:'行政区域', field:'regAddressAdministrativeCode', align:'center' },
                { title:'注册地址', field:'regAddress', align:'center' },
                { title:'法定代表人', field:'legalRepresentative', align:'center' },
                { title:'联系电话', field:'legalRepresentativeTel', align:'center' },
            ],
            tableData: [],
            tableOrg:[],
            orgDesc:[
                { label:'组织名称', field:'orgName' },
                { label:'组织编码', field:'orgCode' },
                { label:'上级组织', field:'parentName' },
                { label:'行政区域', field:'administrativeDivision' },
                { label:'组织地址', field:'address' },
                { label:'启用状态', field:'status', slot:'status' },
                { label:'备注说明', field:'remark' },
            ],
            tablePage: { 
                currentPage:1, 
                pageSize:20, 
                total:0 
            },
        }
    },
    methods: {
        tableRange(arr) {
            const {currentPage, pageSize} = this.tablePage
            return JSON.parse(JSON.stringify(arr)).slice((currentPage-1)*pageSize,currentPage*pageSize)
        },
        pageChange(obj) {
            this.tablePage.currentPage = obj.currentPage
            this.tablePage.pageSize = obj.pageSize
            this.tableData=this.tableRange(this.tableOrg)
        }
    },
    created() {
        this.tableData = this.selaps.enterpriseChildren
        this.tableOrg = JSON.parse(JSON.stringify(this.tableData))
        this.tablePage.total = this.tableData.length
    }
}
</script>
<style lang="less">
    .org-cont {
        width:100%;
        height:100%;
        display:flex;
        flex-direction:column;
        > div:first-child {
            height:90px;
            padding-bottom:10px;
        }
        .aps-table {
            height:calc(100% - 30px);
            width:100%;
            overflow:auto;
        }
    }
</style>