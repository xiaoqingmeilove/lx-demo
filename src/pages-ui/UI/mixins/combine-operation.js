export default {
  data() {
    return {
      combineOperationOptions: [
        { label: '选择产品型号', value: 'model' },
        { label: '产品规格', value: 'standard' },
        { label: '数字', value: 'num', type: 'number' },
        { label: '保留小数', value: 'num2', type: 'float', digits: 4 },
        { label: '整数', value: 'num3', type: 'integer', },
        { label: '下拉选择', value: 'test', type: 'combobox', source: 'test' },
        { label: 'select选择', value: 'test2', type: 'select', source: 'test',
          props: {
            multiple: true,
            filterable: true,
            allowCreate: true
          },
          output: 'string'    //多选输出格式 默认数组
        },
      ],
      combineOperationSourceList: {
        test: [
          { label: '红色', value: 'red' },
          { label: '绿色', value: 'green' },
          { label: '蓝色', value: 'blue' },
        ]
      },
    }
  },
  methods: {
    onCombineOperationOptionsOk({ field, value }) {
      console.log('value', value)
      this.$message.success(`field: ${field}, value: ${value}`)
    }
  }
}
