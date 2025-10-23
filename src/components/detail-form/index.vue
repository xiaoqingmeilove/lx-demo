<template>
  <div class="page">
    <!-- 非修改状态 -->
    <el-form class="demo-ruleForm" v-if="editState === false">
      <template v-for="item in formData">
        <div
          class="sub-title"
          :label="item.title"
          v-if="item.edit === 'sub-title'"
        >
          <sub-title :title="item.title"></sub-title>
        </div>
        <el-form-item :label="item.title" v-else>
          <div v-if="item.type === 'radio'">
            <span v-for="i in item.souce">
              <span v-if="i.value === form[item.field]">{{ i.text }}</span>
            </span>
          </div>

          <span v-else>
            <el-tooltip
              class="item"
              effect="dark"
              :content="`${form[item.field]}`"
              placement="top"
            >
              <span>{{ form[item.field] }}</span>
            </el-tooltip>
          </span>
        </el-form-item>
      </template>
    </el-form>
    <!-- 修改状态 -->
    <el-form class="demo-ruleForm" v-else>
      <template v-for="item in formData">
        <el-form-item :label="item.title" v-if="item.edit === false">
          <span>
            <el-tooltip
              class="item"
              effect="dark"
              :content="`${form[item.field]}`"
              placement="top"
            >
              <span>{{ form[item.field] }}</span>
            </el-tooltip>
          </span>
        </el-form-item>
        <div
          class="sub-title"
          :label="item.title"
          v-else-if="item.edit === 'sub-title'"
        >
          <sub-title :title="item.title"></sub-title>
        </div>
        <el-form-item :label="item.title" v-else>
          <el-input
            style="width: 100%"
            type="text"
            v-model="form[item.field]"
            v-if="item.type == 'input'"
            >{{ form[item.field] }}</el-input
          >
          <el-input
            style="width: 100%"
            type="number"
            :precision="2"
            v-else-if="item.type == 'inputnumber'"
            v-model="form[item.field]"
            >{{ form[item.field] }}</el-input
          >
          <el-select
            v-else-if="item.type == 'select'"
            v-model="form[item.field]"
          >
            <el-option key="1" value="1">1</el-option>
            <el-option key="2" value="2">2</el-option>
            <el-option key="3" value="3">3</el-option>
            <el-option key="4" value="4">4</el-option>
          </el-select>
          <template v-else-if="item.type == 'radio'">
            <span v-for="i in item.souce">
              <el-radio v-model="form[item.field]" :label="i.value">{{
                i.text
              }}</el-radio>
            </span>
            <!-- {{item.text}} -->
          </template>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "detailForm",
  props: {
    formData: {
      type: Array,
      default: () => [],
    },
    form: {
      type: Object,
      default: () => {},
    },
    editState: {
      type: Boolean,
      default: false,
    },
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.page {
  .demo-ruleForm {
    display: flex;
    flex-wrap: wrap;
    .sub-title {
      width: 100%;
      margin-top: 10px;
    }
    .el-form-item {
      width: 25%;
      margin: 0;
      display: flex;
      align-items: center;
      border: 1px solid #e8eaec;
    }
    /deep/.el-form-item__label {
      height: 100%;
      width: 140px;
      text-align: left;
      padding-left: 10px;
      background-color: #f8f8f9;
      border-right: 1px solid #e8eaec;
      display: flex;
      align-items: center;
    }
    /deep/.el-form-item__content {
      flex: 1;
      padding: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      span {
        padding-left: 10px !important;
      }
    }
  }
  /deep/.page-header {
    .page-header-title > div {
      padding: 0 !important;
    }
  }
}
</style>
