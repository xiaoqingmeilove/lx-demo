<template>
  <div class="search-component">
    <fieldset class="search-component-fieldset">
      <legend v-if="!!legend">{{legend}}</legend>
      <div class="search-component-container">
        <div class="search-component-add">
          <IconPlus class="search-component-iconplus" @click="onAddClick"></IconPlus>
        </div>
        <div class="search-component-main">
          <div class="search-component-list">
            <div class="search-component-item" v-for="(item, index) in itemList" :key="index">
              <div class="search-component-label">
                <el-select v-model="item.key" @change="onLabelSelectChange($event, item, index)"
                  class="search-component-label-select"
                >
                  <el-option v-for="(opt, optIndex) in getLabelOptions(item)" :key="optIndex"
                    :label="opt.label"
                    :value="opt.key"
                  >
                    {{opt.label}}
                  </el-option>
                </el-select>
              </div>
              <div class="search-component-item-wrapper">
                <template v-if="item.slot">
                  <slot :name="item.slot" v-bind="{ item }"></slot>
                </template>
                <template v-else-if="componentsMap[item.type]">
                  <compontent :is="componentsMap[item.type]"
                    :item="item"
                    :source-list="sourceList"
                    @update:value="onUpdateValue"
                    @enter="onEnter"
                  ></compontent>
                </template>
              </div>
              <IconMinus class="search-component-iconminus" @click="onDeleteClick(item, index)"></IconMinus>
            </div>
          </div>
        </div>
        <div class="search-component-btns">
          <button class="search-component-btn" @click="onSearchClick">查询</button>
          <button class="search-component-btn-default" @click="onResetClick">重置</button>
        </div>
      </div>
    </fieldset>
  </div>
</template>

<script>
  import IconPlus from './icons/icon-plus/index.vue'
  import IconMinus from './icons/icon-minus/index.vue'

  export default {
    name: 'searchComponent',
    components: {
      IconPlus,
      IconMinus
    },
    props: {
      legend: {
        type: String,
        default: ''
      },
      options: {
        type: Array,
        default: () => []
      },
      columns: {
        type: Number,
        default: 4
      },
      sourceList: {
        type: Object,
        default: () => ({})
      },
      cache: {
        type: String,
        default: ''
      }
    },
    computed: {
      componentsMap() {
        return {
          input: () => import('./components/input/index.vue'),
          select: () => import('./components/select/index.vue'),
          selectmulti: () => import('./components/selectmulti/index.vue'),
          numberRange: () => import('./components/number-range/index.vue'),
          datePicker: () => import('./components/date-picker/index.vue'),
        }
      },
      cacheName() {
        return this.cache ? `search_cache_${this.cache}` : ''
      }
    },
    watch: {
      'options': {
        handler(newVal) {
          this.init()
        },
        deep: true
      }
    },
    data() {
      return {
        optionsList: [],
        itemList: [],
        searchData: {}
      }
    },
    created() {
      this.init()
    },
    mounted(){
      const element = document.querySelector('.search-component');
      element && element.style.setProperty("--columns", this.columns);
    },
    methods: {
      init() {
        this.optionsList = [...this.options].map(item => {
          item.key = this.getKey(item)
          return item
        })
        if (this.cache) {
          const cacheListData = localStorage.getItem(this.cacheName)
          if (cacheListData) {
            const cacheList = JSON.parse(cacheListData)
            const itemList = []
            cacheList.forEach(item => {
              if (this.optionsList.some(i => i.key === item.key)) {
                itemList.push({
                  ...item,
                  value: this.initValue(item)
                })
              }
            })
            this.itemList = itemList
          } else {
            this.getDefaultItems()
          }
        } else {
          this.getDefaultItems()
        }
      },
      initValue(item) {
        if (['numberRange'].includes(item.type)) {
          return []
        }
        return ''
      },
      getDefaultItems() {
        const list = this.optionsList.filter(item => !!item.isDefault)
        const itemList = []
        list.forEach(item => {
          const _item = {
            ...item,
            value: this.initValue(item)
          }
          itemList.push(_item)
          this.handleData(_item)
        })
        this.itemList = itemList
      },
      getKey(item) {
        if (item.field) return item.field
        if (item.fields) return item.fields.join('_')
        return ''
      },
      getLabelOptions(currentItem) {
        const list = this.optionsList.filter(item =>
          !this.itemList.some(i => i.key === item.key)
          || currentItem.key === item.key
        )
        return list.map(item => ({
          label: item.label,
          key: item.key,
        }))
      },
      dataHandlers() {
        return {
          selectmulti(item, obj) {
            const { field, output, value } = item
            if (output === 'string') {
              obj[field] = (value || []).join(',')
            } else {
              obj[field] = value
            }
          },
          numberRange(item, obj) {
            const { field, fields, output, value } = item
            const [start, end] = fields || []
            const [startVal, endVal] = value || []
            obj[start] = startVal
            obj[end] = endVal
          },
          datePicker(item, obj) {
            const { field, fields, output, value } = item
            const [start, end] = fields || []
            const [startVal, endVal] = value || []
            obj[start] = startVal
            obj[end] = endVal
          }
        }
      },
      onAddClick() {
        const nextItem = this.optionsList.filter(item => !this.itemList.some(i => i.key === item.key))[0]
        if (!nextItem) return
        this.itemList.push({
          ...nextItem,
          value: this.initValue(nextItem),
        })
      },
      onSearchClick() {
        this.doSearch()
      },
      onResetClick() {
        //this.itemList.splice(0, this.itemList.length)
        this.getDefaultItems()
        this.searchData = {}
        this.$emit('reset')
        this.removeCache()
      },
      onDeleteClick(item, index) {
        this.deleteProperty(item)
        this.itemList.splice(index, 1)
      },
      setCache() {
        if (this.cache) {
          localStorage.setItem(this.cacheName, JSON.stringify(this.itemList))
        }
      },
      removeCache() {
        if (this.cache) {
          localStorage.removeItem(this.cacheName)
        }
      },
      onLabelSelectChange(key, item, index) {
        this.deleteProperty(item)
        const find = this.optionsList.find(i => i.key === key)
        if (!find) return
        const list = [...this.itemList]
        list[index] = {
          ...find,
          value: this.initValue(find)
        }
        this.handleData(list[index])
        this.itemList = list
      },
      onUpdateValue({ item, value }) {
        this.handleData(item)
      },
      deleteProperty(item) {
        if (item.fields) {
          item.fields.forEach(field => {
            delete this.searchData[field]
          })
        } else if (item.field) {
          delete this.searchData[item.field]
        }
      },
      handleData(item) {
        const { field, type, value } = item
        const searchData = {...this.searchData}
        const handler = this.dataHandlers()[type]
        if (handler) {
          handler(item, searchData)
        } else {
          if (field) {
            searchData[field] = type==='input' ? String(value).trim() : value
          }
        }
        this.searchData = searchData
      },
      doSearch() {
        this.$emit('search', this.searchData)
        this.setCache()
      },
      onEnter() {
        this.doSearch()
      }
    }
  }
</script>

<style lang="scss">
.search-component {
  --columns: 4;
  // padding: 12px;
}
.search-component-fieldset {
  padding: 12px 0;
  border: none;
}
.search-component-container {
  display: flex;
}
.search-component-add {
  margin-right: 16px;
}
.search-component-main {
  flex: 1;
  width: 0;
}
.search-component-btns {
  display: flex;
  gap: 10px;
  padding: 0 16px;
}
.search-component-btn {
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  height: 28px;
  outline: 0;
  border: none;
  border-radius: 4px;
  background: var(--base-color);
  color: #fff;
  font-size: 15px;
  cursor: pointer;
  user-select: none;
}
.search-component-btn-default {
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  height: 28px;
  outline: 0;
  border: 1px solid #D9D9D9;
  border-radius: 4px;
  background: #fff;
  color: rgba($color: #000000, $alpha: .85);
  font-size: 15px;
  cursor: pointer;
  user-select: none;
}
.search-component-list {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  gap: 16px;
}
.search-component-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.search-component-label {
  width: 108px;
}
.search-component-item-wrapper {
  flex: 1;
  width: 0;
}

.search-component-iconplus {
  color: var(--base-color);
  fill: currentColor;
  cursor: pointer;
}
.search-component-iconminus {
  color: #ccc;
  fill: currentColor;
  cursor: pointer;
  width: 24px;
  height: 24px;
  transition: color .3s;
  &:hover {
    color: #999;
  }
}

.search-component {
  .search-component__input,
  .search-component__select,
  .search-component__datepicker {
    width: 100%;
    font-size: 14px;
  }
  .el-input__inner {
    display: flex;
    border-radius: 0;
    height: 28px;
    line-height: 28px;
  }
  .el-input__suffix,
  .el-date-editor .el-range__icon,
  .el-date-editor .el-range-separator,
  .el-date-editor .el-range__close-icon {
    display: flex;
    align-items: center;
  }
  .el-date-editor .el-range__close-icon {
    position: absolute;
    right: 3px;
    display: none;
    color: #000;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #fff;
    &.el-icon-circle-close {
      display: flex;
    }
  }
  .el-date-editor .el-range-separator {
    width: auto;
    padding: 0;
    font-size: 13px;
  }
  .search-component__datepicker {
    padding: 3px;
    .el-icon-date {
      display: none;
    }
    .el-range-input {
      flex: 1;
      width: 0;
      font-size: 13px;
    }
  }
}

</style>
