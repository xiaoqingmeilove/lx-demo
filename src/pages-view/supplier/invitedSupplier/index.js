import { ApiBasic, ApiQuotation } from '@/apis'
import { mapState } from 'vuex'
import { handleStorageColumns, MaximizeTable } from '@/utils/vxe-table'
import { blobToFile } from '@/utils/utils';
import { findMenuByCode } from "@/utils/menu";
import XEUtils from 'xe-utils'
import moment from "moment";

let maximizeTable = null

const apiBasic = new ApiBasic();
const apiQuotation = new ApiQuotation();
export default {
  name: "supplier_invitedSupplier",
  components: {},
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    showBtn(){
      return (name) => {
        let find = this.allBtnControlList?.find((x) => x.btnCode == name)
       return find ?? false;
      }
    },
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
      menuCode: "supplier_invitedSupplier",
      columns: [],
      tableColumns: [],
      defaultColumns: [],
      searchOptions: [],
      tableData: [],
      condition: {},
      tablePage: {
        currentPage: 1,
        pageSize: localStorage.getItem("pageSize") ? JSON.parse(localStorage.getItem("pageSize"))[this.$route.name] || 20 : 20,
        total: 0,
        showTotal: () => `共${this.tablePage.total}条`,
      },
      sourceList: {
        inviteStatusList: (dict["supplier_invite_status"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue, color: d.remark }
        }),
        authStatusList: (dict["supplier_auth_status"] || []).map(d => {
          return { label: d.dictLabel, value: d.dictValue, color: d.remark }
        }),
      },
      allBtnControlList: [],
      visible: {
        addVisible: false,
        smsVisible: false
      },
      addRules: {
        contactInfo: [
          { required: true, message: "请输入手机号码或邮箱", trigger: "blur" },
          { validator: (rule, value, callback) => {
            const phoneRegex = /^1[3456789]\d{9}$/;
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (phoneRegex.test(value) || emailRegex.test(value)) {
              callback();
            } else {
              callback(new Error('请输入有效的手机号码或邮箱地址'));
            }
          }, trigger: "blur" }
        ],
        supplierName: [{ required: true, message: "请输入供应商名称", trigger: "blur" }]

      },
      addForm: [],
      smsTableList: [],
      smsColumns: [],
    };
  },
  created() {
    this.setColumn();
  },
  activated() {
    this.$tabs.activeTab.title = findMenuByCode(this.menuCode)?.title ?? '供应商邀请';
    this.getList();
  },
  beforeRouteLeave(to, from, next) {
    this.closePopup();
    next();
  },
  mounted() {},
  methods: {
    batchInvite(){
      const list = this.$refs.table.getCheckboxRecords();
      if(!list.length){
        this.$message.error('请选择需要邀请的供应商！');
        return;
      }
      this.invite(list.map(x=>x.id));
    },
    invite(data){
      const loading = this.loading("邀请中");
      apiBasic.putSupplierInvite(data).then(res=>{
        if(res.code === 200){
          this.$message.success('邀请成功！');
          this.getList();
        }else{
          this.$message.error(res.message??'操作失败');
        }
      }).catch(err=>{
        this.$message.error(err?.message??'操作失败');
      }).finally(()=>{
        setTimeout(()=>loading.close(),1000);
      })
    },
    openSms(row){
      const loading = this.loading("加载中");
      apiBasic.getSupplierInviteSmsList({id: row.id}).then(res=>{
        if(res.code === 200){
          this.smsTableList = res?.data??[];
          this.visible.smsVisible = true;
        }else{
          this.$message.error(res.message??'操作失败');
        }
      }).catch(err=>{
        this.$message.error(err?.message??'操作失败');
      }).finally(()=>{
        setTimeout(()=>loading.close(),200);
      })
    },
    addRow(){
      this.addForm = [...this.addForm, {}]
    },
    delRow(index){
      if(this.addForm.length === 1) return this.$message.error('至少保留一条数据')
      this.addForm.splice(index, 1);
    },
    save(){
      const formKeys = new Array(this.addForm.length).fill(null).map((_, index) => `addform${index + 1}`);
      let flag = true;
      for(let key in this.$refs){
        if(formKeys.includes(key)){
          this.$refs[key][0] && this.$refs[key][0].validate(valid=>{
            if (!valid){
              flag = false;
            }
          })
        }
      }
      if (!flag) {
        this.$message.error('请检查必填项！');
        return;
      }
      const loading = this.loading("保存中");
      apiBasic.postSupplierInviteSave(this.addForm).then(res => {
        if(res.code === 200){
          this.$message.success('保存成功！');
          this.visible.addVisible = false;
          this.getList();
        }else{
          this.$message.error(res.message??'操作失败');
        }
      }).catch(err=>{
        this.$message.error(err?.message??'操作失败');
      }).finally(()=>{
        setTimeout(()=>loading.close(),1000);
      })

    },
    closePopup(){
      const { tools } = this.$refs;
      const { setting } = tools?.$refs;
      setting && setting.cancel();
      this.visible = {
        addVisible: false,
        smsVisible: false
      };
    },
    exprot(){
      const loading = this.loading("导出中");
      apiBasic.getAccessExport({...this.condition}).then(res => {
        blobToFile(res, `导出${findMenuByCode(this.menuCode)?.title??'供应商准入'}_${moment().format("YYYYMMDDHHmm")}.xlsx`);
      }).finally(() => {
        setTimeout(() => {
          loading.close();
        }, 500)
      })
    },
    showBtnConfig() {
      let data = {
        param: {
          listBtnView: 1,
        },
      };
      apiQuotation.postDetailBtnList(this.menuCode, data).then((res) => {
        if (res.code === 200) {
          this.allBtnControlList = res.data ?? [];
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
      maximizeTable = new MaximizeTable(this.$refs.tableSection.$el);
    },
    async setColumn() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      const list = {code: "list,smsList", corpCode: this.businessCode ?? "LX"}
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, list);
      if(res.code === 200 && res.data){
        this.columns = res.data.list?.columns ?? [];
        this.smsColumns = res.data.smsList?.columns ?? [];
        this.initTableConfig();
      }
      const searchRes = await apiQuotation.getSearchConfig(this.menuCode, {code: "search", corpCode: this.businessCode ?? "LX"});
      if(searchRes.code === 200 && searchRes.data && searchRes.data.columns){
        this.searchOptions = searchRes.data.columns;
      }
      loading.close();
    },
    initTable() {
      const { table } = this.$refs
      const tableColumns = this.columns.map(item => {
        if (item.params && item.params.displayDigits) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, item.params.displayDigits)
          }
        }
        return item
      })
      this.tableColumns = handleStorageColumns(tableColumns, table.id)
    },
    getList(callback) {
      const loading = this.loading('加载中');
      apiBasic.getSupplierInviteList(this.condition, this.tablePage.currentPage, this.tablePage.pageSize).then(res => {
        if (res.code === 200 && res.data) {
          this.tableData = res.data?.records ?? []
          this.tablePage.total = res.data.total;
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
    // onCellDbClick({row}) {
    //   this.$router.push({ path: `/supplier/supplierAccess-detail/detail/${row.id}` });
    // },
    // 查询
    onSearch(value) {
      const condition = XEUtils.clone(value, true);
      this.tablePage.currentPage = 1;
      this.condition = { ...condition };
      this.getList();
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
      this.getList();
    },
    onReset() {
      this.condition = {};
      this.tablePage.currentPage = 1,
      this.getList();
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
    onToolOk(e) {
      const { type, data } = e
      const fn = this.toolMethods()[type]
      fn && fn(data)
    },
    toolMethods() {
      return {
        set_column: ({columns}) => {
          this.tableColumns = columns;
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