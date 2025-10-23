<template>
  <div class="bill-state">
    <page-button v-if="getFind('dictLabel')" :theme="getFind('remark')">{{
      getFind("dictLabel")
    }}</page-button>
    <page-button theme="cancel" v-else>暂无</page-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "btnStateInfo",
  props: {
    state: {
      type: [String, Number],
      default: null,
    },
    dictName: {
      type: [String, Number],
      default: null,
    },
  },
  computed: {
    ...mapState({
      dict: (state) => state.Common.dict,
    }),
    getFind() {
      return (field) => {
        let find = (this.dict[this.dictName] ?? []).find(
          (x) => x.dictValue == this.state
        );
        return find ? find[field] : null;
      };
    },
  },
  data() {
    return {};
  },
};
</script>

