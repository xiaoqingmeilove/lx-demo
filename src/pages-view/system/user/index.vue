<template>
    <app-page>
        <div class="view-section">
            <search-component v-model="condition" :options="searchOptions" :source-list="sourceList" @search="onSearch" @reset="onReset" :cache="`search_system_user_${userInfo.userId}`"/>
        </div>
        <table-section ref="tableSection">
            <div class="app-table-container" style="padding:5px">
                <div class="app-table-header">
                    <sub-title high title="用户信息"></sub-title>
                    <vxe-toolbar class="app-table-toolbar" ref="toolbar">
                        <template #buttons>
                            <page-button @click="start(0)" type="text" style="margin-left: 36px;">启用</page-button>
                            <page-button @click="start(1)" type="text" style="margin-left: 36px;">停用</page-button>
                            <page-button content="新增" @click="$router.push({ path:`/system/user/0` })" type="text" style="margin-left: 36px;">
                                <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
                            </page-button>
                            <!-- <table-icon @showSearch="searchshow = !searchshow" /> -->
                        </template>
                        <template #tools>
                            <table-tools :default-columns="defaultColumns" @ok="onToolOk"></table-tools>
                        </template>
                    </vxe-toolbar>
                </div>
                <div class="app-table-body">
                    <vxe-grid 
                        :id="`tb_user_list_${userInfo.userId}`" :custom-config="{ storage: true }"
                        height="auto" :data="tableData" :columns="tableColumns" ref="table" @cell-dblclick="onCellDbClick">
                        <template #index="{rowIndex}">
                            <span>{{rowIndex + 1}}</span>
                        </template>
                        <template #sex="{ row }">
                            {{row.sex=='0'?'男':'女'}}
                        </template>
                        <template #status="{ row }">
                            <page-button size="small" :theme="row.status=='0'?'success':'danger'">
                                {{row.status=='0'?'启用':'禁用'}}
                            </page-button>
                        </template>
                        <!-- <template #employeeId="{ row }">
                            <el-tag size="small" :type="!!row.employeeId?'success':'danger'">
                                {{!!row.employeeId?'是':'否'}}
                            </el-tag>
                        </template> -->
                    
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
        </table-section>
    </app-page>
</template>
<script>
import { ApiSystem } from '@/apis'
const apiSystem = new ApiSystem()
import TabLabel from '../components/tabLabel'

import {MaximizeTable,handleStorageColumns} from '@/utils/vxe-table'
import XEUtils from 'xe-utils'
import { mapState } from 'vuex'
let maximizeTable = null;

export default {
    name: 'user',
    components: { TabLabel },
    data() {
        return {
            height:0,
            condition:{},
            searchOptions: [
                { label: '用户账号', field: 'userName', type: 'input', isDefault: true },
                { label: '用户名称', field: 'nickName', type: 'input', isDefault: true },
                { label: '手机号码', field: 'phone', type: 'input', isDefault: true },
                // { label: '用户部门', field: 'deptName', type: 'input', isDefault: true },
                { label:'用户角色', field:'roleIds', type:'selectmulti', source:'roleList', placeholder:'请选择用户角色', isDefault: true },
            ],
            sourceList: {
                roleList: []
            },
            tableColumns: [
                { field:'index', title:'序号', width:80, type: 'checkbox', align:'center', slots:{ default:'index' }},
                { field:'userName', title:'用户账号', align:'center' },
                { field:'nickName', title:'用户名称', align:'center' },
                { field:'sex', title:'性别', align:'center', slots:{ default:'sex' } },
                { field:'birthday', title:'出生日期', align:'center', width:160 },
                { field:'phone', title:'电话', align:'center' },
                { field:'email', title:'邮箱', align:'center' },
                { field:'openIds', title:'微信openid', align:'left' },
                { field:'webchatNo', title:'微信号', align:'center' },
                { field:'status', title:'启用状态', align:'center', slots:{ default:'status' } },
                { field:'employeeName', title:'关联职员', align:'center' },
            ],
            tableData: [],
            tablePage: {
                currentPage: 1,
                pageSize: 20,
                total: 0,
            },
            tableOrg:[],
            searchshow:false,
            defaultColumns:[],
        }
    },
    computed: {
      ...mapState({
        userInfo: state => state.User.userInfo ?? {},
      })
    },
    methods:{
         // 加载组件功能
        loading(text) {
            const loading = this.$loading({
                lock: true,
                text,
                spinner: 'el-icon-loading',
            })
            return loading
        },
        start(state){
            const list = this.$refs.table.getCheckboxRecords();
            if(!list.length){
                this.$message.warning(`请选择需要${state?'停用':'启用'}的用户`);
                return;
            }
            const loading = this.$loading({
                lock: true,
                text: "请求中...",
                spinner: "el-icon-loading",
            });
            apiSystem.putUpdateState({ status:state, userIds:list.map(i=>i.userId) }).then((res)=>{
                if(res.code === 200){
                    this.$message.success(res.message ?? '操作成功');
                    this.getUser()
                }else{
                    this.$message.warning(res.message ?? '操作失败')
                }
            }).catch(err=>{
                this.$message.error(err?.message ?? '操作失败')
            }).finally(()=>{
                loading && loading.close()
            })
        },
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
        pageChange(e){
            const { pageSize, currentPage } = e;
            let pageSizeObj = localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize")) : {};
            pageSizeObj[this.$route.name] = pageSize;
            localStorage.setItem("pageSize", JSON.stringify(pageSizeObj));
            this.tablePage = {
                ...this.tablePage,
                pageSize: pageSize,
                currentPage: currentPage,
            };
            this.getUser();
        },
        onSearch(value) {
            const condition = XEUtils.clone(value, true);
            this.tablePage.currentPage = 1;
            this.condition = { ...condition };
            this.getUser();
        },
        // 一览表重置
        onReset() {
            this.condition = {};
            this.tablePage.currentPage = 1;
            this.$refs.table.clearSort()       
            this.getUser();
        },
        getUser(data={}) {
            const loading = this.loading("加载中");
            const params = {
              ...this.condition,
              page:this.tablePage.currentPage,
              size:this.tablePage.pageSize,
            }
            apiSystem.getUser(params).then(res=>{
                if (res.code == 200 && res.data) {
                    this.tablePage.total = res.data.total
                    this.tableData = res.data.records
                    this.tablePage.currentPage = res.data.current
                } else {
                    this.$message.error(res.message || "获取一览表异常");
                }
            }).catch((err) => {
                this.$message.error(err.message || "获取一览表异常");
            }).finally(() => {
                loading.close()
            });
        },
        onCellDbClick(e) {
            this.$router.push({ path:`/system/user/${e.row.userId}` })
        },
    },
    created(){
        this.height = document.documentElement.clientHeight - 300
        this.getUser()
        apiSystem.getRoleList().then(res=>{ 
            this.sourceList.roleList = res.data.records.map(i=>{
                return { label:i.roleName, value:i.roleId }
            })
        })
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
.vxe-buttons--wrapper {
    position: relative;
}
.tab-tail {
    position:absolute;
    display:flex;
    right:0
}
</style>