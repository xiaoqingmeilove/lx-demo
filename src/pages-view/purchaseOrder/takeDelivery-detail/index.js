import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { findMenuByCode } from "@/utils/menu";
import { ApiContract, ApiQuotation, ApiBasic } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import VXETable from "vxe-table";
import timeline from "@/pages-components/timeline/index.vue";

const apiContract = new ApiContract();
const apiQuotation = new ApiQuotation()
const apiBasic = new ApiBasic()
export default {
  name: "purchaseOrder_takeDelivery_detail",
  components: {
    timeline
  },
  async beforeRouteLeave(to, from, next) {
    if (to.name == "login") {
      next();
      return;
    } else {
      next();
    }
  },
  async beforeRouteUpdate(to, from, next) {
    if (to.name == "login") {
      next();
      return;
    } else {
      next();
    }
  },
  async beforePageLeave(tab, type) {
    return new Promise((resolve, reject) => {
      if (["unload", "leave"].includes(type)) {
        resolve();
      } else {
        resolve();
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
  },
  data() {
    const dict = this.$store.state.Common.dict
    return {
      menuCode: "purchaseOrder_takeDelivery",
      fileBillTpye: "OR",
      editState: false,
      backForm: {},
      moment,
      descItems: [],
      descItemsTransport: [],
      columns: [],
      tableColumns: [],
      defaultColumns: [],
      rules: {
        shippingMethod: [{ required: true, message: "请输入运输方式" }],
      },
      previewImg: false,
      previewIndex: 0,
      imgs: [],
      id: null,
      form: {},
      formDataShow: {
        cpxx: true,
        jbxx: true,
        fhxx: true,
      },
      descSourceList: {
        fileList: [],
      },
      allBtnControlList: [],
      activeName: 'jbxx',
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
  mounted() { },
  activated() {
    this.$tabs.activeTab.title = `${findMenuByCode(this.menuCode)?.title ?? '采购订单'}详情`;
    if (this.id) {
      this.init();
    }
  },
  methods: {
    syncApsSubmit() {
      this.$confirm('确认同步吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const loading = this.loading('请求中');
        apiContract.getSendReceiveNotice(this.id).then((res) => {
          if (res.code === 200) {
            this.$message.success(res.message ?? "操作成功");
            this.init();
          } else {
            this.$message.error(res.message ?? "操作失败");
          }
        }).catch(err => {
          this.$message.error(err.message ?? "操作失败");
        }).finally(() => {
          setTimeout(() => loading.close(), 1000);
        });
      });
    },

    confirm() {
      this.$confirm('确认收货吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.confirmShip();
      });
    },
    confirmShip() {
      const loading = this.loading('请求中');
      apiContract.postTakeDeliveryReceive({ id: this.id }).then((res) => {
        if (res.code === 200) {
          this.$message.success(res.message ?? "操作成功");
          this.init();
        } else {
          this.$message.error(res.message ?? "操作失败");
        }
      }).catch(err => {
        this.$message.error(err.message ?? "操作失败");
      }).finally(() => {
        setTimeout(() => loading.close(), 1000);
      })
    },
    onFileSelect(e) {
      if (this.form.id) {
        const file = e[0];
        let data = {
          ...file,
          billId: this.form.id,
          billType: this.fileBillTpye,
          uploadUser: this.userInfo.userId,
          uploadUserName: this.userInfo.userName,
          menuCode: this.menuCode,
        };
        ApiBillFile.addAuthBillFile(data).then((res) => {
          if (res.code === 200) {
            this.$message.success(res.message);
            this.$refs.fileList.getData();
          } else {
            this.$message.error(res.message || "操作失败");
          }
        });
      }
    },
    showBtnConfig() {
      apiQuotation.postDetailBtnList(this.menuCode, { param: { id: this.id ?? null } }).then((res) => {
        if (res.code === 200) {
          this.allBtnControlList = res.data ?? [];
        } else {
          this.$message.error(res.message);
        }
      });
    },
    getDetail() {
      const loading = this.loading('请求中');
      apiContract.getTakeDeliveryDetail(this.id).then((res) => {
        if (res.code === 200) {
          this.form = res.data;
        } else {
          this.$message.error(res.message ?? "获取失败");
        }
      }).catch((err) => {
        this.$message.error(err.message ?? "获取失败");
      }).finally(() => {
        loading.close();
      });
    },
    onFilelistUpdate(file) {
      this.descSourceList.fileList = (file?.fileList ?? []).map((item) => {
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
    init() {
      this.getDetail();
      this.showBtnConfig();
    },
    async setColumn() {
      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, { code: "detailList", corpCode: this.businessCode ?? "LX" });
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.initTableConfig();
      }
      const resForm = await apiQuotation.getFormsConfigMulti(this.menuCode, { code: "detailForm,detailListTransport", corpCode: this.businessCode ?? "LX" });
      if (resForm.code === 200 && resForm.data) {
        this.descItems = resForm.data.detailForm?.columns ?? [];
        this.descItemsTransport = resForm.data.detailListTransport?.columns ?? [];
      }
    },
    onInputBlurFormChange(e) {
      if (e && e.item && e.item.fieldName) {
        const find = (this.descSourceList[e.item.source] || []).find(x => x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
    },
    bindRules() {
      this.$refs.dataFormTransport && this.$refs.dataFormTransport.clearValidate();
      if (this.form.shippingMethod === 'kd') {
        return {
          logisticsCompany: [{ required: true, message: "请输入快递公司" }],
          trackingNumber: [{ required: true, message: "请输入快递单号" }],
        }
      } else if (this.form.shippingMethod === 'wl') {
        return {
          driverName: [{ required: true, message: "请输入司机姓名" }],
          driverPhone: [{ required: true, message: "请输入司机联系方式" }],
          vehiclePlate: [{ required: true, message: "请输入车牌号" }],
        }
      } else {
        return this.rules;
      }
    },
    initTableConfig() {
      const { table, toolbar } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable('columns', 'tableColumns', table.id);
      }
      this.defaultColumns = XEUtils.clone(this.columns, true);
    },
    initTable(column, tableColumn, tableId) {
      const tableColumns = this[column].map((item) => {
        if (item.params) {
          item.formatter = ({ cellValue, row, column }) => {
            if (item.params.displayDigits) {
              var value = XEUtils.toFixed(cellValue, item.params.displayDigits);
            } else {
              var value = cellValue;
            }
            return cellValue != null ? item.params.percent ? `${value}%` : value : cellValue;
          };
        }
        return item;
      });
      this[tableColumn] = handleStorageColumns(tableColumns, tableId);
    },
    onToolOk(e, column) {
      const { type, data } = e
      const fn = this.toolMethods(column)[type]
      fn && fn(data)
    },
    toolMethods(column) {
      return {
        set_column: ({ columns }) => {
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
