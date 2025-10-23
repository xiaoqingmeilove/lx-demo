import XEUtils from 'xe-utils'

let cache_dataform = null

export default {
  data() {
    return {
      dataFormItems: [
        { label: '用户名', field: 'username', type: 'input' },
        { label: '手机号', field: 'phone', type: 'number', props: { allowEmpty: true }  },
        { label: '生日', field: 'birthday', type: 'date' },
        { label: '性别', field: 'gender', type: 'radio', source: 'gender' },
        { label: '颜色', field: 'color', type: 'select', source: 'color' },
        { label: '颜色多选', field: 'color2', type: 'selectmulti', source: 'color' },
        { label: '下拉输入', field: 'color3', type: 'selectinput', props: { allowCreate: true }, source: 'color' },
        { label: '输入多选', field: 'color4', type: 'selectinputmulti', props: { allowCreate: true }, source: 'color' },
        { label: '数字1', field: 'num1', type: 'number', digits: 2, formatterName: 'toFixedNumber' },
        { label: '数字2', field: 'num2', type: 'number', numberType: 'float', digits: 4, formatterName: 'toFixedNumber' },
        { label: '日期时间', field: 'time', type: 'datetime' },
        { label: '默认文本', field: 'text' },
        { label: '插槽', field: 'enable', slot: 'enable' },
        { label: '区域', field: 'area', slot: 'area' },
        { label: '日期范围', field: 'daterange', type: 'daterange', width: '42%' },
        { label: '文本域', field: 'textarea', type: 'textarea', width: '100%' },
        { label: '只读属性', field: 'color', type: 'select', source: 'color', readOnly: true },
        { label: '禁用', field: 'color', type: 'select', source: 'color', disabled: true },
        { label: '小数限制', field: 'num3', type: 'number', digits: 3, precision: 3, formatterName: 'toFixedNumber' },
        { label: '下拉框2', placeholder: '建议使用场景:纯文本选择;支持失去焦点创建条目;', field: 'color5', type: 'selectinput2', source: 'color5', width: '50%' },

        {
          label: '自定义样式',
          field: 'customClass',
          type: 'input',
          placeholder: '自定义样式; 大于10显示红色',
          width: '50%',
          //自定义样式建议itemClass用类名控制
          itemClass: ({item, data}) => {
            return Number(data[item.field]) > 10 ? 'color---red' : ''   //测试用例
          },
          //评估阶段
          itemStyle: ({item, data}) => {
            if (Number(data[item.field]) > 10) {
              return {
                background: 'rgb(75 173 58 / 50%)'
              }
            }
            return null
          }
        },
        { label: '联系人验证测试', field: 'contacts', slot: 'contacts' },
        { label: '用户名', field: 'username', type: 'maxtextarea' },

      ],
      dataFormModel: {
        username: 'admin',
        phone: '13888888888',
        birthday: '',
        gender: 1,
        color: 'red',
        color2: [],
        color3: '',
        color4: [],
        num1: 3.1415,
        num2: 3.1415926,
        num3: 3.141,
        time: '',
        text: '测试文本',
        enable: true,
        area: {},
        textarea: '',
        color5: '',
        customClass: '',
        float: 0,
        contacts: [],
        dateRange: [],

        float: 0

      },
      dataFormSourceList: {
        gender: [
          { label: '男', value: 1 },
          { label: '女', value: 2 },
        ],
        color: [
          { label: '红色', value: 'red' },
          { label: '绿色', value: 'green' },
          { label: '蓝色', value: 'blue' },
        ],
        color5: [
          { label: '红色', value: '红色' },
          { label: '绿色', value: '绿色' },
          { label: '蓝色', value: '蓝色' },
        ]
      },
      dataFormRules: {
        username: [
          { required: true, message: '请输入用户名' }
        ],
        phone: [
          { required: true, message: '请输入手机' },
          { validator: (rule, value, callback) => {
            if (!/^1[3-9]\d{9}$/.test(value)) {
              callback(new Error('手机格式错误'))
            } else {
              callback()
            }
          }, message: '手机格式错误' }
        ],
        num1: [
          { validator: (rule, value, callback) => {
            const n = Number(value || 0)
            if (n >= 3 && n <= 4) {
              callback()
            } else {
              callback(new Error('数字范围3-4'))
            }
          }, trigger: 'blur' }
        ],
        // area: [
        //   { required: true, message: '请选择地区' }
        // ],
        float: [
          { required: true, message: '请输入数字' }
        ],
        contacts: [
          { required: true, message: '请输入联系人' },
          {
            validator: (rule, value, callback) => {
              console.log('value', value)
              if (value.length === 0) {
                callback(new Error('请输入联系人xxx'))
              } else {
                callback()
              }
            }, trigger: ['blur', 'change']
          }
        ]
      },
      dataFormEditable: false
    }
  },
  methods: {
    onDataFormBtnClick(type) {
      switch (type) {
        case 'edit':
          cache_dataform = XEUtils.clone(this.dataFormModel, true)
          this.dataFormEditable = true
          break
        case 'cancel':
          this.dataFormModel = cache_dataform
          cache_dataform = null
          this.dataFormEditable = false
          break
        case 'ok':
          this.$refs.dataForm.validate(valid => {
            if (valid) {
              this.dataFormEditable = false
            }
          })
          break
        default:
          break
      }
    },
    onDataFormInputChange(e) {
      console.log('onDataFormInputChange', e)
    },
    onDataFormInputBlur(e) {
      console.log('onDataFormInputBlur', e)
    },
    onDataFormSelectBlur(e) {
      console.log('onDataFormSelectBlur', e)
    },
    onDataFormSelectClear(e) {
      console.log('onDataFormSelectClear', e)
    },
    onDataFormSelectInputFilter(e) {
      console.log('onDataFormSelectInputFilter', e)
    },
    onDataFormSelectChange(e) {
      console.log('onDataFormSelectChange', e)
    }
  }
}
