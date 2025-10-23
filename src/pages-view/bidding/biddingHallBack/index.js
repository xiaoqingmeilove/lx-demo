import { columns, columns1 } from "./scripts/columns";
import { ApiBid, ApiQuotation } from '@/apis'
import { mapState } from 'vuex'
import { handleStorageColumns } from '@/utils/vxe-table'
import { blobToFile } from '@/utils/utils';
import { findMenuByCode } from "@/utils/menu";
import XEUtils from 'xe-utils'
import VXETable from "vxe-table";
import moment from "moment";
import * as echarts from "echarts";

const apiBid = new ApiBid();
const apiQuotation = new ApiQuotation();
export default {
  name: "bidding_biddingHallBack",
  components: {},
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    getColorAndName(){
      return (row, column, list) => {
        const find = list.find(f=>f.value == row[column.field]);
        return find || { color: '#45CB7F', label: row[column.field] || '未知'};
      }
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      dict,
      menuCode: "bidding_biddingHallBack",
      columns: [],
      tableColumns: [],
      defaultColumns: [],
      columns1: [],
      tableColumns1: [],
      defaultColumns1: [],
      searchOptions: [],
      tableData: [],
      tableData1: [],
      condition: {},
      condition1: {},
      tablePage: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20 : 20,
        total: 0,
        showTotal: () => `共${this.tablePage.total}条`,
      },
      tablePage1: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name+'xm'] || 20 : 20,
        total: 0,
        showTotal: () => `共${this.tablePage.total}条`,
      },
      sourceList: {
        billStatelist: (dict["bill_state"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
      },
      chart: null,
      options: {
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          data: []
        },
        grid: {
          top: '50px',
          right: '20px',
          bottom: '30px',
          left: '20px',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        series: []
      },
      budAmount: 0,
    };
  },
  created() {
    this.setColumn();
  },
  activated() {
    this.$tabs.activeTab.title = findMenuByCode(this.menuCode)?.title ?? '竞价大厅(后台)';
    this.getHallList(()=>{
      if(this.tableData1.length){
        this.condition = {billNo: this.tableData1[0]?.billNo ?? ''}
        this.budAmount = this.tableData1[0]?.amount ?? 0;
        this.getHallOfferList();
      }else{
        this.tableData = [];
        this.chart && this.chart.clear();
      }
    });
  },
  beforeRouteLeave(to, from, next) {
    this.closePopup();
    next();
  },
  mounted() {},
  methods: {
    toPricing(row){
      VXETable.modal.confirm({
        title: "提示",
        content: "确定核价?",
        mask: true,
      }).then(async (type) => {
        if (type === "confirm") {
          const loading = this.loading('请求中');
          apiBid.postBiddingPricing(row?.id).then(res => {
            if (res.code === 200 && res.data) {
              this.$message.success(res?.message ?? "操作成功");
              this.$router.push({
                path: `/bidding/bidPricing-detail/detail/${res.data}`,
              });
            } else {
              this.$message.error(res?.message ?? "操作失败");
            }
          }).catch(err=>{
            this.$message.error(err?.message ?? "操作失败")
          }).finally(()=>{
            loading.close();
          })
        }
      })
    },
    closePopup(){
      const { tools, tools1 } = this.$refs;
      const { setting } = tools?.$refs;
      const { setting1 } = tools1?.$refs;
      setting && setting.cancel();
      setting1 && setting1.cancel();
    },
    initTableConfig() {
      const { table, toolbar, xmtoolbar, xmtable } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable('columns', 'tableColumns', table.id);
      }
      if (xmtable) {
        xmtable.connect(xmtoolbar);
        this.initTable('columns1', 'tableColumns1', xmtable.id);
      }
      this.defaultColumns = XEUtils.clone(this.columns, true);
      this.defaultColumns1 = XEUtils.clone(this.columns1, true);
    },
    async setColumn() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, {code: "list,list1", corpCode: this.businessCode ?? "LX"});
      if (res.code === 200 && res.data) {
        this.columns = res.data.list?.columns ?? [];
        this.columns1 = res.data.list1?.columns ?? [];
        this.initTableConfig();
      }
      loading.close();
    },
    initTable(column, tableColumn, tableId) {
      const tableColumns = this[column].map(item => {
        if (item.params && item.params.displayDigits) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, item.params.displayDigits)
          }
        }
        return item
      })
      this[tableColumn] = handleStorageColumns(tableColumns, tableId)
    },
    getHallOfferList(callback) {
      const loading = this.loading('加载中');
      apiBid.getBiddingApplyHallOfferList(this.condition).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data?.offerList ?? [];
          if(res.data?.signUpOfferList){
              this.initCharts(res.data?.signUpOfferList ?? {});
          }
          typeof callback === 'function' && callback();
        } else {
          this.$message.error(res.message || "获取数据异常");
        }
      }).catch(err => {
        this.$message.error(err.message || "获取数据异常")
      }).finally(() => {
        loading.close()
      })
    },
    initCharts(data){
      // const values = Object.values(data);  
      // const keysName =values.map(x=>x[0].supplierName);
      // console.log("keys222",values);
      
      this.chart && this.chart.clear();
      let options = {...this.options};
      const keys = Object.keys(data);
      const itemList = keys.reduce((acc, item)=>{
        acc = acc.concat(data[item]);
        return acc;
      }, [])
      options.legend.data = keys;
      options.xAxis.data = XEUtils.uniq(itemList.map(x=>`第${x?.rowNum??1}次`));
      options.series = keys.map(item => {
        return {
          name: item,
          type: 'line',
          data: data[item].map(x=>x.amount),
          markLine: {
            symbol: ['none', 'none'], // 去掉箭头
            label: {
              show: true,
              position: 'insideEndTop',
              formatter: '{b} {c}'
            },
            data: [
              {
                name: '预算金额',
                yAxis: this.budAmount,
              }
            ],
            lineStyle: {
              color: '#f00',
              type: 'solid',
              width: 3
            }
          }
        }
      })
      this.options = {...options};
      this.$nextTick(() => {
        this.chart = echarts.init(this.$refs.charts);
        this.options && this.chart.setOption(this.options, true)
        window.onresize = () => {
          this.chart.resize();
        };
      })
    },
    getHallList(callback){
      const loading = this.loading('加载中');
      apiBid.getBiddingApplyHallList(this.condition1, this.tablePage1.currentPage, this.tablePage1.pageSize).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData1 = res.data?.records ?? []
          this.tablePage1.total = res.data.total;
          typeof callback === 'function' && callback();
        } else {
          this.$message.error(res.message || "获取数据异常");
        }
      }).catch(err => {
        this.$message.error(err.message || "获取数据异常")
      }).finally(() => {
        loading.close()
      })
    },
    // 一览表双击事件 查看详情
    onCellDbClick({row}) {
      this.condition = {billNo: row?.billNo ?? ''}
      this.budAmount = row?.amount ?? 0
      this.getHallOfferList();
    },

    // 分页
    handlePageChange(e) {
      const { pageSize, currentPage } = e;
      let pageSizeObj = localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize")) : {};
      pageSizeObj[this.$route.name] = pageSize;
      localStorage.setItem("pageSize", JSON.stringify(pageSizeObj));
      this.tablePage = {
        ...this.tablePage,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.getHallOfferList();
    },
    handlePageChange1(e) {
      const { pageSize, currentPage } = e;
      let pageSizeObj = localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize")) : {};
      pageSizeObj[this.$route.name + 'xm'] = pageSize;
      localStorage.setItem("pageSize", JSON.stringify(pageSizeObj));
      this.tablePage1 = {
        ...this.tablePage1,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.getHallList();
    },

    // 表格工具
    handleColumns(columns) {
      return columns.map(item => {
        if (item.digits) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, item.digits)
          }
        }
        return item
      })
    },
    onToolOk(e, column) {
      const { type, data } = e
      const fn = this.toolMethods(column)[type]
      fn && fn(data)
    },
    toolMethods(column) {
      return {
        set_column: ({columns}) => {
          this[column] = [...columns]
        }
      }
    },
    // 加载组件功能
    loading(text) {
      const loading = this.$loading({
        lock: true,
        text,
        spinner: 'el-icon-loading',
      })
      return loading
    },
  },
};