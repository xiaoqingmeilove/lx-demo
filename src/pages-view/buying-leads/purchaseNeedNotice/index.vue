<template>
  <div class="purchaseNeedNotice-page">
    <div class="header-card" v-if="summaryData.length">
      <div class="header-card-title">采购需求汇总</div>
      <div class="header-card-body">
        <div
          class="header-card-item"
          v-for="(item, index) in summaryData"
          :key="index"
        >
          <svg-icon
            :icon-class="summaryIcons[item.label] || 'cgxq'"
            size="56"
          ></svg-icon>
          <div class="header-card-item-value">
            <div class="header-card-item-value-title">{{ item.label }}</div>
            <div class="header-card-item-value-num">{{ item.value ?? 0 }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="charts-content">
      <div class="charts-item">
        <div class="title">采购商品占比</div>
        <div class="content">
          <div ref="charts" class="charts"></div>
        </div>
      </div>
      <div class="charts-item">
        <div class="title">需求增长曲线（按数量）</div>
        <div class="content">
          <div ref="charts1" class="charts"></div>
        </div>
      </div>
      <div class="charts-item">
        <div class="title">需求增长曲线（按金额）</div>
        <div class="content">
          <div ref="charts2" class="charts"></div>
        </div>
      </div>
    </div>
    <div class="bill-table">
      <div class="table-title">未开始寻源需求明细</div>
      <div class="table-body">
        <vxe-grid
          height="auto"
          :columns="columns"
          :data="tableData"
          :custom-config="{ storage: true }"
          :id="`tb_cgxqkb_list_${userInfo.userId}`"
          ref="table"
        >
        </vxe-grid>
      </div>
      <div class="table-footer">
        <vxe-pager
          :current-page.sync="pagination.currentPage"
          :page-size.sync="pagination.pageSize"
          :total="pagination.total"
          @page-change="pageChange"
        ></vxe-pager>
      </div>
    </div>
  </div>
</template>
<script>
import XEUtils from "xe-utils";
import { mapState } from "vuex";
import * as echarts from "echarts";
import { ApiQuotation, ApiBuy, ApiBasic } from "@/apis";
const apiQuotation = new ApiQuotation();
const apiBuy = new ApiBuy();
const apiBasic = new ApiBasic();
export default {
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
  },
  data() {
    return {
      menuCode: "buyingLead_purchaseNeedNotice",
      columns: [],
      tableData: [],
      chart: null,
      summaryData: [],
      bOption: {
        legend: {
          top: "30%",
          right: "right",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ",
        },
        series: [
          {
            name: "Nightingale Chart",
            type: "pie",
            radius: ["40%", "70%"],
            center: ['36%', '50%'], // 调整饼图位置
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: false,
              },
            },
            data: [
              { value: 200, name: "rose 1" },
              { value: 180, name: "rose 2" },
              { value: 160, name: "rose 3" },
              { value: 140, name: "rose 4" },
              { value: 120, name: "rose 1" },
              { value: 100, name: "rose 2" },
              { value: 90, name: "rose 3" },
              { value: 88, name: "rose 4" },
              { value: 200, name: "rose 1" },
              { value: 50, name: "rose 2" },
              { value: 40, name: "rose 3" },
              { value: 30, name: "rose 4" },
            ],
          },
        ],
      },
      xOption1: {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "0%",
          right: "2%",
          top: "9%",
          bottom: "0%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
            "Sat",
            "Sun",
            "Sat",
            "Sun",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [62, 13, 1, 5, 3, 34, 126, 1, 3, 163, 45, 9],
            type: "line",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#C4D2FF",
                },
                {
                  offset: 1,
                  color: "#F8FAFF",
                },
              ]),
            },
            itemStyle: {
              color: "#6A8DFF",
            },
          },
        ],
      },
      xOption2: {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "0%",
          right: "2%",
          top: "9%",
          bottom: "0%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: [
            "Mon",
            "Tue",
            "Wed",
            "Thu",
            "Fri",
            "Sat",
            "Sun",
            "Sat",
            "Sun",
            "Sat",
            "Sun",
          ],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [62, 13, 1, 5, 3, 34, 126, 1, 3, 163, 45, 9],
            type: "line",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#FFC3BA",
                },
                {
                  offset: 1,
                  color: "#FFF5F3",
                },
              ]),
            },
            itemStyle: {
              color: "#FF7460",
            },
          },
        ],
      },
      pagination: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize")
          ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20
          : 20,
        total: 0,
        showTotal: () => `共${this.pagination.total}条`,
      },
      summaryIcons: {
        采购需求总数量: "cgxq",
        寻源中: "xyz",
        完成寻源: "wcxy",
        已签合同: "yqht",
        已下订单: "yxdd",
      },
    };
  },
  activated() {
    this.init();
  },
  mounted() {
    this.chart = echarts.init(this.$refs.charts);
    this.chart1 = echarts.init(this.$refs.charts1);
    this.chart2 = echarts.init(this.$refs.charts2);
    window.onresize = () => {
      //动态改变图表尺寸
      this.chart.resize();
      this.chart1.resize();
      this.chart2.resize();
    };
  },
  created() {},
  methods: {
    init() {
      this.getTableList();
      this.getSummaryList();
      this.getEchartList();
      this.setColumn();
    },
    async setColumn() {
      const loading = this.loading("正在加载");
      let data = {
        code: "list",
        corpCode: this.businessCode ?? "LX",
      };
      const res = await apiQuotation.getColumnsConfig(this.menuCode, data);
      if (res.code === 200 && res.data && res.data.columns) {
        let columns = res.data.columns;
        this.columns = [...columns];
      }
      loading.close();
    },
    getEchartList() {
      apiBuy
        .getPurchaseNeedNoticeEchart()
        .then((res) => {
          if (res.code == 200) {
            this.bOption.series[0].data = (res.data.cgspzb ?? []).map((x) => {
              const itemColor = {
                办公用品: "#5EA5F5",
                非金属材料: "#FF9E43",
                主料: "#26E036",
              };
              return {
                value: x.value,
                name: x.name,
                itemStyle: { color: itemColor[x.name] },
              };
            });
            this.xOption1.xAxis.data = res.data.xqzzqxasl.label ?? [];
            this.xOption1.series[0].data = res.data.xqzzqxasl.value ?? [];
            this.xOption2.xAxis.data = res.data.xqzzqxaje.label ?? [];
            this.xOption2.series[0].data = res.data.xqzzqxaje.value ?? [];
            this.initCharts();
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.$message.error("数据获取异常");
        });
    },
    initCharts() {
      this.bOption && this.chart.setOption(this.bOption);
      this.xOption1 && this.chart1.setOption(this.xOption1);
      this.xOption2 && this.chart2.setOption(this.xOption2);
    },
    getSummaryList() {
      apiBuy
        .getPurchaseNeedNoticeSummary()
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.summaryData = res.data ?? [];
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.$message.error("数据获取异常");
        });
    },
    getTableList() {
      const loading = this.loading("加载中");
      apiBuy
        .getPurchaseNeedNoticeList(
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
      let pageSizeObj = localStorage.getItem("pageSize")
        ? JSON.parse(localStorage.getItem("pageSize"))
        : {};
      pageSizeObj[this.$route.name] = pageSize;
      localStorage.setItem("pageSize", JSON.stringify(pageSizeObj));
      this.pagination = {
        ...this.pagination,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.getTableList();
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
.purchaseNeedNotice-page {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  .notice-title {
    font-size: 30px;
    font-weight: 500;
    text-align: center;
    background-color: #fff;
  }
  // .notice-title:hover {
  //   box-shadow: 0 6px 6px 0 rgba(24, 144, 255, 0.3);
  //   cursor: default;
  // }
  .bill-summary {
    height: 120px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
    .summary-item {
      background-color: #fff;
      height: 100%;
      width: 0;
      flex: 1;
      margin-right: 15px;
      border-radius: 12px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      box-shadow: 0px 0px 8px 0px #3c3e4314;
      .title {
        font-size: 16px;
        font-weight: 500;
      }
      .qty {
        height: 0;
        flex: 1;
        width: 100%;
        font-size: 28px;
        display: grid;
        place-items: center;
      }
    }
    .summary-item:last-child {
      margin-right: 0;
    }
    // .summary-item:hover {
    //   box-shadow: 0 6px 6px 0 rgba(24, 144, 255, 0.3);
    //   cursor: default;
    // }
  }

  .charts-content {
    height: 416px;
    display: flex;
    flex-direction: row;
    .charts-item {
      height: 100%;
      width: 0;
      flex: 1;
      margin-right: 15px;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      background-color: #fff;
      box-shadow: 0px 0px 8px 0px #3c3e4314;
      .title {
        font-size: 18px;
        font-weight: bold;
        height: 54px;
        line-height: 43px;
        padding: 7px 22px 0;
        border-bottom: 1px solid #eaeaea;
      }
      .content {
        width: 100%;
        height: 0;
        flex: 1;
        padding: 10px;
        .charts {
          width: 100%;
          height: 100%;
        }
      }
    }
    .charts-item:last-child {
      margin-right: 0;
    }
    // .charts-item:hover {
    //   box-shadow: 0 6px 6px 0 rgba(24, 144, 255, 0.3);
    //   cursor: default;
    // }
  }
  .bill-table {
    height: 500px;
    background-color: #fff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    padding: 7px 10px;
    box-shadow: 0px 0px 8px 0px #3c3e4314;
    .table-title {
      height: 43px;
      line-height: 43px;
      padding: 0 12px;
      font-weight: bold;
      font-size: 18px;
    }
    .table-body {
      height: 0;
      flex: 1;
    }
  }
  // .bill-table:hover {
  //   box-shadow: 0 6px 6px 0 rgba(24, 144, 255, 0.3);
  //   cursor: default;
  // }
}
.flex(@dir: row, @jus: space-around ,@ali:center, @gap: 15px, @fwp: nowrap ) {
  display: flex;
  flex-direction: @dir;
  justify-content: @jus;
  align-items: @ali;
  gap: @gap;
  flex-wrap: @fwp;
}
.header-card {
  .flex(column, space-around, center, 14px);
  width: 100%;
  border-radius: 4px;
  padding: 7px 22px 20px;
  background-color: #fff;
  box-shadow: 0px 0px 8px 0px #3c3e4314;
  .header-card-title {
    width: 100%;
    height: 43px;
    line-height: 43px;
    color: #000;
    font-size: 18px;
    font-weight: 600;
  }
  .header-card-body {
    .flex();
    width: 100%;
    flex: 1;
    .header-card-item {
      display: flex;
      align-items: center;
      gap: 12px;
      &-value {
        font-size: 16px;
        color: #333;
        &-title {
          color: #666;
        }
        &-num {
          font-size: 28px;
          font-weight: bold;
          margin-top: 15px;
        }
      }
    }
  }
}
</style>
