
import moment from "moment";
import { blobToFile } from '@/utils/utils';
import { columns1, columns2 } from './scripts/data/column';
import * as echarts from "echarts";
import { ApiService } from '@/apis';
import { mapState } from 'vuex'
const apiService = new ApiService()

import ScoreForm from "./scripts/coms/serviceScore/index";

export default {
  name: 'service_rate', 
  components: {ScoreForm},
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
    }),},
  data() {
    const dict = this.$store.state.Common.dict
    return {
      loaded: false,
      tableHeight: 'auto',
      columns1, 
      columns2,
      dict,
      condition1: {},
      condition2: {},
      searchModel1: {}, 
      searchOptions1: [
        {
          label: '单据号',
          field: 'billNo',
          type: 'input',
          isDefault: true,
        },
        {
          label: '客户名称',
          field: 'customerName',
          type: 'input',
          isDefault:true,
        }, 
        {
          label: '单据申请日期',
          field: 'time1',
          type: 'datePicker',
          isDefault:true,
          fields: ['billBeginDate', 'billEndDate'],
        },
        {
          label: '单据评价时间',
          field: 'time2',
          type: 'datePicker',
          isDefault:true,
          fields: ['beginDate', 'endDate'],
        }
      ],
      sourceList1: {},
      tableData1: [],
      pagination1: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        
        showTotal: () => `共${this.pagination1.total}条`,
        
      }, // 一览表分页配置
      searchModel2: {}, 
      searchOptions2: [
        {
          label: '单据申请日期',
          field: 'time1',
          type: 'datePicker',
          isDefault: true,
          fields: ['orderAppBeginDate', 'orderAppEndDate'],
        },
        {
          label: '单据评价时间',
          field: 'time2',
          type: 'datePicker',
          isDefault:true,
          fields: ['orderEvaBeginTime', 'orderEvaEndTime'],
        }
      ],
      sourceList2: {},
      tableData2: [],
      pagination2: {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        
        showTotal: () => `共${this.pagination2.total}条`,
        
      }, // 一览表分页配置
      activeService:'0',
      chart:'',
      option: {
        title: { text:'分段报价情况对比' }, 
        grid: { top:'10%', left:'3%', right:'2%', bottom:'2%', containLabel:true },
        tooltip: { trigger:'axis' },
        xAxis: { type:'category', data:[] }, 
        yAxis: { type:'value' }, 
        series: [{ data:[], type:'bar' }]
      },
      scoreview:false,
      form:{}
    }
  },
  watch: {
    activeService(){
      this.activeService == '1'?
        setTimeout(()=>{
          this.chart = echarts.init(this.$refs.charts)
          this.chart.setOption(this.option)
          window.addEventListener('resize', ()=>{ this.chart.resize() })
        },300)
      :''
    }
  },
  created() {
    this.init()
  }, 
  activated(){
    this.getList1();
  },
  methods: { 
    activeClick(e){
      this.activeService = e.index
      e.index=='0'?this.getList1():this.getList2()
    },
    viewResult(obj){
      console.log(obj)
    },
    init(){
      this.getList1();
    },
    // 导出
    exportTable(){ 
      const loading = this.loading("导出中")
      apiService.exportServiceResult(this.condition1).then(res => { 
        blobToFile(res, `导出服务评论_${moment().format("YYYYMMDDHHmm")}.xlsx`);
      }).finally(() => {
        setTimeout(() => {
          loading.close();
        }, 2000)
      }) 
    },
    // 获取一览表
    getList1(){
      const loading = this.loading("加载中")
      console.log(this.condition1,this.pagination1.currentPage,this.pagination1.pageSize); 
      apiService.getServiceResult({...this.condition1,page:this.pagination1.currentPage,size:this.pagination1.pageSize}).then(res => {
        console.log(res);
        if(res.code == 200 && res.data){
          this.tableData1 = res.data.list ?? [];
          this.pagination1.total = res.data.total;
          this.pagination1.currentPage = res.data.pages; 
        } else {
          this.tableData1 = []
        }
      }).catch((err) => {
        this.$message.error("获取一览表异常");
      }).finally(() => {
        loading.close()
      });
    },
    getList2(){
      // const loading = this.loading("加载中")
      // console.log(this.condition2,this.pagination2.currentPage,this.pagination2.pageSize); 
      // apiSheet.sheetStatistic('dbScript_quotationServiceEvaluation',{...this.condition2,page:this.pagination2.currentPage,size:this.pagination2.pageSize}).then(res => {
      //   if(res.code == 200 && res.data){
      //     this.columns2 = res.data.columns[0]
      //     this.tableData2 = res.data.dataList[0] ?? []
      //     this.pagination2.total = res.data.bottom[0].page.total-0
      //     this.option.series = res.data.dataList[1]?.series[0]?.data.length?
      //                        [{ data:[...res.data.dataList[1].series[0].data], type:'bar' }]:
      //                        [{ data:[], type:'bar' }]
      //     this.option.xAxis.data = res.data.dataList[1]?.xAxis?.data || []
      //     !!this.chart?this.chart.setOption(this.option):''
      //   }
      // }).catch((err) => {
      //   this.$message.error("获取一览表异常");
      // }).finally(() => {
      //   loading.close()
      // });
    },
    // 一览表分页change事件
    pageChange1(e){
      const { pageSize, currentPage } = e;
      this.pagination1 = {
        ...this.pagination1,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.getList1();
    },
    onSearch1(value) {
      console.log(value);
      let beginTime = "";
      let endTime = "";
      if (!!value) {
        beginTime = value.beginTime
          ? moment(value.beginTime).format("YYYY-MM-DD HH:mm:ss")
          : "";
          endTime = value.endTime
          ? moment(value.endTime)
              .format("YYYY-MM-DD HH:mm:ss")
              .replace(/00:00:00/, "23:59:59")
          : "";
      } 
      this.pagination1.currentPage = 1;
      this.condition1 = { 
        ...value,
        // beginTime: beginTime,
        // endTime: endTime,  
      }; 
      this.getList1();
    },
    // 一览表重置
    onReset1() {
      this.condition1 = {};
      this.pagination1 = {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        
        showTotal: () => `共${this.pagination1.total}条`,
        
      }, 
      this.getList1(); 
    },
    // 一览表分页change事件
    pageChange2(e){
      const { pageSize, currentPage } = e;
      this.pagination2 = {
        ...this.pagination2,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.getList2();
    },
    onSearch2(value) {
      // console.log(value);
      if (!!value) {
        if (value.orderAppBeginDate&&value.orderAppEndDate) {
          this.condition2.orderApplicationDate=[value.orderAppBeginDate+' 00:00:00',value.orderAppEndDate+' 23:59:59']
        } else {
          delete this.condition2.orderApplicationDate
        }
        if (value.orderEvaBeginTime&&value.orderEvaEndTime) {
          this.condition2.orderEvaluationTime=[value.orderEvaBeginTime+' 00:00:00',value.orderEvaEndTime+' 23:59:59']
        } else {
          delete this.condition2.orderEvaluationTime
        }
      } 
      this.getList2();
    },
    // 一览表重置
    onReset2() {
      this.condition2 = {};
      this.pagination2 = {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        
        showTotal: () => `共${this.pagination2.total}条`,
        
      }, 
      this.getList2(); 
    },
    // 加载组件功能
    loading(text){
      const loading = this.$loading({
        lock: true,
        text,
        spinner: 'el-icon-loading',
      })
      return loading
    },
  }
}