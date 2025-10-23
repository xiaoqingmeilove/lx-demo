<template>
  <div class="seekNotice-page">
    <div class="echart-top">
      <div class="seek-amount">
        <div class="title">月度寻源金额</div>
        <div class="content">
          <div ref="charts" class="charts"></div>
        </div>
      </div>
      <div class="seek-speed">
        <div class="title">月度寻源进度</div>
        <div class="content">
          <div ref="charts1" class="charts"></div>
        </div>
      </div>
    </div>
    <div class="echart-buttom">
      <div class="seek-rows">
        <div class="title">月度寻源条数</div>
        <div class="content">
          <div ref="charts3" class="charts"></div>
        </div>
      </div>
      <div class="seek-type">
        <div class="title">月度寻源方式</div>
        <div class="content">
          <div ref="charts2" class="charts"></div>
        </div>
      </div>
    </div>
    <div class="add-buttom">
      <div class="title">寻源状态月度分析</div>
      <div class="content">
        <div ref="charts4" class="charts"></div>
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
      bOption1: {
        legend: {
          top: '36%',
          right: 'right'
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ",
        },
        series: [
          {
            name: "Nightingale Chart",
            type: "pie",
            radius: ['40%', '70%'],
            center: ['36%', '50%'], // 调整饼图位置
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: false,
              }
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
      bOption2: {
        legend: {
          top: '36%',
          right: 'right'
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ",
        },
        series: [
          {
            name: "Nightingale Chart",
            type: "pie",
            radius: ['40%', '70%'],
            center: ['36%', '50%'], // 调整饼图位置
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: false,
              }
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
          left: "1%",
          right: "2%",
          top: "12%",
          bottom: "0%",
          containLabel: true,
        },
        legend: {
          top: "bottom",
          data: ["申请数量"],
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
          name: "单位（万元）",
        },
        series: [
          {
            data: [62, 13, 1, 5, 3, 34, 126, 1, 3, 163, 45, 9],
            type: "line",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#FFC3BA'
                },
                {
                  offset: 1,
                  color: '#FFF5F3'
                }
              ])
            },
            itemStyle: {
              color: '#FF7460',
            }
          },
        ],
      },
      xOption2: {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "1%",
          right: "2%",
          top: "12%",
          bottom: "0%",
          containLabel: true,
        },
        legend: {
          top: "bottom",
          data: ["申请数量"],
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
          name: "单位（条）",
        },
        series: [
          {
            data: [62, 13, 1, 5, 3, 34, 126, 1, 3, 163, 45, 9],
            type: "line",
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#C4D2FF'
                },
                {
                  offset: 1,
                  color: '#F8FAFF'
                }
              ])
            },
            itemStyle: {
              color: '#6A8DFF',
            }
          },
        ],
      },
      zOption1: {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        grid: {
          left: "1%",
          right: "2%",
          top: "9%",
          bottom: "0%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
          name: "单位（条）",
        },
        legend: {
          data: ["寻源发起的条数", "寻源完成的条数"],
        },
        series: [
          {
            name: "寻源发起的条数",
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            itemStyle: {
              color: "#6A8DFF",
            },
          },
          {
            name: "寻源完成的条数",
            data: [120, 200, 150, 80, 70, 110, 130],
            type: "bar",
            itemStyle: {
              color: "#10DD87",
            },
          },
        ],
      },
      chart: null,
      chart1: null,
      chart2: null,
      chart3: null,
      chart4: null,
    };
  },
  activated() {
    this.init();
  },
  mounted() {
    this.chart = echarts.init(this.$refs.charts);
    this.chart1 = echarts.init(this.$refs.charts1);
    this.chart2 = echarts.init(this.$refs.charts2);
    this.chart3 = echarts.init(this.$refs.charts3);
    this.chart4 = echarts.init(this.$refs.charts4);
    window.onresize = () => {
      //动态改变图表尺寸
      this.chart.resize();
      this.chart1.resize();
      this.chart2.resize();
      this.chart3.resize();
      this.chart4.resize();
    };
  },
  created() {},
  methods: {
    init() {
      this.getEchartList();
    },
    getEchartList() {
      const loading = this.loading("正在加载");
      apiBuy
        .getSeekNoticeEchart()
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.bOption1.series[0].data = (res.data.xyjd ?? []).map(x=>{
              const itemColor = { '进行中': '#FF9E43', '已完成': '#10DD87' };
              return {...x, itemStyle:{ color: itemColor[x.name]}}
            });
            this.bOption2.series[0].data = (res.data.xyfs ?? []).map(x=>{
              const itemColor = { '询比价': '#5EA5F5', '竞价': '#FF9E43' };
              return {...x, itemStyle:{ color: itemColor[x.name]}}
            });;
            this.xOption1.xAxis.data = res.data.xyje.label ?? [];
            this.xOption1.series[0].data = res.data.xyje.value ?? [];
            this.xOption2.xAxis.data = res.data.xyts.label ?? [];
            this.xOption2.series[0].data = res.data.xyts.value ?? [];
            this.zOption1.xAxis.data = res.data.xyts.label ?? [];
            this.zOption1.series[0].data = res.data.xyzt.value ?? [];
            this.zOption1.series[1].data = res.data.xyzt.value1 ?? [];
            this.initCharts();
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.$message.error("数据获取异常");
        })
        .finally(() => {
          loading.close();
        });
    },
    initCharts() {
      this.bOption1 && this.chart1.setOption(this.bOption1);
      this.bOption2 && this.chart2.setOption(this.bOption2);
      this.xOption1 && this.chart.setOption(this.xOption1);
      this.xOption2 && this.chart3.setOption(this.xOption2);
      this.zOption1 && this.chart4.setOption(this.zOption1);
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
.seekNotice-page {
  padding: 15px;
  // display: flex;
  // flex-direction: column;
  .notice-title {
    font-size: 30px;
    font-weight: 500;
    text-align: center;
    background-color: #fff;
  }
  .notice-title:hover {
    box-shadow: 0 6px 6px 0 rgba(24, 144, 255, 0.3);
    cursor: default;
  }

  .echart-top {
    height: 316px;
    width: 100%;
    margin-bottom: 15px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    .seek-amount {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      width: 70%;
      display: flex;
      flex-direction: column;
      
    }
    // .seek-amount:hover {
    //   box-shadow: 0 6px 6px 0 rgba(24, 144, 255, 0.3);
    //   cursor: default;
    // }
    .seek-speed {
      height: 100%;
      background-color: #fff;
      border-radius: 4px;
      width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      box-shadow: 0px 0px 8px 0px #3C3E4314;
    }
    // .seek-speed:hover {
    //   box-shadow: 0 6px 6px 0 rgba(24, 144, 255, 0.3);
    //   cursor: default;
    // }
  }
  .echart-buttom {
    height: 316px;
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 16px;
    margin-bottom: 16px;
    .seek-type {
      height: 100%;
      border-radius: 4px;
      background-color: #fff;
      width: 0;
      flex: 1;
      display: flex;
      flex-direction: column;
      box-shadow: 0px 0px 8px 0px #3C3E4314;
    }
    // .seek-type:hover {
    //   box-shadow: 0 6px 6px 0 rgba(24, 144, 255, 0.3);
    //   cursor: default;
    // }

    .seek-rows {
      height: 100%;
      background-color: #fff;
      border-radius: 4px;
      width: 70%;
      display: flex;
      flex-direction: column;
      box-shadow: 0px 0px 8px 0px #3C3E4314;
    }
    // .seek-rows:hover {
    //   box-shadow: 0 6px 6px 0 rgba(24, 144, 255, 0.3);
    //   cursor: default;
    // }
  }
  .add-buttom {
    height: 402px;
    width: 100%;
    background-color: #fff;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 8px 0px #3C3E4314;
  }
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
.seekNotice-page::-webkit-scrollbar {
  width: 8px;
  height: 12px;
}
.seekNotice-page::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 6px;
}
.seekNotice-page::-webkit-scrollbar-thumb {
  background: #aaa;
  border-radius: 6px;
}
.seekNotice-page::-webkit-scrollbar-thumb:hover {
  background: #888;
}
</style>
