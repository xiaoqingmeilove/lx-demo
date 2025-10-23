<template>
  <app-page>
    <div class="view-section">
      <search-component
        :options="searchOptions"
        :source-list="bindSourceList"
        cache="test"
        @search="onSearch"
        @reset="onReset"
        @expand="onExpand"
      >
        <template #abc="{ item }">
          <span>{{item}}</span>
        </template>
      </search-component>
    </div>
    <table-section ref="tableSection">
      <div class="app-table-container" auto>
        <div class="app-table-header">
          <sub-title title="专项报价"></sub-title>
          <div class="app-table-action-layouts" v-if="editable">
            <page-button type="text" @click="onTableActionBtnClick('copy')">复制</page-button>
            <page-button type="text" @click="onTableActionBtnClick('reverse')">反选</page-button>
            <page-button type="text" @click="onTableActionBtnClick('moveUp')">上移</page-button>
            <page-button type="text" @click="onTableActionBtnClick('moveDown')">下移</page-button>
            <page-button type="text" @click="onTableActionBtnClick('toTop')">移至顶部</page-button>
            <page-button type="text" @click="onTableActionBtnClick('toBottom')">移至底部</page-button>
            <page-button type="text" @click="onTableActionBtnClick('delete')">删除</page-button>
            <div class="app-table-moveto">
              <span>移至</span>
              <vxe-input v-model="toLine" class="app-table-moveto--input" type="integer"  min="1" :controls="false"></vxe-input>
              <span>行</span>
              <page-button size="mini" class="app-table-moveto--ok" @click="onTableActionBtnClick('toLine')">确定</page-button>
            </div>
          </div>
          <vxe-toolbar ref="toolbar" class="app-table-toolbar">
            <template #buttons>
              <page-button @click="onPrintData">打印数据</page-button>
              <filter-data-button
                :fields="bindFields"
                :filter-list="filterList"
                cache-name="f_xxx"
                @confirm="onFilterConfirm"
              ></filter-data-button>
              <template v-if="editable">
                <page-button @click="onEditBtnOk">确定</page-button>
                <page-button theme="default" @click="onEditBtnClick(false)">取消</page-button>
              </template>
              <template v-else>
                <page-button theme="primary" @click="onEditBtnClick(true)">修改</page-button>
              </template>
            </template>
            <template #tools>
              <table-tools :default-columns="defaultColumns" @ok="onToolOk"></table-tools>
            </template>
          </vxe-toolbar>
        </div>
        <div class="app-table-body">
          <vxe-grid
            id="`tb_testtable"
            :data="bindTableData"
            :columns="tableColumns"
            height="auto"
            :custom-config="{ storage: true }"
            :scroll-y="{ enabled: true }"
            @cell-dblclick="onRowDblClick"
            ref="table"
          >
            <template #slot_edit_input="{ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }">
              <template v-if="editable">
                <vxe-input v-model="row[column.field]"></vxe-input>
              </template>
              <template v-else>
                <span>{{column.formatter ?　column.formatter({
                  cellValue: row[column.field],
                  row,
                  rowIndex,
                  column,
                  columnIndex,
                  $columnIndex
                }) : row[column.field]}}</span>
              </template>
            </template>
            <template #slot_edit_number="{ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }">
              <template v-if="editable">
                <vxe-input v-model="row[column.field]" type="number" :controls="false"
                  :data-row="rowIndex"
                  :data-column="columnIndex"
                  :disabled="rowIndex % 4 === 1"
                  @keydown="onInputKeydown($event, rowIndex, columnIndex, column)"
                ></vxe-input>
              </template>
              <template v-else>
                <span>{{column.formatter ?　column.formatter({
                  cellValue: row[column.field],
                  row,
                  rowIndex,
                  column,
                  columnIndex,
                  $columnIndex
                }) : row[column.field]}}</span>
              </template>
            </template>

            <template #copperPrice="{ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }">
              <vue2-number-input v-model="row[column.field]"
                :data-row="rowIndex"
                :data-column="columnIndex"
                @keydown="onInputKeydown2($event, rowIndex, columnIndex, column)"
                @change="onPriceChange($event, rowIndex, columnIndex, column)"
              ></vue2-number-input>
            </template>

            <template #billState="{ row }">
              <bill-state :state="row.billState"></bill-state>
            </template>

            <template #cz="{ row }">
              <page-button content="点我" @click="$router.push({ name: 'ui_detailtest', params: { id: row.id } })"></page-button>
              <page-button content="按钮" theme="danger" type="text" @click="$router.push({ path: `/ui/detailtest/${row.id}` })"></page-button>
            </template>

            <template #quoteType="{ row }">
              <el-select v-model="row.quoteType">
                <el-option value="1" label="工程"></el-option>
                <el-option value="2" label="家装"></el-option>
              </el-select>
            </template>

            <template #pager>
              <vxe-pager
                :current-page.sync="pagination.currentPage"
                :page-size.sync="pagination.pageSize"
                :total="pagination.total"
                @page-change="onPageChange"
              ></vxe-pager>
            </template>
        </vxe-grid>
        </div>
      </div>
    </table-section>

    <template #custom>
      <el-drawer class="app-page-drawer"
        :visible.sync="drawerVisible"
        :modal-append-to-body="false"
        :append-to-body="false"
        size="85%"
        direction="ltr"
      ></el-drawer>
    </template>
  </app-page>
</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import XEUtils from 'xe-utils'
  import SEARCH_OPTIONS from './scripts/data/search-options'
  import { ApiQuotation } from '@/apis'

  import mixin_table from './scripts/mixins/table'

  import { handleNextFocus } from '@/utils/vxe-table'

  import { debounce } from '@/utils'

  import { handleFilterData } from '@/components/filter-data-button/filter.js'

  const apiQuotation = new ApiQuotation()

  let cache_tabledata = []

  export default {
    name: 'ui_pagelist',
    mixins: [mixin_table],
    computed: {
      ...mapState({
        userInfo: state => state.User.userInfo ?? {},
      }),
      bindFields() {
        return this.tableColumns.filter(item => !['seq', 'checkbox', 'radio'].includes(item.type) && !!item.title)
          .map(item => {
            return {
              label: item.title,
              value: item.field,
            }
        })
      },

      ...mapGetters('Common', {
        getDicts: 'getDicts'
      }),
      bindSourceList() {
        return {
          ...this.getDicts,
          ...this.sourceList,
        }
      },
    },

    data() {
      const dict = this.$store.state.Common.dict
      return {
        condition: {},
        searchModel: {},
        searchOptions: [...SEARCH_OPTIONS],
        sourceList: {
          select: (dict['standard_type'] ?? []).map(d => {
            return { label: d.dictLabel, value: d.dictValue }
          }),
          selectmulti: (dict['bill_state'] ?? []).map(d => {
            return { label: d.dictLabel, value: d.dictValue }
          })
        },

        drawerVisible: false,

        filterList: [],
        fields: [],
        bindTableData: []
      }
    },
    created() {

    },
    mounted() {
      this.getList()
    },
    methods: {
      async getList(page = 1) {
        const loading = this.$loading({
        	lock: true,
        	text: '正在查询',
        	spinner: 'el-icon-loading',
        })
        const res = await apiQuotation.getQuotedList(this.condition, page, this.pagination.pageSize)
        loading.close()
        const { records = [], total = 0 } = res?.data ?? {}
        this.tableInit(this.$refs.table, records, () => {
          this.pagination = {
            ...this.pagination,
            total: total,
            currentPage: page
          }
          //this.bindTableData = this.tableData
          this.bindTableData = handleFilterData(this.tableData, this.filterList)
        })
      },

      onSearch(value) {
        this.condition = {...value}
        this.getList()
      },
      onReset() {
        this.condition = {}
        this.getList()
      },
      onRowDblClick({ row, rowIndex}) {
        this.$message.error(`[${rowIndex}] - ${row.productName}`)
        this.drawerVisible = true
      },
      onPageChange({ currentPage, pageSize }) {
        this.pagination = {
          ...this.pagination,
          pageSize
        },
        this.getList(currentPage)
      },

      async onEditBtnClick(editable) {
        if (editable) {
          cache_tabledata = XEUtils.clone(this.tableData, true)
        } else {
          this.tableData = [...cache_tabledata]
        }
        this.editable = editable
      },
      onEditBtnOk() {
        //TODO
        cache_tabledata = null
        this.editable = false
      },

      onInputKeydown(e, rowIndex, columnIndex, column) {
        const { code } = e.$event
        const { table } = this.$refs
        const max_row = this.tableData.length
        const max_column = this.tableColumns.length

        const container = column.fixed === 'left' ? table.$el.querySelector('.vxe-table--fixed-left-wrapper')
                            : column.fixed === 'right' ? table.$el.querySelector('.vxe-table--fixed-right-wrapper')
                            : table.$el

        handleNextFocus(container, code, rowIndex, columnIndex, max_row, max_column)
      },
      onInputKeydown2(e, rowIndex, columnIndex, column) {
        debounce(this.inputFocus)(e, rowIndex, columnIndex, column)
      },
      inputFocus(e, rowIndex, columnIndex, column) {
        const { code } = e
        const { table } = this.$refs
        const max_row = this.tableData.length
        const max_column = this.tableColumns.length

        //
        const container = column.fixed === 'left' ? table.$el.querySelector('.vxe-table--fixed-left-wrapper')
                            : column.fixed === 'right' ? table.$el.querySelector('.vxe-table--fixed-right-wrapper')
                            : table.$el

        handleNextFocus(container, code, rowIndex, columnIndex, max_row, max_column)
      },

      onFilterConfirm(data) {
        console.log('onFilterConfirm', data)
        this.filterList = data
        this.$nextTick(() => {
          this.bindTableData = handleFilterData(this.tableData, this.filterList)
        })
      },

      onPrintData() {
        console.log('this.tableData', this.tableData)
      }
    }
  }
</script>

<style lang="less">
</style>

