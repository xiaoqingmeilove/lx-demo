<template>
  <div class="filelist-group">
    <div class="filelist-group-aside">
      <div class="filelist-group-aside-scroll">
        <el-scrollbar class="el-scrollbar-y" ref="asideScroll">
          <div class="filelist-group-list">
            <div class="filelist-group-list-item"
              v-for="(item, index) in bindGroups" :key="`groupid_${item.id}`"
              :class="{
                on: currentGroupId == item.id
              }"
              @click="onGroupItemClick(item)"
            >
              <svg-icon icon-class="folder" fill="#FFC121" size="22" class="filelist-group-icon"></svg-icon>
              <el-tooltip class="item" effect="dark" :content="item.name" placement="right-start">
                <div class="file-group-name" >
                {{item.name}}
              </div>
              </el-tooltip>
             
              <small v-if="item.count">{{item.count}}</small>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="filelist-group-main">
      <div class="filelist-group-main-header">
        <upload-button @success="onUploadSuccess"
          class="file-upload-button"
          content="上传"
          icon="el-icon-upload2"
          align="center"
          :width="126"
         :disabled="!showUpload || readOnly"
        ></upload-button>
        <page-button content="导出" class="export-button"
            :width="126"
            @click="onExportBtnClick"
            :disabled="!showExport"
          >
            <template #img>
              <svg-icon icon-class="export" size="14" style="margin-right: 5px;"></svg-icon>
            </template>
          </page-button>
        <slot name="buttons"></slot>
      </div>
      <div class="filelist-group-main-body">
        <el-scrollbar class="el-scrollbar-y" ref="listScroll">
          <div class="filelist-group-filelist">
            <div class="filelist-group-filelist-item"
              v-for="(item, index) in bindFiles" :key="item._index_"
              v-if="item.folderAuth.folderLook"
            >
              <div>
                <a class="filelist-group-filelist-item-icon" @click="onItemImgClick(item)">
                  <template v-if="item.isImg">
                    <img :src="'/' + item.url" class="is--img" />
                  </template>
                  <template v-else>
                    <img :src="require(`./assets/${item.fileIcon}.png`)" />
                  </template>
                </a>
                <div class="file-info-content">
                  <div class="file-info-content-row">
                    <span>{{item.originalFileName}}</span>
                    <svg-icon v-if="!readOnly && item.folderAuth.folderRename" icon-class="edit2" class="edit-filename" @click="onEditNameClick(item, index)"></svg-icon>
                  </div>
                  <div class="file-info-content-row file-info-datainfo">
                    <div v-if="item.bindGroupName">{{item.bindGroupName}}</div>
                    <div>{{item.fileImageSize}}</div>
                    <div>{{item.uploadTime}}</div>
                    <div>{{item.uploadUserName}}</div>
                  </div>
                </div>
                <div class="fileitem-operations">
                  <slot name="operations" v-bind="{ item, index }"></slot>
                  <svg-icon
                    v-if="item.isImg"
                    icon-class="img"
                    title="图片预览"
                    @click="previewImages"
                  ></svg-icon>
                  <svg-icon v-for="op in bindOperations" :key="op.code"
                     v-if="item.folderAuth[op.authCode] ?? false"
                    :icon-class="op.icon"
                    :title="op.name"
                    @click="onOperatonClick(op.code, item, index)"
                  ></svg-icon>
                </div>
              </div>

            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <popup-form v-model="nameForm.visible"
      title="修改名称"
      :span="12"
      width="450"
      :form-data="nameForm.data"
      :data-gather="nameForm.dataGather"
      :rules="nameForm.rules"
      :title-width="90"
      auto-scroll
      okText="确定"
      cancelText="取消"
      btn-align="right"
      @ok="nameForm.ok"
      @hide="nameForm.data = {}; currentItemIndex = -1;"
    >
    </popup-form>

    <popup-form v-model="moveForm.visible"
      title="移动"
      :span="12"
      width="450"
      :form-data="moveForm.data"
      :data-gather="moveForm.dataGather"
      :rules="moveForm.rules"
      :data-list="bindDataList"
      :title-width="90"
      auto-scroll
      okText="确定"
      cancelText="取消"
      btn-align="right"
      @ok="moveForm.ok"
      @hide="moveForm.data = {}; currentItemIndex = -1;"
    >
    </popup-form>
    <light-box v-if="previewImg && media.length > 0"
      :media="media"
      :show-light-box="previewImg"
      @onClosed="onLightBoxClosed"
      ref="lightbox"
    ></light-box>
  </div>
</template>

<script>
import LightBox from 'vue-image-lightbox'
import { mapState } from 'vuex'
import VXETable from 'vxe-table'
import { MIME_TYPE } from './mime'
import { ApiBillFile } from '@/apis'

const IMG_EXT = ['jpg', 'png', 'jpeg', 'gif', 'bmp']
const FILE_EXT_MAP = {
  doc: 'word',
  docx: 'word',
  xls: 'excel',
  xlsx: 'excel',
  pdf: 'pdf',
  png: 'img',
  jpg: 'img',
  jpeg: 'img',
  bmp: 'img',
  gif: 'img',
  zip: 'zip',
  rar: 'zip',
  ppt: 'ppt',
  pptx: 'ppt'
}

function getNameAndExt(name) {
  const lastDotIndex = name.lastIndexOf(".");
  const ext = lastDotIndex !== -1 ? name.slice(lastDotIndex + 1) : "";
  const fileName = lastDotIndex !== -1 ? name.slice(0, lastDotIndex) : name;
  return { name: fileName, ext: ext };
}

const groupid_key = 'folderId'

export default {
  name: 'filelistGroup',
  props: {
    groups: {
      type: Array,
      default: () => []
    },
    fileList: {
      type: Array,
      default: () => []
    },
    manual: {
      type: Boolean,
      default: false
    },
    idFormatter: {
      type: Function,
      default: null
    },
    operations: {
      type: Array,
      default: () => []
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    buttons: {
      type: Array,
      default: () => []
    },
    editable: {
      type: Boolean,
      default: true
    },

     billId: {
      type: [String, Number],
      default: null
    },
    billType: {
      type: String,
      default: null
    },
    menuCode: {
      type: String,
      default: null
    },
    currentFolderId: {
      type: [String, Number],
      default: null
    },
  },
  components: {
    LightBox
  },
  computed: {
    ...mapState({
      userInfo: state => state.User.userInfo ?? {},
    }),
    showUpload(){
      if(this.currentGroupId){
        let find = (this.groups ?? []).find(x => x.id == this.currentGroupId);
        return find ? find.folderAuth.folderUpload :false;
      }else{
        let list = (this.groups ?? []).some((x) => x.folderAuth.folderUpload);
      return list;
      }
    },
    showExport(){
      if(this.currentGroupId){
        let find = (this.groups ?? []).find(x => x.id == this.currentGroupId && x.count);
        return find ? find.folderAuth.folderExport :false;
      }else{
        let list = (this.groups ?? []).some((x) => x.folderAuth.folderExport && x.count);
      return list;
      }
      
    },
    bindGroups() {
      const groups = [{ name: '全部', id: '' }].concat(this.groups)
      return groups.map(item => {
        item.count = this.getFileCount(item)
        return item
      })
    },
    bindFiles() {
      const list = this.fileList.map((item, index) => {
        item._index_ = index
        item.isImg = this.isImg(item)
        item.bindGroupName = this.bindGroupName(item)
        item.folderAuth = this.bindGroupAuth(item)
        item.fileIcon = this.getFileIcon(item)
        return item
        // return {
        //   ...item,
        //   _index_: index
        // }
      })
      return !this.currentGroupId ? list
              : list.filter(item => item[groupid_key] == this.currentGroupId)
    },
    bindOperations() {
      // 条件控制
      let list = [...this.operationList]
      if (this.readOnly) {
        list = list.filter(item => !!!item.excute)
      }
      if (this.operations && this.operations.length) {
        return list.filter(item => this.operations.includes(item.code))
      }
      return list
    },
    bindDataList() {
      return {
        groups: this.groups.map(item => ({
          label: item.name,
          value: item.id
        }))
      }
    },
    isInBtnList() {
      return name => {
        if (this.buttons && this.buttons.length) {
          return this.buttons.includes(name)
        }
        return true
      }
    },
    bindFolderEditable() {
      const { readOnly, editable, currentGroupId } = this
      if (!readOnly && editable && currentGroupId) {
        const find = this.groups.find(x => x.id == currentGroupId)
        if (find && find.status != 1) {
          return true
        }
      }
      return false
    },
    media() {
      return this.bindFiles.filter(item => item.isImg).map(item => {
        return {
          thumb: item.url,
          src: item.url,
          caption: item.originalFileName,
        }
      })
    }
  },
  data() {
    return {
      currentGroupId: '',
      currentItemIndex: -1,
      // groupList: [
      //   { name: '合同', id: 1 },
      //   { name: '签收', id: 2 },
      //   { name: '回款', id: 3 },
      //   { name: '发票', id: 4 },
      // ],

      operationList: [
        { name: '移动', code: 'move', icon: 'moveto', excute: true ,authCode:"folderMove"},
        // { name: '在线预览', code: 'preview', icon: 'preview' ,authCode:"folderPreview"},
        { name: '下载', code: 'download', icon: 'download2',authCode:"folderDownload" },
        { name: '删除', code: 'delete', icon: 'garbage', excute: true,authCode:"folderDel" },
      ],

      folderMode: 'add',
      form: {
        visible: false,
        data: {},
        dataGather: [
          {
            span: 24,
            config: [
              { label: '名称', field: 'name', type: 'input' },
            ]
          },
        ],
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ]
        },
        ok: () => {
          const name = this.form.data.name
          const { folderMode } = this
          if (this.manual) {
            this.$emit('event:add-folder', {
              name,
              next: (id) => {
                if (!id) {
                  this.form.visible = false
                  return
                }
                this.nexts()['addFolder'](id, name)
              }
            })
          } else {
            this.handleEvents()['addFolder'](name)
          }
        }
      },

      folderForm: {
        visible: false,
        data: {},
        dataGather: [
          {
            span: 24,
            config: [
              { label: '目录名称', field: 'name', type: 'input' },
              { label: '显示顺序', field: 'sortNum', type: 'inputnumber' },
            ]
          },
        ],
        rules: {
          name: [
            { required: true, message: '请输入目录名称' }
          ]
        },
        ok: (data) => {
          const { name, sortNum } = data
          if (this.manual) {
            this.$emit('event:update-folder', {
              id: this.currentGroupId,
              name,
              sortNum,
              next: () => {
                this.nexts()['updateFolder'](name, sortNum)
              }
            })
          } else {
            this.handleEvents()['updateFolder'](name, sortNum)
          }
        }
      },

      nameForm: {
        visible: false,
        data: {},
        dataGather: [
          {
            span: 24,
            config: [
              { label: '名称', field: 'name', type: 'input' },
            ]
          },
        ],
        rules: {
          name: [
            { required: true, message: '请输入名称' }
          ]
        },
        ok: (data) => {
          const item = this.fileList[this.currentItemIndex]
          const info = getNameAndExt(item.fileName)
          const name = data.name + (info.ext ? `.${info.ext}` : '')
          if (this.manual) {
            this.$emit('event:update-filename', {
              item,
              index: this.currentItemIndex,
              name: name,
              next: () => {
                this.nexts()['updateFilename'](name)
              }
            })
          } else {
            const fn = this.handleEvents()['updateFilename']
            fn(name)
          }
        }
      },

      moveForm: {
        visible: false,
        data: {},
        dataGather: [
          {
            span: 24,
            config: [
              { label: '分组名', field: 'id', type: 'select', source: 'groups', props: { clearable: false } },
            ]
          },
        ],
        rules: {

        },
        ok: (data) => {
          const groupId = data?.id || ''
          if (this.manual) {
            this.$emit('event:move-file', {
              item: this.fileList[this.currentItemIndex],
              index: this.currentItemIndex,
              groupId,
              next: () => {
                this.nexts()['move'](groupId)
              }
            })
          } else {
            const fn = this.handleEvents()['move']
            fn(groupId, this.currentItemIndex)
          }
        }
      },

      previewImg: false,

    }
  },
  methods: {
    async onExportBtnClick() {
      const { billId, billType, currentFolderId ,menuCode} = this
      const loading = this.$loading({
      	lock: true,
      	text: '正在请求',
      	spinner: 'el-icon-loading',
      })
      let folderCode = this.groups.find(x => x.id == currentFolderId)?.folderCode
      const res = await ApiBillFile.exportAuthFiles(billId, billType, currentFolderId,menuCode,folderCode)
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
    generateID() {
      if (typeof this.idFormatter === 'function') {
        return this.idFormatter()
      }
      const epoch = 1735689600000
      const timestamp = Date.now() - epoch
      const uniqueId = Math.floor(Math.random() * 4096)
      const snowflakeId = (timestamp << 12) | uniqueId
      return Math.abs(snowflakeId).toString()
    },
    handleEvents() {
      return {
        addFolder: (name) => {
          this.nexts()['addFolder'](this.generateID(), name)
        },
        deleteFolder: (id) => {
          this.nexts()['deleteFolder'](id)
        },
        updateFolder: (name, sortNum) => {
          this.nexts()['updateFolder'](name, sortNum)
        },
        updateFilename: (name) => {
          // this.fileList[this.currentItemIndex].fileName = data.name
          // this.nameForm.visible = false
          this.nexts()['updateFilename'](name)
        },
        uploadSuccess: (files) => {
          this.nexts()['upload'](files)
        },
        delete: (item, index) => {
          this.nexts()['delete'](index)
        },
        move: (groupId) => {
          this.nexts()['move'](groupId)
        }
      }
    },
    onGroupItemClick(item) {
      this.currentGroupId = item.id
      this.$emit('folder-item-clicked', item.id)
    },
    onAddFolderClick() {
      this.form.visible = true
    },

    nexts() {
      return {
        addFolder: (id, name) => {
          this.groups.push({
            id,
            name,
            status: 0
          })
          this.form.visible = false

          this.$nextTick(() => {
            const wrap = this.$refs['asideScroll']?.wrap
            if (!wrap) return
            wrap.scrollTop = wrap.scrollHeight
          })
        },
        deleteFolder: id => {
          const findIndex = this.groups.findIndex(item => item.id == id)
          if (findIndex < 0) return
          this.groups.splice(findIndex, 1)
          this.currentGroupId = ''
          this.$emit('folder-item-clicked', '')
        },
        updateFolder: (name, sortNum) => {
          const findIndex = this.groups.findIndex(item => item.id == this.currentGroupId)
          if (findIndex < 0) return
          this.groups[findIndex].name = name
          this.groups[findIndex].sortNum = sortNum
          this.folderForm.visible = false
        },
        updateFilename: (name) => {
          const { currentItemIndex } = this
          this.fileList[currentItemIndex].originalFileName = name
          this.nameForm.visible = false
        },
        delete: (index) => {
          this.fileList.splice(index, 1)
        },
        move: (groupId) => {
          const { currentItemIndex } = this
          this.fileList[currentItemIndex][groupid_key] = groupId
          this.moveForm.visible = false
        },
        upload: (files) => {
          // for(let i = 0; i < files.length; i++) {
          //   const file = files[i]
          //   const { id, fileName, url, uploadTime, fileImageSize, originalFileName } = file
          //   const fileItem = {
          //     fileName,
          //     originalFileName,
          //     url,
          //     fileImageSize,
          //     uploadTime,
          //     createUser: this.userInfo.userName,
          //     groupId: this.currentGroupId,
          //     id: id || null
          //   }
          //   this.fileList.push(fileItem)
          // }
          if (files && files.length) {
            for(let i = 0; i < files.length; i++) {
              this.fileList.push(files[i])
            }
          }
          this.$nextTick(() => {
            const wrap = this.$refs['listScroll']?.wrap
            if (!wrap) return
            wrap.scrollTop = wrap.scrollHeight
          })
        }
      }
    },

    onUploadSuccess(files) {
      if (this.manual) {
        this.$emit('event:upload', {
          files,
          groupId: this.currentGroupId,
          next: this.nexts()['upload']
        })
      } else {
        const fn = this.handleEvents()['uploadSuccess']
        const groupId = this.currentGroupId
        const userId = this.userInfo.userId
        const userName = this.userInfo.userName
        files = files.map(file => {
          const { id, fileName, url, uploadTime, fileImageSize, originalFileName } = file
          return {
            fileName,
            originalFileName,
            url,
            fileImageSize,
            uploadTime,
            uploadUser: userId,
            uploadUserName: userName,
            folderId: groupId,
            id: id || null
          }
        })
        fn(files)
      }
    },

    onEditNameClick(item, index) {
      this.currentItemIndex = item._index_
      const info = getNameAndExt(item.originalFileName) //fileName
      const { name, ext } = info
      this.nameForm.data = {
        name: name,
      }
      this.nameForm.dataGather[0].config[0].inputSuffix = ext ? `.${ext}` : ''
      this.nameForm.visible = true
    },

    operationEvents(item, index) {
      return {
        download: () => {
          const { originalFileName, url } = item
          const a = document.createElement('a')
          a.style.display = 'none'
          a.download = originalFileName
          a.href = url
          a.click()
        },
        preview: () => {
          this.previewFile(item.url)
        },
        delete: () => {
          if (this.manual) {
            this.$emit('event:delete-file', {
              item,
              index: index,
              next: () => {
                this.nexts()['delete'](index)
              }
            })
          } else {
            const fn = this.handleEvents()['delete']
            fn(item, index)
          }
        },
        move: () => {
          this.currentItemIndex = item._index_
          this.moveForm.data = {
            id: item[groupid_key]
          }
          this.moveForm.visible = true
        }
      }
    },
    onOperatonClick(eventName, item, index) {
      const fn = this.operationEvents(item, item._index_)[eventName]
      fn && fn()
    },

    onFolderModalShow() {
      const { folderInput } = this.$refs
      this.$nextTick(() => {
        folderInput.focus()
      })
    },

    onDeleteFolderClick() {
      VXETable.modal.confirm({
        title: '提示',
        content: '是否删除目录?',
        mask: true,
      }).then(type => {
        if (type === 'confirm') {
          if (this.manual) {
            this.$emit('event:delete-folder', {
              id: this.currentGroupId,
              next: () => {
                this.nexts()['deleteFolder'](this.currentGroupId)
              }
            })
          } else {
            const fn = this.handleEvents()['deleteFolder']
            fn(this.currentGroupId)
          }
        }
      })
    },
    onUpdateFolderClick() {
      this.folderMode = 'update'
      const currentGroup = this.groups.find(x => x.id == this.currentGroupId)
      // this.form.data = {
      //   name: currentGroup?.name
      // }
      // this.form.visible = true
      this.folderForm.data = {
        name: currentGroup?.name,
        sortNum: currentGroup?.sortNum
      }
      this.folderForm.visible = true
    },
    onLightBoxClosed(e) {
      this.previewImg = false
    },
    previewImages(item) {
      this.previewImg = true
      this.$nextTick(() => {
        const { lightbox } = this.$refs
        const { $el } = lightbox
        this.tmpEl = $el
        document.body.appendChild($el)
        let index = item ? this.media.findIndex(x => x.src === item.url) : 0
        index = index < 0 ? 0 : index
        lightbox.showImage(index)
      })
    },
    isImg(item) {
      let fileName = item.fileName ?? '';
      let ext = (fileName.split('.')[fileName.split('.').length - 1]).toLowerCase()
      return IMG_EXT.includes(ext)
    },
    bindGroupName(item) {
      return this.groups.find(x => x.id == item[groupid_key])?.name
    },
    bindGroupAuth(item) {
      return this.groups.find(x => x.id == item[groupid_key]).folderAuth
    },
    getFileCount(item) {
      if (!item.id) return this.fileList.length
      return this.fileList.filter(i => i[groupid_key] == item.id).length
    },
    getFileIcon(item) {
      let fileName = item.fileName ?? '';
      let ext = (fileName.split('.')[fileName.split('.').length - 1]).toLowerCase()
      return FILE_EXT_MAP[ext] ?? 'default'
    },
    getFileExtensionFromUrl(url) {
      const match = url.match(/[^\/\\&\?]+\.(?:[^\/\\&\?]+)(?=[\?&]|\s|$)/)
      if (match) {
        const filename = match[0]
        return filename.split('.').pop()
      }
      return null
    },
    previewFile(url) {
      fetch(url)
        .then(response => response.blob())
        .then(blob => {
          const ext = this.getFileExtensionFromUrl(url)
          const mime = MIME_TYPE[ext]
          if (mime) {
            const fileUrl = URL.createObjectURL(new Blob([blob], { type: MIME_TYPE[ext]}))
            window.open(fileUrl, '_blank')
          } else {
            window.open(url, '_blank')
          }
        })
        .catch(error => this.$message.error('文件转换失败'));
    },
    onItemImgClick(item) {
      this.previewFile(item.url)
    }
  }
}
</script>

<style lang="scss" >
@use './style.scss'
</style>
