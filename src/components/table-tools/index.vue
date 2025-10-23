<template>
  <div class="table-tools">
    <!-- <table-maximize v-if="isInTools('maximize')" @ok="onOk" ></table-maximize> -->
    <table-column-setting v-if="isInTools('setting')" :default-columns="defaultColumns" @ok="onOk" ref="setting"></table-column-setting>
  </div>
</template>

<script>
  import tableColumnSetting from './coms/table-column-setting/index.vue'
  import tableMaximize from './coms/table-maximize/index.vue'

  export default {
    name: 'tableTools',
    components: {
      tableColumnSetting,
      tableMaximize
    },
    props: {
      tools: {
        type: Array,
        default: () => ['maximize', 'setting']
      },
      defaultColumns: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      isInTools() {
        return name => {
          return this.tools.includes(name)
        }
      }
    },
    methods: {
      onOk({ type, data }) {
        this.$emit('ok', {
          type,
          data
        })
      }
    }
  }
</script>

<style lang="less">
.table-tools {
  display: flex;
  .table-tools-item {
    &+.table-tools-item {
      margin-left: 8px;
    }
  }
}
</style>
