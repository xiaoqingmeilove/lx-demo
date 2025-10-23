
import moment from "moment";
import { blobToFile } from '@/utils/utils';
import { columns } from './scripts/data/column';
import { ApiService } from '@/apis';
const apiService = new ApiService()
import { ApiSystem } from '@/apis';
const apiSystem = new ApiSystem()
import ServiceForm from './form'
import { mapState } from 'vuex'

export default {
  name: 'service_table', 
  components: { ServiceForm },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      loaded: false,
      tableHeight: 'auto',
      columns, 
      dict,
      sform:false,
      create:true,
      condition: {},
      searchModel: {}, 
      searchOptions: [
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
          label: '受理日期',
          field: 'acceptanceDate',
          type: 'datePicker', 
          fields: ['beginAcceptTime', 'endAcceptTime'],
          isDefault: true,
        },
        {
          label: '单据状态',
          field: 'billState',
          type: 'selectmulti',
          source: "statelist",
          output: 'string',
          isDefault: true,
        },
      ],
      sourceList: {
        statelist: [
          { label:'待受理', value:0 }, { label:'已受理', value:1 },
          { label:'拒受理', value:2 }, { label:'待服务', value:3 },
          { label:'待回访', value:4 }, { label:'已回访', value:5 },
          { label:'已完成', value:6 }
        ]
      },
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20 : 20,
        total: 0,
        
        showTotal: () => `共${this.pagination.total}条`,
        
      }, // 一览表分页配置
      billStateList: [],  // 单据状态
      problemTypeList: [],// 问题类型
      priorityList: [],    //优先级
      sourceBillTypeList: [], // 单据类型
      infoSourcesList: [],  // 信息来源
      processingMethodList: [],   // 处理方式
      lossLevelList: [],    // 损失等级
    }
  },
  created() {
    this.init()
  }, 
  activated(){
    this.getList();
  },
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
    }),
    getProblemTypeName() {
      return id => {
        let obj = this.problemTypeList.find(p => p.dictValue == id)
        return obj ? obj.dictLabel : ''
      }
    },
    getPriorityName() {
      return id => {
        let obj = this.priorityList.find(p => p.dictValue == id)
        return obj ? obj.dictLabel : "";
      }
    },
    getBillStateName() {
      return state => {
        let obj = this.billStateList.find(p => p.dictValue == state)
        return obj ? obj.dictLabel : ""
      }
    },
    getProcessingMethodName() {
      return id => {
        let obj = this.processingMethodList.find(p => p.dictValue == id)
        return obj ? obj.dictLabel : '';
      }
    },
    getLossLevelName() {
      return id => {
        let obj = this.lossLevelList.find(p => p.dictValue == id)
        return obj ? obj.dictLabel : '';
      }
    }
  },
  methods: { 
    getDictData() {
      apiSystem.getDictItem(4927286877366).then(res=>{ this.billStateList = res.data })
      apiSystem.getDictItem(4927286877361).then(res=>{ this.problemTypeList = res.data })
      apiSystem.getDictItem(4927286877362).then(res=>{ this.priorityList = res.data })
      apiSystem.getDictItem(4927286877360).then(res=>{ this.sourceBillTypeList = res.data })
      apiSystem.getDictItem(4927286877363).then(res=>{ this.infoSourcesList = res.data })
      apiSystem.getDictItem(4927286877367).then(res=>{ this.processingMethodList = res.data })
      apiSystem.getDictItem(4927286877368).then(res=>{ this.lossLevelList = res.data })
    },
    init(){
      this.getDictData()
      this.getList();
    },
    // 导出
    exprot(){ 

    },
      // 获取一览表
    getList(){
      const loading = this.loading("加载中")
      console.log(this.condition,this.pagination.currentPage,this.pagination.pageSize); 
      apiService.postSalesService(this.condition,this.pagination.currentPage,this.pagination.pageSize).then(res => {
        if(res.code == 200 && res.data){
          this.tableData = res.data.records ?? [];
          this.pagination.total = res.data.total;
          this.pagination.currentPage = res.data.current; 
        }
      }).catch((err) => {
        this.$message.error("获取一览表异常");
      }).finally(() => {
        loading.close()
      });
    },
    // 一览表双击事件
    onCellDbClick({ row }){ 
      this.$router.push({ path: `/service/serviceTable-detail/detail/${row.id}` })
    },
    // 一览表分页change事件
    pageChange(e){
      const { pageSize, currentPage } = e;
      let pageSizeObj = localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize")) : {};
      pageSizeObj[this.$route.name] = pageSize;
      localStorage.setItem("pageSize", JSON.stringify(pageSizeObj));
      this.pagination = {
        ...this.pagination,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.getList();
    },
    onSearch(value) {
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
      this.pagination.currentPage = 1;
      this.condition = { 
        ...value,
        beginTime: beginTime,
        endTime: endTime,  
      }; 
      this.getList();
    },
    // 一览表重置
    onReset() {
      this.condition = {};
      this.pagination= {
        currentPage: 1,
        pageSize: 20,
        total: 0,
        
        showTotal: () => `共${this.pagination.total}条`,
        
      }, 
      this.getList(); 
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
