import XEUtils from "xe-utils";
import moment from "moment";
import { mapState } from "vuex";
import { ApiQuotation, ApiBuy, ApiBiddingManagement, ApiSystem } from "@/apis";
import { handleStorageColumns } from "@/utils/vxe-table";
import { handleNextFocus } from "@/utils/vxe-table";
import { previewFile } from '@/utils/utils';
import mixin_table from "./scripts/mixins/table";
import VXETable from "vxe-table";
import VueEasyLightbox from "vue-easy-lightbox";
import supplierList from "@/pages-components/supplierList/index.vue";
import expertList from "@/pages-components/expertList/index.vue";
import columnPasting from "@/pages-components/columnPasting/index.vue";
import productList from "@/pages-components/productList/index.vue";
import materialList from "@/pages-components/materialList/index.vue";
import addUnconventional from "./scripts/com/addUnconventional/index.vue";
import timeline from "@/pages-components/timeline/index.vue";
import bidPreparation from "./scripts/com/bidPreparation/index.vue";
import supplierSelect from "./scripts/com/supplierSelect/index.vue";
import answeringQuestion from "./scripts/com/answeringQuestion/index.vue";
import bidReview from "./scripts/com/bidReview/index.vue";
import bidConfirm from "./scripts/com/bidConfirm/index.vue";
import FilelistList from "@/Controls/filelist-list/index.vue";
import negotiations from "./scripts/com/negotiations/index.vue";
import bidReviewDetail from "./scripts/com/bidReviewDetail/index.vue";
import noticeModal from "@/pages-components/notice/notice.vue";
import { handContent } from "./scripts/utils/helper.js";
import bizOperLog from "./scripts/com/bizOperLog/index.vue";
import bidStep from "@/pages-components/bid-step/index.vue";


const apiQuotation = new ApiQuotation();
const apiBuy = new ApiBuy();
const apiBiddingManagement = new ApiBiddingManagement();
const apiSystem = new ApiSystem();
const IMG_EXT = ["jpg", "png", "jpeg", "gif", "bmp"];
export default {
    mixins: [mixin_table],
    components: {
        VueEasyLightbox,
        columnPasting,
        productList,
        materialList,
        addUnconventional,
        timeline,
        supplierList,
        expertList,
        bidPreparation,
        supplierSelect,
        answeringQuestion,
        bidReview,
        bidConfirm,
        FilelistList,
        negotiations,
        bidReviewDetail,
        noticeModal,
        bizOperLog,
        bidStep
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
        bindDescItems() {
            if (!this.form.billState) {
                return this.descItems.filter(x => x.field !== 'urgentFlag')
            }
            return this.descItems;
        }
        
    },
    data() {
        const dict = this.$store.state.Common.dict;
        return {
            reverse: true,
            activities: [],
            dict,
            moment,
            noticeVisible: false,
            editNoticeState: false,
            noticeForm: {},
            activeName: 'pb', // 默认选中
            activeNameList: ['jbxx', 'cgmx', 'gys','zbwj','dyzx','pb'],
            menuCode: "bidding_tenderingApply",
            fileBillTpye: "PA",
            addSupplierVisible: false,
            addListVisible: false,
            addExpertVisible: false,
            id: null,
            lztVisible: false,
            lztColumn: {},
            lztLoadText: "",
            lztText: "",
            allBtnControlList: [],
            supplierColumns: [],
            pzbjColumns: [],
            zbjhsjColumns: [],
            bidConfirmItems: [],
            bidConfirmColumns: [],
            dbqrColumns: [],
            tabList: [],
            businessRule: [],
            editState: false,
            form: {
                urgentFlag: 0,
                procurementType: '',
                procurementTypeName: '',
                detailList: [],
                fileList: [],
            },
            formDataShow: {
                jbxx: true,
                cgmx: true,
                gys: true,
                fjxx: true,
                zbfa: true,
                pzbj: true,
                zbjhsj: true,
                zbwj: true,
                qt: true,
                czjl: true,
                sjap: true,
                bsbz: true,
                dyzx: true,
                pb: true,
                pbDetail: true,
                tb: true,
                db: true,
                swtp: true,
            },
            backForm: {},
            columns: [],
            rulesobj: {
                projectName: [{ required: true, message: "请输入项目名称" }],
            },
            descItems: [],
            descSourceList: {
                unitList: (dict['unit'] || []).map(x => {
                    return { label: x.dictLabel, value: x.dictValue }
                }),
                tender_opening_type: (dict["tender_opening_type"] ?? []).map((d) => {
                    return { label: d.dictLabel, value: d.dictValue };
                }), //开标方式
                tender_evaluation_type: (dict["tender_evaluation_type"] ?? []).map((d) => {
                    return { label: d.dictLabel, value: d.dictValue };
                }), //评标方式
                tender_evaluation_method: (dict["tender_evaluation_method"] ?? []).map((d) => {
                    return { label: d.dictLabel, value: d.dictValue };
                }), //评定标方法

                purchaseTypeList: (dict["tender_purchase_type"] ?? []).map((d) => {
                    return { label: d.dictLabel, value: d.dictValue };
                }), //采购类型
                purchaseMethodList: (dict["tender_purchase_method"] ?? []).map((d) => {
                    return { label: d.dictLabel, value: d.dictValue };
                }), //采购方式
                bidScopeList: (dict["tender_bid_scope"] ?? []).map((d) => {
                    return { label: d.dictLabel, value: d.dictValue };
                }), //招标范围
                pricingMethodList: (dict["tender_pricing_method"] ?? []).map((d) => {
                    return { label: d.dictLabel, value: d.dictValue };
                }), //计价模式
                projectStatusList: (dict["tender_project_status"] ?? []).map((d) => {
                    return { label: d.dictLabel, value: d.dictValue };
                }), //立项状态
                entrustTypeList: (dict["tender_entrust_type"] ?? []).map((d) => {
                    return { label: d.dictLabel, value: d.dictValue };
                }),
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
                { label: "申请数量", value: "qty", type: "number", toFixed: 2 },
                {
                    label: "需求日期", value: "purchaseDate", type: "date", props: {
                        pickerOptions: {
                            disabledDate(current) {
                                return current < moment().subtract(1, "day");
                            },
                        },
                    }
                },
                { label: "备注", value: "remark" },
            ],
            addUnconVisible: false,
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
        const { params, query } = this.$route;
        const { id } = params;
        if (id) {
            this.id = id;
            this.init();
        } else {
            this.editState = true;
            this.showBtnConfig();
            this.form = {
                ...this.form,
                "purchaseType": 'GOODS',
                "purchaseMethod": 'INVITED_BIDDING',

                ruleMap: {
                    tender_opening_type: (this.dict["tender_opening_type"] ?? []).find(d => d.defaultFlag == 0)?.dictValue,
                    tender_evaluation_type: (this.dict["tender_evaluation_type"] ?? []).find(d => d.defaultFlag == 0)?.dictValue,
                    tender_evaluation_method: (this.dict["tender_evaluation_method"] ?? []).find(d => d.defaultFlag == 0)?.dictValue,
                }
            }
        }
        this.setColumn();
    },
    methods: {

        selectActiveName(name) {
            return this.activeNameList.includes(name);
        },
        activeNameChange(form) {
            let { bizFlowStatus } = form;
            switch (bizFlowStatus) {
                case '0':
                    this.activeName = 'jbxx';
                    this.activeNameList = ['jbxx', 'cgmx', 'gys', 'czjl'];
                    break;
                case '1':
                    this.activeName = 'gys';
                    this.activeNameList = ['jbxx', 'cgmx', 'gys', 'bsbz', 'czjl'];
                    break;
                case '2':
                    this.activeName = 'gys';
                    this.activeNameList = ['jbxx', 'cgmx', 'gys', 'bsbz', 'czjl'];
                    break;
                case '3':
                    this.activeName = 'bsbz';
                    this.activeNameList = ['jbxx', 'cgmx', 'gys', 'bsbz', 'czjl'];
                    break;
                case '4':
                    this.activeName = 'jbxx';
                    this.activeNameList = ['jbxx', 'cgmx', 'gys','zbwj', 'czjl'];
                    break;
                case '5':
                    this.activeName = 'dyzx';
                    this.activeNameList = ['jbxx', 'cgmx', 'gys','zbwj','dyzx', 'czjl'];
                    break;
                case '6':
                    this.activeName = 'gys';
                    this.activeNameList = ['jbxx', 'cgmx', 'gys','zbwj','dyzx', 'czjl'];
                    break;
                case '7':
                    this.activeName = 'pb';
                    this.activeNameList = ['jbxx', 'cgmx', 'gys','zbwj','dyzx', 'pb',  'czjl'];
                    break;
                case '8':
                    this.activeName = 'pbDetail';
                    this.activeNameList = ['jbxx', 'cgmx', 'gys','zbwj','dyzx', 'pbDetail', 'swtp', 'czjl' ];
                    break;
                case '9':
                    this.activeName = 'db';
                    this.activeNameList = ['jbxx', 'cgmx', 'gys','zbwj','dyzx', 'pbDetail', 'swtp', 'db', 'czjl'];
                    break;
                default:
                    this.activeName = 'jbxx';
                    this.activeNameList = ['jbxx', 'cgmx', 'gys', 'czjl'];
                    break;
            }
        },
        bidApply() {
           const loading = this.$loading({
                lock: true,
                text: "定标申请中...",
                spinner: "el-icon-loading",
            });
            apiBiddingManagement.putBidApply({ id: this.id }).then((res) => {
                if (res.code === 200) {
                    this.$message.success("定标申请成功");
                    this.init();
                } else {
                    this.$message.error(res.message);
                }
            }).finally(() => {
                loading.close();
            });
        },

        signEnd() {
            this.$confirm('确定报名结束吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const loading = this.$loading({
                    lock: true,
                    text: "报名结束中",
                    spinner: "el-icon-loading",
                });
                await apiBiddingManagement.putSignEnd({ id: this.id }).then((res) => {
                    if (res.code === 200) {
                        this.$message.success("报名结束成功");
                        this.init();
                    } else {
                        this.$message.error(res.message);
                    }
                }).finally(() => {
                    loading.close();
                });
            })
        },
        bidSave() {
            this.$refs.bidConfirm.handleSave();
        },
        gysSubmit() {
            this.$refs.supplierSelect.gysSubmit();
        },
        gysSave() {
            this.$refs.supplierSelect.gysSave();
        },
        openBid() {
            const loading = this.$loading({
                lock: true,
                text: "开标中",
                spinner: "el-icon-loading",
            });
            apiBiddingManagement.putBidOpen({ id: this.id }).then((res) => {
                if (res.code === 200) {
                    this.$message.success("开标成功");
                    this.init();
                } else {
                    this.$message.error(res.message);
                }
            }).finally(() => {
                loading.close();
            });
        },
        submitReview() {
            this.$refs.bidReview.submitReview();
        },
        bidConfirm() {
            this.$refs.bidConfirm.handleSubmit();
        },
        publishBidding() {
            this.$confirm('确定发布招标吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const loading = this.$loading({
                    lock: true,
                    text: "发布中",
                    spinner: "el-icon-loading",
                });
                await apiBiddingManagement.tenderRelease({ id: this.id }).then((res) => {
                    if (res.code === 200) {
                        this.$message.success("发布成功");
                        this.init();
                    } else {
                        this.$message.error(res.message);
                    }
                }).finally(() => {
                    loading.close();
                });
            })
        },
        submitBidding() {
            this.$confirm('确定发标吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const loading = this.$loading({
                    lock: true,
                    text: "发标中",
                    spinner: "el-icon-loading",
                });
                await apiBiddingManagement.putBidRelease({ id: this.id }).then((res) => {
                    if (res.code === 200) {
                        this.$message.success("发标成功");
                        this.init();
                    } else {
                        this.$message.error(res.message);
                    }
                }).finally(() => {
                    loading.close();
                });
            })
        },
        closeAnswer() {
            this.$confirm('确定结束答疑吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const loading = this.$loading({
                    lock: true,
                    text: "答疑结束中",
                    spinner: "el-icon-loading",
                });
                await apiBiddingManagement.putFinishAnswer({ id: this.id }).then((res) => {
                    if (res.code === 200) {
                        this.$message.success("答疑结束成功");
                        this.init();
                    } else {
                        this.$message.error(res.message);
                    }
                }).finally(() => {
                    loading.close();
                });
            })
        },
        async bsbzSave() {
            const bidPreparationRef = this.$refs.bidPreparation
            bidPreparationRef && await bidPreparationRef.editSave()
            this.editState = false;
            this.init();
        },
        async bsbzSubmit() {
            const bidPreparationRef = this.$refs.bidPreparation
            bidPreparationRef && await bidPreparationRef.editSubmit()
            this.editState = false;
            this.init();
        },
        onInputBlurFormChange(e) {
            if (e && e.item && e.item.fieldName) {
                const find = (this.descSourceList[e.item.source] || []).find(x => x.value === this.form[e.item.field])
                this.$set(this.form, e.item.fieldName, find?.label ?? '');
            }
        },
        addUnconOk(data) {
            let row = { ...data };
            let detailList = [...this.form.detailList];
            row.hasOwnProperty('_X_ROW_KEY') && delete row._X_ROW_KEY;
            console.log(row, "addUnconOk");
            detailList = detailList.concat([row]);
            this.$set(this.form, "detailList", detailList);
            this.$message.success("添加成功");
        },
        handleClose(done) {
            this.addUnconVisible = false;
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
                        this.editState = false;
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
                        this.editState = false;
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
        // 添加产品
        addProductData(data) {
            const dataClone = XEUtils.clone(data, true);
            let list = (dataClone ?? []).map((item) => {
                const { materialCode, materialName, materialTypeId, materialTypeCode, materialTypeName, model, standard, voltageLevel, attribute, unit, planPrice } = item
                return { materialCode, materialName, materialTypeId, materialTypeCode, materialTypeName, model, standard, voltageLevel, attribute, unit, price: planPrice };
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
        // 表格小数位控制
        getDigits(field) {
            let item = this.columns.find((x) => x.field === field);
            const { params = {} } = item;
            return item && item.params && params.hasOwnProperty("displayDigits")
                ? item.params.displayDigits
                : 0;
        },
        editForm() {
            this.backForm = XEUtils.clone(this.form, true);
            this.editState = true;
        },
        cancel() {
            this.editState = false;
            this.form = { ...this.backForm };
        },
        // 保存
        submit(state) {
            this.form.ruleList = this.businessRule.concat(this.zbjhsjColumns);
            if (state === 1) {
                //新增
                this.addTender();
            } else if (state === 2) {
                //修改保存
                this.editTender();
            }
        },
        addTender() {
            const loading = this.$loading({
                lock: true,
                text: "保存中",
                spinner: "el-icon-loading",
            });
            apiBiddingManagement.addTender(this.form).then((res) => {
                if (res.code === 200 && res.data) {
                    this.id = res.data.billId;
                    this.$tabs.close(
                        null,
                        `/biddingManagement/tenderingApply-detail/${this.id}`
                    );
                } else {
                    this.$message.error(res.message);
                }
            }).finally(() => {
                loading.close();
            });
        },
        editTender() {
            const loading = this.$loading({
                lock: true,
                text: "保存中",
                spinner: "el-icon-loading",
            });
            apiBiddingManagement.editTender(this.form).then((res) => {
                if (res.code === 200 && res.data) {
                    this.editState = false;
                    this.$message.success("保存成功");
                    this.init();
                } else {
                    this.$message.error(res.message);
                }
            }).finally(() => {
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
            this.editState = false;
        },
        getDetail() {
            const loading = this.$loading({
                lock: true,
                text: "加载中",
                spinner: "el-icon-loading",
            });
            let id = this.id;
            apiBiddingManagement.getBidReviewTenderExpertDetail({ id }).then((res) => {
                if (res.code === 200 && res.data) {
                    this.form = { ...res.data };
                    // this.activeNameChange(this.form);
                } else {
                    this.$message.error(res.message);
                }
            }).finally(() => {
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
                code: "viewDetailList,viewDetailList2,detailList3,detailList4,tabList,detailList5",
                corpCode: this.businessCode ?? "LX",
            };
            const res = await apiQuotation.getColumnsConfigMulti(this.menuCode, data);
            if (res.code === 200 && res.data && res.data) {
                this.columns = [...res.data.viewDetailList.columns];
                this.supplierColumns = [...res.data.viewDetailList2.columns];
                this.pzbjColumns = [...res.data.detailList3.columns];
                this.bidConfirmColumns = [...res.data.detailList4.columns];
                this.tabList = [...res.data.tabList.columns];
                this.dbqrColumns = [...res.data.detailList5.columns];
                this.initTableConfig();
            }
            let dataForm = {
                code: "detailForm,detailForm2,detailForm3,detailForm4",
                corpCode: this.businessCode ?? "LX",
            };
            const resform = await apiQuotation.getFormsConfigMulti(
                this.menuCode,
                dataForm
            );
            if (resform.code === 200 && resform.data) {
                let dataItems = resform.data.detailForm.columns;
                this.descItems = [...dataItems];
                this.businessRule = [...resform.data.detailForm2.columns];
                this.zbjhsjColumns = [...resform.data.detailForm3.columns];
                this.bidConfirmItems = [...resform.data.detailForm4.columns];
            }

            setTimeout(() => {
                loading.close();
            }, 1000);
        },
        delExpert(row, rowIndex) {
            this.form.expertList.splice(rowIndex, 1);
        },
        delSupplier(row, rowIndex) {
            this.form.supplierList.splice(rowIndex, 1);
        },
        issueOk(data) {
            const loading = this.$loading({
                lock: true,
                text: "发布中",
                spinner: "el-icon-loading",
            });
            console.log(data, 'data');
            apiSystem.putProclamation(data).then(res => {
                if (res.code == 200) {
                this.$message.success(res.message ?? "发布成功");
                this.init();
                } else {
                this.$message.error(res.message);
                }
            }).finally(() => {
                loading.close();
            });
        },
        noticeClose() {
            this.noticeForm = {};
            this.editNoticeState = false;
            this.noticeVisible = false;
        },
        editNotice() {
            this.noticeForm = {
                deadline: moment().add(3, 'days').format('YYYY-MM-DD HH:mm:ss'),
                officialWebsite: 1,
                content: handContent(this.form),
                relevanceProjectName: this.form.projectName,
                relevanceBillNo: this.form.billNo,
                relevanceBillType: "RC",
            };
            this.editNoticeState = true;
            this.noticeVisible = true;
        },

        addSupplierData(data) {
            const dataClone = XEUtils.clone(data || [], true);
            let form = { ...this.form };
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
                this.form = { ...form };
                this.$message.success("添加成功");
            };
        },
        addExpertData(data) {
            const dataClone = XEUtils.clone(data || [], true);
            let form = { ...this.form };
            let expertListData = form.expertList ?? [];
            const list = dataClone.filter(f => !expertListData.some(s => s.expertId == f.employeeId));
            console.log('list', list);
            if (!list.length) {
                this.$message.warning("选择专家已添加，请重新选择专家");
                return
            }

            if (list) {
                expertListData = expertListData.concat(list);
                this.$set(this.form, 'expertList', expertListData);
                this.$message.success("添加成功");
                console.log('form', this.form);
            }
        },
        initTableConfig() {
            const { table, toolbar } = this.$refs;
            if (table) {
                table.connect(toolbar);
                this.initTable();
            }

            this.defaultColumns = XEUtils.clone(this.columns, true);
        },
        initTable() {
            const { table } = this.$refs;
            const tableColumns = this.columns.map((item) => {
                const { params = {} } = item;
                if (item.params && params.hasOwnProperty("displayDigits")) {
                    item.formatter = ({ cellValue, row, column }) => {
                        return XEUtils.toFixed(cellValue, column.params.displayDigits);
                    };
                }
                return item;
            });
            this.columns = handleStorageColumns(tableColumns, table.id);
        },
        onToolOk(e) {
            const { type, data } = e;
            const fn = this.toolMethods()[type];
            fn && fn(data);
        },
        toolMethods() {
            return {
                set_column: ({ columns }) => {
                    this.columns = columns;
                },
            };
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
            // if (!valid) {
            //     this.$message.error("请填写必填项");
            //     return false;
            // }
            // if (!this.form.detailList.length) {
            //     this.$message.warning("采购明细不能为空");
            //     return;
            // }

            // let flag = this.form.detailList.some((x) => !Number(x.qty) || !x.purchaseDate);
            // if (flag) {
            //     this.$message.error("请补充申请数量，需求日期！！");
            //     return;
            // }
            // if (this.editState) {
            //     const loading = this.$loading({
            //         lock: true,
            //         text: "保存中",
            //         spinner: "el-icon-loading",
            //     });
            //     apiBuy.putPurchaseApply(this.form).then((res) => {
            //         if (res.code === 200 && res.data) {
            //             this.editState = false;
            //         } else {
            //             this.$message.error(res.message);
            //             return false;
            //         }
            //     }).finally(() => {
            //         loading.close();
            //     });
            // }
            this.onSubmitExamine();
        },
        async onSubmitExamine() {
            const { workflow } = this.$refs;
            const { workflow: workflowComponent } = workflow?.$refs;
            workflowComponent && workflowComponent.submitWorkflow();
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
        upDownMove(e, rowIndex, columnIndex, column) {
            this.inputFocus(e, rowIndex, columnIndex, column);
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
