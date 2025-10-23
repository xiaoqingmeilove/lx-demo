<template>
  <div class="product-list-page">
    <div class="view-section">
      <search-component
        :options="searchOptions"
        :source-list="sourceList"
        :cache="`search_product_list_${userInfo.userId}`"
        @search="onSearch"
        @reset="onReset"
      >
    </search-component>
    </div>
    <table-section>
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <div class="selectText">
            已选择
            <page-button type="text">
              {{ columnSelectList.length }}</page-button
            >
            条产品
          </div>
          <vxe-toolbar ref="productToolbar" class="app-table-toolbar">
            <template #buttons>
              <page-button @click="addProductList" content="加入清单" type="text" style="margin-left: 36px;">
                <template #img><svg-icon icon-class="addIcon" style="margin-right: 5px" /></template>
              </page-button>
            </template>
            <template #tools>
              <table-tools
                :default-columns="defaultColumns"
                @ok="onToolOk"
              ></table-tools>
            </template>
          </vxe-toolbar>
        </div>
        <div class="app-table-body">
          <vxe-grid
            height="auto"
            :id="`tb_cgsq_product_list_${userInfo.userId}`"
            :data="tableData"
            :columns="columns"
            ref="productTable"
            :custom-config="{ storage: true }"
            @cell-dblclick="onDblclick"
            @checkbox-all="rowSelection"
            @checkbox-change="rowSelection"
          >
            <template #slot_flag="{row, column}">
              <span class="vxe-cell--label">
                <page-button theme="success" v-if="parseFloat(row[column.field]) === 1">是</page-button>
                <page-button theme="danger" v-if="parseFloat(row[column.field])=== 0">否</page-button>
              </span>
            </template>
        </vxe-grid>
        </div>
        <div class="app-table-footer">
          <vxe-pager
            :current-page.sync="pagination.currentPage"
            :page-size.sync="pagination.pageSize"
            :total="pagination.total"
            @page-change="pageChange"
          ></vxe-pager>
        </div>
      </div>
    </table-section>
  </div>
</template>

<script>
import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiBuy ,ApiBasic} from "@/apis";
import {  handleStorageColumns } from "@/utils/vxe-table";
const apiQuotation = new ApiQuotation();
const apiBuy = new ApiBuy();
const apiBasic = new ApiBasic();
export default {
  name: "productList",
  props: {
    menuCode: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
  },
  data() {
    return {
      defaultColumns:[],
      tableData: [],
      searchOptions: [],
      columns: [],
      condition: {},
      sourceList: {
        flagList: [
          {label: "是", value: 1},
          {label: "否", value: 0},
        ],
      },
      pagination: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        showTotal: () => `共${this.pagination.total}条`,
      },
      columnSelectList: [],
    };
  },
  created() {
   
    this.init();
   
  },
  methods: {
    init() {
      this.getList();
      this.setColumn();
    },
    addProductList() {
      if (this.columnSelectList.length == 0) {
        this.$message.error("未选中需加入清单的产品！");
        return;
      }
      this.$emit("ok", this.columnSelectList);
      this.$refs.productTable.clearCheckboxRow();
      this.columnSelectList = this.$refs.productTable.getCheckboxRecords();
    },
    rowSelection({ checked }) {
      // 获取产品清单已选中数据
      this.columnSelectList = this.$refs.productTable.getCheckboxRecords();
    },
    // 产品清单 双击行回调
    onDblclick({ row, rowIndex }) {
      this.$emit("ok", [row]);
    },
    async setColumn() {
      const loading = this.loading("正在加载");
      let data = {
        code: "productList",
        corpCode: this.businessCode ?? "LX",
      };
      const res = await apiQuotation.getColumnsConfig(this.menuCode, data);
      if (res.code === 200 && res.data && res.data.columns) {
        let columns = res.data.columns;
        this.columns = [...columns];
        this.initTableConfig();
      }
      const searchRes = await apiQuotation.getSearchConfig(this.menuCode, data);
      if (searchRes.code === 200 && searchRes.data && searchRes.data.columns) {
        let searchOptions = searchRes.data.columns;
        this.searchOptions = [...searchOptions];
      }
      loading.close();
    },
    initTableConfig() {
      const { productTable, productToolbar } = this.$refs;
      if (productTable) {
        productTable.connect(productToolbar);
        this.initTable();
      }
      
      this.defaultColumns = XEUtils.clone(this.columns, true);
    },
    initTable() {
      const { productTable } = this.$refs;
      const tableColumns = this.columns.map((item) => {
        const { params = {} } = item;
        if (item.params && params.hasOwnProperty("displayDigits")) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits);
          };
        }
        return item;
      });
      this.columns = handleStorageColumns(tableColumns, productTable.id);
    },
    onToolOk(e) {
      const { type, data } = e;
      const fn = this.toolMethods()[type];
      fn && fn(data);
    },
    toolMethods() {
      return {
        set_column: ({ columns }) => {
          this.columns = columns;
        },
      };
    },
    getList() {
      const loading = this.loading("加载中");
      apiBasic.getMaterialAllList(
          this.condition,
          this.pagination.currentPage,
          this.pagination.pageSize
        )
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.tableData = res.data.records ?? [];
            this.pagination.total = res.data.total;
            this.pagination.currentPage = res.data.current;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.$message.error("获取一览表异常");
        })
        .finally(() => {
          loading.close();
        });
    },
    pageChange(e) {
      const { pageSize, currentPage } = e;
      this.pagination = {
        ...this.pagination,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.getList();
    },
    onSearch(value) {
      this.condition = { ...value };
      this.pagination.currentPage = 1;
      this.getList();
    },
    // 一览表重置
    onReset() {
      this.condition = {};
      this.pagination.currentPage = 1;
      this.getList();
    },
    // 加载组件功能
    loading(text) {
      const loading = this.$loading({
        lock: true,
        text,
        spinner: "el-icon-loading",
      });
      return loading;
    },
  },
};
</script>
<style scoped lang="less">
.product-list-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
