import { mapState } from "vuex";
import { ApiBiddingManagement } from "@/apis";
import XEUtils from "xe-utils";
import supplierList from "@/pages-components/supplierList/index.vue";


const apiBiddingManagement = new ApiBiddingManagement();

export default {
    name: "supplierSelect",
    components: {
        supplierList,
    },
    props: {
        form: {
            type: Object,
            default: () => ({}),
        },
        columns: {
            type: Array,
            default: () => [],
        },

        editState: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState({
            menus: (state) => state.User.menus ?? [],
            userInfo: (state) => state.User.userInfo ?? {},
            businessCode: (state) => state.Common.businessCode,
        }),
    },
    data() {
        return {
            formDataShow: {
                gys: true,
                gysbg: true,
                gyskp: false,
            },
            descSourceList: {
                suggestedFlag: [
                    { label: '是', value: 1 },
                    { label: '否', value: 0 },
                ],
            },
            addSupplierVisible: false,
            localForm: {},
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        addSupplierData(data) {
            const dataClone = XEUtils.clone(data || [], true);
            console.log('dataClone' , dataClone);
            let form = { ...this.localForm };
            let supplierList = form.supplierList ?? [];
            const list = dataClone.filter(f => !supplierList.some(s => s.supplierId == f.supplierId));
            if (!list.length) {
                this.$message.warning("选择供应商已添加，请重新选择供应商");
                return
            }
            if (list) {
                list.map(item => {
                    item.id = null
                })
                supplierList = supplierList.concat(list);
                form.supplierList = supplierList;
                this.localForm = { ...form };
                this.$emit("update:form", this.localForm);
                this.$message.success("添加成功");
            };
        },
        gysSubmit() {
            const loading = this.loading("提交中");
            apiBiddingManagement.putShotlistSubmit({ id: this.localForm.id }).then(res => {
                if (res.code === 200) {
                    this.$message.success("供应商入围提交成功");
                    this.$emit("init");
                } else {
                    this.$message.error(res.message);
                }
            }).finally(() => {
                loading.close();
            });
        },
        gysSave() {
            const loading = this.loading("保存中");
            apiBiddingManagement.putShotlistEdit(this.localForm).then(res => {
                if (res.code === 200) {
                    this.$message.success("供应商入围保存成功");
                    this.$emit("init");
                } else {
                    this.$message.error(res.message);
                }
            }).finally(() => {
                loading.close();
            });
        },
        init() {
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
    watch: {
        form: {
            handler(newVal) {
                this.localForm = XEUtils.clone(newVal, true);
                if(newVal.bizFlowStatus>2){
                    this.formDataShow.gysbg = true;
                    this.formDataShow.gyskp = false;
                }
            },
            deep: true,
            immediate: true,
        },
    },

}