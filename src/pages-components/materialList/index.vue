<template>
  <div class="product-list-page">
    <div class="view-section">
      <search-component
        :options="searchOptions"
        :source-list="sourceList"
        :cache="`search_materialList_list_${userInfo.userId}`"
        @search="onSearch"
        @reset="onReset"
      >
        <template #slot_tree="{item}">
          <el-select-tree
            v-model="condition[item.field]"
            style="width: 100%;"
            filterable
            clearable
            check-strictly
            :data="sourceList[item.source]"
            :props="{label:'label',value:'id',children:'children'}"
          ></el-select-tree>
        </template>
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
            :id="`tb_cgsq_materialList_list_${userInfo.userId}`"
            :data="tableData"
            :columns="columns"
            ref="productTable"
            :custom-config="{ storage: true }"
            @cell-dblclick="onDblclick"
            @checkbox-all="rowSelection"
            @checkbox-change="rowSelection"
          >
            <template #rowNum="{ row, rowIndex }">
              <span>{{ rowIndex + 1 }}</span>
            </template>
            <template #status="{row, rowIndex}">
              <span v-if="row.status == 1">是</span>
              <span v-else>否</span>
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
import { ApiQuotation, ApiBasic} from "@/apis";
import {  handleStorageColumns } from "@/utils/vxe-table";
const apiQuotation = new ApiQuotation();
const apiBasic = new ApiBasic();
function filterTree(tree) {
  return tree.reduce((acc, item) => {
    if ((item.value ?? '') !== '') {
      acc.push({ ...item });
    }
    if (item.children) {
      acc.push(...filterTree(item.children));
    }
    return acc;
  }, []);
}
export default {
  name: "materialList",
  props: {
    menuCode: {
      type: String,
      default: "material_detail",
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
    const dict = this.$store.state.Common.dict
    return {
      defaultColumns:[],
      tableData: [],
      searchOptions: [],
      columns: [],
      condition: {},
      sourceList: {
        YesorNoList:[
          { label: "是", value: 1 },
          { label: "否", value: 0 },
        ],
        materialTypeList: [],
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
    this.getSelectList();
  },
  methods: {
    treeFormat(arr, originArr){
      const list = filterTree(originArr ?? arr);
      arr.forEach(i=>{
        const find = list.find(x=> i.parentId && x.id == i.parentId);
        i.labelName = i.parentId && find && find.label ? find.label + '/' + i?.name : i?.name;
        i.label = `${i.code?i.code + ' - ':''}` + i.name;
        i.value = i.id;
        if (i.children && i.children.length){
          this.treeFormat(i.children, originArr ?? arr)
        }
      })
      return arr
    },
    getSelectList() {
      apiBasic.getMaterialListApi().then((res) => {
        if (res.code === 200 && res.data) {
          let sourceList = { ...this.sourceList };
          sourceList.materialTypeList = this.treeFormat(res.data)
          this.sourceList = { ...sourceList };
        }
      });
    },
    init() {
      this.getList();
      this.setColumn();
    },
    addProductList() {
      if (this.columnSelectList.length == 0) {
        this.$message.error("未选中供应商！");
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
        code: "materialList",
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
      apiBasic.getMaterialInfoListApi(
          this.condition,
          this.pagination.currentPage,
          this.pagination.pageSize
        )
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.tableData = res.data?.records ?? [];
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
      const condition = { ...value };
      this.condition = { ...condition, materialTypeId: this.condition.materialTypeId || null };
      this.pagination.currentPage = 1;
      this.getList();
    },
    // 一览表重置
    onReset() {
      this.condition = {materialTypeId: null};
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
.row-bg{
  display: inline-block;
  padding: 6px 10px;
  border-radius: 4px;
  color: #fff;
}
.status{
  display: flex !important;
  align-items: center !important;
  gap: 5px;
  .dot{
    display: block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }
}
</style>
