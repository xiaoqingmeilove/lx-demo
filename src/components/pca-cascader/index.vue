<template>
  <div class="pac-body">
    <template v-if="formData[pcaRegionField]!='660083'">
      <el-cascader v-model="pca"
      filterable
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
    <template v-else>
      <el-input 
        class="pca-input pca-cascader" 
        v-model="formData[pcaField]" 
        :disabled="disabled || readOnly"
        :placeholder="readOnly ? '' : placeholder" 
        :class="[readOnly ? 'pca-input--readonly' : '']" 
        @change="inputChange"
      ></el-input>
    </template>
    <el-select 
      v-model="formData[pcaRegionField]" 
      class="pca-select"
      :class="[readOnly ? 'pca-select--readonly' : '']"
      :placeholder="readOnly ? '' : placeholder"
      :disabled="disabled || readOnly"
      v-if="!readOnly"
      @change="onSelectChange"
    >
      <el-option
        v-for="item in options"
        :key="item.code"
        :label="item.name"
        :value="item.code">
      </el-option>
    </el-select>
  </div>
</template>

<script>
  //import PCA_OPTIONS from './scripts/data'
  import { mapState } from 'vuex'

  export default {
    name: 'pcaCascader',
    model: {
    	prop: 'formData',
    	event: 'sync'
    },
    props: {
      formData: {
        type: Object,
        default: () => {}
      },
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
      },
      pcaRegionField: {
        type: String,
        default: 'countryCode'
      },
      pcaField: {
        type: String,
        default: 'areaCodeList'
      },
      pcaTextField: {
        type: String,
        default: 'areaCodeListName'
      },
    },
    computed: {
      ...mapState({
        options: state => state.Common.pca ?? [],
      }),
      bindOptions() {
        const options = this.options.find(x => x.code == this.formData[this.pcaRegionField])?.children ?? []
        if (this.level === 'province') {
          return options.map(item => {
            const i = {...item}
            delete i.children
            return i
          })
        } else if (this.level === 'city') {
          return options.map(item => {
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
        return options
      },
      watchPca() {
        return this.formData[this.pcaField]
      },
      watchPcaRegion() {
        return this.formData[this.pcaRegionField]
      }
    },
    watch: {
      watchPca: {
        handler(newVal) {
          this.handlePCAData(newVal)
        },
        immediate: true
      },
      watchPcaRegion: {
        handler(newVal) {
          this.handlePcaRegion(newVal)
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
        this.handlePCAData(this.formData[this.pcaField])
      },
      handlePcaRegion(data) {
        const obj = this.options.find(item => item.flag);
        this.formData[this.pcaRegionField] = data ? data : obj?.code || '000000'
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
        const name = this.getName(value, this.bindOptions);
        this.$set(this.formData, this.pcaField, val);
        this.$set(this.formData, this.pcaTextField, name);
        this.$emit('sync', this.formData);
        this.$emit('change', { value: val, name, countryCode: this.formData[this.pcaRegionField] });
      },
      onSelectChange(value) {
        this.$set(this.formData, this.pcaRegionField, value);
        this.$set(this.formData, this.pcaField, '');
        this.$set(this.formData, this.pcaTextField, '');
        this.$emit('sync', this.formData);
        this.$emit('change', { value: this.formData[this.pcaField], name: this.formData[this.pcaTextField], countryCode: this.formData[this.pcaRegionField] });
      },
      inputChange(value){
        this.$set(this.formData, this.pcaTextField, value);
        this.$emit('sync', this.formData);
        this.$emit('change', { value: this.formData[this.pcaField], name: this.formData[this.pcaTextField], countryCode: this.formData[this.pcaRegionField] });
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
.pac-body{
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  .pca-select{
    width: 83px !important;
    line-height: 32px;
    .el-input {
    .el-input__inner {
      color: #595959;
      height: 32px;
      line-height: 32px;
      border-radius: 0 4px 4px 0;
    }
    .el-input__suffix {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  }
}
.el-select.pca-select--readonly{
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
      border-radius: 0 4px 4px 0;
    }
    .el-input__suffix {
      display: none;
    }
  }
}
.pca-input{
  flex: 1;
  line-height: 32px;
  .el-input__inner {
    padding: 0 6px;
    color: #595959;
    height: 32px;
    line-height: 32px;
    border-radius: 4px 0 0 4px;
  }
  .el-input__suffix {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.pca-input.pca-input--readonly{
  cursor: default;
  &.is-disabled {
    .el-input__inner {
      padding: 0 6px;
      border: none;
      background: #fff;
      color: #606266;
      cursor: default;
      border-radius: 0 4px 4px 0;
    }
    .el-input__suffix {
      display: none;
    }
  }
}
.el-cascader {
  flex: 1;
  line-height: 32px;
  .el-input {
    .el-input__inner {
      padding: 0 6px;
      color: #595959;
      height: 32px;
      line-height: 32px;
      border-radius: 4px 0 0 4px;
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
      border-radius: 4px 0 0 4px;
    }
    .el-input__suffix {
      display: none;
    }
  }
}
</style>
