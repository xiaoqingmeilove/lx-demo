<template>
  <app-page>
    <div class="home_page">
      <div class="entrance">
        <div class="entrance_head_title">核心指标 <span style="padding-left: 16px;">{{current}}</span></div>
        <div class="entrance_content" v-if="OtherIndicators && userInfo.userType != '03'">
        <div class="entrance_item">
          <div class="entrance_nav">供应商数量</div>
          <div class="entrance_desc">{{ OtherIndicators?.supplierCountNum?.number }}</div>
          <div class="entrance_num" style="color: #FD3D3D" v-if="OtherIndicators.supplierCountNum.percentage.includes('+')">
            <svg-icon icon-class="VectorUp"></svg-icon>{{ OtherIndicators.supplierCountNum.percentage.replace(/^\+/g, '') }}%</div>
          <div class="entrance_num" style="color: #12C624" v-else><svg-icon icon-class="VectorDown"></svg-icon>{{ OtherIndicators.supplierCountNum.percentage }}%</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">总需求金额(万元)</div>
          <div class="entrance_desc">{{ convertToTenThousand(OtherIndicators?.sumAmount?.number) }}</div>
          <div class="entrance_num" style="color: #FD3D3D" v-if="OtherIndicators.sumAmount.percentage.includes('+')">
            <svg-icon icon-class="VectorUp"></svg-icon>{{ OtherIndicators.sumAmount.percentage.replace(/^\+/g, '') }}%</div>
          <div class="entrance_num" style="color: #12C624" v-else><svg-icon icon-class="VectorDown"></svg-icon>{{ OtherIndicators.sumAmount.percentage }}%</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">总采购金额(万元)</div>
          <div class="entrance_desc">{{ convertToTenThousand(OtherIndicators?.sumAmountYWC?.number) }}</div>
          <div class="entrance_num" style="color: #FD3D3D" v-if="OtherIndicators.sumAmountYWC.percentage.includes('+')">
            <svg-icon icon-class="VectorUp"></svg-icon>{{ OtherIndicators.sumAmountYWC.percentage.replace(/^\+/g, '') }}%</div>
          <div class="entrance_num" style="color: #12C624" v-else><svg-icon icon-class="VectorDown"></svg-icon>{{ OtherIndicators.sumAmountYWC.percentage }}%</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">采购来源(笔)</div>
          <div class="entrance_desc">{{ OtherIndicators?.stacking?.number }}</div>
          <div class="entrance_num" style="color: #FD3D3D" v-if="OtherIndicators.stacking.percentage.includes('+')">
            <svg-icon icon-class="VectorUp"></svg-icon>{{ OtherIndicators.stacking.percentage.replace(/^\+/g, '') }}%</div>
          <div class="entrance_num" style="color: #12C624" v-else><svg-icon icon-class="VectorDown"></svg-icon>{{ OtherIndicators.stacking.percentage }}%</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">完成采购来源(笔)</div>
          <div class="entrance_desc">{{ OtherIndicators?.stackingYWC?.number }}</div>
          <div class="entrance_num" style="color: #FD3D3D" v-if="OtherIndicators.stackingYWC.percentage.includes('+')">
            <svg-icon icon-class="VectorUp"></svg-icon>{{ OtherIndicators.stackingYWC.percentage.replace(/^\+/g, '') }}%</div>
          <div class="entrance_num" style="color: #12C624" v-else><svg-icon icon-class="VectorDown"></svg-icon>{{ OtherIndicators.stackingYWC.percentage }}%</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">已签合同(笔)</div>
          <div class="entrance_desc">{{ OtherIndicators?.signedContract?.number }}</div>
          <div class="entrance_num" style="color: #FD3D3D" v-if="OtherIndicators.signedContract.percentage.includes('+')">
            <svg-icon icon-class="VectorUp"></svg-icon>{{ OtherIndicators.signedContract.percentage.replace(/^\+/g, '') }}%</div>
          <div class="entrance_num" style="color: #12C624" v-else><svg-icon icon-class="VectorDown"></svg-icon>{{ OtherIndicators.signedContract.percentage }}%</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">已下单(笔)</div>
          <div class="entrance_desc">{{ OtherIndicators?.orderPlaced?.number }}</div>
          <div class="entrance_num" style="color: #FD3D3D" v-if="OtherIndicators.orderPlaced.percentage.includes('+')">
            <svg-icon icon-class="VectorUp"></svg-icon>{{ OtherIndicators.orderPlaced.percentage.replace(/^\+/g, '') }}%</div>
          <div class="entrance_num" style="color: #12C624" v-else><svg-icon icon-class="VectorDown"></svg-icon>{{ OtherIndicators.orderPlaced.percentage }}%</div>
        </div>
      </div>
      <div class="entrance_content" v-if="CoreIndicators && userInfo.userType == '03'">
        <div class="entrance_item">
          <div class="entrance_nav">公开询价</div>
          <div class="entrance_desc">{{CoreIndicators.enquiryApplyNum}}</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">我收到的询价</div>
          <div class="entrance_desc">{{CoreIndicators.enquiryApplyAttendNum}}</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">我收到的竞价</div>
          <div class="entrance_desc">{{CoreIndicators.biddingSignUpNum}}</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">我提交的报价</div>
          <div class="entrance_desc">{{CoreIndicators.offerNum}}</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">我参与的竞价</div>
          <div class="entrance_desc">{{CoreIndicators.biddingPricingNum}}</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">已签合同(笔)</div>
          <div class="entrance_desc">0</div>
        </div>
        <div class="entrance_item">
          <div class="entrance_nav">已下单(笔)</div>
          <div class="entrance_desc">0</div>
        </div>
      </div>
      </div>
      <div class="data_box" v-if="userInfo.userType != '03'">
        <div class="data_box_left">
          <div class="entrance_title">
            <div>项目看板</div>
            <!-- <i class="el-icon-refresh"></i> -->
          </div>
          <div class="board" v-if="ProjectDashboard">
            <div class="stage-container">
              <div class="stage-item">
                <div class="stage-item-header">
                  <svg-icon icon-class="xqjd" /><span class="stage-name">需求阶段</span>
                </div>
                <div class="stage-item-body-total">
                  共计:
                  <span class="stage-item-body-total-num">{{ProjectDashboard.purchProject.purchProjectNum}}</span>
                  个项目
                </div>
                <div class="stage-item-body">
                  <div class="stage-item-body-list" v-if="ProjectDashboard.purchProject.purchProjectData.length > 0">
                    <div class="stage-item-body-list-item" v-for="(item,index) of ProjectDashboard.purchProject.purchProjectData" :key="index">
                      <div class="stage-item-body-list-item-name ellipsis">
                        {{item.projectName}}
                      </div>
                      <div class="stage-item-body-list-item-serial ellipsis">
                        编号：{{item.billNo}}
                      </div>
                      <div class="stage-item-body-list-item-submitor ellipsis">
                        负责人：{{item.createUserName}}
                      </div>
                    </div>
                  </div>
                  <div class="stage-item-body-noneImg" v-else>
                      <img class="noneImg" :src="require(`/static/images/proc/none.png`)" alt="img">
                  </div>
                </div>
              </div>
              <div class="stage-item">
                <div class="stage-item-header">
                  <svg-icon icon-class="xjjd" /><span class="stage-name">询价阶段</span>
                </div>
                <div class="stage-item-body-total">
                  共计:
                  <span class="stage-item-body-total-num">{{ProjectDashboard.enquiryApplyMap.enquiryApplyNum}}</span>
                  个项目
                </div>
                <div class="stage-item-body">
                  <div class="stage-item-body-list" v-if="ProjectDashboard.enquiryApplyMap.enquiryApplyData.length > 0">
                    <div class="stage-item-body-list-item" v-for="(item,index) of ProjectDashboard.enquiryApplyMap.enquiryApplyData" :key="index">
                      <div class="stage-item-body-list-item-name ellipsis">
                        {{item.projectName}}
                      </div>
                      <div class="stage-item-body-list-item-serial ellipsis">
                        编号：{{item.billNo}}
                      </div>
                      <div class="stage-item-body-list-item-submitor ellipsis">
                        负责人：{{item.createUserName}}
                      </div>
                    </div>
                  </div>
                  <div class="stage-item-body-noneImg" v-else>
                      <img class="noneImg" :src="require(`/static/images/proc/none.png`)" alt="img">
                  </div>
                </div>
              </div>
              <div class="stage-item">
                <div class="stage-item-header">
                  <svg-icon icon-class="jjjd" /><span class="stage-name">竟价阶段</span>
                </div>
                <div class="stage-item-body-total">
                  共计:
                  <span class="stage-item-body-total-num">{{ProjectDashboard.biddingApply.biddingApplyNum}}</span>
                  个项目
                </div>
                <div class="stage-item-body">
                  
                  <div class="stage-item-body-list" v-if="ProjectDashboard.biddingApply.biddingApplyData.length > 0">
                    <div class="stage-item-body-list-item" v-for="(item,index) of ProjectDashboard.biddingApply.biddingApplyData" :key="index">
                      <div class="stage-item-body-list-item-name ellipsis">
                        {{item.projectName}}
                      </div>
                      <div class="stage-item-body-list-item-serial ellipsis">
                        编号：{{item.billNo}}
                      </div>
                      <div class="stage-item-body-list-item-submitor ellipsis">
                        负责人：{{item.createUserName}}
                      </div>
                    </div>
                  </div>
                  <div class="stage-item-body-noneImg" v-else>
                      <img class="noneImg" :src="require(`/static/images/proc/none.png`)" alt="img">
                  </div>
                </div>
              </div>
              <div class="stage-item">
                <div class="stage-item-header">
                  <svg-icon icon-class="zbjd" /><span class="stage-name">招标阶段</span>
                </div>
                <div class="stage-item-body-total">
                  共计:
                  <span class="stage-item-body-total-num">{{ProjectDashboard.inviteTenders.inviteTendersNum}}</span>
                  个项目
                </div>
                <div class="stage-item-body">
                  <div class="stage-item-body-list" v-if="ProjectDashboard.inviteTenders.inviteTendersData.length > 0">
                    <div class="stage-item-body-list-item" v-for="(item,index) of ProjectDashboard.inviteTenders.inviteTendersData" :key="index">
                      <div class="stage-item-body-list-item-name ellipsis">
                        {{item.projectName}}
                      </div>
                      <div class="stage-item-body-list-item-serial ellipsis">
                        编号：{{item.billNo}}
                      </div>
                      <div class="stage-item-body-list-item-submitor ellipsis">
                        负责人：{{item.createUserName}}
                      </div>
                    </div>
                  </div>
                  <div class="stage-item-body-noneImg" v-else>
                      <img class="noneImg" :src="require(`/static/images/proc/none.png`)" alt="img">
                  </div>
                </div>
              </div>
              <div class="stage-item">
                <div class="stage-item-header">
                  <svg-icon icon-class="psjd" /><span class="stage-name">评审阶段</span>
                </div>
                <div class="stage-item-body-total">
                  共计:
                  <span class="stage-item-body-total-num">{{ProjectDashboard.enquiryResult.enquiryResultNum}}</span>
                  个项目
                </div>
                <div class="stage-item-body">
                  <div class="stage-item-body-list" v-if="ProjectDashboard.enquiryResult.enquiryResultData.length > 0">
                    <div class="stage-item-body-list-item" v-for="(item,index) of ProjectDashboard.enquiryResult.enquiryResultData" :key="index">
                      <div class="stage-item-body-list-item-name ellipsis">
                        {{item.projectName}}
                      </div>
                      <div class="stage-item-body-list-item-serial ellipsis">
                        编号：{{item.billNo}}
                      </div>
                      <div class="stage-item-body-list-item-submitor ellipsis">
                        负责人：{{item.createUserName}}
                      </div>
                    </div>
                  </div>
                  <div class="stage-item-body-noneImg" v-else>
                      <img class="noneImg" :src="require(`/static/images/proc/none.png`)" alt="img">
                  </div>
                </div>
              </div>
              <div class="stage-item">
                <div class="stage-item-header">
                  <svg-icon icon-class="hjjd" /><span class="stage-name">核价阶段</span>
                </div>
                <div class="stage-item-body-total">
                  共计:
                  <span class="stage-item-body-total-num">{{ProjectDashboard.biddingPricing.biddingPricingNum}}</span>
                  个项目
                </div>
                <div class="stage-item-body">
                  <div class="stage-item-body-list" v-if="ProjectDashboard.biddingPricing.biddingPricingData.length > 0">
                    <div class="stage-item-body-list-item" v-for="(item,index) of ProjectDashboard.biddingPricing.biddingPricingData" :key="index">
                      <div class="stage-item-body-list-item-name ellipsis">
                        {{item.projectName}}
                      </div>
                      <div class="stage-item-body-list-item-serial ellipsis">
                        编号：{{item.billNo}}
                      </div>
                      <div class="stage-item-body-list-item-submitor ellipsis">
                        负责人：{{item.createUserName}}
                      </div>
                    </div>
                  </div>
                  <div class="stage-item-body-noneImg" v-else>
                      <img class="noneImg" :src="require(`/static/images/proc/none.png`)" alt="img">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="data_box_right">
          <div class="entrance_title">
            <div>待办</div>
          </div>
          <div class="data_box_todo">
            <div class="todo_item" v-for="(item,index) of msgCard" :key="index" @click="moduleDetail(item)">
              <div class="todo_case">{{item.id}}</div>
              <div class="todo_type">【{{item.module}}】</div>
              <div class="todo_title">{{item.title}}</div>
              <div class="todo_time">
                <div><i class="el-icon-date"></i>&nbsp;{{item.appTime}}</div>&nbsp;&nbsp;
                <div><i class="el-icon-user"></i>&nbsp;{{item.senderName}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="conInfo">
        <div class="conInfo_left">
          <div class="card_title">
            <div>中标公告</div>
          </div>
          <div class="Notice" v-if="noticeList && noticeList.length">
            <div class="Notice_item" v-for="(item,index) of noticeList" :key="index" @dblclick="noticeDbClick(item)">
              <div class="Notice_item_left">{{item.title}}</div>
              <div class="Notice_item_right">{{item.releaseTime}}</div>
            </div>
          </div>
          <div class="no_default" v-else><img :src="require(`/static/images/proc/none.png`)" alt="img"></div>
        </div>
        <div class="conInfo_right">
          <div class="conInfo_right_card">
            <div class="card_title">
              <div>快捷入口</div>
            </div>
            <div class="conInfo_right_card_context">
              <div class="no_default"><img class="noneImg" :src="require(`/static/images/proc/none.png`)" alt="img"></div>
            </div>
          </div>
          <div class="conInfo_right_card">
            <div class="card_title">
              <div>最近访问</div>
            </div>
            <div class="conInfo_right_card_context">
              <div class="no_default"><img class="noneImg" :src="require(`/static/images/proc/none.png`)" alt="img"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="purchase" v-if="userInfo.userType == '03'">
          <div class="entrance_title">
            <div>最新采购信息</div>
            <div class="zbjl">中标记录<span>2</span></div>
          </div>
          <div class="worktable">
            <div class="table">
              <vxe-grid
                :data="ApplyInfo"
                :id="`tb_home_list_${userInfo.userId}`"
                :custom-config="{ storage: true }"
                :columns="columns"
                height="auto"
                ref="listtable"
              >
              <template #rowNum="{ row, rowIndex }">
                <span>{{ rowIndex + 1 }}</span>
              </template>
              <template #doing="{ row }">
                <page-button type="text" @click="get(row)">操作</page-button>
              </template>
        </vxe-grid>
            </div>
            <div class="pagers">
              <vxe-pager
                :current-page.sync="pagination.currentPage"
                :page-size.sync="pagination.pageSize"
                :total="pagination.total"
                @page-change="pageChange"
              ></vxe-pager>
            </div>
          </div>
      </div>
      
      <vxe-modal
        show-zoom
        resize
        v-model="noticeVisible"
        width="50%"
        height="80%"
        title="公告详情"
        :maskClosable="false"
        destroy-on-close
      >
        <div style="height: 100%; width: 100%" v-html="noticeContent"></div>
      </vxe-modal>
      <div class="introduction" v-if="userInfo.userType != '03'">
        <div class="introduction_right">
            <div class="entrance_title">
              <div>采购订单趋势</div>
              <div class="time_tab">
                <div class="time_item" :class="{'active':fox==1}" @click="getEchars(1)">最近一周</div>
                <div class="time_item" :class="{'active':fox==2}" @click="getEchars(2)">最近30天</div>
                <div class="time_item" :class="{'active':fox==3}" @click="getEchars(3)">最近一年</div>
              </div>
            </div>
            <div ref="charts1" class="charts"></div>
        </div>
      </div>
    </div>
  </app-page>
</template>

<script>
  import { mapState } from "vuex";
  import { ApiBasic,ApiMessage,ApiPublic } from "@/apis";
  import { columns } from "./scripts/column";
  import * as echarts from "echarts";
  const apiBasic = new ApiBasic();
  const apiMessage = new ApiMessage();

  export default {
    name: "home",
    components: {},
    computed: {
      ...mapState({
        userInfo: (state) => state.User.userInfo ?? {},
        businessCode: (state) => state.Common.businessCode,
      }),
      convertToTenThousand(){
        return (value = 0) =>{
          return (value / 10000).toFixed(2);
        }
      }
    },
    data() {
      const dict = this.$store.state.Common.dict;
      return {
        fox:3,
        current:"",
        noticeVisible:false,
        noticeContent:'',
        xOption1: {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          grid: {
            top: '12%',    // 上边距
            left: '2%',   // 左边距
            right: '2%',  // 右边距
            bottom: '12%', // 下边距
            containLabel: true // 如果标签(label)过长超过了grid区域，是否保持全部显示
        },
          toolbox: {
            feature: {
              dataView: { show: true, readOnly: false },
              magicType: { show: true, type: ['line', 'bar'] },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          legend: {
            data: ['订单额', '订单数']
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisPointer: {
                type: 'shadow'
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '订单额',
              axisLabel: {
                formatter: '{value} 元'
              }
            },
            {
              type: 'value',
              name: '订单数（笔）',
              axisLabel: {
                formatter: '{value} 笔'
              }
            }
          ],
          series: [
            {
              name: '订单额（元）',
              type: 'bar',
              tooltip: {
                valueFormatter: function (value) {
                  return value + ' 元';
                }
              },
              barWidth: '40',
              itemStyle: {
                  color: '#6A8DFF' // 设置柱子颜色为红色
              },
              data: [
                
              ]
            },
            {
              name: '订单数（笔）',
              type: 'line',
              yAxisIndex: 1,
              tooltip: {
                valueFormatter: function (value) {
                  return value + ' 笔';
                }
              },
              barWidth: '40',
              itemStyle: {
                  normal: {
                      color: '#FF6F59', // 点的颜色
                      lineStyle: {
                          color: '#FF6F59' // 线的颜色
                      }
                  }
              },
              data: []
            }
          ]
        },
        CoreIndicators:'',    // 供应商核心指标
        OtherIndicators:'',    // 普通户核心指标
        ProjectDashboard:'',   // 项目看板
        ApplyInfo: [],
        messageData:[],
        msgCard:[],
        noticeList:[],
        getFrom:{
          beginTime:'',
          endTime:''
        },
        columns, //一览表表头信息,
        pagination: {
          currentPage: 1,
          pageSize: localStorage.getItem("pageSize")
            ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20
            : 20,
          total: 0,
          showTotal: () => `共${this.pagination.total}条`,
        }, // 一览表分页配置
      };
    },
    mounted() {
      if(this.$refs.charts1) this.chart1 = echarts.init(this.$refs.charts1);
      this.getEchars(3)
      this.getData()
      this.getDatas()
      this.getNoticeList()
      this.getCurrentDate();
    },
    methods: {
      get(row){

      },
      toPath(url){
        this.$router.push({
          path: url,
        });
      },
      //userType = ‘03’:供应商
      initCharts() {
          // 采购趋势
        console.log(this.getFrom)
        apiBasic
          .getPurchasingApi(this.getFrom).then((res) => {
            if (res.code == 200 && res.data) {
              this.xOption1 = {
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'cross',
                    crossStyle: {
                      color: '#999'
                    }
                  }
                },
                grid: {
                  top: '12%',    // 上边距
                  left: '2%',   // 左边距
                  right: '2%',  // 右边距
                  bottom: '12%', // 下边距
                  containLabel: true // 如果标签(label)过长超过了grid区域，是否保持全部显示
              },
                legend: {
                  data: ['订单额', '订单数']
                },
                xAxis: [
                  {
                    type: 'category',
                    data: res.data?.map(function (item) {
                        return item.time;
                    }),
                    axisPointer: {
                      type: 'shadow'
                    }
                  }
                ],
                yAxis: [
                  {
                    type: 'value',
                    name: '订单额（元）',
                    axisLabel: {
                      formatter: '{value} 元'
                    }
                  },
                  {
                    type: 'value',
                    name: '订单数（笔）',
                    axisLabel: {
                      formatter: '{value} 笔'
                    }
                  }
                ],
                series: [
                  {
                    name: '订单额',
                    type: 'bar',
                    tooltip: {
                      valueFormatter: function (value) {
                        return value + ' 元';
                      }
                    },
                    barWidth: '40',
                    itemStyle: {
                        color: '#6A8DFF' // 设置柱子颜色为红色
                    },
                    data: res.data?.map(function (item) {
                        return item.amount;
                    }),
                  },
                  {
                    name: '订单数',
                    type: 'line',
                    yAxisIndex: 1,
                    tooltip: {
                      valueFormatter: function (value) {
                        return value + ' 笔';
                      }
                    },
                    barWidth: '40',
                    itemStyle: {
                        normal: {
                            color: '#FF6F59', // 点的颜色
                            lineStyle: {
                                color: '#FF6F59' // 线的颜色
                            }
                        }
                    },
                    data: res.data?.map(function (item) {
                        return item.num;
                    }),
                  }
                ]
              }
              console.log(this.xOption1)        
              this.xOption1 && this.chart1 && this.chart1.setOption(this.xOption1); 
            } else {
              this.$message.error(res.message);
            }
          })
          .catch((err) => {
            this.$message.error("获取数据异常");
          })
      },
      getEchars(index){
        this.fox = index
        let days = ''
				if(index == 1){days = '7'}
				else if(index == 2){days = '31'}
				else if(index == 3){days = '365'}
				const now = new Date();
				const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
				const end = new Date(now);
				this.getFrom.beginTime = `${start.toISOString().split('T')[0]} 00:00:00`
				this.getFrom.endTime = `${end.toISOString().split('T')[0]} 23:59:59`
        this.initCharts()
      },
      
      // 中标公告
      getNoticeList() {
        ApiPublic.getNoticeList().then((res) => {
          if (res.code == 200) {
            this.noticeList = [...res.data];
          } else {
            this.$message.error(res?.message ?? "中标公告获取失败");
          }
        });
      },
      noticeDbClick(item){
        ApiPublic.getNoticeDetail({id:item.id}).then((res) => {
          if (res.code == 200) {
            this.noticeVisible = true;
            this.noticeContent = res.data.content;
          } else {
            this.$message.error(res?.message ?? "中标公告获取失败");
          }
        });
      },
      getDatas(){
          let data = {
            noticeType: 10,
            page: 1,
            size: 20,
          };
          apiMessage
            .getInnerMessage(data)
            .then((res) => {
              if (res.code === 200) {
                this.messageData = res.data.records;
                this.msgCard = res.data.records.map((i) => {
                  return Object.assign(
                    JSON.parse(
                      i.content.replace(/\r\n/g, "\\n").replace(/\n/g, "\\n")
                    ),
                    {
                      readflag: i.readFlag,
                      module: i.moduleName + (i.funcEvent ? "-" + i.funcEvent : ""),
                      showall: false,
                      id: i.id,
                      createTime: i.createTime,
                      senderCode:i.senderCode,
                      senderName:i.senderName
                    }
                  );
                });
                console.log(this.messageData)
                console.log(this.msgCard)
              }else{
                this.$message.error("获取数据异常");
              }
            })
      },
      
      moduleDetail(obj) {
        if (/calendar/.test(obj.url)) {
          if (/calendar/.test(location.hash)) {

          } else {
            this.$router.replace({
              name: "myTodo_calendar",
              params: { id: obj.url.replace(/^.*id=/, "") },
            });
          }
        } else {
          this.$router.push({ path: obj.url });
        }
      },
      getData(){
        // 平台用户核心指标
        apiBasic
          .getindicatorsInfoApi().then((res) => {
            if (res.code == 200 && res.data) {
              this.OtherIndicators = res.data
            } else {
              this.$message.error(res.message);
            }
          })
          .catch((err) => {
            this.$message.error("获取数据异常");
          })
          
        // 供应商核心指标
        apiBasic
          .getcoreIndicatorsInfoApi().then((res) => {
            if (res.code == 200 && res.data) {
              this.CoreIndicators = res.data
            } else {
              this.$message.error(res.message);
            }
          })
          .catch((err) => {
            this.$message.error("获取数据异常");
          })
          // 最新采购信息
        apiBasic
          .getenquiryApplyInfoApi().then((res) => {
            if (res.code == 200 && res.data) {
              this.ApplyInfo = res.data
            } else {
              this.$message.error(res.message);
            }
          })
          .catch((err) => {
            this.$message.error("获取数据异常");
          })

          // 项目看板
        apiBasic
          .getDashboardInfoApi().then((res) => {
            if (res.code == 200 && res.data) {
              this.ProjectDashboard = res.data
            } else {
              this.$message.error(res.message);
            }
          })
          .catch((err) => {
            this.$message.error("获取数据异常");
          })
      },
      // 一览表分页change事件
      pageChange(e) {
        const { pageSize, currentPage } = e;
        /*let pageSizeObj = localStorage.getItem("pageSize")
              ? JSON.parse(localStorage.getItem("pageSize"))
              : {};
            pageSizeObj[this.$route.name] = pageSize;
            localStorage.setItem("pageSize", JSON.stringify(pageSizeObj));
            this.pagination = {
              ...this.pagination,
              pageSize: pageSize,
              currentPage: currentPage,
            };
            this.getList();*/
      },
      getCurrentDate() {
        const now = new Date();
        const optionsDate = { year: 'numeric', month: 'numeric', day: 'numeric' };  
        const optionsWeekday = { weekday: 'long' };
        const formattedDate = new Intl.DateTimeFormat('zh-CN', optionsDate).format(now);  
        const formattedWeekday = new Intl.DateTimeFormat('zh-CN', optionsWeekday).format(now);  
        this.current = `${formattedDate}  ${formattedWeekday}`;
      },
    },
  };
</script>
<style scoped lang="less">
  @import url("./index_scoped.less");
</style>
