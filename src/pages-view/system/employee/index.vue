<template>
    <app-page>
        <div class="view-section">
            <search-component v-model="condition" :options="searchOptions" @search="d=>getEmployee(d)" @reset="getEmployee()" :cache="`search_system_employee_${userInfo.userId}`"/>
        </div>
        <table-section ref="tableSection">
            <div class="app-table-container" style="padding:5px">
                <div class="app-table-header">
                    <sub-title high title="职员信息"></sub-title>
                    <vxe-toolbar class="app-table-toolbar" ref="toolbar">
                        <template #buttons>
                            <page-button content="新增" @click="$router.push({ path:`/system/employee/0` })" type="text" style="margin-left: 36px;">
                                <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                            </page-button>
                            <page-button content="批量生成用户" @click="emptouser=true" type="text" style="margin-left: 36px;"/>
                        </template>
                        <template #tools>
                            <table-tools :default-columns="defaultColumns" @ok="onToolOk"></table-tools>
                        </template>
                    </vxe-toolbar>
                </div>
                <div class="app-table-body">
                    <vxe-grid ref="table" height="auto" :data="tableData" :columns="tableColumns"
                        @cell-dblclick="onCellDbClick" :row-config="{ keyField:'id', isHover:true }"
                        @checkbox-all="selectChange" @checkbox-change="selectChange"
                        :checkbox-config="{checkRowKeys:selectedRows, highlight:true}"
                        :id="`tb_employee_list_${userInfo.userId}`" :custom-config="{ storage: true }"
                    >
                        <template #sex="{ row }">
                            {{row.sex?'男':'女'}}
                        </template>
                        <template #birthday="{ row }">
                            {{moment(row.birthday).format('YYYY-MM-DD HH:mm:ss')}}
                        </template>
                        <template #openStatus="{ row }">
                            <page-button :theme="row.openStatus=='0'?'success':'danger'">{{row.openStatus=='0'?'启用':'禁用'}}</page-button>
                            <!-- <el-tag style="display:inline-block" size="small" :type="row.openStatus=='0'?'success':'danger'">
                                {{row.openStatus=='0'?'启用':'禁用'}}
                            </el-tag> -->
                        </template>
                        <template #sysUserId="{ row }">
                            <page-button :theme="row.sysUserId!='0'?'success':'danger'">{{row.sysUserId!='0'?'是':'否'}}</page-button>
                            <!-- <el-tag style="display:inline-block" size="small" :type="row.sysUserId!='0'?'success':'danger'">
                                {{row.sysUserId!='0'?'是':'否'}}
                            </el-tag> -->
                        </template>
                    
        </vxe-grid> 
                </div>
                <div class="app-table-footer">
                    <vxe-pager
                        :current-page.sync="pagination.currentPage"
                        :page-size.sync="pagination.pageSize"
                        :total="pagination.total"
                        @page-change="pageChange"
                    />
                </div>
            </div>
        </table-section>
        <modal width="500px" title="批量生成用户" :visible="emptouser" @close="emptouser=false">
            确定要批量生成用户?
            <div style="font-size:12px;color:rgb(220,220,220)">初始用户名, 密码均为手机号</div>
            <template slot="footer_bnt">
                <page-button content="确定" @click="seltoUser"/>
                <page-button content="取消" @click="emptouser=false"/>
            </template>
        </modal>
    </app-page>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()
import TabLabel from '../components/tabLabel'
import moment from 'moment'
import {MaximizeTable,handleStorageColumns} from '@/utils/vxe-table'
import XEUtils from 'xe-utils'
import { mapState } from 'vuex'
let maximizeTable = null;

export default {
    name: 'employee',
    components: { TabLabel },
    data() {
        return {
            moment,
            height:0,
            condition:{},
            searchOptions: [
                { label: '姓名', field: 'name', type: 'input', isDefault: true },
            ],
            tableColumns: [
                { type:'checkbox', width:50, resizable:false, fixed:'left', align:'center'},
                // { type:'seq', title:'序号', width:60, fixed:'left', align:'center'},
                { field:'name', title:'姓名', align:'center' },
                { field:'code', title:'工号', align:'center' },
                { field:'sex', title:'性别', align:'center', slots:{ default:'sex' } },
                { field:'birthday', title:'出生日期', align:'center', slots:{ default:'birthday' }, width:160 },
                { field:'enterpriseName', title:'所属企业', align:'center' },
                { field:'deptName', title:'所属部门', align:'center' },
                { field:'postName', title:'所属岗位', align:'center' },
                { field:'positionType', title:'岗位性质', align:'center' },
                { field:'phone', title:'联系电话', align:'center' },
                { field:'education', title:'学历', align:'center' },
                { field:'webchatNo', title:'微信号', align:'center' },
                { field:'openStatus', title:'职员状态', align:'center', slots:{ default:'openStatus' } },
                { field:'sysUserId', title:'关联用户', align:'center', slots:{ default:'sysUserId' } },
            ],
            tableData: [],
            userRow: {},
            create: false,
            empDlg: false,
            selemp: {},
            pagination: { currentPage:1, pageSize:20, total:0 },
            selectedRows: [],
            searchshow:false,
            emptouser:false,
            defaultColumns:[],
        }
    },
    computed: {
      ...mapState({
        userInfo: state => state.User.userInfo ?? {},
      })
    },
    methods:{
        initTable() {
        const { table } = this.$refs
        const tableColumns = this.tableColumns.map(item => {
          if (item.displayDigits) {
            item.formatter = ({ cellValue, row, column }) => {
              return XEUtils.toFixed(cellValue, item.displayDigits)
            }
          }
          return item
        })
        this.tableColumns = handleStorageColumns(tableColumns, table.id)
      },
      onToolOk(e) {
        const { type, data } = e
        const fn = this.toolMethods()[type]
        fn && fn(data)
      },
      toolMethods() {
        return {
          maximize: data => {
            const { maximize } = data
            if (maximize) {
              maximizeTable.maximize()
            } else {
              maximizeTable.restoreTable()
            }
          }
        }
      },
        pageChange(obj){
            this.pagination.currentPage = obj.currentPage
            this.pagination.pageSize = obj.pageSize
            this.getEmployee()
        },
        getEmployee(obj={}) {
            let data = {
                ...obj,
                page:this.pagination.currentPage,
                size:this.pagination.pageSize
            }
            apiSystem.getEmployee(data).then(res=>{
                this.pagination.total = res.data.total
                this.tableData = res.data.records
            })
        },
        onCellDbClick(e) {
            this.$router.push({ path:`/system/employee/${e.row.id}` })
        },
        selectChange({ checked }){
            this.selectedRows = this.$refs.table.getCheckboxRecords()
        },
        seltoUser() {
            if (this.selectedRows.length) {
                let ids = this.selectedRows.map(i=>i.id)
                apiSystem.employeeToUser(ids).then(res=>{
                    this.$message[res.code==200?'success':'warning'](res.message)
                    this.selectedRows.forEach(i=>{
                        this.$refs.table.setCheckboxRow(i,false)
                    })
                    this.selectedRows = []
                })
                this.emptouser = false
            } else {
                this.$message.warning('请选择职员')
            }
        }
    },
    created(){
        this.height = document.documentElement.clientHeight - 300
        this.getEmployee()
    },
    mounted() {
      const { table, toolbar } = this.$refs
      if (table) {
        table.connect(toolbar)
        this.initTable()
      }
      this.defaultColumns = XEUtils.clone(this.tableColumns, true);
      maximizeTable = new MaximizeTable(this.$refs.tableSection.$el)
    },
}
</script>
<style>
@import '../style/system.css';
</style>
<style lang="less">
.tab-tail {
    position:absolute;
    display:flex;
    right:0
}
</style>