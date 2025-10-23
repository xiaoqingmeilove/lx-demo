import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiBuy, ApiBasic, ApiSystem, ApiContract } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { handleNextFocus } from "@/utils/vxe-table";
import { previewFile } from '@/utils/utils';
import mixin_table from "./scripts/mixins/table";
import VXETable from "vxe-table";
import VueEasyLightbox from "vue-easy-lightbox";
import supplierList from "@/pages-components/supplierList/index.vue";
import columnPasting from "@/pages-components/columnPasting/index.vue";
import priceCommonList from "@/pages-components/priceCommonList/index.vue";
import priceCommonDetail from "@/pages-components/priceCommonDetail/index.vue";
import viewAddress from "@/pages-components/viewAddress/index.vue";
import splicinAddress from "@/pages-components/splicinAddress/index.vue";
import timeline from "@/pages-components/timeline/index.vue";

const apiQuotation = new ApiQuotation();
const apiBuy = new ApiBuy();
const apiBasic = new ApiBasic();
const apiSystem = new ApiSystem();
const apiContract = new ApiContract();
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
export default {
  name: 'purchaseOrder_orderApply',
  mixins: [mixin_table],
  components: { VueEasyLightbox, supplierList, columnPasting, priceCommonList, priceCommonDetail, viewAddress, splicinAddress, timeline },
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
    bindDescItems() {
      // if (!this.form.billState) {
      //   return this.descItems.filter(x => x.field !== 'urgentFlag')
      // }
      return this.descItems;
    },
    calcSum() {
      return (data, code) => {
        if (!!data) {
          return data.reduce((total, cur) => {
            let n = cur[code] || 0;
            n = Number(n);
            return XEUtils.add(total, n);
          }, 0);
        }
      };
    },

  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      visible: {
        addSupplierVisible: false,
        viewAddressVisible: false,
        addAddressDrawer: false,
        addListVisible: false,
        viewPriceVisible: false,

      },
      addAddressForm: {
        deliveryAddress: '',
        receiveLinkName: '',
        receiveLinkTel: '',
        defaultFlag: "1",
      },
      viewPriceRow: {},

      rules: {
        addAddressForm: [{ required: true, message: '请选择区域', trigger: 'blur' },],
        deliveryAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' },],
        receiveLinkName: [{ required: true, message: '请输入联系人', trigger: 'blur' },],
        receiveLinkTel: [{ required: true, message: '请输入联系方式', trigger: 'blur' },],
      },

      // 要货计划
      planDescItems: [],
      planRules: {
        planType: [{ required: true, message: "请选择计划类型", trigger: 'blur' }],
      },
      planTableRules: {
        arrivalTime: [{ required: true, message: "请选择要求交货日期", trigger: 'blur' }],
      },
      planColumns: [],
      defaultPlanColumns: [],
      planTableColumns: [],
      planTableList: [],
      planIndex: null,
      plancpTableColumns: [],
      defaultPlancpColumns: [],


      dict,
      moment,
      activeName: 'jbxx',
      menuCode: "purchaseOrder_orderApply",
      // fileBillTpye: "PA",
      id: null,
      lztVisible: false,
      lztColumn: {},
      lztLoadText: "",
      lztText: "",
      allBtnControlList: [],
      editState: 0,
      form: {
        // urgentFlag: 0,
        // procurementType: '',
        // procurementTypeName: '',
        detailList: [],
        fileList: [],
      },
      formDataShow: {
        jbxx: true,
        cgmx: true,
        cghj: true,
        pcxx: true,
        pccpxx: true,
      },
      backForm: {},
      columns: [],
      plancpColumns: [],
      rulesobj: {
        supplierId: [{ required: true, message: "请选择供应商" }],
        confirmAddress: [{ required: true, message: "请选择收货地址" }],
        purchaseDeptId: [{ required: true, message: "请选择申请部门" }],
        purchaseType: [{ required: true, message: "请选择采购类型" }],
        paymentMethod: [{ required: true, message: "请选择结算方式" }],
      },
      descItems: [],
      descSourceList: {
        contractTypeList: (dict["contract_type"] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        planTypeList: [
          { label: '一次性采购', value: '1' },
          { label: '多批次采购', value: '2' },
        ],
        unitList: (dict['unit'] || []).map(x => {
          return { label: x.dictLabel, value: x.dictValue }
        }),
        flagList: [
          { label: "是", value: 1 },
          { label: "否", value: 0 },
        ],
        contractPurchaseTypeList: (dict['contract_purchase_type'] ?? []).map(x => {
          return { label: x.dictLabel, value: x.dictValue }
        }),
        payment_method: (dict['payment_method'] || []).map(x => {
          return { label: x.dictLabel, value: x.dictValue }
        }),
        procurementTypeList: (dict['procurement_type'] ?? []).map(x => {
          return { label: x.dictLabel, value: x.dictValue }
        }),
        fileList: [],
        applicantList: [], //申请人
        adepartmentList: [], //采购部门
        sourcingMethodList: (dict["sourcing_method"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }), //寻源方式
        confirmedSupplierList: [], //供应商
      },
      defaultColumns: [],
      previewImg: false,
      previewIndex: 0,
      imgs: [],
      pickerOptions: {
        disabledDate(current) {
          return current < moment().subtract(1, "day");
        },
      },
      combineOptions: [
        { label: "含税单价", value: "price", type: "number", toFixed: 2 },
        { label: "下单数量", value: "qty", type: "number", toFixed: 2 },
        { label: "交货日期", value: "dealDate", type: "date", props: { pickerOptions: { disabledDate(current) { return current < moment().subtract(1, "day") } } } },
        { label: "备注", value: "remark" },
      ],
    };
  },
  async beforeRouteLeave(to, from, next) {
    if (to.name == "login") {
      next();
      return;
    }
    if (this.editState) {
      // 离开
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
    // 离开-同模块
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
  created() { },
  mounted() { },
  activated() {
    this.getSelectList();
    const { params, query } = this.$route;
    const { id } = params;
    if (id) {
      this.id = id;
      this.init();
    } else {
      this.editState = 1;
      this.showBtnConfig();
      this.createInitAddress();
      // const find = (this.dict['procurement_type'] ?? []).find(d => !Number(d.defaultFlag));
      // this.form = {
      //   ...this.form,
      //   procurementType: find?.dictValue,
      //   procurementTypeName: find?.dictLabel,
      // }
    }
    this.setColumn();
  },
  methods: {
    addPlan() {
      if (!this.form.planType) {
        this.$message.warning("请选择要货计划类型");
        return;
      }
      const list = new Array(1).fill({
        show: true,
        batchNo: `${this.form.billNo}-${(this.form?.purchPlanList ?? []).length + 1}`,
        batch: `第${(this.form?.purchPlanList ?? []).length + 1}批`,
        detailList: (this.form?.detailList ?? []).map(x => {
          // x.orderQty = this.form.planType != 1 ? 0 : x.qty;
          // x.orderAmount = this.form.planType != 1 ? 0 : XEUtils.toFixed(parseFloat(x.qty || 0) * parseFloat(x.bidPrice || 0), 2);
          x.planQty = x.qty;
          x.planDealDate = x.dealDate;
          delete x.id;
          delete x._X_ROW_KEY;
          return x;
        }),
      });

      let purchPlanList = this.form?.purchPlanList ?? [];
      purchPlanList = purchPlanList.concat(list);
      this.form = { ...this.form, purchPlanList };
      console.log('this.form', this.form)
    },

    planCellClick({ row, rowIndex }) {
      console.log('row', row)
      this.planIndex = rowIndex;
      this.planTableList = XEUtils.clone(row?.detailList ?? [], true);
    },
    delPlan(row, index) {
      let purchPlanList = XEUtils.clone(this.form.purchPlanList || [], true);
      if (purchPlanList.length <= 1) {
        this.$message.warning('至少保留一条批次')
        return
      }
      purchPlanList.splice(index, 1);
      if (index == this.planIndex) {
        this.planIndex = null;
        this.planTableList = [];
      }
      this.form = {
        ...this.form, purchPlanList: purchPlanList.map((x, i) => {
          x.batchNo = `${this.form.billNo}-${i + 1}`;
          return x;
        })
      };
    },

    syncApsSubmit() {

      this.$confirm('确认同步吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        const loading = this.$loading({
          lock: true,
          text: "数据同步中",
          spinner: "el-icon-loading",
        });
        apiContract.getSyncAps(this.id).then(res => {
          if (res.code === 200) {
            this.$message.success("数据同步成功");
            this.init();
          } else {
            this.$message.error(res?.message ?? '数据同步失败');
          }
        }).finally(() => {
          setTimeout(() => loading.close(), 1000);
        })

      }).catch(() => {
        return false;
      })

    },

    async orderNotice() {

      // const valid = await new Promise((resolve, reject) => {
      //   this.$refs.planDataForm.validate((valid) => {
      //     resolve(valid);
      //   });
      // });
      // if (!valid) {
      //   this.$message.warning("请填写必填项");
      //   this.activeName = 'yhjh';
      //   return;
      // }

      const planSumQty = this.calcSum((this.form?.purchPlanList ?? []).reduce((acc, item) => {
        acc.concat(item?.detailList ?? [])
        return acc;
      }, []), "planQty");
      const sumQty = this.calcSum(this.form?.detatilList ?? [], "qty");
      if (parseFloat(planSumQty) > parseFloat(sumQty)) {
        this.$message.warning("要货计划本批订单数量不能大于采购商品订单数量");
        this.activeName = 'yhjh';
        return;
      }

      // 输出多批次时间
      let arrivalTimeStr = ''
      if (this.form.purchPlanList?.length) {
        for (const batch of this.form.purchPlanList) {
          arrivalTimeStr += '[' + batch.arrivalTime + '] '
        }
      }
      console.log('arrivalTimeStr', arrivalTimeStr)

      const confirm = await this.$confirm(`请确认采购订单按\n${arrivalTimeStr}发布给供应商？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

        const loading = this.$loading('发布中...');
        apiContract.putOrderRelease({ id: this.id }).then(res => {
          if (res.code === 200) {
            this.$message.success("发布成功");
            this.init();
          } else {
            this.$message.warning(res?.message ?? '发布失败');
          }
        }).catch(err => {
          this.$message.warning(err?.message ?? '发布失败');
        }).finally(() => {
          setTimeout(() => loading.close(), 1000);
        })

      }).catch(() => {
        return false;
      });

    },


    //添加地址
    addAddress() {
      const { deliveryAddress, receiveLinkName, receiveLinkTel, areaCodeList, areaCodeListName } = this.addAddressForm;
      if (!deliveryAddress || !receiveLinkName || !receiveLinkTel || !areaCodeList || !areaCodeListName) {
        this.$message.error("请填写必填项");
        return;
      }
      const { } = this.addAddressForm;
      this.form = {
        ...this.form,
        ...this.addAddressForm,
        name: this.addAddressForm.receiveLinkName,
        tel: this.addAddressForm.receiveLinkTel,
        confirmAddress: this.addAddressForm.areaCodeListName + this.addAddressForm.deliveryAddress + this.addAddressForm.receiveLinkName + this.addAddressForm.receiveLinkTel,
      }
      let params = {
        ...this.addAddressForm,
        name: this.addAddressForm.receiveLinkName,
        tel: this.addAddressForm.receiveLinkTel,
        confirmAddress: this.addAddressForm.areaCodeListName + this.addAddressForm.deliveryAddress + this.addAddressForm.receiveLinkName + this.addAddressForm.receiveLinkTel,
      }
      apiBasic.saveAddress(params).then((res) => {
        if (res.code === 200) {
          this.$message.success("添加成功");
          this.visible.addAddressDrawer = false;
          this.addAddressForm = {
            deliveryAddress: '',
            receiveLinkName: '',
            receiveLinkTel: '',
            defaultFlag: "1",
          },
            this.createInitAddress();
        } else {
          this.$message.error(res.message);
        }
      })
    },

    // 创建初始化地址
    createInitAddress() {
      apiBasic.getAddressList().then((res) => {
        if (res.code === 200 && res.data) {
          let arr = res.data.filter(item => {
            return item.defaultFlag === 1
          })
          if (arr.length > 0) {
            const dataClone = XEUtils.clone(arr, true);
            let list = (dataClone ?? []).map((item) => {
              const { areaCodeList, areaCodeListName, defaultFlag, deliveryAddress, email, name, tel } = item
              return {
                areaCodeList, areaCodeListName, defaultFlag, deliveryAddress, email, name,
                receiveLinkName: name,
                receiveLinkTel: tel,
                confirmAddress: areaCodeListName + deliveryAddress + name + tel
              };
            });
            if (list) {
              let obj = list[0] || {};
              this.form = { ...this.form, ...obj };
            }
          }
        }
      })
    },

    pcaChange(e) {
      console.log(e, "pcaChange");
      // this.form.areaCodeList = e.value;
      // this.form.areaCodeListName = e.name;
      // this.form.countryCode = e.countryCode;
    },

    // delRow(row, rowIndex) {
    //   if (this.form.detailList.length === 1) return this.$message.error('至少保留一条数据')
    //   this.form.detailList.splice(rowIndex, 1);
    // },

    viewPrice(row) {
      this.viewPriceRow = JSON.parse(JSON.stringify(row));
      if (!this.viewPriceRow.sourceId) {
        this.$message.error("数据异常");
        return;
      }
      this.visible.viewPriceVisible = true;
    },

    addSupplierData(data) {
      if (data.length !== 1) {
        this.$message.warning("请选择一个供应商");
        return;
      }
      const obj = data[0] || {};
      let form = { ...this.form };
      this.form = { ...form, supplierName: obj?.supplierName ?? '', supplierId: obj?.id ?? '', supplierBillNo: obj?.billNo ?? '', taxRate: obj?.taxRate ?? 0 };
      this.visible.addSupplierVisible = false;
    },

    onInputBlurFormChange(e) {
      if (e && e.item && e.item.fieldName) {
        const find = (this.descSourceList[e.item.source] || []).find(x => x.value === this.form[e.item.field])
        this.$set(this.form, e.item.fieldName, find?.label ?? '');
      }
    },
    onInputBlur(row) {
      let date = row.arrivalTime;
      if (date && row.detailList) {
        row.detailList.forEach(item => {
          item.planDealDate = moment(date).format('YYYY-MM-DD');
        })
      }
    },


    // 批量填充成功
    onCombineOptionsOk({ field, value }) {
      const selectedRows = this.$refs.table.getCheckboxRecords();
      if (selectedRows.length === 0) {
        this.$message.warning("请选中需填充产品！");
        return;
      }
      selectedRows.forEach((item, index) => {
        let rowindex = this.$refs.table.getRowIndex(item);
        this.$set(this.form.detailList[rowindex], field, value);
      });
      this.$message.success("填充成功");
    },
    onUploadSuccess(e, field, num = 1) {
      const list = this.form[field] || [];
      if (list && list.length >= num) {
        this.$message.warning(`只能上传 ${num} 个附件`);
        return;
      }
      this.$set(this.form, field, num === 1 ? [{ ...e[0] }] : [...list, { ...e[0] }]);
    },
    onImgClick(item, fileList = []) {
      const fileType = (file) => {
        let fileName = file.fileName ?? "";
        let ext = fileName && fileName
          .split(".")
        [fileName.split(".").length - 1].toLowerCase();
        return IMG_EXT.includes(ext);
      };
      if (fileType(item)) {
        this.imgs = fileList.filter((x) => fileType(x))
          .map((i) => {
            return {
              alt: i.originalFileName,
              src: i.url,
              title: i.originalFileName,
            };
          });
        this.previewImg = true;
        this.$nextTick(() => {
          const { lightbox } = this.$refs;
          const { $el } = lightbox;
          document.body.appendChild($el);
          this.previewIndex = this.imgs.findIndex((x) => x.src === item.url);
        });
      }
    },
    viewFile(item, fileList = []) {
      let fileName = item.fileName ?? "";
      let ext = fileName && fileName.split(".")[fileName.split(".").length - 1].toLowerCase();
      if (IMG_EXT.includes(ext)) {
        this.onImgClick(item, fileList);
        return;
      }
      previewFile(item.url)
    },
    getSelectList() {
      apiSystem.getOrderUsersList().then((res) => {
        let descSourceList = { ...this.descSourceList };
        descSourceList.applicantList = (res.data?.submitUser ?? []).map((i) => {
          return {
            label: i.nickName,
            value: i.userName,
          };
        });
        this.descSourceList = { ...descSourceList };
      })
      apiBasic.getQualifiedSupplierList().then((res) => {
        let descSourceList = { ...this.descSourceList };
        descSourceList.confirmedSupplierList = (res.data?.records ?? []).map((i) => {
          return {
            label: i.businessLicense,
            value: i.businessLicense,
          };
        });
        this.descSourceList = { ...descSourceList };
      });
      apiSystem.getJustDeptListList().then((res) => {
        let descSourceList = { ...this.descSourceList };
        descSourceList.adepartmentList = (res.data ?? []).map((i) => {
          return {
            label: i.deptName,
            value: i.deptId,
          };
        });
        this.descSourceList = { ...descSourceList };
      })
    },
    async closePage() {
      const res = await VXETable.modal.confirm({
        title: "提示",
        content: "存在修改状态页面，请确认是否保存！",
        mask: true,
        confirmButtonText: "保存",
      });
      if (res === "confirm") {
        // 修改关闭保存
        const loading = this.$loading({
          lock: true,
          text: "保存中",
          spinner: "el-icon-loading",
        });
        if (this.editState && this.id) {
          const submitRes = await apiBuy.putPurchaseApply(this.form);
          loading.close();
          if (submitRes.code === 200) {
            this.editState = 0;
            this.$message.success("保存成功");
            return true;
          } else {
            this.$message.error(submitRes.message, "修改失败系统异常");
            return false;
          }
        } else {
          const submitRes = await apiBuy.postPurchaseApply(this.form);
          loading.close();
          if (submitRes.code === 200) {
            this.editState = 0;
            this.$tabs.close(
              null,
              `/buyingLead/purchaseApply-detail/${this.id}`
            );
            this.$message.success("保存成功");
            return false;
          } else {
            this.$message.error(submitRes.message, "修改失败系统异常");
            return false;
          }
        }
      }
      if (res === "cancel") {
        if (!this.id) {
          this.$tabs.close();
        } else {
          this.cancel();
        }
        return true;
      }
    },
    integerInputChage(row, rowIndex, field) {
      row[field] = XEUtils.round(row[field], 0);
    },
    addListVisibleFn() {
      if (!this.form.supplierId) {
        this.$message.warning("请先选择供应商");
        return;
      }
      this.visible.addListVisible = true;
    },
    // 添加价目
    addPriceData(data) {
      const dataClone = XEUtils.clone(data, true);
      let list = (dataClone ?? []).map((item) => {
        const { materialCode, materialName, materialTypeId, materialTypeCode, materialTypeName, model, standard, voltageLevel, attribute, unit, taxRate, price, untaxPrice, id } = item
        return { materialCode, materialName, materialTypeId, materialTypeCode, materialTypeName, model, standard, voltageLevel, attribute, unit, taxRate, price, untaxPrice, sourceId: id };
      });
      if (list) {
        let form = { ...this.form };
        let detailList = form.detailList ?? [];
        detailList = detailList.concat(list);
        form.detailList = detailList;
        this.form = { ...form };
        this.$message.success("添加成功");
      }
    },
    // 添加地址
    addAddressData(data) {
      const dataClone = XEUtils.clone(data, true);
      let list = (dataClone ?? []).map((item) => {
        const { areaCodeList, areaCodeListName, defaultFlag, deliveryAddress, email, name, tel } = item
        return {
          areaCodeList, areaCodeListName, defaultFlag, deliveryAddress, email, name,
          receiveLinkName: name,
          receiveLinkTel: tel,
          confirmAddress: areaCodeListName + deliveryAddress + name + tel
        };
      });
      if (list) {
        let obj = list[0] || {};
        this.form = { ...this.form, ...obj };
        this.visible.viewAddressVisible = false;
        this.$message.success("添加成功");
      }
    },
    planInputChage(row, index, column) {

      console.log('row', row)
      console.log('index', index)
      console.log('column', column)
      // let purchPlanList = XEUtils.clone(this.form?.purchPlanList ?? [], true);
      // row.orderAmount = XEUtils.toFixed(parseFloat(row.orderQty || 0) * parseFloat(row.bidPrice || 0), 2);
      // this.planTableList[index] = row;
      // if (this.planIndex !== null) {
      //   purchPlanList[this.planIndex].detailList = [...this.planTableList];
      //   this.form = { ...this.form, purchPlanList };
      // }
    },

    // 表格小数位控制
    getDigits(field) {
      let item = this.columns.find((x) => x.field === field);
      const { params = {} } = item;
      return item && item.params && params.hasOwnProperty("displayDigits")
        ? item.params.displayDigits
        : 0;
    },
    // 表格小数位控制
    getDigits2(column) {
      return column && column.params && column.params.hasOwnProperty("displayDigits")
        ? column.params.displayDigits
        : 0;
    },

    editForm() {
      this.backForm = XEUtils.clone(this.form, true);
      this.editState = this.form.billState === 2 ? 2 : 1;
    },
    cancel() {
      this.editState = 0;
      this.form = { ...this.backForm };
    },
    // 保存
    async submit(state) {
      const valid = await this.validFormData();
      if (!valid) {
        this.$message.error("请填写必填项");
        return false;
      }
      if (state === 1) {
        //新增
        this.addPurchase();
      }
      if (state === 2) {
        if (this.form.planType == 1 && this.form.purchPlanList?.length > 1) {
          this.$message.error('一次性采购订单只有一批次')
          return
        }
        // 验证每个批次内的计划数量不超过下单数量，且总和等于下单数量
        if (this.form.purchPlanList?.length) {
          // 用于存储每个物料的计划数量总和
          const planQtyMap = new Map();

          // 第一遍遍历：验证每个批次的计划数量不超过下单数量，并累加计划数量
          for (const batch of this.form.purchPlanList) {
            if (batch.detailList?.length) {
              for (const planItem of batch.detailList) {
                // 找到对应的订单明细项
                const orderItem = this.form.detailList.find(item => item.rowNum === planItem.rowNum);
                console.log('planItem.planQty', planItem.materialName, planItem.planQty)
                console.log('orderItem.qty', orderItem.materialName, orderItem.qty)

                // 验证单个批次的计划数量不超过下单数量
                if (orderItem && Number(planItem.planQty) > Number(orderItem.qty)) {
                  this.$message.error(`批次 ${batch.batch} 中物料 ${orderItem.materialName} 的计划数量(${planItem.planQty})不能大于下单数量(${orderItem.qty})`);
                  return;
                }

                // 累加每个物料的计划数量
                const currentQty = planQtyMap.get(planItem.rowNum) || 0;
                planQtyMap.set(planItem.rowNum, currentQty + Number(planItem.planQty || 0));
              }
            }
          }

          // 第二遍遍历：验证每个物料的计划数量总和等于下单数量
          for (const orderItem of this.form.detailList) {
            const totalPlanQty = planQtyMap.get(orderItem.rowNum) || 0;
            if (totalPlanQty !== Number(orderItem.qty)) {
              this.$message.error(`物料 ${orderItem.materialName} 在所有批次中的计划数量总和(${totalPlanQty})必须等于下单数量(${orderItem.qty})`);
              return;
            }
          }
        }
        //修改保存
        this.editPurchase();
      }
    },
    addPurchase() {
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      apiContract.postAddOrder(this.form)
        .then((res) => {
          if (res.code === 200 && res.data) {
            this.id = res.data.id;
            this.$tabs.close(
              null,
              `/purchaseOrder/orderApply-detail/${this.id}`
            );
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    editPurchase() {
      const loading = this.$loading({
        lock: true,
        text: "保存中",
        spinner: "el-icon-loading",
      });
      if (this.form.planType == '1') {
        this.form.planTypeName = "一次性采购"
      } else {
        this.form.planTypeName = "多批次采购"
      }

      apiContract.putOrderEdit(this.form)
        .then((res) => {
          if (res.code === 200 && res.data) {
            this.editState = 0;
            this.init();
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    onFilelistUpdate(file) {
      this.descSourceList.fileList = file.fileList.map((item) => {
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
    getDetail() {
      const loading = this.$loading({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
      });
      let id = this.id;
      apiContract.getOrderDetail(id)
        .then((res) => {
          if (res.code === 200 && res.data) {
            this.form = { ...res.data };
            this.form.confirmAddress = res.data.areaCodeListName + '　' + res.data.deliveryAddress + '　' + res.data.receiveLinkName + '　' + res.data.receiveLinkTel
            this.$nextTick(() => {
              if (res.data.purchPlanList) {
                res.data.purchPlanList.forEach(item => item.show = true)
                this.planIndex = 0;
                this.planTableList = res.data.purchPlanList[0]?.detailList ?? [];
              } else {
                this.planIndex = null;
                this.planTableList = [];
              }
              this.initTableConfig();
            })

          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          loading.close();
        });
    },
    showBtnConfig() {
      let data = {
        param: {
          id: this.id ?? null,
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
    async setColumn() {
      const loading = this.$loading({
        lock: true,
        text: "正在加载",
        spinner: "el-icon-loading",
      });
      let data = {
        code: "detailList,detailPlanList,detailOrderList",
        corpCode: this.businessCode ?? "LX",
      };

      const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, data);
      if (res.code === 200 && res.data) {
        this.columns = res.data.detailList?.columns ?? [];
        this.planColumns = res.data.detailPlanList?.columns ?? [];
        this.plancpColumns = res.data.detailOrderList?.columns ?? [];

        this.initTableConfig();
      }

      let dataForm = {
        code: "detailForm,detailPlanForm",
        corpCode: this.businessCode ?? "LX",
      };
      const resform = await apiQuotation.getFormsConfigMulti(this.menuCode, dataForm);
      if (resform.code === 200 && resform.data) {
        this.descItems = resform.data.detailForm?.columns ?? [];
        this.planDescItems = resform.data.detailPlanForm?.columns ?? [];
      }

      setTimeout(() => {
        loading.close();
      }, 1000);
    },
    initTableConfig() {
      const { table, toolbar, plantoolbar, plantable, plancptoolbar, plancptable } = this.$refs;
      if (table) {
        table.connect(toolbar);
        this.initTable('columns', 'tableColumns', table.id);
      }
      if (plantable) {
        plantable.connect(plantoolbar);
        this.initTable('planColumns', 'planTableColumns', plantable.id);
      }
      console.log(' this.$refs', this.$refs);
      console.log('plancptable1111111', plancptable);
      if (plancptable) {
        plancptable.map((item, index) => {
          item.connect(plancptoolbar[index]);
          this.initTable('plancpColumns', 'plancpTableColumns', item.id);
        })
      }

      // if (plancptable) {
      //   plancptable.connect(plancptoolbar);
      //   this.initTable('plancpColumns', 'plancpTableColumns', plancptable.id);
      // }
      this.defaultColumns = XEUtils.clone(this.columns, true);
      this.defaultPlanColumns = XEUtils.clone(this.planColumns, true);
      this.defaultPlancpColumns = XEUtils.clone(this.plancpColumns, true);
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

    validFormData() {
      return new Promise((resolve, reject) => {
        this.$refs.dataForm.validate((valid) => {
          resolve(valid);
        });
      });
    },
    async onSubmitBtnClick() {
      this.beforeSubmit();
    },

    onWorkflowOk() {
      //TODO 刷新表单数据
      this.init();
    },
    async beforeSubmit() {
      const valid = await this.validFormData();
      if (!valid) {
        this.$message.error("请填写必填项");
        return false;
      }
      if (!this.form.detailList.length) {
        this.$message.warning("价目明细不能为空");
        return;
      }
      // if(this.form.sourcingMethod == "single" && !this.form.supplierId){
      //   this.$message.error("单一寻源请选择供应商！");
      //   return 
      // }
      let flag = this.form.detailList.some((x) => Number(x.qty) <= 0 || !x.price || !x.dealDate);
      if (flag) {
        this.$message.error("请补充申请数量，含税单价，交货日期！！");
        return;
      }

      this.onSubmitExamine();
    },
    async onSubmitExamine() {
      const { workflow } = this.$refs;
      const { workflow: workflowComponent } = workflow?.$refs;
      // workflowComponent && workflowComponent.submitWorkflow();
      console.log(workflowComponent.submitWorkflow(), "workflowComponent");
    },
    lztClose() {
      this.lztVisible = false;
      this.lztColumn = {};
      this.lztLoadText = "";
    },
    lztOpen(column) {
      if (!this.editState) return;
      this.lztVisible = true;
      this.lztColumn = column;
      const { visibleData } = this.$refs.table.getTableData();
      let list = [...visibleData];
      this.lztLoadText = (list ?? []).map((x) => x[column.field]).join("\n");
    },
    async lztOk(ztList) {
      const { field } = this.lztColumn;
      const { visibleData, tableData } = this.$refs.table.getTableData();
      if (ztList.length) {
        ztList.forEach((item, index) => {
          if (visibleData[index]) {
            visibleData[index][field] =
              this.lztColumn &&
                this.lztColumn.params &&
                this.lztColumn.params.displayDigits
                ? XEUtils.toFixed(item, this.lztColumn.params.displayDigits)
                : item;
          }
        });
        this.$message.success("操作成功");
        this.lztText = "";
        this.lztVisible = false;
        this.lztColumn = {};
        this.lztLoadText = "";
      }
    },
    upDownMove(e, rowIndex, columnIndex, column, row) {
      if (column.field === "price" || column.field === "qty") {
        row.amount = XEUtils.toFixed(row.price * row.qty, 2);
      }
      if (column.field == "planQty") {
        if (row.planQty > row.qty) {
          this.$message.error("计划数量不能大于下单数量");
          row.planQty = row.qty;
          console.log('row', row)
          console.log('row.qty', row.qty)
          return;
        }
      }

      this.inputFocus(e, rowIndex, columnIndex, column, row);
    },
    inputFocus(e, rowIndex, columnIndex, column) {
      const { code } = e;
      const { table } = this.$refs;
      const max_row = this.form.detailList.length;
      const max_column = this.columns.length;

      //
      const container =
        column.fixed === "left"
          ? table.$el.querySelector(".vxe-table--fixed-left-wrapper")
          : column.fixed === "right"
            ? table.$el.querySelector(".vxe-table--fixed-right-wrapper")
            : table.$el;

      handleNextFocus(
        container,
        code,
        rowIndex,
        columnIndex,
        max_row,
        max_column
      );
    },
    // 加载组件功能
    loading(text) {
      const loading = this.$loading({
        lock: true,
        text,
        spinner: "el-icon-loading",
      });
      return loading;
    },
  },
};
