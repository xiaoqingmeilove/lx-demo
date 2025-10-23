<template>
  <div class="priceCommonDetail">
    <div class="viewOneRow">
        <template v-for="item in handleColumns">
          <div :key="item.field" class="rowBox" >
              <div class="rowItem">
                  <div class="label">{{ item.title }} ：</div>
                  <div class="value">{{ tableData[item.field] }}</div>
              </div>
          </div>
      </template>
    </div>
    <div class="price-table">
      <vxe-grid
            :data="tableData.detailList"
            :id="`priceCommonDetail${tableData.sourceId}`"
            :custom-config="{ storage: true }"
            :columns="columns"
            ref="table"
            min-height="180"
            max-height="600"
          >
          <template #rowNum="{ row, rowIndex }">
              <div style="text-align: center">
                <span>{{ rowIndex + 1 }}</span>
              </div>
          </template>
          <template #stageQty="{ row }">
            <span>{{ row.startQty + '~' + row.endQty }}</span>
          </template>
      </vxe-grid>
    </div>
  </div>
</template>

<script>
import { ApiBasic } from "@/apis";
import XEUtils from "xe-utils";
import { handleStorageColumns } from "@/utils/vxe-table";
const apiBasic = new ApiBasic();
export default {
  name: 'priceCommonDetail',
  props: {
    viewPriceRow: {
      type: Object,
      default: () => {},
    },
    menuCode: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      editState: false,
      tableData: [],
      handleColumns: [
        { "field": "materialName", "title": "物料名称"  },
        { "field": "materialCode", "title": "物料编码"},
        { "field": "model", "title": "型号" },
        { "field": "standard", "title": "规格" },
        { "field": "voltageLevel", "title": "电压" },
        { "field": "attribute", "title": "属性" },
        { "field": "taxRateStr", "title": "税率" },
        { "field": "validity", "title": "有效期" },
      ],
      defaultColumns: [],
      columns:[
        { "field": "rowNum", "title": "序号", "width": "80", "minWidth": "80", "align": "left", "slots": { "default": "rowNum" } },
        { "field": "endQty", "title": "结束数量", "align": "right",'visible': false},
        { "field": "startQty", "title": "起始数量", "align": "right" ,'visible': false},
        { "field": "stageQty", "title": "阶梯数量", "align": "center" ,"slots": { "default": "stageQty",}},
        { "field": "untaxPrice", "title": "不含税单价",  "align": "center", "params": { "displayDigits": 2 } },
        { "field": "price", "title": "含税单价",  "align": "center", "params": { "displayDigits": 2 } }
      ]
    }
  },
  computed: {
   
  },
  mounted() {
    this.getPriceCommonDetail();
  },
  methods: {
    getPriceCommonDetail() {
      apiBasic.getPriceCommonDetail(this.viewPriceRow.sourceId).then(res => {
        if(res.code == 200) {
          this.tableData = res.data;
          if(this.tableData.validityStartDate && this.tableData.validityEndDate) {
            this.tableData.validity = this.tableData.validityStartDate + ' 至 ' + this.tableData.validityEndDate;
          }
          if(this.tableData.taxRate) {
            this.tableData.taxRateStr = this.tableData.taxRate + '%';
          }


          this.initTableConfig();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    initTableConfig() {
      const { table, toolbar } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable();
      }

      this.defaultColumns = XEUtils.clone(this.columns, true);
    },
    initTable() {
      const { table } = this.$refs;
      const tableColumns = this.columns.map((item) => {
        const { params = {} } = item;
        if (item.params && params.hasOwnProperty("displayDigits")) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits);
          };
        }
        return item;
      });
      this.columns = handleStorageColumns(tableColumns, table.id);
    },
  },
};
</script>
<style lang="scss" scoped>
  .viewOneRow{
      display: grid;
      grid-template-columns: repeat(2, 1fr); /* 两列 */
      border-top: 1px solid #e3e3e3;
      border-left: 1px solid #e3e3e3;
      border-radius: 6px;
      .rowBox {
          border-right: 1px solid #e3e3e3;
          border-bottom: 1px solid #e3e3e3;
          .rowItem{
              display: flex;
              align-items: center;
              justify-content: space-between;
              font-size: 16px;
              .label {
                  padding: 15px 10px 15px 20px;
                  text-align: left;
                  flex: 1;
                  background: #f5f5f5;
                  font-weight: bolder;
              }
              .value {
                  padding: 15px 10px 15px 20px;
                  flex: 2;
              }
          }
        }
  }
  .price-table {
    margin-top: 20px;
  }
</style>
