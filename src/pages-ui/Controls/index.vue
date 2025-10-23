<template>
  <app-page :flex="false">
    <h3>上传文件按钮</h3>
    <div style="display: flex; align-items: center;">
      <upload-button @success="onUpload"></upload-button>
      <upload-button @success="onUpload" content="多选" multiple></upload-button>
      <upload-button content="禁用" disabled></upload-button>
      <upload-button @success="onUpload" content="文件类型" :accept="['.png', '.rar']"></upload-button>
      <upload-button @success="onUpload" content="图标" icon="el-icon-plus"></upload-button>

      <upload-button @success="onUpload"
        background="#fff"
        color="#1890FF"
        border-color="#1890FF"
        content="上传文件"
        icon="el-icon-upload2"
        align="left"
        :width="160"
      ></upload-button>

      <upload-button @success="onUpload" content="有图标" theme="white" color="#a3a3a3">
        <template #img>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 3px;">
            <path d="M16.1299 3.87927H9.09891C8.95491 3.87927 8.81691 3.82427 8.71291 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V15.5933C1.71191 16.6623 2.57891 17.5293 3.64791 17.5293H16.1299C17.1989 17.5293 18.0659 16.6623 18.0659 15.5933V5.81527C18.0669 4.74627 17.1999 3.87927 16.1299 3.87927ZM12.9619 11.1203C12.8636 11.2223 12.7457 11.3034 12.6153 11.3587C12.4849 11.4141 12.3446 11.4425 12.2029 11.4423C11.9399 11.4423 11.6759 11.3443 11.4719 11.1473L10.9909 10.6833V13.6273C10.9909 14.2093 10.5189 14.6813 9.93691 14.6813C9.35491 14.6813 8.88291 14.2093 8.88291 13.6273V10.6253L8.41491 11.0663C7.99091 11.4653 7.32391 11.4453 6.92591 11.0213C6.52691 10.5973 6.54691 9.93027 6.97091 9.53227L9.20591 7.42827C9.61491 7.04327 10.2549 7.04627 10.6599 7.43727L12.9349 9.63127C13.3539 10.0343 13.3659 10.7013 12.9619 11.1203Z" fill="#2512FF"/>
            <path d="M18.0669 5.81527C18.0669 4.74627 17.1999 3.87927 16.1309 3.87927H9.09891C8.95491 3.87927 8.81691 3.82427 8.71291 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V15.5933C1.71191 16.6623 2.57891 17.5293 3.64791 17.5293H9.41691C13.8249 16.0683 17.1819 12.3063 18.0669 7.66627V5.81527ZM12.9619 11.1203C12.8636 11.2223 12.7457 11.3034 12.6153 11.3587C12.4849 11.4141 12.3446 11.4425 12.2029 11.4423C11.9399 11.4423 11.6759 11.3443 11.4719 11.1473L10.9909 10.6833V13.6273C10.9909 14.2093 10.5189 14.6813 9.93691 14.6813C9.35491 14.6813 8.88291 14.2093 8.88291 13.6273V10.6253L8.41491 11.0663C7.99091 11.4653 7.32391 11.4453 6.92591 11.0213C6.52691 10.5973 6.54691 9.93027 6.97091 9.53227L9.20591 7.42827C9.61491 7.04327 10.2549 7.04627 10.6599 7.43727L12.9349 9.63127C13.3539 10.0343 13.3659 10.7013 12.9619 11.1203Z" fill="#1556FC"/>
            <path d="M9.09891 3.87927C8.95491 3.87927 8.81691 3.82427 8.71291 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V13.5823C1.73791 13.5823 1.76491 13.5833 1.79091 13.5833C4.40991 13.5833 6.84691 12.8063 8.88491 11.4703V10.6243L8.41691 11.0653C7.99291 11.4643 7.32591 11.4443 6.92791 11.0203C6.52891 10.5963 6.54891 9.92927 6.97291 9.53127L9.20791 7.42727C9.61691 7.04227 10.2569 7.04527 10.6619 7.43627L11.9479 8.67627C13.0729 7.26207 13.8884 5.6275 14.3419 3.87827H9.09891V3.87927Z" fill="#3886FC"/>
            <path d="M8.88191 3.83527C8.81991 3.80927 8.76191 3.77327 8.71191 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V8.60227C4.61591 7.87027 7.12991 6.15627 8.88191 3.83527Z" fill="#5EB2FF"/>
          </svg>
        </template>
      </upload-button>
      <upload-button @success="onUpload" theme="white" content="" :fixed-size="40" shadow>
        <template #img>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right: 3px;">
            <path d="M16.1299 3.87927H9.09891C8.95491 3.87927 8.81691 3.82427 8.71291 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V15.5933C1.71191 16.6623 2.57891 17.5293 3.64791 17.5293H16.1299C17.1989 17.5293 18.0659 16.6623 18.0659 15.5933V5.81527C18.0669 4.74627 17.1999 3.87927 16.1299 3.87927ZM12.9619 11.1203C12.8636 11.2223 12.7457 11.3034 12.6153 11.3587C12.4849 11.4141 12.3446 11.4425 12.2029 11.4423C11.9399 11.4423 11.6759 11.3443 11.4719 11.1473L10.9909 10.6833V13.6273C10.9909 14.2093 10.5189 14.6813 9.93691 14.6813C9.35491 14.6813 8.88291 14.2093 8.88291 13.6273V10.6253L8.41491 11.0663C7.99091 11.4653 7.32391 11.4453 6.92591 11.0213C6.52691 10.5973 6.54691 9.93027 6.97091 9.53227L9.20591 7.42827C9.61491 7.04327 10.2549 7.04627 10.6599 7.43727L12.9349 9.63127C13.3539 10.0343 13.3659 10.7013 12.9619 11.1203Z" fill="#2512FF"/>
            <path d="M18.0669 5.81527C18.0669 4.74627 17.1999 3.87927 16.1309 3.87927H9.09891C8.95491 3.87927 8.81691 3.82427 8.71291 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V15.5933C1.71191 16.6623 2.57891 17.5293 3.64791 17.5293H9.41691C13.8249 16.0683 17.1819 12.3063 18.0669 7.66627V5.81527ZM12.9619 11.1203C12.8636 11.2223 12.7457 11.3034 12.6153 11.3587C12.4849 11.4141 12.3446 11.4425 12.2029 11.4423C11.9399 11.4423 11.6759 11.3443 11.4719 11.1473L10.9909 10.6833V13.6273C10.9909 14.2093 10.5189 14.6813 9.93691 14.6813C9.35491 14.6813 8.88291 14.2093 8.88291 13.6273V10.6253L8.41491 11.0663C7.99091 11.4653 7.32391 11.4453 6.92591 11.0213C6.52691 10.5973 6.54691 9.93027 6.97091 9.53227L9.20591 7.42827C9.61491 7.04327 10.2549 7.04627 10.6599 7.43727L12.9349 9.63127C13.3539 10.0343 13.3659 10.7013 12.9619 11.1203Z" fill="#1556FC"/>
            <path d="M9.09891 3.87927C8.95491 3.87927 8.81691 3.82427 8.71291 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V13.5823C1.73791 13.5823 1.76491 13.5833 1.79091 13.5833C4.40991 13.5833 6.84691 12.8063 8.88491 11.4703V10.6243L8.41691 11.0653C7.99291 11.4643 7.32591 11.4443 6.92791 11.0203C6.52891 10.5963 6.54891 9.92927 6.97291 9.53127L9.20791 7.42727C9.61691 7.04227 10.2569 7.04527 10.6619 7.43627L11.9479 8.67627C13.0729 7.26207 13.8884 5.6275 14.3419 3.87827H9.09891V3.87927Z" fill="#3886FC"/>
            <path d="M8.88191 3.83527C8.81991 3.80927 8.76191 3.77327 8.71191 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V8.60227C4.61591 7.87027 7.12991 6.15627 8.88191 3.83527Z" fill="#5EB2FF"/>
          </svg>
        </template>
      </upload-button>
      <upload-button @success="onUpload" theme="white" content="" :fixed-size="40" shadow disabled>
        <template #img>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.1299 3.87927H9.09891C8.95491 3.87927 8.81691 3.82427 8.71291 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V15.5933C1.71191 16.6623 2.57891 17.5293 3.64791 17.5293H16.1299C17.1989 17.5293 18.0659 16.6623 18.0659 15.5933V5.81527C18.0669 4.74627 17.1999 3.87927 16.1299 3.87927ZM12.9619 11.1203C12.8636 11.2223 12.7457 11.3034 12.6153 11.3587C12.4849 11.4141 12.3446 11.4425 12.2029 11.4423C11.9399 11.4423 11.6759 11.3443 11.4719 11.1473L10.9909 10.6833V13.6273C10.9909 14.2093 10.5189 14.6813 9.93691 14.6813C9.35491 14.6813 8.88291 14.2093 8.88291 13.6273V10.6253L8.41491 11.0663C7.99091 11.4653 7.32391 11.4453 6.92591 11.0213C6.52691 10.5973 6.54691 9.93027 6.97091 9.53227L9.20591 7.42827C9.61491 7.04327 10.2549 7.04627 10.6599 7.43727L12.9349 9.63127C13.3539 10.0343 13.3659 10.7013 12.9619 11.1203Z" fill="#2512FF"/>
            <path d="M18.0669 5.81527C18.0669 4.74627 17.1999 3.87927 16.1309 3.87927H9.09891C8.95491 3.87927 8.81691 3.82427 8.71291 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V15.5933C1.71191 16.6623 2.57891 17.5293 3.64791 17.5293H9.41691C13.8249 16.0683 17.1819 12.3063 18.0669 7.66627V5.81527ZM12.9619 11.1203C12.8636 11.2223 12.7457 11.3034 12.6153 11.3587C12.4849 11.4141 12.3446 11.4425 12.2029 11.4423C11.9399 11.4423 11.6759 11.3443 11.4719 11.1473L10.9909 10.6833V13.6273C10.9909 14.2093 10.5189 14.6813 9.93691 14.6813C9.35491 14.6813 8.88291 14.2093 8.88291 13.6273V10.6253L8.41491 11.0663C7.99091 11.4653 7.32391 11.4453 6.92591 11.0213C6.52691 10.5973 6.54691 9.93027 6.97091 9.53227L9.20591 7.42827C9.61491 7.04327 10.2549 7.04627 10.6599 7.43727L12.9349 9.63127C13.3539 10.0343 13.3659 10.7013 12.9619 11.1203Z" fill="#1556FC"/>
            <path d="M9.09891 3.87927C8.95491 3.87927 8.81691 3.82427 8.71291 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V13.5823C1.73791 13.5823 1.76491 13.5833 1.79091 13.5833C4.40991 13.5833 6.84691 12.8063 8.88491 11.4703V10.6243L8.41691 11.0653C7.99291 11.4643 7.32591 11.4443 6.92791 11.0203C6.52891 10.5963 6.54891 9.92927 6.97291 9.53127L9.20791 7.42727C9.61691 7.04227 10.2569 7.04527 10.6619 7.43627L11.9479 8.67627C13.0729 7.26207 13.8884 5.6275 14.3419 3.87827H9.09891V3.87927Z" fill="#3886FC"/>
            <path d="M8.88191 3.83527C8.81991 3.80927 8.76191 3.77327 8.71191 3.72627L7.10991 2.22527C7.00525 2.12725 6.86731 2.07258 6.72391 2.07227H3.64791C2.57891 2.07227 1.71191 2.93927 1.71191 4.00827V8.60227C4.61591 7.87027 7.12991 6.15627 8.88191 3.83527Z" fill="#5EB2FF"/>
          </svg>
        </template>
      </upload-button>

      <upload-button @success="onUpload" content="添加附件" type="text" icon="el-icon-plus"></upload-button>
      <upload-button @success="onUpload" content="添加附件" type="text" icon="el-icon-plus" color="#9CACCA"></upload-button>
    </div>

    <h3>附件列表</h3>
    <div style="width: 800px;">
      <attachment-list :list="attachList"
        @change="onAttachChange"
        @delete="onAttachDelete"
      ></attachment-list>
    </div>
    <h3>附件列表多选</h3>
    <div style="width: 800px;">
      <attachment-list :list="attachList"
        multiple
        @change="onAttachChange2"
        @delete="onAttachDelete"
      ></attachment-list>
    </div>
    <h3>单据详情状态</h3>
    <bill-item-states :data-list="['fei', 'aps', 'deng', 'gou', 'xie']"></bill-item-states>
    <br />
    <bill-item-states :data-list="['fei', 'deng', 'gou', 'xie']"></bill-item-states>
    <br />
    <bill-item-states :data-list="['aps', 'xie']"></bill-item-states>
    <h3>单据详情状态(单个)</h3>
    <bill-item-state-icon icon="fei"></bill-item-state-icon>
    <bill-item-state-icon icon="aps"></bill-item-state-icon>
    <bill-item-state-icon icon="deng"></bill-item-state-icon>
    <bill-item-state-icon icon="gou"></bill-item-state-icon>
    <bill-item-state-icon icon="xie" size="24"></bill-item-state-icon>

    <h3>
      附件分组({{filelistCount}})
      <!-- <button @click="onPrint">打印列表</button> -->
    </h3>
    <div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
      <vxe-select v-model="billType" size="small">
        <vxe-option v-for="t in billTypes" :key="t.code" :value="t.code" :label="`${t.code}(${t.name})`"></vxe-option>
      </vxe-select>
      <vxe-input v-model="billId" size="small"></vxe-input>
      <vxe-button @click="setGroup" size="small">设置</vxe-button>
      <div>
        <vxe-radio v-model="isReadonly" :label="false" size="small">编辑</vxe-radio>
        <vxe-radio v-model="isReadonly" :label="true" size="small">只读</vxe-radio>
      </div>
    </div>
    <div style="width: 1000px; height: 400px;">
      <bill-filelist-group
        :read-only="isReadonly"
        :bill-id="setBillId"
        :bill-type="setBillType"
        @filelist-update="onFilelistUpdate"
      >
        <template #buttons>
          <page-button>测试</page-button>
        </template>
        <template #operations="{ item }">
          <svg-icon icon-class="info" title="自定义按钮"></svg-icon>
        </template>
      </bill-filelist-group>
    </div>

    <!-- <h3>附件分组(手动 - 默认true:自动)</h3>
    <div style="width: 1000px; height: 400px;">
      <bill-filelist-group :manual="true"
        :groups="filelist_group_groups"
        :file-list="filelist_group_list"
        bill-id="1"
        bill-type="EA"
        @event:upload="onFilelistGroupUpload"
        @event:add-folder="onAddFolder"
        @event:delete="onFilelistItemDelete"
        @event:move="onFilelistItemMove"
        @event:update-name="onFilelistGroupItemUpdateName"
      >
        <template #buttons>
          <page-button>测试</page-button>
        </template>
        <template #operations="{ item }">
          <svg-icon icon-class="export" title="导出"></svg-icon>
        </template>
      </bill-filelist-group>
    </div>

    <h3>附件分组(空id)</h3>
    <div style="width: 1000px; height: 400px;">
      <bill-filelist-group
        :groups="filelist_group_groups"
        :file-list="filelist_group_list"
      >
        <template #buttons>
          <page-button>测试</page-button>
        </template>
        <template #operations="{ item }">
          <svg-icon icon-class="export" title="导出"></svg-icon>
        </template>
      </bill-filelist-group>
    </div>
     -->

    <!-- <h3>附件分组(只读)</h3>
    <div style="width: 1000px; height: 400px;">
      <bill-filelist-group
        read-only
        :header="false"
        :bill-id="setBillId"
        :bill-type="setBillType"
      >
        <template #buttons>
          <page-button disabled>测试</page-button>
        </template>
        <template #operations="{ item }">
          <svg-icon icon-class="export" title="导出"></svg-icon>
        </template>
      </bill-filelist-group>
    </div> -->

  </app-page>
</template>

<script>
  import { mapState } from 'vuex'

  import { mixin_filelist_group } from './mixins'

  export default {
    name: 'ui_controls',
    mixins: [mixin_filelist_group],
    computed: {
      ...mapState({
        userInfo: state => state.User.userInfo ?? {},
      })
    },
    data() {
      return {
        attachList: [
          { fileName: '111.pdf', originalFileName: '111.pdf', url: '', fileImageSize: '0B', uploadTime: '2000-01-01 00:00:00', createUser: '张三' },
          { fileName: '222.xlsx', originalFileName: '222.xlsx', url: '', fileImageSize: '0B', uploadTime: '2001-01-01 00:00:00', createUser: '李四' }
        ],
      }
    },
    methods: {
      onUpload(file) {
        this.$message.success(`上传成功 ${file.url}`)
      },
      onAttachChange(files) {
        //TODO
        // const { fileName, url, uploadTime, fileImageSize, originalFileName } = files[0]
        // this.attachList.push({
        //   fileName,
        //   originalFileName,
        //   url,
        //   fileImageSize,
        //   uploadTime,
        //   createUser: '张三'
        // })
        let fileList = this.attachList ?? []
        fileList = [
          ...fileList,
          ...files.map(file => {
            const { fileName, url, uploadTime, fileImageSize, originalFileName } = file
            return {
              fileName,
              originalFileName,
              url,
              fileImageSize,
              uploadTime,
              createUser: this.userInfo.nickName
            }
          })
        ]
        this.attachList = fileList
      },
      onAttachDelete(e) {
        //TODO
        const { data, index } = e
        this.attachList.splice(index, 1)
      },
      onAttachChange2(files) {
        let fileList = this.attachList ?? []
        fileList = [
          ...fileList,
          ...files.map(file => {
            const { fileName, url, uploadTime, fileImageSize, originalFileName } = file
            return {
              fileName,
              originalFileName,
              url,
              fileImageSize,
              uploadTime,
              createUser: this.userInfo.userName
            }
          })
        ]
        this.attachList = fileList
      }
    }
  }
</script>

<style scoped lang="less">
/* 以下样式仅用于此页面样式展示 */
h3 {
  margin: 20px 0;
}

.custom-upload-btn {
  /deep/.page-button {
    width: 40px;
    height: 40px;
    padding: 0;
  }
}
</style>
