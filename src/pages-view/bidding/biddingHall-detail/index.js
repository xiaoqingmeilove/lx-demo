import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { columns, columns1, columns2 } from "./scripts/columns";
import { descItems, descItems1, descItems2 } from "./scripts/descItems";
import { findMenuByCode } from "@/utils/menu";
import { ApiBid, ApiQuotation } from "@/apis";
import { previewFile } from '@/utils/utils';
import { handleStorageColumns } from "@/utils/vxe-table";
import VueEasyLightbox from "vue-easy-lightbox";
import bidPrice from "./scripts/com/bidPrice.vue";
import VXETable from "vxe-table";
import * as echarts from "echarts";

const apiBid = new ApiBid();
const apiQuotation = new ApiQuotation()
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
export default {
  name: "bidding_biddingHall_detail",
  components: { VueEasyLightbox, bidPrice },
  async beforeRouteLeave(to, from, next) {
    if (to.name == "login") {
      next();
      return;
    }
    if (this.editState) {
      let state = await this.closePage();
      state ? next() : next(false);
    } else {
      next();
    }
  },
  async beforeRouteUpdate(to, from, next) {
    if (to.name == "login") {
      next();
      return;
    }
    if (this.editState) {
      let state = await this.closePage();
      state ? next() : next(false);
    } else {
      next();
    }
  },
  async beforePageLeave(tab, type) {
    let state = null;
    if (this.editState && !["unload", "leave"].includes(type)) {
      state = await this.closePage();
    }
    return new Promise((resolve, reject) => {
      if (["unload", "leave"].includes(type)) {
        resolve();
      } else {
        if (this.editState) {
          state ? resolve() : reject();
        } else {
          resolve();
        }
      }
    });
  },
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    showBtn() {
      return (name) => {
        let find = this.allBtnControlList?.find((x) => x.btnCode == name);
        return find ?? false;
      };
    },
    showfooter(){
      return (column='columns') => this[column].some(item => item.params && item.params.addFooter);
    },
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      dict,
      menuCode: "bidding_biddingHall",
      activeName: 'jbxx',
      editState: false,
      backForm: {},
      moment,
      descItems: descItems,
      descItems1: descItems1,
      columns: [],
      tableColumns: [],
      defaultColumns: [],
      outPriceColumns: [],
      outPriceTableColumns: [],
      outPriceDefaultColumns: [],
      id: null,
      form: {},
      formDataShow: {
        cpxx: true,
        fjcz: true,
        jbxx: true,
        cjlb: true
      },
      rules: {},
      descSourceList: {
        fileList: [],
      },
      visible: {
        outVisible: false,
      },
      outReadOnly: false,
      bidPriceReadOnly: false,
      outForm: {},
      allBtnControlList: [],
      countForm: {
        label: '距离结束时间',
        beginValue: null,
        endValue: null,
        outPriceBtnDis: false,
        offerTime: null,
      },
      sourceList: {
        projectStatus: (dict["bidding_project_status"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue, color: d.remark }
        }),
      },
      projectStatusType:['', 'danger' ,'success', 'info', 'warning'],
      chart: null,
      options: {
        color: ['#4277FF'],
        tooltip: {
          trigger: 'axis',
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
        series: [{
          type: 'line',
          data: [],
          symbol: "none",
          areaStyle:{
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "#4277FF",
                },
                {
                  offset: 1,
                  color: "#FFFFFF",
                },
              ]),
            }
        }]
      },
    };
  },
  created() {
    const { params } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
    }
    this.setColumn();
  },
  mounted() {
    this.initCharts()
    window.addEventListener("resize", () => {
      this.chart.resize();
    });   
  },
  beforeDestroy() {
    window.removeEventListener("resize", () => {
      this.chart.resize();
    });
  },
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '竞价大厅'}详情`;
    if (this.id) {
      this.init();
    }else{
      this.editState = true;
      this.showBtnConfig();
    }
  },
  methods: {
    formatNumber(value, digits) {
      const newValue = XEUtils.toFixed(value, digits);
      return newValue.replace(/^-?\d+/g, (m) => m.replace(/(?=(?!\b)(\d{3})+$)/g, ","))
    },
    calcSum(data, code) {
      if (data.length) {
        return data.reduce((total, cur) => {
          let n = cur[code] || 0;
          n = Number(n);
          return total + n;
        }, 0);
      }
    },
    footerMethod({columns, data}) {
      const footerData = [
        columns.map((column, _columnIndex) => {
          if (_columnIndex == 0) {
            return "合计";
          }
          if (column.params && column.params.addFooter) {
            return column.params.commafy ? this.formatNumber(this.calcSum(data, column.property), column.params.displayDigits) : XEUtils.toFixed(this.calcSum(data, column.property), column.params.displayDigits);
          }
          return null;
        }),
      ];
      return footerData;
    },
    openOut(row){
      if(!row.id) return;
      const loading = this.loading('请求中');
      apiBid.getBiddingSignHallDetails(row.id).then((res) => {
        if (res.code === 200) {
          this.outForm = {
            detailList: res.data?.records ?? [],
            signUpOffer: {...row}
          };
          this.visible.outVisible = true;
          this.outReadOnly = true;
        } else {
          this.$message.error(res.message ?? "获取失败");
        }
      }).catch((err) => {
        this.$message.error(err.message ?? "获取失败");
      }).finally(()=>{
        loading.close();
      })

    },
    async closePage() {
      const res = await VXETable.modal.confirm({
        title: "提示",
        content: "存在修改状态页面，请确认是否保存！",
        mask: true,
        confirmButtonText: "保存",
      });
      if (res === "confirm") {}
      if (res === "cancel") {
        if (!this.id) {
          this.$tabs.close();
        } else {
          this.cancel();
        }
        return true;
      }
    },
    cancel() {
      this.editState = false;
      this.form = { ...this.backForm };
    },
    showBtnConfig() {
      apiQuotation.postDetailBtnList(this.menuCode, {param: { id: this.id ?? null }}).then((res) => {
        if (res.code === 200) {
          this.allBtnControlList = res.data ?? [];
        } else {
          this.$message.error(res.message);
        }
      });
    },
    onInputBlurFormChange(e) {
      if (e && e.item && e.item.fieldName) {
        const find = (this.descSourceList[e.item.source]||[]).find(x=>x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
    },
    viewFile(url){
      previewFile(url)
    },
    selectChange(value, objfield, list, field) {
      const val = (list || []).find(d => d.value == value)?.label ?? ''
      this.$set(this[objfield], field, val);
    },
    onUploadSuccess(e, field) {
      const fileList = XEUtils.clone(this[field].fileList || [], true);
      this.$set(this[field], "fileList", fileList.concat([{ ...e[0] }]));
    },
    getDetail() {
      const loading = this.loading('请求中');
      apiBid.getBiddingSignHallDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.form = res.data || {};
          this.checkCountTime();
          this.updateCharts()
        } else {
          this.$message.error(res.message ?? "获取失败");
        }
      }).catch((err) => {
        this.$message.error(err.message ?? "获取失败");
      }).finally(() => {
        loading.close();
      });
    },
    updateBidPriceReadOnly() {
      // beginTime:竞价开始时间 endTime:竞价结束时间 offerTime:报价截止时间
      const { beginTime, endTime, offerTime } = this.form;
      let flag = false
      // 当前时间在竞价时间段内
      if (beginTime && endTime) {
        const now = new Date().getTime();
        flag = now > moment(beginTime) && now < moment(endTime) && (offerTime? now > moment(offerTime) : true)
      }
      this.bidPriceReadOnly = !flag
      
      console.log(!flag);
      return !flag
    },
    checkCountTime(){
      const { beginTime, endTime, offerTime } = this.form;
      const offerTimestamp  = moment() + (moment(offerTime) - moment());
      if(moment(beginTime)>moment()){
        const beginTimestamp = moment() + (moment(beginTime) - moment());
        const time = moment() - moment(beginTime);
        this.countForm = { label: '距离开始时间', beginValue: beginTimestamp, endValue: null };
        setTimeout(() => { this.checkCountTime(); }, Math.abs(time));
      }else if(moment(endTime)>moment()){
        const endTimestamp = moment() + (moment(endTime) - moment());
        const time = moment() - moment(endTime);
        this.countForm = { label: '距离结束时间', beginValue: null, endValue: endTimestamp };
        setTimeout(() => { this.checkCountTime(); }, Math.abs(time));
      }else{
        this.countForm = { label: '距离结束时间', beginValue: null, endValue: null };
      }
      if(moment(offerTime)>moment()){
        const time = moment() - moment(offerTime);
        this.countForm = { ...this.countForm, offerTime: offerTimestamp };
        setTimeout(() => { this.checkCountTime(); }, Math.abs(time));
      }else{
        this.countForm = { ...this.countForm, offerTime: null };
      }
      this.$set(this.countForm, 'outPriceBtnDis', moment(offerTime)>moment() || !(moment(beginTime)<moment() && moment(endTime)>moment()));
      this.updateBidPriceReadOnly()
    },
    getDigits(column) {
      return (column && column.params && column.params.displayDigits) ? column.params.displayDigits : 0;
    },
    onFilelistUpdate(file) {
      this.descSourceList.fileList = (file?.fileList??[]).map((item) => {
        return {
          label: item.originalFileName,
          value: item.id + "",
          fileName: item.fileName,
          filePath: item.filePath,
          url: item?.url,
          quotedBillFileId: item?.quotedBillFileId,
        };
      });
    },
    initCharts(){ 
      this.chart && this.chart.clear();
      this.$nextTick(() => {
        this.chart = echarts.init(this.$refs.charts);
        this.options && this.chart.setOption(this.options)
        this.chart.resize();
      })
    },
    updateCharts(){
      const offerList = this.form.offerList
      let options = {...this.options};
      let xAxisData = []
      let seriesData = []
      offerList.map(item=>{
        xAxisData.push(item.offerTime)
        seriesData.push(item.amount)
      })
      options.xAxis.data = xAxisData
      options.series[0].data = seriesData
      this.options = {...options};
      console.log('updateCharts', options)
      this.options && this.chart.setOption(this.options, true)
      this.$nextTick(() => {
        this.chart.resize();
      });
    },
    init() {
      this.getDetail();
      this.showBtnConfig();
    },
    initTableConfig() {
      const { cpxxtable, cpxxtoolbar, cjlbtable, cjlbtoolbar } = this.$refs;
      if (cpxxtable) {
        cpxxtable.connect(cpxxtoolbar);
        this.initTable('columns', 'tableColumns', cpxxtable.id);
      }
      if (cjlbtable) {
        cjlbtable.connect(cjlbtoolbar);
        this.initTable('outPriceColumns', 'outPriceTableColumns', cjlbtable.id);
      }
      this.defaultColumns = XEUtils.clone(this.columns, true);
      this.outPriceDefaultColumns = XEUtils.clone(this.outPriceColumns, true);
    },
    initTable(column, tableColumn, tableId) {
      const tableColumns = this[column].map((item) => {
        if (item.params) {
          item.formatter = ({ cellValue, row, column }) => {
            if(item.params.displayDigits){
              var value = XEUtils.toFixed(cellValue, item.params.displayDigits);
            }else{
              var value = cellValue;
            }
            return cellValue!=null ? item.params.percent ? `${value}%` : value : cellValue;
          };
        }
        return item;
      });
      this[tableColumn] = handleStorageColumns(tableColumns, tableId);
    },
    async setColumn() {
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, {code: "detailList,detailList1",corpCode: this.businessCode ?? "LX"});
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, {code: "detailForm",corpCode: this.businessCode ?? "LX"});
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.outPriceColumns = res.data.detailList1?.columns ?? [];
        this.initTableConfig();
      }
      if(resForm.code === 200 && resForm.data){
        this.descItems = resForm.data.detailForm?.columns ?? [];
        this.descItems1 = resForm.data.detailForm1?.columns ?? [];
      }
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
