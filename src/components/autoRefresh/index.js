import XEUtils from "xe-utils";
import { mapState } from "vuex";

export default {
  name: "autoRefresh",
  props: {},
  components: {},
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      dict: (state) => state.Common.dict,
    }),
  },
  watch: {},
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      refreshTime: localStorage.getItem("refreshTime")
        ? JSON.parse(localStorage.getItem("refreshTime"))[this.$route.name] ||
          300000
        : 300000,
      open: localStorage.getItem("openRefreshTime")
        ? JSON.parse(localStorage.getItem("openRefreshTime"))[this.$route.name]
        : false,
      timeList: (dict["refresh_time_list"] ?? []).map((d) => {
        return { label: d.dictLabel, value: Number(d.dictValue) };
      }),
      curtimer: null,
    };
  },
  activated() {
    if (this.open) {
      this.curtimer = setInterval(() => {
        this.$emit("init");
      }, this.refreshTime);
    }
  },
  deactivated() {
    if (this.curtimer) {
      clearInterval(this.curtimer);
    }
  },
  mounted() {},
  methods: {
    openChange({ checked }) {
      if (this.curtimer) {
        clearInterval(this.curtimer);
      }
      if (checked) {
        this.curtimer = setInterval(() => {
          this.$emit("init");
        }, this.refreshTime);
      }
      let checkedObj = localStorage.getItem("openRefreshTime")
        ? JSON.parse(localStorage.getItem("openRefreshTime"))
        : {};
      checkedObj[this.$route.name] = checked;
      localStorage.setItem("openRefreshTime", JSON.stringify(checkedObj));
    },
    refreshTimeChange({ value }) {
      // if (this.curtimer) {
      //   clearInterval(this.curtimer);
      // }
      // if (value) {
      //   this.curtimer = setInterval(() => {
      //     this.$emit("init");
      //   }, this.refreshTime);
       
      // }
      let refreshTimeObj = localStorage.getItem("refreshTime")
      ? JSON.parse(localStorage.getItem("refreshTime"))
      : {};
    refreshTimeObj[this.$route.name] = value;
    localStorage.setItem("refreshTime", JSON.stringify(refreshTimeObj));
    },
  },
  beforeDestroy() {
    if (this.curtimer) {
      clearInterval(this.curtimer);
    }
  },
};
