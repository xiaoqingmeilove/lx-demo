import { mapState } from "vuex";
import { ApiBiddingManagement } from "@/apis";
import XEUtils from "xe-utils";

const apiBiddingManagement = new ApiBiddingManagement();

export default {
    name: "negotiations",
    props: {
        formData: {
            type: Object,
            default: () => ({}),
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
            form: {},
            searchSupplier: '',
            negotiateList: [],
            supplierList: [],
            backSupplierList:[],
            supplierId:'',
            createForm: {
                negotiateDate:'',
                negotiateTime:'',
                place:'',
                participants:'',
                content:'',
                amount:'',
                oldAmount:'',
                fileList:[]
            },
        }
    },
    mounted() {
    },
    methods: {
        init() {
            this.getNegotiateDetailList( this.form.id  );
            this.createForm = {
                negotiateDate:'',
                place:'',
                participants:'',
                content:'',
                amount:'',
                oldAmount: this.supplierList.find(item => item.checked).amount,
                fileList:[]
            }
        },
        handleSearchSupplier() {
            if( this.searchSupplier ) {
                this.supplierList = this.backSupplierList.filter(item => item.supplierName.includes(this.searchSupplier));
                
            } else {
                this.supplierList = this.backSupplierList;
            }
        },
        getNegotiateDetailList(id ) {
            const params = {
                id: id,
                supplierId: this.supplierId
            }
            const loading = this.loading('加载中...');
            apiBiddingManagement.getNegotiateDetailList(params).then(res => {
                if( res.code === 200 ) {
                    this.negotiateList = res.data.negotiateList?.map(item => {
                        return{
                            ...item,
                            checked: false
                        }
                    });
                    this.supplierList = res.data.supplierList?.map(item => {
                        if(this.supplierId == item.id) {
                            item.checked = true;
                        } else {
                            item.checked = false;
                        }
                        return item;
                    });
                    if(this.supplierList.length > 0) {
                       let supplier = this.supplierList.find(item => item.checked)
                       if(!supplier) {
                        this.supplierList[0].checked = true;
                        this.supplierId = this.supplierList[0].id;
                        this.createForm.oldAmount = this.supplierList[0].amount;
                       }
                    }
                    this.backSupplierList = XEUtils.clone(this.supplierList,true);
                }
            }).finally(() => {
                loading.close();
            });
        },
        handleSupplierClick(item) {
            this.supplierList.forEach(item => {
                item.checked = false;
            });
            item.checked = true;
            this.supplierId = item.id;
            this.init();
        },
        postNegotiateSave() {
            const loading = this.loading('保存中...');
            const params = {
                ...this.createForm,
                masterId: this.form.id,
                // supplierId: this.supplierList.find(item => item.checked).id,
                supplierId: this.supplierId
            };
            apiBiddingManagement.postNegotiateSave(params).then(res => {
                if( res.code === 200 ) {
                    // this.init();
                    this.getNegotiateDetailList( this.form.id  );
                    this.$message.success('保存成功');
                } else {
                    this.$message.error(res.message);
                }
            }).finally(() => {
                loading.close();
            });
        },
        postNegotiateSubmit() {
            const loading = this.loading('提交中...');
            const params = {
                ...this.createForm,
                masterId: this.form.id,
                supplierId: this.supplierId
            };
            apiBiddingManagement.postNegotiateSubmit(params).then(res => {
                if( res.code === 200 ) {
                    this.$message.success('提交成功');
                    this.init();
                } else {
                    this.$message.error(res.message);
                }
            }).catch(err => {
                this.$message.error(err.message);
            }).finally(() => {
                loading.close();
            });
        },
        handleNegotiateRecordClick(item) {
            this.negotiateList.forEach(item => {
                item.checked = false;
            });
            item.checked = true;
            this.createForm = XEUtils.clone(item,true);
            this.createForm.oldAmount = this.supplierList.find(item => item.checked).amount;
            this.createForm.fileList =  item.fileList.map(item => {
                return {
                    ...item,
                    url: item.url,
                    name: item.originalFileName,
                }
            });
        },
        handleChange(file, fileList)  {
            this.createForm.fileList = fileList.map(item => {
                if( item.response?.data ) {
                    return {
                        ...item.response?.data,
                        url: item.response?.data.filePath,
                        name: item.response?.data.originalFileName,
                    }
                } else {
                    return {
                        ...item,
                        url: item.url,
                        name: item.name,
                    }
                }
            });
        },
        handleCancel() {
            this.init();
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
        formData: {
            handler(newVal) {
                this.form = newVal;
                this.getNegotiateDetailList( newVal.id );
               
            },
            deep: true,
            immediate: true,
        },
    },

}