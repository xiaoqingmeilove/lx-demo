import addMember from './coms/addMember.vue'
import DeleteDialog from './coms/deleteDialog.vue'
import addSales from './coms/addSales.vue'
import XEUtils from "xe-utils";
import VXETable from 'vxe-table'
import { columns } from "./data/column.js";
import { MaximizeTable, handleStorageColumns } from '@/utils/vxe-table'
import { mapState } from 'vuex'
import { ApiSystem, ApiQuotation } from '@/apis'

const apiSystem = new ApiSystem()
const apiQuotation = new ApiQuotation()

function filterTree(tree) {
  return tree.reduce((acc, item) => {
    if ((item.id ?? '') !== '') {
      acc.push({ ...item });
    }
    if (item.materialTypes) {
      acc.push(...filterTree(item.materialTypes));
    }
    return acc;
  }, []);
}
export default {
  name: 'system_salesPersonnel',
  components: { addMember, DeleteDialog, addSales },
  data() {
    return {
      menuCode: 'system_salesPersonnel',
      tabkey: '1',
      editState: false,
      tableData: [],
      backTableData: [],
      columns: [],
      tableColumns: [],
      defaultColumns: [],
      drawerVisible: false,

      create: false,
      regionDlg: false,
      regionTree: [],
      selrole: undefined,
      regionObj: {
        orderNum: 1,
      },
      regionListObj: {
        regionList: [],
        clientList: [],
        enabled: [{ label: '启用', value: "0" }, { label: '禁用', value: "1" }],
      },
      regionRules: {
        name: [{ required: true, message: "请输入区域名称" },],
      },
      moveObj: {},
      moveRules: {
        salesmanManagerIdNew: [{ required: true, message: "请选择区域" },],
      },
      moveDlg: false,
      addUserDlg: false,
      delreginDlg: false,
      associatedDlg: false,
      tableOrg: [],
      salesObj: {
        title: '新增',
        form: {},
        flag: false
      },
      associatedObj: {},
      filterText: '',

      delSalesmanDlg: false,
      salesmanObj: {},
      queryContent: '',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.roleTree.filter(val);
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
  },
  created() {
    this.init();
    this.setColumn();
  },
  activated() {
    if (!!this.selrole) {
      this.$refs.roleTree.setChecked(this.selrole, true);
    }
  },
  mounted() {},
  methods: {
    onSearch(){
      // if(this.regionTree.length && this.businessCode === 'GDDL'){
      //   this.nodeClick(this.regionTree[0])
      // }
      // this.$nextTick(() => {
      //   this.$refs.roleTree && this.selrole && this.$refs.roleTree.setCurrentNode(this.selrole)
      // });
      this.getSalesById();
    },
    onReset(){
      this.queryContent = '';
      this.onSearch();
    },
    toUser(row){
      if(!row.userId) return;
      this.$router.push({ path: `/system/user/${row.userId}`});
    },
    // 关联用户
    associatedOk(data){
      const loading = this.$loading({
        lock: true,
        text: "正在保存",
        spinner: "el-icon-loading",
      });
      let obj = {...this.associatedObj};
      obj.userId=data.id;
      obj.userName=data.name;
      delete obj?._X_ROW_KEY;
      apiSystem.putEditSalesman(obj).then(res=>{
        if(res.code===200){
          this.getSalesById();
          this.getRegionTree();
          this.associatedDlg=false;
          this.$message.success(res.message||'操作成功')
        }else{
          this.$message.warning(res.message||'操作异常')
        }
      }).catch(err=>{
        this.$message.error(err.message||'操作异常')
      }).finally(()=>{
        loading.close();
      })
    },
    // 批量新增业务员
    saveSalesmanBatch(data){
      const list = data.map(x=>{
        return {
          userId: x.id,
          salesmanManagerId: this.selrole?.id
        }
      })
      const loading = this.$loading({
        lock: true,
        text: "正在保存",
        spinner: "el-icon-loading",
      });
      apiSystem.postSaveSalesmanBatch(list).then(res=>{
        if(res.code===200){
          this.getSalesById();
          this.getRegionTree();
          this.addUserDlg=false;
          this.$message.success(res.message||'操作成功')
        }else{
          this.$message.warning(res.message||'操作异常')
        }
      }).catch(err=>{
        this.$message.error(err.message||'操作异常')
      }).finally(()=>{
        loading.close();
      })
    },
    // 新增业务员
    saveSalesman(data){
      const loading = this.$loading({
        lock: true,
        text: "正在保存",
        spinner: "el-icon-loading",
      });
      if(data.title=="新增"){
        apiSystem.postSaveSalesman(data.form).then(res=>{
          if(res.code===200){
            this.getSalesById();
            this.getRegionTree();
            this.salesObj.flag=false;
            this.$message.success(res.message||'操作成功')
          }else{
            this.$message.warning(res.message||'操作异常')
          }
        }).catch(err=>{
          this.$message.error(err.message||'操作异常')
        }).finally(()=>{
          loading.close();
        })
      }else{
        delete data.form?._X_ROW_KEY
        apiSystem.putEditSalesman(data.form).then(res=>{
          if(res.code===200){
            this.getSalesById();
            this.getRegionTree();
            this.salesObj.flag=false;
            this.$message.success(res.message||'操作成功')
          }else{
            this.$message.warning(res.message||'操作异常')
          }
        }).catch(err=>{
          this.$message.error(err.message||'操作异常')
        }).finally(()=>{
          loading.close();
        })
      }
    },
    // 删除业务员
    delSalesman(){
      const loading = this.$loading({
        lock: true,
        text: "正在删除",
        spinner: "el-icon-loading",
      });
      const data = [this.salesmanObj.id]
      apiSystem.deleteDelSalesman(data).then(res=>{
        if(res.code===200){
          this.getSalesById();
          this.getRegionTree();
          this.delSalesmanDlg=false;
          this.$message.success(res.message||'操作成功')
        }else{
          this.$message.warning(res.message||'操作异常')
        }
      }).catch(err=>{
        this.$message.error(err.message||'操作异常')
      }).finally(()=>{
        loading.close();
      })
    },
    // 移动业务员区域
    moveRegion(){
      this.$refs.roleForm1.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "正在保存",
            spinner: "el-icon-loading",
          });
          const data = {
            salesmanManagerIdOld: this.moveObj.salesmanManagerId,
            salesmanManagerIdNew: this.moveObj.salesmanManagerIdNew,
            salesmanId: this.moveObj.id,
            delFlag: 0,
          }
          apiSystem.putMovingRegion(data).then(res=>{
            if(res.code===200){
              this.moveDlg = false;
              this.getSalesById();
              this.getRegionTree();
              this.$message.success(res.message||'操作成功')
            }else{
              this.$message.warning(res.message||'操作异常')
            }
          }).catch(err=>{
            this.$message.error(err.message||'操作异常')
          }).finally(()=>{
            loading.close();
          })
        } else {
          this.$message.warning('请检查必填项')
          return false;
        }
      });
    },
    setManagerAdmin(row){
      const loading = this.$loading({
        lock: true,
        text: "正在保存",
        spinner: "el-icon-loading",
      });
      const data = {
        id: row.id,
        name: row.name,
        salesmanManagerId: this.selrole?.id
      }
      apiSystem.postSetManagerAdmin(data).then(res=>{
        if(res.code===200){
          this.getRegionTree();
          this.getSalesById();
          this.$message.success(res.message||'操作成功')
        }else{
          this.$message.warning(res.message||'操作异常')
        }
      }).catch(err=>{
        this.$message.error(err.message||'操作异常')
      }).finally(()=>{
        loading.close();
      })
    },
    editSales(row){
      this.salesObj={
        title: '修改',
        form: XEUtils.clone(row, true),
        flag: true
      }
    },
    closeAddUser(status) {
      if (status) {

      } else {
        this.addUserDlg = false;
      }
    },
    // 新增区域保存
    regionOk() {
      const data = {...this.regionObj};
      data.parentId = data.parentId||0;
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "正在保存",
            spinner: "el-icon-loading",
          });
          apiSystem.postSaveManager(data).then(res=>{
            if(res.code===200){
              this.regionDlg = false;
              this.getRegionTree();
              this.$message.success(res.message||'新增成功')
            }else{
              this.$message.warning(res.message||'新增区域异常')
            }
          }).catch(err=>{
            this.$message.error(err.message||'新增区域异常')
          }).finally(()=>{
            loading.close();
          })
        } else {
          this.$message.warning('请检查必填项')
          return false;
        }
      });
    },
    editRegion(){
      if(!this.selrole){
        this.$message.warning('请选择区域');
        return
      }
      if(this.selrole.name=='全部') {
        this.$message.warning('不可编辑修改全部区域');
        return;
      }
      const list = [...this.regionListObj.regionList];
      this.regionListObj.regionList = this.treeFormat(list);
      this.regionObj={...this.selrole};
      this.regionObj.parentId=this.regionObj.parentId==0?"":this.regionObj.parentId;
      this.create=false;
      this.regionDlg=true;
    },
    treeFormat(arr){
      arr.forEach(i=>{
        i.disabled = i.id === this.regionObj.id;
        if(i.children && i.children.length){
          this.treeFormat(i.children);
        }
      });
      return arr;
    },
    regionEdit(){
      const data = {...this.regionObj};
      data.parentId = data.parentId||0;
      if(data.salesmanList){
        data.salesmanList.forEach(item=>{
          delete item?._X_ROW_KEY;
        })
      }
      this.$refs.roleForm.validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: "正在保存",
            spinner: "el-icon-loading",
          });
          apiSystem.putEditManager(data).then(res=>{
            if(res.code===200){
              this.regionDlg = false;
              this.getRegionTree();
              this.$message.success(res.message||'操作成功')
            }else{
              this.$message.warning(res.message||'操作异常')
            }
          }).catch(err=>{
            this.$message.error(err.message||'操作异常')
          }).finally(()=>{
            loading.close();
          })
        } else {
          this.$message.warning('请检查必填项')
          return false;
        }
      });
    },
    // 删除区域
    delRegion() {
      if (!this.selrole) return
      const loading = this.$loading({
        lock: true,
        text: "正在删除",
        spinner: "el-icon-loading",
      });
      apiSystem.deleteDelManager([this.selrole.id]).then(res=>{
        if(res.code===200){
          this.getRegionTree();
          this.selrole=undefined;
          this.tableData=[];
          this.delreginDlg=false;
          this.$message.success(res.message||'删除成功')
        }else{
          this.$message.warning(res.message||'删除异常')
        }
      }).catch(err=>{
        this.$message.error(err.message||'删除异常')
      }).finally(()=>{
        loading.close();
      })
    },
    init(){
      this.getRegionTree();
      this.getSelect();
    },
    getRegionTree() {
      apiSystem.getSalesmanManagerTreeBack().then(res => {
        if (res.code === 200) {
          this.regionTree = this.businessCode==='GDDL'?[{name: '全部', id: ''}, ...(res.data||[])]:(res.data||[]);
          this.regionListObj.regionList = res.data;
          if(!this.selrole && this.regionTree.length){
            this.nodeClick(this.regionTree[0])
          }
          this.$nextTick(() => {
            this.$refs.roleTree && this.$refs.roleTree.filter(this.filterText);
            this.$refs.roleTree && this.selrole && this.$refs.roleTree.setCurrentNode(this.selrole)
          });
        } else {
          this.$message.warning(res.message || '获取区域异常')
        }
      }).catch(err => {
        this.$message.error(err.message || '获取区域异常')
      })
    },
    getSelect(){
      apiSystem.getSysTree(2).then(res=>{
        if(res.code===200 && res.data){
          this.regionListObj.clientList=res.data
        }
      })
    },
    getSalesById(){
      if(!this.selrole) return
      const loading = this.$loading({
        lock: true,
        text: "正在查询",
        spinner: "el-icon-loading",
      });
      const data = {
        salesmanManagerId: this.selrole.id,
        queryContent: this.queryContent,
      }
      apiSystem.postSalesById(data).then(res=>{
        if(res.code===200){
          this.tableData=res.data?.records ?? []
        }else{
          this.$message.warning(res.message||'查询业务员异常')
        }
      }).catch(err=>{
        this.$message.error(err.message||'查询业务员异常')
      }).finally(()=>{
        loading.close();
      })
    },
    nodeClick(obj) {
      this.selrole = obj;
      this.regionObj = {...obj};
      this.queryContent = '';
      this.getSalesById();
      // if(obj.name == '全部'){
      // }
      // if (obj.id) {
      //   this.tableData = obj.salesmanList ? [...obj.salesmanList] : [];
      // };
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // 启用停用
    changeStatus() {
      if (!this.selrole) return
      const list = filterTree(this.regionTree);
      const obj = (list||[]).find(x=>x.id==this.selrole.id);
      let data = {...this.selrole};
      apiSystem.putEditManager(data).then(res=>{
        if(res.code===200){
          this.getSalesById();
          this.getRegionTree();
          this.$message.success(res.message||'操作成功')
        }else{
          this.selrole.enabled=obj.enabled;
          this.$message.warning(res.message||'操作异常')
        }
      }).catch(err=>{
        this.selrole.enabled=obj.enabled;
        this.$message.error(err.message||'操作异常')
      }).finally(()=>{
        loading.close();
      })
    },

    // 左侧栏选产品
    handleClose(done) {
      this.drawerVisible = false;
    },

    initTable() {
      const { table } = this.$refs
      const tableColumns = this.columns.map(item => {
        if (item.params && item.params.displayDigits) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, item.params.displayDigits);
          }
        }
        return item;
      })
      this.columns = handleStorageColumns(tableColumns, table.id);
    },
    initTableConfig() {
      const { table, toolbar } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable();
      }
      this.defaultColumns = XEUtils.clone(this.columns, true);
    },
    async setColumn() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      let data = {
        code: "list",
        corpCode: this.businessCode ??  "LX",
      };
      const res = await apiQuotation.getColumnsConfig(this.menuCode, data);
      if (res.code === 200 && res.data && res.data.columns) {
        let columns = res.data.columns;
        this.columns = [...columns];
        this.initTableConfig();
      }
      loading.close();
    },
  },
}
