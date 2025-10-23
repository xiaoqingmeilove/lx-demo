import { descItems, priceColumns } from "./data.js";
import { ApiQuotation, ApiBasic } from "@/apis";
import XEUtils from "xe-utils";
import { mapState } from "vuex";
const apiQuotation = new ApiQuotation();
const apiBasic = new ApiBasic();
export default {
  props: {
    detailList: {
      type: Array,
      default: () => [],
    }
  },
  components: {},
  computed: {
    ...mapState({
      businessCode: (state) => state.Common.businessCode,
    }),
  },
  watch: {},
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      sourceList: {
        unitList: (dict["unit"] ?? []).map((d) => {
          return { label: d.dictLabel, value: d.dictValue };
        }),
        materialTypeList: []
      },
      descItems,
      priceColumns: priceColumns.map((item) => {
        if (item.params && item.params.displayDigits) {
          item.formatter = ({ cellValue, row, column }) => {
            return XEUtils.toFixed(cellValue, item.params.displayDigits);
          };
        }
        return item;
      }),
      priceData: [],
      tableData: [],
      search: {
        model: null,
        standard: null,
      },
      rowslection: null,
      priceRowslection: null,
      pagination: {
        currentPage: 1,
        pageSize: 50,
        total: 0,
        showTotal: () => `共${this.pagination.total}条`,
      },
      addProductForm: {
        unit: "",
        notGeneral: true,
      },
      rulesobj: {
        materialName: [{ required: true, message: '请填写物料名称', trigger: 'blur' },],
        model: [{ required: true, message: '请填写型号', trigger: 'blur' },],
        standard: [{ required: true, message: '请填写规格', trigger: 'blur' },],
        unit: [{ required: true, message: '请选择单位', trigger: 'blur' },],
        qty: [{ required: true, message: '请填写申请数量', trigger: 'blur' },],
        latestArrivalDate: [{ required: true, message: '请选择需求日期', trigger: 'blur' },],
      }
    };
  },
  created() {
    this.getSelectList();
  },
  mounted() {},
  methods: {
    onInputBlurFormChange(e) {
      if(e && e.item && e.item.field === 'materialTypeId'){
        const find = this.filterTree(this.sourceList[e.item.source]||[]).find(x=>x.id === this.addProductForm[e.item.field])
        this.$set(this.addProductForm, 'materialTypeName', find?.name ?? '');
        this.$set(this.addProductForm, 'materialTypeCode', find?.code?? '');
      }
      if(e && e.item && e.item.fieldName){
        const find = (this.sourceList[e.item.source]||[]).find(x=>x.value === this.addProductForm[e.item.field])
        this.$set(this.addProductForm, e.item.fieldName, find?.label ?? '');
      }
      if(e && e.item && ['model','standard'].includes(e.item.field)){
        this.$set(this.search, e.item.field, this.addProductForm[e.item.field]);
        this.searchPrice();
      }
    },
    filterTree(tree) {
      return tree.reduce((acc, item) => {
        if ((item.value ?? '') !== '') {
          acc.push({ ...item });
        }
        if (item.children) {
          acc.push(...this.filterTree(item.children));
        }
        return acc;
      }, []);
    },
    treeFormat(arr, originArr){
      const list = this.filterTree(originArr ?? arr);
      arr.forEach(i=>{
        const find = list.find(x=> i.parentId && x.id == i.parentId);
        // i.label = i.parentId && find && find.label ? find.label + '/' + i?.name : i?.name;
        i.label = `${i.code?i.code + ' - ':''}` + i.name;
        i.value = i.id;
        if (i.children && i.children.length){
          this.treeFormat(i.children, originArr ?? arr)
        }
      })
      return arr
    },
    // 获取一览表
    getSelectList() {
      apiBasic.getMaterialListApi().then((res) => {
        if (res.code === 200 && res.data) {
          let sourceList = { ...this.sourceList };
          sourceList.materialTypeList = this.treeFormat(res.data)
          this.sourceList = { ...sourceList };
        }
      });
    },
    pageChange(e) {
      const { pageSize, currentPage } = e;
      this.pagination = {
        ...this.pagination,
        pageSize: pageSize,
        currentPage: currentPage,
      };
      this.searchPrice(this.pagination.currentPage);
    },
    priceCellClick(e) {
      const { row, rowIndex } = e;
      console.log(row, "priceCellClick");
      const {materialCode, materialName, materialTypeId, materialTypeCode, materialTypeName, model, standard, voltageLevel, attribute, unit, planPrice} = row;
      this.addProductForm = {
        ...this.addProductForm,
        notGeneral: false,
        materialCode, materialName, materialTypeId, materialTypeCode, materialTypeName, model, standard, voltageLevel, attribute, unit, price: planPrice
      }
      
      return ;
    },
    searchPriceClick(page) {
      this.search = {
        ...this.search,
      };
      this.searchPrice(page);
    },
    searchPrice(page = 1) {
      const loading = this.$loading({
        lock: true,
        text: "搜索中",
        spinner: "el-icon-loading",
      });
      let search = { ...this.search };
      this.scrollIsRequest = true;
      let obj = {
        ...search,
        page,
        size: this.pagination.pageSize,
      };
      apiBasic.getMaterialInfoListApi(obj).then((res) => {
        if (res.code === 200 && res.data) {
          this.priceData = res.data?.records ?? [];
          this.pagination.total = res.data.total;
          this.pagination.currentPage = res.data.current;
          setTimeout(() => {
            this.$refs.table1.clearScroll();
          }, 0);
        }else{
          this.$message.error(res.message)
        }
      })
      .finally(() => {
        loading.close();
      });
    },

    searchReset() {
      this.search = {
        model: null,
        standard: null,
      };
      this.pagination.currentPage = 1;
      this.searchPrice();
      //搜索
    },
    submit() {
      this.$refs.addProductForm.validate(valid=>{
        if (valid){
          console.log(this.addProductForm, "addProductForm");
          this.$emit("submit", this.addProductForm);
        } else {
          this.$message.warning("请完善必填项");
        }
      })

      return;
      let data = this.tableData;
      if (data.some((x) => x.match !== true && x.match !== false)) {
        this.$message.warning("请完善是否匹配,非匹配产品会自动生成非常规产品");
        return;
      }
      if (
        data.some(
          (x) =>
            !x.customerModel ||
            !x.customerStandard ||
            !x.auxUnitCode
        )
      ) {
        this.$message.warning("请补全产品或删除产品");
        return;
      }
      this.$emit(
        "submit",
        data.map((i) => {
          if (!i.productCode) {
            i.model = i.customerModel;
            i.standard = i.customerStandard;
            i.voltageLevel = i.customerVoltageLevel;
          }
          return i;
        })
      );
    },
    close() {
      this.$emit("close");
    },
  },
};
