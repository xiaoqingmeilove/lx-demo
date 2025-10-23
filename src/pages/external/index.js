import XEUtils from "xe-utils";
import { mapState } from "vuex";
import { ApiSystem, ApiPublic } from "@/apis";
import { beckonColumns, bidColumns, seekColumns} from "./data";
const apiSystem = new ApiSystem();
export default {
  components: {},
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      token: (state) => state.User.token ?? null,
      businessCode: (state) => state.Common.businessCode,
    }),
    judgeNum() {
      return (num) => {
        return Number(num) > 0 ? "#ff2020" : "#2eb55b";
      };
    },
  },
  data() {
    return {
      beckonColumns,bidColumns,seekColumns,
      noticeVisible: false,
      tableDate: {
        beckonList:[],
        bidList:[],
        seekList:[],
        seekTitle:"",
        bidTitle:"",
        beckonTitle:"",
      },
      newsList:[],
      noticeContent: "",
      noticeList: [],
      dealList: [
        {
          name: "新增产品",
          number: "500",
          percentage: "+12.34",
          icons: "addproduct",
        },
        {
          name: "采购需求总数量",
          number: "1233",
          percentage: "-12.34",
          icons: "stacking",
        },
        {
          name: "采购来源中",
          number: "433",
          percentage: "+12.34",
          icons: "manual",
        },
        {
          name: "完成采购来源",
          number: "321",
          percentage: "+12.34",
          icons: "approve",
        },
      ],
      menuList: [
        {
          title: "首页",
          class: "navigation-bar",
        },
        {
          title: "询价采购",
          class: "seek",
        },
        {
          title: "竞价采购",
          class: "bid",
        },
        {
          title: "招标采购",
          class: "beckon",
        },
        {
          title: "中标公告",
          class: "news-notice",
        },
        {
          title: "帮助中心",
        },
      ],
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  activated() {},
  methods: {
    init() {
      this.getNoticeList();
      this.getDealList();
      this.getPurchaseList();
    },
    getPurchaseList() {
      ApiPublic.getExternalPurchaseList().then((res) => {
        if (res.code == 200 && res.data) {
          this.tableDate = {...res.data};
        } else {
          this.$message.error(res?.message ?? "系统异常");
        }
      });
    },
    getDealList() {
      ApiPublic.getExternalDealNews().then((res) => {
        if (res.code == 200 && res.data) {
          this.dealList = res.data?.dealList ?? [];
          this.newsList = res.data?.newsList ?? [];
        } else {
          this.$message.error(res?.message ?? "系统异常");
        }
      });
    },
    getNoticeList() {
      ApiPublic.getNoticeList().then((res) => {
        if (res.code == 200) {
          this.noticeList = [...res.data];
        } else {
          this.$message.error(res?.message ?? "中标公告获取失败");
        }
      });
    },
    noticeDbClick(item){
      ApiPublic.getNoticeDetail({id:item.id}).then((res) => {
        if (res.code == 200) {
          this.noticeVisible = true;
          this.noticeContent = res.data.content;
        } else {
          this.$message.error(res?.message ?? "中标公告获取失败");
        }
      });
    },
    jumpTo(path){
      if(this.token){
        this.$router.push({path});
      }else{
        this.$router.push(`/login`);
      }
    },
    scrollTo(name) {
      console.log(name,'name');
      const beckonElement = this.$el.querySelector(`.${name}`);
      if (beckonElement) {
        beckonElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
  },
};
