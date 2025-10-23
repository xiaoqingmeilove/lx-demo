<template>
  <div class="attachment-list">
    <div class="attachment-list-toolbar">
      <span class="attach-count">共<b>{{list.length}}</b>个附件</span>
      <div class="attach-upload-btn" v-if="!readOnly">
        <upload-button type="text"
          icon="el-icon-plus"
          color="#9CACCA"
          text="添加附件"
          :multiple="multiple"
          :show-loading="showLoading"
          @success="onUploadChange"
        ></upload-button>
      </div>
    </div>
    <div class="attachment-list-body">
      <ul class="attach-ls">
        <li class="attach-ls-item" v-for="(item, index) in list" :key="index">
          <div class="attach-item-img">
            <template v-if="isImg(item)">
              <img :src="'/' + item.url" @click="onImgClick(item)" class="is--img" />
            </template>
            <template v-else>
              <img :src="require(`./assets/${fileIcon(item)}.png`)" />
            </template>
          </div>
          <div class="attach-item-content">
            <div class="attach-name">{{item.originalFileName}}</div>
            <div class="attach-info">
              <div>{{item.uploadTime}}</div>
              <div>{{item.fileImageSize}}</div>
              <div>{{item.createUser}}</div>
            </div>
          </div>
          <div class="attach-item-action">
            <i v-if="item.url" class="attach-icon-btn el-icon-download" title="下载" @click="onDownloadIconClick(item)"></i>
            <i v-if="!readOnly"
               title="删除"
              class="attach-icon-btn el-icon-delete"
              @click="onDeleteBtnClick(item, index)"
            ></i>
          </div>
        </li>
      </ul>
    </div>
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
    zip: 'compress',
    rar: 'compress',
  }

  const IMG_EXT = ['jpg', 'png', 'jpeg', 'gif', 'bmp']

  export default {
    name: 'attachmentList',
    props: {
      list: {
        type: Array,
        default: () => []
      },
      multiple: {
        type: Boolean,
        default: false
      },
      showLoading: {
        type: Boolean,
        default: true
      },
      readOnly: {
        type: Boolean,
        default: false
      }
    },
    components: {
      LightBox
    },
    computed: {
      isImg() {
        return item => {
          let fileName = item.fileName ?? '';
          let ext = (fileName.split('.')[fileName.split('.').length - 1]).toLowerCase()
          return IMG_EXT.includes(ext)
        }
      },
      fileIcon() {
        return item => {
          let fileName = item.fileName ?? '';
          let ext = (fileName.split('.')[fileName.split('.').length - 1]).toLowerCase()
          return FILE_EXT_MAP[ext] ?? 'default'
        }
      },
      media() {
        return this.list.filter(item => this.isImg(item)).map(item => {
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
        previewImg: false,
        tmpEl: null
      }
    },
    created() {

    },
    methods: {
      onUploadChange(file) {
        this.$emit('change', file)
      },
      onDownloadIconClick(item) {
        const { originalFileName, url } = item
        const a = document.createElement('a')
        a.style.display = 'none'
        a.download = originalFileName
        a.href = url
        a.click()
      },
      onDeleteBtnClick(item, index) {
        this.$emit('delete', {
          data: item,
          index
        })
      },
      onImgClick(item) {
        this.previewImg = true
        this.$nextTick(() => {
          const { lightbox } = this.$refs
          const { $el } = lightbox
          this.tmpEl = $el
          document.body.appendChild($el)
          let index = this.media.findIndex(x => x.src === item.url)
          index = index < 0 ? 0 : index
          lightbox.showImage(index)
        })
      },
      onLightBoxClosed(e) {
        this.previewImg = false
      }
    }
  }
</script>

<style lang="less">
.attachment-list {
  .attachment-list-toolbar {
    display: flex;
    align-items: center;
    height: 24px;
  }
  .attach-count {
    color: #9CACCA;
    > b {
      margin: 0 6px;
      color: #595959;
      font-weight: normal;
    }
  }
  .attach-upload-btn {
    margin-left: auto;
  }
}
ul.attach-ls {
  margin: 0;
  padding: 0;
  li.attach-ls-item {
    display: flex;
    height: 80px;
    padding: 15px 0;
    border-bottom: solid 1px #ddd;
    .attach-item-img {
      width: 100px;
      height: 50px;
      border: solid 1px #ddd;
      margin-right: 36px;
      padding: 3px 0;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      > img {
        max-width: 100%;
        max-height: 100%;
        &.is--img {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      }
    }
    .attach-item-content {
      flex: 1;
      width: 0;
      height: 100%;
      .attach-name {
        height: 25px;
        line-height: 25px;
        color: #595959;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .attach-info {
        display: flex;
        color: #c1c1c1;
        padding: 4px 0;
        > div {
          padding-right: 20px;
          margin-right: 20px;
          border-right: solid 1px #c9c9c9;
          line-height: 18px;
        }
        > div:last-child {
          border: none;
        }
      }
    }
    .attach-item-action {
      display: flex;
      justify-content: center;
      margin-left: 12px;
      height: 100%;
      font-size: 20px;
      color: #aaa;
      align-items: flex-end;
      .attach-icon-btn {
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
}

</style>
