import XEUtils from 'xe-utils'
import moment from 'moment'
import { mapState } from 'vuex'
import { ApiQuotation, ApiSeek } from '@/apis'
import { handleStorageColumns } from '@/utils/vxe-table'
import { handleNextFocus } from '@/utils/vxe-table'
import VXETable from 'vxe-table'
import columnPasting from '@/pages-components/columnPasting/index.vue'
import SplicinAddress from '@/pages-components/splicinAddress/index.vue'
const apiQuotation = new ApiQuotation()
const apiSeek = new ApiSeek()
export default {
  components: { columnPasting, SplicinAddress },
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode
    }),
    showBtn() {
      return (name) => {
        const find = this.allBtnControlList?.find((x) => x.btnCode == name)
        return find ?? false
      }
    },
    // 将后端状态映射为 el-steps 的索引（0 开始）
    activeStep() {
      const s = this.form?.quoteState
      const map = {
        DBJ: 0, // 待报价
        YBJ: 1, // 已报价
        YKB: 2, // 已开标
        WZB: 3, // 未中标
        YZB: 4 // 已中标
      }
      if (s == null) return 0
      const key = String(s)
      return map.hasOwnProperty(key) ? map[key] : 0
    }
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      activeName: 'jbxx',
      menuCode: 'seekContrast_supplierApply',
      fileBillTpye: 'SA',
      id: null,
      lztVisible: false,
      lztColumn: {},
      lztLoadText: '',
      lztText: '',
      allBtnControlList: [],
      editState: false,
      form: {
        detailList: []
      },
      formDataShow: {
        bjmx: true,
        fjcz: true,
        bjhz: true,
        xjnr: true,
        gys: true
      },
      backForm: {},
      columns: [],
      columns1: [],
      supplierColumns: [],
      rulesobj: {},
      rulesobj1: {},
      rulesobj2: {},
      descItems: [],
      descItems1: [],
      descItems2: [],
      descSourceList: {
        fileList: []
      },
      defaultColumns: [],
      defaultColumns1: [],
      timeDifference: '',
      timer: null
    }
  },
  async beforeRouteLeave(to, from, next) {
    if (to.name == 'login') {
      next()
      return
    }
    if (this.editState) {
      clearInterval(this.timer)
      this.timer = null
      // 离开
      const state = await this.closePage()
      state ? next() : next(false)
    } else {
      next()
    }
  },
  async beforeRouteUpdate(to, from, next) {
    if (to.name == 'login') {
      next()
      return
    }
    clearInterval(this.timer)
    this.timer = null
    // 离开-同模块
    if (this.editState) {
      const state = await this.closePage()
      state ? next() : next(false)
    } else {
      next()
    }
  },
  async beforePageLeave(tab, type) {
    let state = null
    if (this.editState && !['unload', 'leave'].includes(type)) {
      state = await this.closePage()
    }
    return new Promise((resolve, reject) => {
      if (['unload', 'leave'].includes(type)) {
        resolve()
      } else {
        if (this.editState) {
          state ? resolve() : reject()
        } else {
          resolve()
        }
      }
    })
  },
  created() {},
  mounted() {},
  activated() {
    this.getSelectList()
    const { params } = this.$route
    const { id } = params
    if (id) {
      this.id = id
      this.init()
    }
    this.setColumn()
  },
  methods: {
    inStockFlagChange(e, row, rowIndex, column) {
      const List = this.form.detailList.map((x) => ({ ...x, inStockFlag: 0 }))
      List[rowIndex][column.field] = e
      this.form.detailList = List
    },
    getStepDescription(step) {
      const completedSteps = ['DBJ', 'YBJ', 'YKB', 'YZB']
      const currentStepIndex = completedSteps.indexOf(step)
      const descriptions = {
        DBJ: '未开始',
        YBJ: '未开始',
        YKB: '未开始',
        YZB: '未开始'
      }
      if (currentStepIndex < this.activeStep) {
        return '已完成' // 已完成的步骤
      } else if (currentStepIndex === this.activeStep) {
        console.log(this.form?.enquiryApplyBill)

        if (this.form?.enquiryApplyBill.enquiryState == 4) {
          return `已终止` // 终止状态
        }
        return '进行中' // 当前步骤
      } else {
        return descriptions[step] // 默认描述
      }
    },
    // 根据索引返回步骤的显示状态
    getStepStatus(index) {
      const a = this.activeStep
      if (index < a) return 'finish'
      if (index === a) return 'process'
      return 'wait'
    },
    getSelectList() {},
    submitApply() {
      VXETable.modal
        .confirm({
          title: '提示',
          content: '确认提交报价?',
          mask: true
        })
        .then(async(type) => {
          if (type === 'confirm') {
            const loading = this.$loading({
              lock: true,
              text: '提交中',
              spinner: 'el-icon-loading'
            })
            apiSeek
              .putSupplierSubmit({ id: this.form.id })
              .then((res) => {
                if (res.code === 200) {
                  this.$message.success('操作成功!')
                  this.init()
                } else {
                  this.$message.error(res.message)
                }
              })
              .finally(() => {
                loading.close()
              })
          }
        })
    },

    async closePage() {
      const res = await VXETable.modal.confirm({
        title: '提示',
        content: '存在修改状态页面，请确认是否保存！',
        mask: true,
        confirmButtonText: '保存'
      })
      if (res === 'confirm') {
        // 修改关闭保存
        const loading = this.$loading({
          lock: true,
          text: '保存中',
          spinner: 'el-icon-loading'
        })
        if (this.editState && this.id) {
          const submitRes = await apiSeek.putSupplierApply(this.form)
          loading.close()
          if (submitRes.code === 200) {
            this.editState = false
            this.$message.success('保存成功')
            return true
          } else {
            this.$message.error(submitRes.message, '修改失败系统异常')
            return false
          }
        }
      }
      if (res === 'cancel') {
        this.cancel()
        return true
      }
    },
    integerInputChage(row, rowIndex, field) {
      row[field] = XEUtils.round(row[field], 0)
    },
    // 表格小数位控制
    getDigits(field) {
      const item = this.columns.find((x) => x.field === field)
      const { params = {}} = item
      return item && item.params && params.hasOwnProperty('displayDigits')
        ? item.params.displayDigits
        : 0
    },
    editForm() {
      this.backForm = XEUtils.clone(this.form, true)
      this.editState = true
    },
    cancel() {
      this.editState = false
      this.form = { ...this.backForm }
    },
    // 保存
    submit() {
      this.editBill()
    },
    editBill() {
      const loading = this.$loading({
        lock: true,
        text: '保存中',
        spinner: 'el-icon-loading'
      })
      apiSeek
        .putSupplierApply(this.form)
        .then((res) => {
          if (res.code === 200 && res.data) {
            this.editState = false
            this.init()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          loading.close()
        })
    },
    onFilelistUpdate(file) {
      this.descSourceList.fileList = file.fileList.map((item) => {
        return {
          label: item.originalFileName,
          value: item.id + '',
          fileName: item.fileName,
          filePath: item.filePath,
          url: item?.url,
          quotedBillFileId: item?.quotedBillFileId
        }
      })
    },
    init() {
      this.getDetail()
      this.showBtnConfig()
    },
    getDetail() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading'
      })
      const id = this.id
      apiSeek
        .getSupplierApplyDetail({ id })
        .then((res) => {
          if (res.code === 200 && res.data) {
            this.form = { ...res.data }
            this.timeDifference = this.calculateTimeDifference(
              this.form.endQuoteTime
            )
            this.timer = setInterval(() => {
              this.timeDifference = this.calculateTimeDifference(
                this.form.endQuoteTime
              )
            }, 1000)
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          loading.close()
        })
    },
    showBtnConfig() {
      const data = {
        param: {
          id: this.id ?? null
        }
      }
      apiQuotation.postDetailBtnList(this.menuCode, data).then((res) => {
        if (res.code === 200) {
          this.allBtnControlList = res.data ?? []
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 计算时间差
    calculateTimeDifference(endTime) {
      if (!endTime) {
        return ''
      }
      const start = new Date()
      const end = new Date(endTime)
      const diffMs = end - start
      if (diffMs <= 0) {
        return '已过期'
      }
      const seconds = Math.floor(diffMs / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      const months = Math.floor(days / 30.44)
      const years = Math.floor(months / 12)
      const remainingMonths = months % 12
      const remainingDays = Math.floor(days % 30.44)
      const remainingHours = hours % 24
      const remainingMinutes = minutes % 60
      const remainingSeconds = seconds % 60

      const time = {
        years: years ? years + '年' : '',
        months: remainingMonths ? remainingMonths + '月' : '',
        days: remainingDays ? remainingDays + '日' : '',
        hours: remainingHours ? remainingHours + '时' : '',
        minutes: remainingMinutes ? remainingMinutes + '分' : '',
        seconds: remainingSeconds ? remainingSeconds + '秒' : ''
      }
      const srt = `${time.years}${time.months}${time.days}${time.hours}${time.minutes}${time.seconds}`
      return srt
    },

    async setColumn() {
      const loading = this.$loading({
        lock: true,
        text: '正在加载',
        spinner: 'el-icon-loading'
      })
      const data = {
        code: 'detailList,detailList1,detailList2',
        corpCode: this.businessCode ?? 'LX'
      }
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, data)
      if (res.code === 200 && res.data) {
        this.columns = [...(res.data.detailList?.columns ?? [])]
        this.columns1 = [...(res.data.detailList1?.columns ?? [])]
        this.supplierColumns = [...(res.data.detailList2?.columns ?? [])]
        this.initTableConfig()
      }
      const dataForm = {
        code: 'detailForm,detailForm1,detailForm2',
        corpCode: this.businessCode ?? 'LX'
      }
      const resform = await apiQuotation.getFormsConfigMulti(
        this.menuCode,
        dataForm
      )
      if (resform.code === 200 && resform.data) {
        this.descItems = resform.data.detailForm?.columns ?? []
        this.descItems1 = resform.data.detailForm1?.columns ?? []
        this.descItems2 = resform.data.detailForm2?.columns ?? []
      }

      setTimeout(() => {
        loading.close()
      }, 1000)
    },
    initTableConfig() {
      const { table, toolbar, table1, toolbar1 } = this.$refs
      if (table) {
        table.connect(toolbar)
        this.initTable()
      }
      if (table1) {
        table1.connect(toolbar1)
        this.initTable()
      }
      this.defaultColumns = XEUtils.clone(this.columns, true)
      this.defaultColumns1 = XEUtils.clone(this.columns1, true)
    },
    initTable() {
      const { table, table1 } = this.$refs
      const tableColumns = this.columns.map((item) => {
        const { params = {}} = item
        if (item.params && params.hasOwnProperty('displayDigits')) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits)
          }
        }
        return item
      })
      this.columns = handleStorageColumns(tableColumns, table.id)

      const tableColumns1 = this.columns1.map((item) => {
        const { params = {}} = item
        if (item.params && params.hasOwnProperty('displayDigits')) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, column.params.displayDigits)
          }
        }
        return item
      })
      this.columns1 = handleStorageColumns(tableColumns1, table1.id)
    },
    onToolOk(e) {
      const { type, data } = e
      const fn = this.toolMethods()[type]
      fn && fn(data)
    },
    toolMethods() {
      return {
        set_column: ({ columns }) => {
          this.columns = columns
        }
      }
    },
    validFormData() {
      return new Promise((resolve, reject) => {
        this.$refs.dataForm.validate((valid) => {
          resolve(valid)
        })
      })
    },
    lztClose() {
      this.lztVisible = false
      this.lztColumn = {}
      this.lztLoadText = ''
    },
    lztOpen(column) {
      if (!this.editState) return
      this.lztVisible = true
      this.lztColumn = column
      const { visibleData } = this.$refs.table.getTableData()
      const list = [...visibleData]
      this.lztLoadText = (list ?? []).map((x) => x[column.field]).join('\n')
    },
    async lztOk(ztList) {
      const { field } = this.lztColumn
      const { visibleData, tableData } = this.$refs.table.getTableData()
      if (ztList.length) {
        ztList.forEach((item, index) => {
          if (visibleData[index]) {
            visibleData[index][field] =
              this.lztColumn &&
              this.lztColumn.params &&
              this.lztColumn.params.displayDigits
                ? XEUtils.toFixed(item, this.lztColumn.params.displayDigits)
                : item
          }
        })
        this.$message.success('操作成功')
        this.lztText = ''
        this.lztVisible = false
        this.lztColumn = {}
        this.lztLoadText = ''
      }
    },
    upDownMove(e, rowIndex, columnIndex, column) {
      this.inputFocus(e, rowIndex, columnIndex, column)
    },
    inputFocus(e, rowIndex, columnIndex, column) {
      const { code } = e
      const { table } = this.$refs
      const max_row = this.form.detailList.length
      const max_column = this.columns.length

      //
      const container =
        column.fixed === 'left'
          ? table.$el.querySelector('.vxe-table--fixed-left-wrapper')
          : column.fixed === 'right'
            ? table.$el.querySelector('.vxe-table--fixed-right-wrapper')
            : table.$el

      handleNextFocus(
        container,
        code,
        rowIndex,
        columnIndex,
        max_row,
        max_column
      )
    },
    // 加载组件功能
    loading(text) {
      const loading = this.$loading({
        lock: true,
        text,
        spinner: 'el-icon-loading'
      })
      return loading
    }
  }
}
