
import moment from "moment";
import { columns } from './scripts/data/column';
import { ApiSystem } from '@/apis';
import { MaximizeTable, handleStorageColumns } from '@/utils/vxe-table'
import { mapState } from 'vuex'
import XEUtils from 'xe-utils'

const apiSystem = new ApiSystem()

let maximizeTable = null;
export default {
  watch: {
  },
  components: {
  },
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
    }),
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      defaultColumns:[],
      columns:[],  //一览表表头信息, 
      dict, 
      tableData: [],
    }
  },
  created() {
  },
  mounted() {
    const { table, toolbar } = this.$refs
    if (table) {
      table.connect(toolbar)
      this.initTable()
    }
    this.defaultColumns = XEUtils.clone(this.columns, true);
    maximizeTable = new MaximizeTable(this.$refs.tableSection.$el)
  },
  activated () {
    this.init();
  },
  methods: {
    onUploadSuccess(files){
      console.log(files[0], "files");
      const {fileImageSize, fileName} = files[0];
      const suffix = fileName.substring(fileName.lastIndexOf("."));
      if (['.jpg','.jpeg','.png','.gif'].indexOf(suffix) == -1) {
        this.$message.warning("暂不支持此类型的文件上传，请选择JPG、JPEG、PNG、gif 格式");
        return;
      }
    },
    init(){
      this.getList();
    },
    getList(){
      const loading = this.loading("加载中")
      apiSystem.getVersionTree().then(res => {
        if(res.code == 200 && res.data){
          this.tableData = this.filterTree(res.data);
        }else{
          this.$message.error(res.message);
        }
      }).catch((err) => {
        this.$message.error(err.message||"获取一览表异常");
      }).finally(() => {
        loading.close()
      });
    },
    filterTree(tree) {
      return tree.reduce((acc, item) => {
        if ((item.id ?? '') !== '') {
          acc.push({ ...item });
        }
        if (item.children) {
          acc.push(...this.filterTree(item.children));
        }
        return acc;
      }, []);
    },
    // 一览表双击事件
    onCellDbClick(e){
      const { row } = e;
      this.$router.push({ path: `/system/versioning-detail/detail/${row.id}`});
    },
    initTable() {
      const { table } = this.$refs;
      const tableColumns = columns.map(item => {
        if (item.params && item.params.displayDigits) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, item.params.displayDigits)
          }
        }
        return item
      })
      this.columns = handleStorageColumns(tableColumns, table.id)
    },
    onToolOk(e) {
      const { type, data } = e
      const fn = this.toolMethods()[type]
      fn && fn(data)
    },
    toolMethods() {
      return {
        maximize: data => {
          const { maximize } = data
          if (maximize) {
            maximizeTable.maximize()
          } else {
            maximizeTable.restoreTable()
          }
        }
      }
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
