<template>
    <app-page>
        <div class="view-section">
            <!--<search-component v-model="condition" :options="searchOptions" :source-list="sourceList" @search="d=>getUser(d)" @reset="getUser()" :cache="`search_system_user_${userInfo.userId}`"/>-->
            <search-component
                :options="searchOptions"
                :source-list="sourceList"
                @search="onSearch"
                @reset="onReset"
                :cache="`search_quotation_loginLog_${userInfo.userId}`"
            ></search-component>
        </div>
        <table-section ref="tableSection">
            <div class="app-table-container" style="padding:5px">
                <div class="app-table-header">
                    <sub-title high title="操作日志"></sub-title>
                    <vxe-toolbar class="app-table-toolbar" ref="toolbar">
                        <!--<template #buttons>
                            <page-button @click="start(0)">启用</page-button>
                            <page-button @click="start(1)">停用</page-button>
                            <page-button content="新增" @click="$router.push({ path:`/system/user/0` })"/>
                        </template>-->
                        <template #tools>
                            <table-tools :default-columns="defaultColumns" @ok="onToolOk"></table-tools>
                        </template>
                    </vxe-toolbar>
                </div>
                <div class="app-table-body">
                    <vxe-grid
                        :id="`tb_loginLog_${userInfo.userId}`"
                        :data="tableData"
                        :columns="columns"
                        :custom-config="{ storage: true }"
                        show-footer
                        height="auto"
                        ref="table"
                    >
                        <template #rowNum="{ rowIndex }">
                        <span>{{ rowIndex + 1 }}</span>
                        </template>
                        <template #pager>
                        <vxe-pager
                            :current-page.sync="tablePage.currentPage"
                            :page-size.sync="tablePage.pageSize"
                            :total="tablePage.total"
                            :page-sizes="tablePage.pageSizeOptions"
                            @page-change="handlePageChange"
                        ></vxe-pager>
                        </template>
                    
        </vxe-grid> 
                </div>
            </div>
        </table-section>
    </app-page>
</template>
<script>
import { ApiSystem , ApiQuotation} from '@/apis'
const apiSystem = new ApiSystem()
const apiQuotation = new ApiQuotation()
import TabLabel from '../components/tabLabel'

import {MaximizeTable,handleStorageColumns} from '@/utils/vxe-table'
import XEUtils from 'xe-utils'
import { mapState } from 'vuex'
let maximizeTable = null;

export default {
    name: 'operationLog',
    components: { TabLabel },
    data() {
        return {
            menuCode:'operationLog',
            defaultColumns: [],
            tableColumns: [], //一览表表头信息
            columns:[],
            pagination: {
                currentPage: 1,
                pageSize: localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20 : 20,
                total: 0,
                
                showTotal: () => `共${this.pagination.total}条`,
                
            }, // 一览表分页配置
            oldPagination: {
                currentPage: 1,
                pageSize: 20,
            },
            condition: {}, //一览表搜索结果对象
            height:0,
            searchOptions: [],
            sourceList: {
                billStateList:[
                    {
                        label: "成功",
                        value: 0,
                    },
                    {
                        label: "失败",
                        value: 1,
                    },
                ],
                clientList:[
                    {
                        label: "系统内部",
                        value: 3,
                    },
                    {
                        label: "小程序",
                        value: 1,
                    },
                    {
                        label: "web",
                        value: 0,
                    },
                ],
                ModuleList:[]
            },
            tableData: [],
            tablePage: {
                currentPage: 1,
                pageSize: 20,
                total: 0,
            },
            tableOrg:[],
            searchshow:false,
        }
    },
    computed: {
      ...mapState({
        userInfo: state => state.User.userInfo ?? {},
        businessCode: (state) => state.Common.businessCode,
      })
    },
    methods:{
        async setColumn() {
            let data = {
                code: "list",
                corpCode: this.businessCode ??  "LX",
            };
            let search = {
                code: "search",
                corpCode: this.businessCode ??  "LX",
            };
            const tasks = [];
            tasks.push(apiQuotation.getColumnsConfig(this.menuCode, data));
            tasks.push(apiQuotation.getSearchConfig(this.menuCode, search));
            const responses = await Promise.all(tasks);
            responses.map(res => {
                if (res.code === 200 && res.data && res.data.columns) {
                if (res.data.code === 'search') {
                    this.searchOptions = [...res.data.columns];
                } else {
                    const columns = res.data.columns;
                    this.columns = [...columns];
                    this.initTableConfig();
                }
                }
            })
        },
        initTableConfig() {
            const { table, toolbar } = this.$refs;
            if (table) {
                table.connect(toolbar);
                this.initTable();
            }
            this.defaultColumns = XEUtils.clone(this.columns, true);
            maximizeTable = new MaximizeTable(this.$refs.tableSection.$el);
        },
        initTable() {
            const { table } = this.$refs
            const tableColumns = this.columns.map(item => {
                if (item.params && item.params.displayDigits) {
                item.formatter = ({ cellValue, row, column }) => {
                    return XEUtils.toFixed(cellValue, item.params.displayDigits)
                }
                }
                return item
            })
            this.columns = handleStorageColumns(tableColumns, table.id)
            this.getList();
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
        // 查询
    onSearch(value) {
        this.tablePage.currentPage = 1;
        this.pagination.currentPage = 1;
        this.oldPagination.currentPage = 1;
        this.condition = { ...value };
        this.getList();
    },
    onReset() {
        this.condition = {};
        this.tablePage.currentPage = 1;
        this.getList();
    },

    init() {
      this.getList();
    },

    // 一览表数据查询
    getList() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      let token = localStorage.getItem('token')
      let data = {
            ...this.condition,
            page: this.pagination.currentPage,
            size: this.pagination.pageSize
      }
      apiSystem.getOperationListApi(data,token).then((res) => {
        if (res.code === 200 && res.data) {
          this.tableData = [...res.data.records];
          this.tablePage.total = res.data.total;
          this.pagination.total = res.data?.total ?? 0;
        } else {
          this.$message.error(res.message || "获取数据异常");
        }
      }).catch((err) => {
        this.$message.error(err.message || "获取数据异常");
      }).finally(() => {
        loading.close()
      })

    },
    // 分页
    handlePageChange(e) {
      const { pageSize, currentPage } = e;
      let pageSizeObj = localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize")) : {};
      pageSizeObj[this.$route.name] = pageSize;
      localStorage.setItem("pageSize", JSON.stringify(pageSizeObj));
      this.pagination = {
        ...this.pagination,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.oldPagination = {
        pageSize: pageSize,
        currentPage: currentPage,
      }
      this.tablePage = {
        ...this.tablePage,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.getList();
    },
    },
    mounted() {
        this.setColumn()
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