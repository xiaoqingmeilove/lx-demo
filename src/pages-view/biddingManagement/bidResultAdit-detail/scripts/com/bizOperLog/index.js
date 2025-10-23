import { mapState } from "vuex";
import { ApiBiddingManagement } from "@/apis";
import XEUtils from "xe-utils";
import { handleNextFocus } from "@/utils/vxe-table";

const apiBiddingManagement = new ApiBiddingManagement();

export default {
    name: "bizOperLog",
    props: {
        bizType: {
            type: String,
            default: "",
        },
        formData: {
            type: Object,
            default: () => ({}),
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
        const dict = this.$store.state.Common.dict;
        return {
            activities: [],
            form: {},

        }
    },
    mounted() {
        this.getBizOperLog();
    },
    methods: {
        init() {
        },
        
        // 获取操作记录
        getBizOperLog() {
            const loading = this.loading('加载中...');
            let params = {
                bizType: this.bizType,
                bizId: this.form.id,
            }
            apiBiddingManagement.getBizOperLog(params).then(res => {
                if (res.code === 200) {
                    this.activities = res.data;
                } else {
                    this.$message.error(res.message);
                }
            }).catch(() => {
                this.$message.error(res.message);
            }).finally(() => {
                loading.close();
            });
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
            },
            deep: true,
            immediate: true,
        },
       
    },

}