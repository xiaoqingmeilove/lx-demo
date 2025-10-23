export default {
  data() {
    const dict = this.$store.state.Common.dict
    return {
      searchOptions: [
        {
          label: '名称',
          field: 'name',
          type: 'input',
          isDefault: true,
          defaultValue: 'name'
        },
        {
          label: '下拉框',
          field: 'select',
          type: 'select',
          source: 'select',
          placeholder: '下拉框选项',
          isDefault: true,
        },
        {
          label: '多选框',
          field: 'selectmulti',
          type: 'selectmulti',
          source: 'selectmulti',
          placeholder: '多选框',
          output: 'string',
          isDefault: true,
          defaultValue: ['1', '2']
        },
        {
          label: '数字范围',
          fields: ['num1', 'num2'],
          type: 'numberRange',
          isDefault: true
        },
        {
          label: '时间选择',
          fields: ['date1', 'date2'],
          type: 'datePicker'
        },
        {
          label: '产品分类名',
          field: 'productType',
          type: 'input'
        },
        {
          label: '标准',
          field: 'standard',
          type: 'input'
        },
        {
          label: '规格',
          field: 'model',
          type: 'input'
        },
        {
          label: '单位',
          field: 'unit',
          type: 'input'
        },
        {
          label: '单据号',
          field: 'billNo',
          type: 'input'
        },
        {
          label: '下拉框2',
          field: 'select2',
          type: 'select',
          source: 'select',
          placeholder: '可搜索下拉框',
          props: {
            filterable: true,
          }
        },
        {
          label: '下拉框3',
          field: 'select3',
          type: 'select',
          source: 'select',
          placeholder: '可创建条目下拉框',
          props: {
            filterable: true,
            allowCreate: true
          }
        },
        {
          label: '多选下拉框2',
          field: 'selectmulti2',
          type: 'selectmulti',
          source: 'selectmulti',
          placeholder: '可搜索多选下拉框',
          props: {
            filterable: true,
          }
        },
        {
          label: '多选下拉框3',
          field: 'selectmulti3',
          type: 'selectmulti',
          source: 'selectmulti',
          placeholder: '可创建条目多选下拉框',
          props: {
            filterable: true,
            allowCreate: true
          }
        },
      ],
      searchSourceList: {
        select: (dict['standard_type'] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        }),
        selectmulti: (dict['bill_state'] ?? []).map(d => {
          return { label: d.dictLabel, value: d.dictValue }
        })
      },
    }
  },
  methods: {
    onSearch(value) {
      console.log('onSearch', value)
      this.$message.success('onSearch')
    },
    onReset() {
      this.$message.success('onReset')
    },
    onExpand() {
      this.$message.success('onExpand')
    },
  }
}
