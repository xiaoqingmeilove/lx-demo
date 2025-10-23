<template>
  <!-- 切换前备份 -->
  <div class="bill-filelist-group">
    <template v-if="!billId">
      <el-empty description="请先初始化单据"></el-empty>
    </template>
    <template v-else>
      <FilelistGroup
        v-bind="$attrs"
        v-on="$listeners"
        :groups="groups"
        :file-list="fileList"
        :editable="!!billId"
        manual
        @folder-item-clicked="onFolderItemClicked"
        @event:upload="onEventUpload"
        @event:add-folder="onEventAddFolder"
        @event:delete-folder="onEventDeleteFolder"
        @event:update-folder="onEventUpdateFolder"
        @event:update-filename="onEventUpdateFilename"
        @event:move-file="onEventMoveFile"
        @event:delete-file="onEventDeleteFile"
      >
        <template #buttons>
          <page-button content="导出" class="export-button"
            :width="126"
            :disabled="exportDisabled"
            @click="onExportBtnClick"
            v-if="exportButton"
          >
            <template #img>
              <svg-icon icon-class="export" size="14" style="margin-right: 5px;"></svg-icon>
            </template>
          </page-button>
          <slot name="buttons"></slot>
        </template>
        <template #operations="data">
          <slot name="operations" v-bind="{...data}"></slot>
        </template>
      </FilelistGroup>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import VXETable from 'vxe-table'
import { ApiBillFile } from '@/apis'
import FilelistGroup from '../filelist-group/index.vue'
import moment from 'moment'

export default {
  name: 'billFilelistGroup',
  components: {
    FilelistGroup
  },
  props: {
    billId: {
      type: [String, Number],
      default: null
    },
    billType: {
      type: String,
      default: null
    },
    exportButton: {
      type: Boolean,
      default: true
    },
    // groups: {
    //   type: Array,
    //   default: () => []
    // },
    // fileList: {
    //   type: Array,
    //   default: () => []
    // },
  },
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
    }),
    exportDisabled() {
      if (!this.currentFolderId && this.fileList.length) {
        return false
      }
      return !this.fileList.some(item => item.folderId == this.currentFolderId)
    }
  },
  watch: {
    billId(newVal) {
      if (newVal) {
        this.getData()
      }
    }
  },
  data() {
    return {
      groups: [],
      fileList: [],
      currentFolderId: ''
    }
  },
  mounted() {
    if (this.billId) {
      this.getData()
    }
  },
  methods: {
    async getData(callback) {
      const { billId, billType } = this
      const res = await ApiBillFile.getBillFiles(billId, billType)
      this.fileList = res.data?.fileList ?? []
      this.groups = (res.data?.folderList ?? []).map(item => {
        return {
          id: item.id,
          name: item.folderName,
          status: item.status,
          sortNum: item.sortNum
        }
      })

      this.fileListUpdate()

      typeof callback === 'function' && callback()
    },
    async onExportBtnClick() {
      const { billId, billType, currentFolderId } = this
      const loading = this.$loading({
      	lock: true,
      	text: '正在请求',
      	spinner: 'el-icon-loading',
      })
      const res = await ApiBillFile.exportFiles(billId, billType, currentFolderId)
      loading.close()
      if (res) {
        if (res instanceof Error) {
          const errorText = await res.response?.data?.text()
          const errorJson = errorText ? JSON.parse(errorText) : {}
          this.$message.error(errorJson.message || '导出失败')
        } else {
          const link = document.createElement('a')
          link.download = `${new Date().valueOf()}.zip`
          link.href = window.URL.createObjectURL(res)
          link.click()
        }
      } else {
        this.$message.error(res.message || '导出失败')
      }
    },

    fileListUpdate() {
      this.$emit('filelist-update', {
        fileList: this.fileList
      })
    },

    onEventUpload({ files, groupId, next }) {
      const { billId, billType } = this
      const file = files[0]
      const data = {
        ...file,
        billId,
        billType,
        folderInfoId: groupId,
        uploadUser: this.userInfo.userId,
        uploadUserName: this.userInfo.userName,
      }
      ApiBillFile.addBillFile(data).then(res => {
        if (res.code === 200) {
          // const newId = res.data
          // next([
          //   {
          //     id: newId,
          //     fileName: originalFileName,
          //     originalFileName,
          //     url,
          //     fileImageSize,
          //     uploadTime: now,
          //     uploadUser: this.userInfo.userId,
          //     uploadUserName: this.userInfo.userName,
          //     folderId: groupId
          //   }
          // ])
          if (res.code === 200) {
            this.$message.success(res.message)
            this.getData(next)
          } else {
            this.$message.error(res.message || '操作失败')
          }
        }
      })
    },

    onFolderItemClicked(id) {
      this.currentFolderId = id
    },

    onEventAddFolder({ name, next }) {
      const { billId, billType } = this
      ApiBillFile.addFolder(billId, billType, name).then(res => {
        const newId = res.data
        next(newId)
      })
    },
    onEventDeleteFolder({ id, next }) {
      const { billId, billType } = this
      ApiBillFile.deleteFolder(id, billId, billType).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          next()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      })
    },
    onEventUpdateFolder({ id, name, sortNum, next }) {
      const { billId, billType } = this
      ApiBillFile.updateFolder({
        id,
        folderName: name,
        sortNum,
        billId,
        billType,
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          next()
          this.getData()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      })
    },
    onEventUpdateFilename({ item, name, next }) {
      const { billId, billType } = this
      ApiBillFile.updateBillFlieName({
        fileId: item.id,
        originalFileName: name,     //????
        billId,
        billType,
        folderInfoId: item.folderId
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          next()
          this.fileListUpdate()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      })
    },
    onEventMoveFile({ item, index, groupId, next }) {
      const { billId, billType } = this
      ApiBillFile.moveFile({
        fileId: item.id,
        billId,
        billType,
        newFolderInfoId: groupId,
        oldFolderInfoId: item.folderId
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          next()
          this.fileListUpdate()
        } else {
          this.$message.error(res.message || '操作失败')
        }
      })
    },
    onEventDeleteFile({ item, index, next}) {
      VXETable.modal.confirm({
        title: '提示',
        content: '是否删除附件?',
        mask: true,
      }).then(type => {
        if (type === 'confirm') {
          const { billId, billType } = this
          ApiBillFile.deleteFile({
            fileId: item.id,
            billId,
            billType,
            folderInfoId: item.folderId,
          }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              next()
              this.fileListUpdate()
            } else {
              this.$message.error(res.message || '操作失败')
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.bill-filelist-group {
  width: 100%;
  height: 450px;
  background: #fff;
  .export-button {
    color: var(--base-color);
    border-color: var(--base-color);
    background: #fff;
  }
}
</style>
