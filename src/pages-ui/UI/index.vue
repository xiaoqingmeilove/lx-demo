<template>
  <app-page :flex="false">
    <bill-icons :billInfo="showBillIcons"></bill-icons>
    <h2 class="ceshi">UI</h2>
    <h3>全局状态按钮</h3>
    <page-button  theme="default">按钮default</page-button>
    <page-button theme="primary" >按钮primary</page-button>
    <page-button theme="success">按钮success</page-button>
    <page-button theme="warning">按钮warning</page-button>
    <page-button theme="danger">按钮danger</page-button>
    <page-button theme="info">按钮info</page-button>
    <page-button theme="cancel">按钮cancel</page-button>
    <page-button theme="red">按钮red</page-button>
    <page-button theme="green">按钮green</page-button>
    <page-button theme="gray">按钮gray</page-button>
    <page-button theme="white">按钮white</page-button>
    <h3>新增全局状态按钮</h3>
    <page-button theme="tomato">按钮tomato</page-button>
    <page-button theme="greener">按钮greener</page-button>
    <page-button theme="higtblue">按钮higtblue</page-button>
    <page-button theme="golden">按钮golden</page-button>
    <page-button theme="purple">按钮purple</page-button>
    <page-button theme="redorange">按钮redorange</page-button>
    <page-button theme="darkgreen">按钮darkgreen</page-button>
    <page-button theme="darkblue">按钮darkblue</page-button>
    <page-button theme="lavender">按钮lavender</page-button>


    <h3>基础按钮</h3>
    <page-button content="按钮"></page-button>
    <h3>基础用法</h3>
    <page-button content="按钮" theme="default"></page-button>
    <page-button
      content="带图标"
      theme="primary"
      icon="el-icon-eleme"
    ></page-button>
    <page-button theme="success">按钮</page-button>
    <page-button theme="warning">按钮</page-button>
    <page-button theme="danger">按钮</page-button>
    <page-button theme="primary" icon="el-icon-eleme"></page-button>
    <page-button theme="cancel">取消</page-button>
    <page-button content="按钮" width="200px" align="left" icon="el-icon-eleme">设置宽度/对齐方式</page-button>
    <h3>文本按钮</h3>
    <page-button type="text">按钮</page-button>
    <page-button theme="default" type="text">按钮</page-button>
    <page-button theme="primary" type="text">按钮</page-button>
    <page-button theme="success" type="text">按钮</page-button>
    <page-button theme="warning" type="text">按钮</page-button>
    <page-button theme="danger" type="text">按钮</page-button>
    <h3>按钮禁用</h3>
    <page-button content="按钮" disabled></page-button>
    <page-button theme="default" disabled>按钮</page-button>
    <page-button theme="primary" disabled>按钮</page-button>
    <page-button theme="success" disabled>按钮</page-button>
    <page-button theme="warning" disabled>按钮</page-button>
    <page-button theme="danger" disabled>按钮</page-button>
    <page-button
      content="带图标"
      theme="primary"
      icon="el-icon-eleme"
      disabled
    ></page-button>
    <br /><br />
    <page-button type="text" disabled>按钮</page-button>
    <page-button theme="default" type="text" disabled>按钮</page-button>
    <page-button theme="primary" type="text" disabled>按钮</page-button>
    <page-button theme="success" type="text" disabled>按钮</page-button>
    <page-button theme="warning" type="text" disabled>按钮</page-button>
    <page-button theme="danger" type="text" disabled>按钮</page-button>
    <h3>固定大小</h3>
    <page-button theme="primary" :fixed-size="40">按钮</page-button>
    <page-button theme="primary" :fixed-size="40" disabled>按钮</page-button>

    <h3>下拉菜单</h3>
    <page-button disabled>按钮</page-button>
    <el-dropdown class="page-button-dropdown">
      <page-button type="text">下拉菜单</page-button>
      <i class="el-icon-arrow-down el-icon--right"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
        <el-dropdown-item>双皮奶</el-dropdown-item>
        <el-dropdown-item>蚵仔煎</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown split-button class="page-button-dropdown">
      下拉菜单
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
        <el-dropdown-item>双皮奶</el-dropdown-item>
        <el-dropdown-item>蚵仔煎</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dropdown split-button class="page-button-dropdown" disabled>
      下拉菜单
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>黄金糕</el-dropdown-item>
        <el-dropdown-item>狮子头</el-dropdown-item>
        <el-dropdown-item>螺蛳粉</el-dropdown-item>
        <el-dropdown-item>双皮奶</el-dropdown-item>
        <el-dropdown-item>蚵仔煎</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <page-button disabled>按钮</page-button>

    <h3>副标题</h3>
    <sub-title title="标题"></sub-title>
    <div style="width: 300px;">
      <sub-title title="标题">
        <template #description>
          <span>描述文本</span>
        </template>
        <template #buttons>
          <page-button size="small">按钮</page-button>
        </template>
      </sub-title>
    </div>

    <h3>选择文件</h3>
    <file-button @change="onFileSelect"></file-button>
    <file-button content="测试"></file-button>
    <file-button content="禁用" disabled></file-button>
    <file-button type="text" content="选择文件"></file-button>

    <h3>图标(暂定)</h3>
    <div style="color: #595959;">
      <svg-icon v-for="item in iconList" :key="item" :icon-class="item" />
    </div>

    <h3>弹窗表单</h3>
    <page-button @click="popupFormVisible = true;">弹窗表单</page-button>
    <page-button @click="popupFormVisible2 = true;">弹窗表单2</page-button>
    <page-button @click="popupFormVisible3 = true;">弹窗只读,标签带冒号</page-button>
    <popup-form v-model="popupFormVisible"
      title="新增用户"
      :form-data="formData"
      :data-gather="dataGather"
      :data-list="sourceList"
      :rules="rules"
      :auto-scroll="true"
      @ok="onPopupFormOk"
    >
      <template #slot="{ item, index }">
        <b>{{formData[item.field]}} - {{index}}</b>
      </template>
    </popup-form>

    <h3>弹窗操作表格</h3>
    <page-button @click="onPopupTableClick(true)">操作</page-button>
    <page-button @click="onPopupTableClick(false)">查看</page-button>
    <popup-table
      v-model="popupTableVisible"
      :columns="popupTableColumns"
      :data="popupTableData"
      title="标题"
      :editable="popupTableEditable"
      :cancel-text="popupTableCancelText"
      add-text="新增费用"
      :show-footer="true"
      @ok="onPopupTableOk"
    ></popup-table>

    <popup-form v-model="popupFormVisible2"
      :span="12"
      :form-data="formData2"
      :data-gather="dataGather2"
      :data-list="sourceList"
      :rules="rules"
      okText="提交"
      cancelText="取消"
      btn-align="left"
      @ok="onPopupFormOk2"
    >
      <template #popup_title>
        <modal-title title="自定义标题"></modal-title>
      </template>
    </popup-form>

    <popup-form v-model="popupFormVisible3"
      title="只读,标签带冒号"
      :form-data="formData"
      :data-gather="dataGather"
      :data-list="sourceList"
      :auto-scroll="true"
      :read-only="true"
      :title-colon="true"
    ></popup-form>

    <h3>描述表单</h3>
    <template v-if="descEditable">
      <page-button @click="onDescBtnClick('ok')">确定</page-button>
      <page-button theme="default" @click="onDescBtnClick('cancel')">取消</page-button>
    </template>
    <template v-else>
      <page-button @click="onDescBtnClick('edit')">编辑</page-button>
    </template>
    <descriptions-form
      :items="descItems"
      :item-model="descModel"
      :editable="descEditable"
      :source-list="descSourceList"
      :value-formatters="descFormatters"
      :rules="descRules"
      @change:input="onDescFormInputChange"
      @blur:input="onDescFormInputBlur"
      ref="desc"
    >
      <template #area="{ value, item }">
        <pca-cascader v-model="descModel" data-type="string" :read-only="!descEditable" clearable></pca-cascader>
      </template>

      <template #enable="{ value, item }">
        <template v-if="descEditable">
          <el-radio-group v-model="descModel.enable">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </template>
        <template v-else>
          <el-tag :type="value ? 'success' : 'danger'" :disable-transitions="true" size="small">{{value ? '启用': '禁用'}}</el-tag>
        </template>
      </template>

      <template #contacts>
        <page-button v-if="descEditable" type="text" @click="onAddContactBtnClick">添加联系人</page-button>
        <el-tooltip v-for="(_item, _index) in descModel.contacts || []" :key="_index" effect="dark"
          :content="_item.phones" placement="top"
        >
          <i style="margin: 0 6px;">{{_item.contact}}</i>
        </el-tooltip>
      </template>

    </descriptions-form>

    <h3>数据表单</h3>
    <template v-if="dataFormEditable">
      <page-button @click="onDataFormBtnClick('ok')">确定</page-button>
      <page-button theme="default" @click="onDataFormBtnClick('cancel')">取消</page-button>
    </template>
    <template v-else>
      <page-button @click="onDataFormBtnClick('edit')">编辑</page-button>
    </template>
    <data-form
      :items="dataFormItems"
      :form-data="dataFormModel"
      :editable="dataFormEditable"
      :source-list="dataFormSourceList"
      :rules="dataFormRules"
      @change:input="onDataFormInputChange"
      @blur:input="onDataFormInputBlur"
      @change:select="onDataFormSelectChange"
      @filter:selectinput="onDataFormSelectInputFilter"
      @hidden:select="onDataFormSelectBlur"
      @clear:select="onDataFormSelectClear"
      ref="dataForm"
    >
      <template #enable="{ value, item }">
        <template v-if="dataFormEditable">
          <el-radio-group v-model="dataFormModel.enable">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </template>
        <template v-else>
          <el-tag :type="value ? 'success' : 'danger'" :disable-transitions="true" size="small">{{value ? '启用': '禁用'}}</el-tag>
        </template>
      </template>
      <template #area="{ value, item, model }">
        <pca-cascader class="custom-pca-cascader"
          v-model="dataFormModel"
          data-type="string"
          :read-only="!dataFormEditable"
          placeholder="请选择区域"
          clearable
        ></pca-cascader>
      </template>
      <template #contacts="{ value, item, model, form }">
        {{model[item.field]}}
        <el-button @click="model[item.field].push(1);">添加</el-button>
      </template>
    </data-form>

    <h3>区域级联选择器</h3>
    <!-- <pca-cascader v-model="pca" @change="onPCAChange"></pca-cascader>
    <p>{{pca}}</p>
    <pca-cascader v-model="pca2" data-type="string"></pca-cascader>
    <p>{{pca2}}</p>
    <pca-cascader v-model="pca3" data-type="string" level="province"></pca-cascader>
    <p>{{pca3}}</p>
    <pca-cascader v-model="pca4" :check-strictly="false" placeholder="请选择" clearable></pca-cascader> -->
    <p>{{pca4}}</p>

    <h3>组合操作</h3>
    <combine-operation
      :options="combineOperationOptions"
      :source-list="combineOperationSourceList"
      button-text="按钮名称"
      @click="onCombineOperationOptionsOk"
    ></combine-operation>
    <combine-operation
      :options="combineOperationOptions"
      :source-list="combineOperationSourceList"
      button-text="值可空"
      :required="false"
      @click="onCombineOperationOptionsOk"
    ></combine-operation>
    <combine-operation
      :options="combineOperationOptions"
      button-text="禁用"
      :disabled="true"
    ></combine-operation>

    <h3>搜索组件</h3>
    <search-component
      :options="searchOptions"
      :source-list="searchSourceList"
      @search="onSearch"
      @reset="onReset"
      @expand="onExpand"
    ></search-component>

    <h3>图标</h3>
    <div class="clear">
      <div v-for="item in icons" :key="item"
        style="float: left;
               display: flex; align-items: center; justify-content: center;
               flex-direction: column;
               margin: 0 10px 10px 0;
               width: 160px; height: 160px;
               background: #fff;"
        >
        <svg-icon :icon-class="item" :size="24" fill="#999"></svg-icon>
        <label style="margin-top: 30px;">{{item}}</label>
      </div>
    </div>

<!--    <svg-icon icon-class="fei"></svg-icon>
    <svg-icon icon-class="aps" :size="24"></svg-icon>
    <svg-icon icon-class="deng" style="width: 24px; height: 24px;"></svg-icon>
    <svg-icon icon-class="gou" font-size="24px"></svg-icon>
    <svg-icon icon-class="xie" style="font-size: 24px;"></svg-icon> -->

    <hr />

    <!--
    <h3>公共按钮</h3>
    <table-icon></table-icon>
    <h3>上传组件</h3>
    <div class="scfj">
      <upload-component
        :limit="5"
        :multiple="true"
        accept=".png,.jpg"
        @change="handleChange"
        @remove="handleRemove"
      >
        <template #tip>
          <div class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </template>
      </upload-component>
    </div>
    <h3>批量导入</h3>
    <page-button @click="openLeading">批量导入</page-button>
    <leading-component
      v-if="isShow"
      @handleClose="closeUpload"
      @ok="uploadFile"
      @cancel="closeUploadFile"
      @download="downloadExcel"
      :downloadTempTitle="'员工导入模板'"
    ></leading-component>

    <h3>模态框</h3>
    <page-button @click="openModal">打开模态框</page-button>
    <modal
      title="新增文本"
      :visible="modalVisible"
      @close="handleClose"
      @ok="onModal"
      @cancel="onCancel"
    >
      <template #header-title>
        <span>灰色选中列不支持隐藏和排序</span>
      </template>
      <h3>这是中间区域内容</h3>
      <template #footer-title>
        <span> 点击下载文件 </span>
      </template>
    </modal>

    <popup-form v-model="contactPopupFormVisible"
      title="添加联系人"
      :form-data="contactData"
      :data-gather="contactDataGather"
      :rules="contactRules"
      @ok="onContactAddOk"
    ></popup-form>
    -->

  <template #footer>
    <b style="color: darkred; font-style: italic;">/******底部内容******/</b>
  </template>

  </app-page>
</template>

<script>
  import { Cascader } from 'element-ui'
  import XEUtils from 'xe-utils'
  import { mixin_dataform, mixin_combineoperation, mixin_searchcomponent, mixin_icon } from './mixins'
  import { SVG_ICONS } from '@/icons'
  import { constantRoutes } from '@/router'

  let cache_desc = null


export default {
  name: "ui",
  mixins: [mixin_dataform, mixin_combineoperation, mixin_searchcomponent, mixin_icon],
  data(){
    return {
      showBillIcons:{
        xie: true,
        deal: true,
        file: true,
        merge: true,
        copy: true,
        teching: true,
        teched: true,
        purching:true,
        purched:true,
        legaling:true,
        legaled:true,
      },
      fileList: [],
      modalVisible: false,
      isShow: false,

      popupFormVisible: false,
      formData: {
        username: 'admin',
        password: '123456',
        price: null,
        remark: 'hello world',
        dept: null,
        lang: 1,
        roles: [],
        colors: null,
        visible: true,
        address: [],
        instruction: '',
        datetime: '',
        selecttree: '',
        tree: '',
        areaname: '',
        custom: [],
        test: '测试'
      },
      dataGather: [
        {
          config: [
            { label: '用户名', field: 'username', type: 'input' },
            { label: '密码', field: 'password', type: 'password' },
            { label: '价格', field: 'price', type: 'number', inputSuffix: '元/公斤'},
            { label: '备注', field: 'remark', type: 'textarea' },
            { label: '部门', field: 'dept', type: 'select', source: 'dept' },
            { label: '语言', field: 'lang', type: 'radio', source: 'lang' },
            { label: '联系方式', field: 'contact', type: 'radioButton', source: 'contact' },
            { label: '角色', field: 'roles', type: 'checkboxGroup', source: 'checkboxGroup' },
            { label: '颜色', field: 'colors', type: 'checkboxGroup', source: 'colors', output: 'string' },
            { label: '是否可见', field: 'visible', type: 'checkbox', showText: ['是', '否'] },
            { label: '联系地址', field: 'address', type: 'arrayInput' },
            { label: '说明', field: 'instruction', type: 'arrayInput', output: 'string' },
            { label: '日期时间', field: 'datetime', type: 'datetime' },
            { label: '树形选择', field: 'selecttree', type: 'selecttree', source: 'selecttree' },
            { label: '可搜索树形', field: 'tree', type: 'tree', source: 'tree' },
            { label: '地区', field: 'pca', type: 'pca', pcaOptions: {}, pcaTextField: 'areaname' },
            { label: '自定义', field: 'custom', type: 'custom', component: Cascader,
              customOptions: {
                options: [{
                  value: 'zhinan',
                  label: '指南',
                  children: [{
                    value: 'shejiyuanze',
                    label: '设计原则',
                    children: [{
                      value: 'yizhi',
                      label: '一致'
                    }, {
                      value: 'fankui',
                      label: '反馈'
                    }, {
                      value: 'xiaolv',
                      label: '效率'
                    }, {
                      value: 'kekong',
                      label: '可控'
                    }]
                  }],
                }],
                formatter: (val, item) => {
                  const options = item.customOptions?.options ?? []
                  const texts = []
                  function getLabel(list, index = 0) {
                    const find = list.find(i => i.value === val[index])
                    if (find) {
                      texts.push(find.label)
                      getLabel(find.children ?? [], index + 1)
                    }
                  }
                  getLabel(options)
                  return texts.join(' / ')
                }
              }
            },
            { label: '插槽', field: 'test', slot: 'slot' }
          ]
        },
      ],
      sourceList: {
        dept: [
          { label: '无', value: null },
          { label: '部门1', value: 1 },
          { label: '部门2', value: 2 },
          { label: '部门3', value: 3 },
          { label: '部门4', value: 4 },
        ],
        lang: [
          { label: '中文', value: 1 },
          { label: '英语', value: 2 },
          { label: '日语', value: 3 },
        ],
        contact: [
          { label: '微信', value: 1 },
          { label: 'QQ', value: 2 },
          { label: '邮件', value: 3 },
        ],
        checkboxGroup: [
          { label: '管理员', value: 1 },
          { label: '业务员', value: 2 },
          { label: '制单员', value: 3 },
        ],
        colors: [
          { label: '红色', value: 'red' },
          { label: '绿色', value: 'green' },
          { label: '蓝色', value: 'blue' },
        ],
        selecttree: [],
        tree: []
      },
      rules: {
        username: [
          { required: true, message: '请输入名称' },
        ],
        password: [
          { required: true, message: '请输入密码' },
        ],
        instruction: [
          { required: true, message: '请输入instruction' },
          {
            validator: ({ data, field, itemValue }) => {
              const dataArr = data[field]
              const arr = dataArr.filter(item => Boolean(item))
              if (arr.length === 0) {
                return new Error('请输入instruction')
              }
            }
          }
        ]
      },

      popupFormVisible2: false,
      formData2: {
        username: 'admin',
        dept: null,
      },
      dataGather2: [
        {
          config: [
            { label: '用户名', field: 'username', type: 'input' },
            { label: '密码', field: 'password', type: 'password' },
            { label: '备注', field: 'remark', type: 'textarea', span: 24 },
          ]
        },
        {
          title: '标题2',
          span: 24,
          config: [
            { label: '部门', field: 'dept', type: 'select', source: 'dept' },
          ]
        }
      ],

      popupFormVisible3: false,

      popupTableVisible: false,
      popupTableColumns: [
        { title: '用户ID', field: 'id', readonly: true },
        { title: '用户名', field: 'username' },
        { title: '描述', field: 'desc', edit: 'text', },
        { title: '是否包含', field: 'checked', columnType: 'checkbox' },
        { title: '余额', field: 'balance', edit: 'number', align: 'right', sum: true },
        { title: '价格', field: 'price', edit: 'number', align: 'right', sum: true },
      ],
      popupTableData: [
        { id: 1, username: '张三', desc: '描述1', checked: true, balance: 88.88, price: 123 },
        { id: 2, username: '李四', desc: '描述2', checked: false, balance: 188.88, price: 4.56 },
      ],
      popupTableEditable: true,
      popupTableCancelText: '取消',

      descItems: [
        { label: '用户名', field: 'username', required: true, type: 'input' },
        { label: '手机号', field: 'phone', required: true, type: 'input' },
        { label: '年龄', field: 'age', type: 'input' },
        { label: '性别', field: 'gender', type: 'radio', source: 'gender' },
        { label: '占位', visible: false, span: 2 },
        { label: '说明', field: 'instruction', type: 'default' },
        { label: '' },
        { label: '余额', field: 'balance', type: 'number', formatterName: 'toFixedNumber', digits: 2, span: 2 },
        { label: '保留小数', field: 'num', type: 'number', numberType: 'float', formatterName: 'toFixedNumber', digits: 2, span: 2 },
        { label: '区域', field: 'area', slot: 'area', span: 3 },
        { visible: false },
        { label: '地址', field: 'address', type: 'textarea', span: 4 },
        { label: '颜色', field: 'color', type: 'select', source: 'color' },
        { label: '颜色2', field: 'color2', type: 'selectmulti', source: 'color' },
        { label: '颜色3', field: 'color3', type: 'selectinput', source: 'color' },
        { label: '颜色4', field: 'color4', type: 'selectinputmulti', source: 'color' },
        { label: '备注', field: 'remark', type: 'input' },
        { label: '等级', field: 'level', type: 'input', formatterName: 'level' },
        { label: '日期', field: 'date', type: 'date' },
        { label: '时间', field: 'time', type: 'datetime' },
        { label: '启用', field: 'enable', slot: 'enable' },
        { label: '联系人', field: 'contacts', slot: 'contacts' },
      ],
      descSourceList: {
        gender: [
          { label: '男', value: 1 },
          { label: '女', value: 2 },
        ],
        color: [
          { label: '红色', value: 'red' },
          { label: '绿色', value: 'green' },
          { label: '蓝色', value: 'blue' },
        ],
        enable: [
          { label: '启用', value: true },
          { label: '禁用', value: false },
        ]
      },
      descFormatters: {
        level: (value, item) => {
          return `等级${value}`
        },
      },
      descModel: {
        username: 'admin',
        phone: '13888888888',
        age: 88,
        gender: 1,
        area: {},
        address: 'address',
        instruction: '说明',
        balance: 1234.5678,
        num: 1234.5678,
        color: 'blue',
        color2: [],
        color3: '',
        color4: [],
        remark: '备注',
        level: 1,
        date: '',
        time: '2000-01-01 10:00:00',
        enable: true,
        contacts: [],
      },
      descRules: {
        username: [
          { required: true, message: '请输入用户名' }
        ],
        phone: [
          { required: true, message: '请输入手机' },
          { validator: (rule, value) => {
            return /^1[3-9]\d{9}$/.test(value)
          }, message: '手机格式错误'}
        ],
        area: [
          { required: true, message: '请选择地区' }
        ],
        level: [
          { validator: (rule, value) => {
            return /^\d+$/.test(value)
          }, message: '等级输入错误,请输入数字'}
        ],
      },
      descEditable: false,

      contactPopupFormVisible: false,
      contactData: null,
      contactDataGather: [
        {
          config: [
            { label: '联系人', field: 'contact', type: 'input' },
            { label: '联系方式', field: 'phones', type: 'arrayInput', output: 'string' },
          ]
        }
      ],
      contactRules: {
        contact: [
          { required: true, message: '请输入联系人' },
        ],
      },

      pca: ['110000', '110000', '110102'],
      pca2: '150000,150400,150402',
      pca3: '110000',
      pca4: [],

      icons: SVG_ICONS
    }
  },
  created() {
    console.log('ui created')
    this.sourceList.selecttree = [
      {
        label: '超级管理员',
        value: 'sa' ,   //有值的情况下(不等于undefined或null或'')会出现"选择"按钮。所以根据实际情况构建数据
      },
      {
        label: '组1',
        children: [
          {
            label: '管理员',
            value: 'admin' ,
            children:[],
            },
          { label: '用户1', value: 'user1' },
        ]
      },
      {
        label: '组2',
        value: null,
        children: [
          { label: '用户2', value: 'user2' },
        ]
      }
    ]
    this.sourceList.tree = [
      {
        label: '超级管理员',
        disabled: true
      },
      {
        label: '组1',
        children: [
          {
            label: '管理员',
            value: 'admin' ,
            children:[],
            },
          { label: '用户1', value: 'user1' },
        ]
      },
      {
        label: '组2',
        value: null,
        children: [
          { label: '用户2', value: 'user2' },
        ]
      }
    ]
  },
  mounted() {
    const routes = constantRoutes.filter(item => !item.path && !item.isDebug && item.children && item.children.length).reduce((list, item) => {
      list = list.concat(item.children.map(i => {
        return {
          name: i.name,
          title: i.meta?.title,
          defaultTitle: i.meta?.title,
        }
      }))
      return list
    }, [])
    console.log('routes', routes)
  },
  destroyed() {
    console.log('ui destroyed')
  },
  activated() {
    console.log('activated')
  },
  methods: {
    onFileSelect(e) {
      console.log(e)
    },

    uploadFile(data) {
    },
    handleChange(file, fileList) {
    },
    handleRemove(file, index, fileList) {
    },
    openLeading() {
      this.isShow = true;
    },
    closeUpload() {
      this.isShow = false;
    },
    closeUploadFile() {
      this.isShow = false;
    },
    downloadExcel() {
      console.log("模板下载");
    },
    openModal() {
      console.log("打开模态框");
      this.modalVisible = true;
    },
    onModal() {
      console.log("确定");
    },
    onCancel() {
      this.modalVisible = false;
      console.log("取消");
    },
    handleClose() {
      this.modalVisible = false;
    },

    onPopupFormOk(data) {
      console.log('data', data)
      this.formData = {...data}
      this.popupFormVisible = false
    },
    onPopupFormOk2(data) {
      this.formData2 = {...data}
      this.popupFormVisible2 = false
    },

    onPopupTableClick(editable = true) {
      this.popupTableEditable = editable
      this.popupTableCancelText = editable ? '取消' : '关闭'
      this.popupTableVisible = true
    },
    onPopupTableOk({ data }) {
      this.popupTableData = [...data]
      this.popupTableVisible = false
    },

    onAddContactBtnClick() {
      this.contactData = {
        contact: '',
        phones: []
      }
      this.contactPopupFormVisible = true
    },
    onContactAddOk(data) {
      //TODO
      this.descModel.contacts.push(data)
      this.contactPopupFormVisible = false
    },
    onDescFormInputChange(e) {
      console.log('onDescFormInputChange', e)
    },
    onDescFormInputBlur(e) {
      console.log('onDescFormInputBlur', e)
    },

    onPCAChange(value) {
      console.log('onPCAChange', value)
    },

    onDescBtnClick(type) {
      switch (type) {
        case 'edit':
          cache_desc = XEUtils.clone(this.descModel, true)
          this.descEditable = true
          break
        case 'cancel':
          this.descModel = cache_desc
          cache_desc = null
          this.descEditable = false
          break
        case 'ok':
          const desc = this.$refs.desc
          desc.validate(valid => {
            if (!valid) return
            //TODO
            this.descEditable = false
          })
          break
        default:
          break
      }
    }
  },
};
</script>

<style scoped>
/* 以下样式仅用于此页面样式展示 */
h3 {
  margin: 20px 0;
}
p {
  margin: 10px 0;
}

.custom-pca-cascader {
  width: 100%;
}

::v-deep .color---red input {
  color: red;
}
</style>
