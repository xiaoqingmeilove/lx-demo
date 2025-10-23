<template>
  <el-cascader v-model="pca"
    class="pca-cascader"
    :class="[readOnly ? 'pca-cascader--readonly' : '']"
    :props="props"
    :options="bindOptions"
    :disabled="disabled || readOnly"
    :placeholder="readOnly ? '' : placeholder"
    :clearable="clearable"
    @change="onPCAChange"
  ></el-cascader>
</template>

<script>
  //import PCA_OPTIONS from './scripts/data'
  import { mapState } from 'vuex'

  export default {
    name: 'pcaCascader',
    model: {
    	prop: 'pcaData',
    	event: 'sync'
    },
    props: {
      pcaData: {
        type: [Array, String],
        default: () => []
      },
      dataType: {
        type: String,
        default: null
      },
      level: {
        type: String,
        default: 'region'   //province,city,region
      },
      disabled: {
        type: Boolean,
        default: false
      },
      readOnly: {
        type: Boolean,
        default: false
      },
      placeholder: {
        type: String,
        default: ''
      },
      checkStrictly: {
        type: Boolean,
        default: true
      },
      clearable: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      ...mapState({
        options: state => state.Common.pca ?? [],
      }),
      bindOptions() {
        if (this.level === 'province') {
          return this.options.map(item => {
            const i = {...item}
            delete i.children
            return i
          })
        } else if (this.level === 'city') {
          return this.options.map(item => {
            if (item.children && item.children.length > 0) {
              item.children = item.children.map(child => {
                const c = {...child}
                delete c.children
                return c
              })
            }
            return item
          })
        }
        return this.options
      }
    },
    watch: {
      pcaData: {
        handler(newVal) {
          this.handlePCAData(newVal)
        },
        immediate: true
      }
    },
    data() {
      return {
        pca: [],
        props: {
          value: 'code',
          label: 'name',
          checkStrictly: true,
        },

        //options: PCA_OPTIONS
      }
    },
    created() {
      this.init()
    },
    methods: {
      init() {
        this.props = {
          ...this.props,
          checkStrictly: this.checkStrictly
        }
        this.handlePCAData(this.pcaData)
      },
      handlePCAData(data) {
        const dataValue = data || ''
        if (this.dataType === 'string' && typeof dataValue === 'string') {
          this.pca = dataValue.split(',')
        } else {
          this.pca = [...data].map(item => String(item))
        }
      },
      // onPCAChange(value) {
      //   const val = this.dataType === 'string' ? value.join(',') : value
      //   let name = this.getName(value, 0, PCA_OPTIONS)
      //   this.$emit('sync', val)
      //   this.$emit('change', {
      //     value: val,
      //     name
      //   })
      // },
      // getName(values, index, source, name = '') {
      //   const find = source.find(x => x.code === values[index])
      //   if (find) {
      //     name += find.name
      //     index = index + 1
      //     if (index <= values.length - 1) {
      //       if (find.children && find.children.length > 0) {
      //         return this.getName(values, index, find.children, name)
      //       }
      //     }
      //   }
      //   return name
      // }
      onPCAChange(value) {
        const val = this.dataType === 'string' ? value.join(',') : value;
        const name = this.getName(value, this.options);
        this.$emit('sync', val);
        this.$emit('change', { value: val, name });
      },
      getName(values, source) {
        let name = '';
        let index = 0;
        let current = source.find(x => x.code === values[index]);
        while (current) {
          name += current.name;
          index++;
          if (index >= values.length) {
            break;
          }
          if (current.children && current.children.length > 0) {
            current = current.children.find(x => x.code === values[index]);
          } else {
            current = null;
          }
        }
        return name;
      }
    }
  }
</script>

<style lang="less">
.el-cascader {
  line-height: 32px;
  .el-input {
    .el-input__inner {
      color: #595959;
      height: 32px;
      line-height: 32px;
    }
    .el-input__suffix {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.el-cascader.pca-cascader--readonly {
  .el-input {
    cursor: default;
  }
  .el-input.is-disabled {
    .el-input__inner {
      padding: 0;
      border: none;
      background: #fff;
      color: #606266;
      cursor: default;
    }
    .el-input__suffix {
      display: none;
    }
  }
}
</style>
