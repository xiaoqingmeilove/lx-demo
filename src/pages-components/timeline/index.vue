<template>
  <div class="timelineBox">
    <el-timeline>
        <template v-for="(item,index) in timelineData">
          <el-timeline-item :timestamp="item.data?.time" placement="top" :key="item.type">
            <div class="timeStrBox">
              <h5 class="timeStr">{{ calculateTimeDifference(item.data?.time ,timelineData[index+1]?.time) }}</h5>
              <h4 class="timelineTitle" @click="handleClick(item)">
                {{item.title}}
                <span>（{{item.data?.count || 0}}）</span>
              </h4>
              <transition name="fade-slide">
                <div class="timelineContent" v-show="item.show">
                  <vxe-grid
                    :data="item.data?.detailList"
                    :id="`tb_shippingOrder_delivery_cpxx_list_${userInfo.userId}`"
                    :custom-config="{ storage: true }"
                    :columns="item.columns"
                    min-height="72px"
                    max-height="600px"
                    ref="table"
                  >
                    <template #billState="{row}">
                      <bill-state :state="1"></bill-state>
                    </template>
                    <template #orderBizFlowStatus="{row}">
                      <biz-flow-status :state="row.bizFlowStatus"></biz-flow-status>
                    </template>
                  </vxe-grid>
                </div>
              </transition>
            </div>
          </el-timeline-item>   
        </template>

    </el-timeline>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { PROCUREMENT_REQUIREMENT,PROCUREMENT_PLAN,BIDDING_PROCESS,QUOTE_COMPARISON,ELECTRONIC_BIDDING,PURCHASE_CONTRACT,PURCHASE_ORDER,RETURN_ORDER,SHIPPING_ORDER,RECEIVING_DOCUMENT,RECONCILIATION_STATEMENT,INVOICE} from "./data";
import { ApiContract } from "@/apis";
const apiContract = new ApiContract();

const nodeType = {
  "PROCUREMENT_REQUIREMENT": "采购需求",
  "PROCUREMENT_PLAN": "采购计划",
  "BIDDING_PROCESS": "招投标",
  "QUOTE_COMPARISON":"询比价",
  "ELECTRONIC_BIDDING": "电子竞价",
  "PURCHASE_CONTRACT": "合同",
  "PURCHASE_ORDER": "订单",
  "RETURN_ORDER": "退货单",
  "SHIPPING_ORDER": "发货单",
  "RECEIVING_DOCUMENT": "收货单",
  "RECONCILIATION_STATEMENT": "对账单",
  "INVOICE": "发票",
}

export default {
  name: "timeline",
  props: {
    billId: {
      type: String | Number,
      default: "",
    },
    nodeType: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    })
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      PURCHASE_ORDER,
      SHIPPING_ORDER,
      RECEIVING_DOCUMENT,
      PROCUREMENT_REQUIREMENT,
      PROCUREMENT_PLAN,
      BIDDING_PROCESS,
      QUOTE_COMPARISON,
      ELECTRONIC_BIDDING,
      PURCHASE_CONTRACT,
      RETURN_ORDER,
      RECONCILIATION_STATEMENT,
      INVOICE,
      traceData:{},
      descSourceList: {
        purchaseType: (dict['contract_purchase_type'] ?? []).map(x => {
          return { label: x.dictLabel, value: x.dictValue }
        }),
      },
      timelineData:[],
    };
  },
  created() {
    this.init();
  },
  // activated() {
  //  this.init();
  // },
  methods: {
    init() {
      this.getOrderData();
    },
    handleClick(item) {
      item.show = !item.show;
    },
    // 获取订单数据
    getOrderData() {
      const loading = this.loading('请求中');
      console.log(this.billId,this.nodeType)
      apiContract.getTraceFlatLinks(this.billId, this.nodeType).then(res => {
        if (res.code === 200) {
          this.traceData = res.data;
          // this.timelineData = Object.entries(nodeType).map(([type, chineseTips]) => ({
          //   type,
          //   chineseTips,
          //   time:res.data[type]?.time,
          //   title:nodeType[type]||'',
          //   columns: this[type] || [],
          //   data: res.data[type] || [] 
          // }));

          const typeEntries = Object.entries(nodeType);
      
          this.timelineData = typeEntries.map(([type, chineseTips], index) => {
            let time = null;
            for (let i = index; i < typeEntries.length; i++) {
              const currentType = typeEntries[i][0];
              if (res.data[currentType]?.time) {
                time = res.data[currentType].time;
                break;
              }
            }
            return {
              type,
              chineseTips,
              time,
              show:res.data[type]?.detailList?.length > 0,
              title: nodeType[type] || '',
              columns: this[type] || [],
              data: res.data[type] || []
            };
          });

          console.log('data', this.timelineData)

        //   this.traceData = res.data;
        //  this.timelineData = Object.entries(res.data).map(([type, data]) => ({
        //   type,
        //   data,
        //   columns:this[type]||[],
        //   title:nodeType[type]||'',
        // }));
        //  console.log('data', this.timelineData)
        } else {
          this.$message.error(res.message ?? "操作失败");
        }
      }).catch(err => {
        this.$message.error(err.message ?? "操作失败");
      }).finally(() => {
        setTimeout(() => loading.close(), 1000);
      })
    },

    // 计算时间差
     calculateTimeDifference(startTime, endTime) {

      if(!startTime || !endTime){
        return '';
      }
      const start = new Date(startTime);
      const end = new Date(endTime);
      const diffMs = end - start;
      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30.44);
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      const remainingDays = Math.floor(days % 30.44);
      const remainingHours = hours % 24;
      const remainingMinutes = minutes % 60;
      const remainingSeconds = seconds % 60;
      
      let time = {
          years: years?years+'年':'',
          months: remainingMonths?remainingMonths+'月':'',
          days: remainingDays?remainingDays+'日':'',
          hours: remainingHours?remainingHours+'时':'',
          minutes: remainingMinutes?remainingMinutes+'分':'',
          seconds: remainingSeconds?remainingSeconds+'秒':''
        }
      let srt = `${time.years}${time.months}${time.days}${time.hours}${time.minutes}${time.seconds}`
      return srt;
    },

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
</script>
<style lang="less" scoped>
.timelineBox{
  padding: 20px 0 0 160px;
  .timeStrBox{
    min-height: 60px;
  }
  .timeStr{
    position: absolute;
    left: -80px;
    top: 50%;
    font-size: 14px;
    color: red;
    font-weight: bold;
  }
  .timelineTitle{
    font-size: 18px;
    font-weight: bold;
    color: #999;
    cursor: pointer;
    padding-bottom: 30px;
  }
  /deep/.el-timeline{
    .el-timeline-item__timestamp.is-top{
      position: absolute;
      left: -140px;
    }
  }
  
  // 添加过渡动画样式
  .fade-slide-enter-active,
  .fade-slide-leave-active {
    transition: all 0.5s ease-out;
    max-height: 600px; // 与 vxe-grid 的 max-height 保持一致
    opacity: 1;
    transform: translateY(0);
  }

  .fade-slide-enter,
  .fade-slide-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-20px);
    overflow: hidden;
  }

  // 确保内容区域有平滑的过渡
  .timelineContent {
    transition: all 0.5s ease-out;
    overflow: hidden;
  }
}
</style>
