<template>
  <div class="page-button upload-button">
    <page-button class="upload-button-btn"
      :type="type"
      :disabled="disabled"
      :icon="icon"
      :background="background"
      :color="color"
      :border-color="borderColor"
      :theme="theme"
      :shadow="shadow"
      :align="align"
      :width="width"
      :fixed-size="fixedSize"
      @click="onBtnClick"
    >
      <template #img v-if="$scopedSlots.img">
        <slot name="img"></slot>
      </template>
      {{content}}
    </page-button>
    <input type="file"
      class="upload-button--input"
      :multiple="multiple"
      :accept="accepts"
      @change="onFileChange"
      ref="input"
    />
  </div>
</template>

<script>
  import { Loading } from 'element-ui'
  import { ApiCommon } from '@/apis'

  export default {
    name: 'uploadButton',
    props: {
      content: {
        type: String,
        default: '上传'
      },
      type: {
        type: String,
        default: 'button'
      },
      icon: {
        type: String,
        default: null
      },
      background: {
        type: String,
        default: null
      },
      color: {
        type: String,
        default: null
      },
      borderColor: {
        type: String,
        default: null
      },
      theme: {
        type: String,
        default: null
      },
      shadow: {
        type: Boolean,
        default: false
      },
      fixedSize: {
        type: [Number, String],
        default: null
      },
      multiple: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      accept: {
        type: [String, Array],
        default: '*'
      },
      showLoading: {
        type: Boolean,
        default: true
      },
      align: {
        type: String,
        default: 'center'
      },
      width: {
        type: [String, Number],
        default: null
      }
    },
    computed: {
      accepts() {
        if (this.accept instanceof Array) {
          return this.accept.join(',')
        }
        return this.accept
      }
    },
    methods: {
      onBtnClick() {
        this.$refs.input.click()
      },
      onFileChange(e) {
        const files = e.target.files
        this.upload(files)
      },
      async upload(files) {
        let loadingInstance = null
        if (this.showLoading) {
          loadingInstance = Loading.service({
            lock: true,
            text: '正在上传',
            spinner: 'el-icon-loading',
          })
        }

        const responses = await this.doUpload(files)
        if (loadingInstance) {
          loadingInstance.close()
        }
        if (this.multiple) {
          const data = responses.filter(r => r.code === 200).map(res => res.data)
          if (data.length > 0) {
            this.$emit('success', data)
          } else {
            this.$emit('fail')
            this.$message.error('上传文件失败!')
          }
        } else {
          const res = responses[0]
          if (res?.code === 200) {
            this.$emit('success', [res.data])
          } else {
            this.$emit('fail')
            this.$message.error('上传文件失败!')
          }
        }
        this.$refs.input.value = null
      },
      async doUpload(files) {
        const tasks = []
        for (let i = 0; i < files.length; i++) {
          tasks.push(ApiCommon.uploadFile(files[i]))
        }
        return Promise.all(tasks)
      }
    }
  }
</script>

<style lang="less">
.upload-button {
  display: inline-block;
  padding: 0 !important;
  height: auto !important;
  background: none !important;
  border: none !important;
  > button {
    width: 100%;
  }
}
.upload-button--input {
  display: none;
}
</style>
