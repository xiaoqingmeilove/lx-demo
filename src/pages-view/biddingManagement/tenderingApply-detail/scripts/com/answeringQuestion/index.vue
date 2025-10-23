<!--
 * @Author: wmm
 * @Date: 2025-07-18 10:01:25
 * @LastEditors: wmm
 * @LastEditTime: 2025-08-08 14:21:56
-->
<template>
  <div class="answering-question-container">
    <div class="answering-question-warp">
      <div class="left-sidebar">
        <div class="card-content">
          <div class="card-title">问题分类</div>
          <div class="card-list" shadow="never">
            <div :class="{ active: activeCategory === 'all', 'card-item': true }"
              @click="activeCategory = 'all', handleSearch()">
              <div class="card-item-title">全部问题</div>
            </div>
            <div v-for="(item, index) in descSourceList.questionTypeList" :key="index"
              :class="{ active: activeCategory === item.value, 'card-item': true }"
              @click="activeCategory = item.value, handleSearch()">
              <div class="card-item-title">{{ item.label }}</div>
            </div>
          </div>
        </div>
        <div class="card-content">
          <div class="card-title">问题状态</div>
          <div class="card-list" shadow="never">
            <div :class="{ active: activeStatus === 'all', 'card-item': true }"
              @click="activeStatus = 'all', handleSearch()">
              <div class="card-item-title">全部</div>
            </div>
            <div v-for="(item, index) in descSourceList.answerStatusList" :key="index"
              :class="{ active: activeStatus === item.value, 'card-item': true }"
              @click="activeStatus = item.value, handleSearch()">
              <div class="card-item-title">{{ item.label }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="right-content">
        <!-- 筛选栏 -->
        <div class="top-bar">
          <el-input v-model="searchValue" style="width: 420px;" clearable placeholder="搜索问题" prefix-icon="el-icon-search" size="small"
            @keydown.enter.native="handleSearch()"></el-input>
          <!-- <el-button size="small" type="primary" @click="handleSearch">搜索</el-button>
          <el-button size="small" type="primary" @click="addQuestionVisible = true">新增问题</el-button> -->
          <div>
            <page-button @click="handleSearch()">搜索</page-button>
            <page-button v-if="isEdit" @click="addQuestionVisible = true">新增问题</page-button>
            <page-button @click="handleSearch(activeDetailId)">手动刷新</page-button>
          </div>
        </div>
        <div v-if="!questionList.length" class="no-question-data">
          <div class="empty-content">暂无数据</div>
        </div>
        <div v-else class="question-box">
          <!-- 问题一览表 -->
          <div class="question-list-box">
            <div v-for="(item, index) in questionList" :key="index" class="question-list">
              <div class="question-item" :class="{ active: activeDetailId == item.id }"
                @click="getQuestionDetail(item)">
                <div class="question-title-box">
                  <div class="question-title">
                    <el-tooltip :content="item.title">
                      <span>{{ item.title }}</span>
                    </el-tooltip>

                  </div>
                  <div class="question-status-box">
                    <div class="tag-status" :style="{ 'background-color': statusObj[item?.status] }">
                      {{ item.statusName }}
                    </div>
                    <div class="tag-status" v-if="item.questionTypeName">{{ item.questionTypeName }}</div>
                  </div>
                </div>
                <div class="message-header">
                  <span class="message-name">{{ item.supplierName }}</span>
                  <span class="message-time" style="margin-left: 10px;">{{ item.updateTime }}</span>
                </div>
                <div class="message-description">
                  <el-tooltip :content="item.content">
                    <span>{{ item.content }}</span>
                  </el-tooltip>
                </div>
              </div>
            </div>
          </div>
          <!-- 右侧回复区域 -->
          <div class="question-detail-box">
            <el-scrollbar class="workflow-comments-scrollbar" ref="scorllbarRef">
              <div v-for="(citem, cindex) in activeDetaiData" :key="cindex" class="message">
                <template v-if="cindex < 1">
                  <div class="message-title">{{ citem.title }}</div>
                  <div v-html="citem.content" class="message-content"></div>
                  <div class="message-file-list" v-if="citem.fileList && citem.fileList.length > 0">
                    <div v-for="(item, index) in citem.fileList" :key="index" @click="onImgClick(item)">
                      <i class="el-icon-link"></i>
                      {{ item.originalFileName }}
                    </div>
                  </div>
                  <div class="message-header">
                    <span class="sender" style="padding-right: 10px;">{{ citem.supplierName }} </span>
                    <span class="message-time">{{ citem.createTime }}</span>
                  </div>
                 
                </template>
                <div v-else class="message-body">
                  <div v-html="citem.content" class="message-content"></div>
                  <div class="message-file-list" v-if="citem.fileList && citem.fileList.length > 0">
                    <div v-for="(item, index) in citem.fileList" :key="index" @click="onImgClick(item)">
                      <i class="el-icon-link"></i>
                      {{ item.originalFileName }}
                    </div>
                  </div>
                  <div class="message-header">
                    <span class="sender" style="padding-right: 10px;">{{ citem.supplierName }} </span>
                    <span class="message-time">{{ citem.createTime }}</span>
                  </div>
                </div>
              </div>
            </el-scrollbar>

            <div class="comment-reply" v-if="isEdit">
              <Editor class="comment-editor" v-model="content" :defaultConfig="editorConfig" mode="default"
                @onChange="handleEditorChange" ref="editorRef"></Editor>
              <div class="comment-reply-bottom">
                <div class="seed_upload_list">
                  <div v-for="(item, index) of fileList" :key="index"><i class="el-icon-link"></i>{{
                    item.originalFileName }}<i class="el-icon-close" @click="deleteFile(index)"></i></div>
                </div>
                <div class="comment-reply-tools">
                  <div class="comment-reply-tools-item">
                    <svg-icon icon-class="attachment" size="24" @click="onToolItemClick('files')"></svg-icon>
                  </div>
                  <div class="comment-reply-tools-item">
                    <svg-icon icon-class="img" size="24" @click="onToolItemClick('img')"></svg-icon>
                  </div>
                </div>
                <page-button v-if="isEdit"  @click="onSendBtnClick" :disabled="isSending">
                  {{ isSending ? '正在发送' : '添加回复' }}
                </page-button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
    <addQuestion :id="formData.id" :visible.sync="addQuestionVisible" @close="addQuestionClose" @ok="addQuestionOk">

    </addQuestion>
    <vue-easy-lightbox :visible="previewImg" :imgs="media" @hide="onLightBoxClosed" ref="lightbox"></vue-easy-lightbox>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { Editor } from '@wangeditor/editor-for-vue'
import { ApiCommon } from '@/apis'
import { ApiBiddingManagement } from "@/apis";
import { downloadUrlFile } from '@/utils/utils'
import addQuestion from "./addQuestion.vue";
import VueEasyLightbox from 'vue-easy-lightbox'
import { VXETable } from 'vxe-table'
const apiBiddingManagement = new ApiBiddingManagement();
export default {
  name: 'answeringQuestion',
  components: {
    addQuestion,
    Editor,
    VueEasyLightbox
  },
  computed: {
    ...mapState({
      menus: (state) => state.User.menus ?? [],
      userInfo: (state) => state.User.userInfo ?? {},
      businessCode: (state) => state.Common.businessCode,
    }),
    showBtn() {
      return (name) => {
        let find = this.allBtnControlList?.find((x) => x.btnCode == name);
        return find ?? false;
      };
    },
    // 是否可编辑
    isEdit() {
      return this.formData.bizFlowStatus == 5
    },
  },
  props: {
    formData: {
      type: Object
    },
    editState: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    formData(newVal) {
      this.formData = newVal;
    },
  },
  data() {
    const dict = this.$store.state.Common.dict;
    return {
      addQuestionVisible: false,
      allBtnControlList: [],
      form: {},
      searchValue: '',
      activeCategory: 'all', // 当前选中的分类
      activeStatus: 'all', // 当前选中的状态
      activeDetailId: '', // 当前选中的问题id
      activeDetaiData: [], // 当前选中的问题数据
      content: '', // 问题回复内容
      isSending: false, // 是否回复中
      editorConfig: {
        placeholder: '请输入评论',
        autoFocus: false,
        maxLength: 200,
        MENU_CONF: {
          uploadImage: {
            base64LimitSize: 5 * 1024,
            customUpload: this.updateImage,
          }
        },
      },
      descSourceList: {
        questionTypeList: (dict['tender_question_type'] || []).map(x => {
          return { label: x.dictLabel, value: x.dictValue }
        }),
        answerStatusList: (dict['tender_answer_status'] || []).map(x => {
          return { label: x.dictLabel, value: x.dictValue, color: x.remark ?? "#f4f4f5", }
        }),
      },
      statusObj: {},
      newQuestion: {
        title: '',
        category: '',
        content: ''
      },
      questionList: [],
      fileList: [], // 回复的附件
      media: [],
      previewImg: false,
    }
  },
  mounted() {
    this.init()
    this.statusObj = this.descSourceList.answerStatusList.reduce((acc, item) => {
      acc[item.value] = item.color;
      return acc;
    }, {});
  },
  methods: {
    init() {
      this.handleSearch()
    },
    /* 问题查询 */
    async handleSearch(questionId) {
      console.log('查询', this.searchValue)
      const params = {
        masterId: this.formData.id,
        search: this.searchValue,
        questionType: this.activeCategory == 'all' ? '' : this.activeCategory,
        status: this.activeStatus == 'all' ? '' : this.activeStatus
      }
      const res = await apiBiddingManagement.getAnswerList(params)
      if (res.code === 200) {
        this.questionList = res.data.records
        if (res.data.records && res.data.records.length > 0) {
          this.getQuestionDetail( questionId ? {questionId} : this.questionList[0])
        } else {
          this.questionList = []
          this.activeDetailId = ''
          this.activeDetaiData = []
          this.content = ''
          this.fileList = []
        }

      } else {
        this.$message.error(res.message)
      }
    },
    /* 获取问题详情 */
    async getQuestionDetail({ questionId }) {
      this.content = ''
      this.fileList = []

      this.activeDetailId = questionId
      const res = await apiBiddingManagement.getAnswerDetail({ questionId })
      if (res.code !== 200) {
        this.$message.error(res.message)
        return
      }
      this.activeDetaiData = res.data
    },
    handleEditorChange(editorContent) {
    },
    updateImage(file, insertFn) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = function (event) {
          insertFn(event.target.result)
        }
        reader.readAsDataURL(file)
      }
    },
    toolEvents() {
      return {
        img: () => {
          const input = document.createElement('input')
          input.type = 'file'
          input.multiple = true
          input.accept = 'image/*'
          input.click()
          input.onchange = event => this.uploadFile(event)
        },
        files: () => {
          const input = document.createElement('input')
          input.type = 'file'
          input.multiple = true
          input.accept = '.doc,.docx,.xls,.xlsx,.pdf'
          input.click()
          input.onchange = event => this.uploadFile(event)
        }
      }
    },
    uploadFile(event) {
      const files = event.target.files
      const tasks = []
      for (let i = 0; i < files.length; i++) {
        tasks.push(ApiCommon.uploadFile(files[i]))
      }
      const loading = this.$loading({
        lock: true,
        text: '正在上传文件',
        spinner: 'el-icon-loading',
      })
      Promise.all(tasks).then(responses => {
        const postFiles = responses.filter(item => item.code === 200).map(item => {
          return item.data
        })
        this.fileList = postFiles
      }).finally(() => {
        loading.close()
      })
    },
    deleteFile(index) {
      this.fileList.splice(index, 1);
    },
    onImgClick(item) {
      // 下载附件
      if (item.bucketName == 'sims-file-image') {
        this.media = [{
          thumb: item.url,
          src: item.url,
          caption: item.originalFileName,
        }];
        this.previewImg = true
        this.$nextTick(() => {
          const { lightbox } = this.$refs
          const { $el } = lightbox
          this.tmpEl = $el
          document.body.appendChild($el)
        })
      } else {
        VXETable.modal
          .confirm({
            title: "提示",
            content:
              " 确认下载该附件？",
            mask: true,
          })
          .then((type) => {
            if (type === "confirm") {
              downloadUrlFile(item.url)
            }
          })
      }
    },
    onLightBoxClosed(e) {
      this.previewImg = false
    },
    onToolItemClick(eventName) {
      const fn = this.toolEvents()[eventName]
      fn && fn()
    },
    async onSendBtnClick() {
      if (this.$refs.editorRef.editor.isEmpty()) {
        this.$message.warning('内容不能为空')
        return
      }
      if (this.isSending) return
      const loading = this.$loading({
        lock: true,
        text: '正在提交',
        spinner: 'el-icon-loading',
      })
      this.isSending = true
      const { content, activeDetailId, fileList } = this

      const params = {
        questionId: activeDetailId,
        content: content,
        fileList: fileList,
      }

      const res = await apiBiddingManagement.postAnswerReply(params)
      this.isSending = false
      loading.close()
      if (res.code === 200) {
        this.handleSearch(activeDetailId)
      } else {
        this.$message.error(res.message || '操作失败')
      }
    },
    addQuestionOk() {
      this.addQuestionVisible = false
      this.handleSearch()
    },
    addQuestionClose() {
      this.addQuestionVisible = false
    },
    // 加载组件功能
    loading(text) {
      const loading = this.$loading({
        lock: true,
        text,
        spinner: "el-icon-loading",
      });
      return loading;
    },
  }
}
</script>
<style scoped lang="less">
.answering-question-container {
  height: 100%;
  font-size: 14px;
}

.tag-status {
  height: 24px;
  border-radius: 12px;
  text-align: center;
  line-height: 24px;
  font-size: 12px;
  padding: 0 6px;
  background: #f4f4f5
}

.answering-question-warp {
  display: flex;
  gap: 10px;
  height: 100%;
  padding-top: 10px;

  .left-sidebar {
    background: #fff;
    padding: 0 20px;
    width: 220px;
    // .top-bar{
    //   display: flex;
    //   gap: 6px;
    // }
  }

  .top-bar {
    display: flex;
    gap: 20px;
    margin-bottom: 10px;
  }

  .card-content {
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    padding: 10px 10px;
    margin-bottom: 20px;
    border: 1px solid #ebeef5;

    .card-title {
      font-size: 16px;
      font-weight: 600;
    }

    .card-list {
      padding: 12px 8px;

      .card-item {
        display: flex;
        align-items: center;
        padding: 10px 6px;
        cursor: pointer;

        &:hover {
          background: #f1f8ff;
        }

        &.active {
          background: var(--base-color);
          color: #fff;
          border-radius: 4px;
        }

        .card-item-title {
          font-size: 14px;
          font-weight: 500;
        }

        .card-item-content {
          font-size: 14px;
          color: #999999;
        }
      }
    }
  }

  .right-content {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin: 0 10px 0px 0;
  }

  .no-question-data {
    min-height: 48px;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 100%;
    pointer-events: none;
    overflow: hidden;
    outline: 0px;
    display: flex;
    height: 100%;
    border: 1px solid #d9d9d9;
    border-radius: 4px;

    .empty-content {
      display: block;
      width: 50%;
      pointer-events: auto;
    }
  }

  .question-box {
    display: flex;
    gap: 20px;
    height: calc(100% - 52px);
  }

  .question-list-box {
    border-radius: 4px;
    height: 100%;
    overflow: auto;
    width: 420px;

    .question-list {
      .question-item {
        margin-bottom: 20px;
        padding: 20px;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        transition: all 0.3s;
        cursor: pointer;
        line-height: 1.5;

        &:hover {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          border-color: #d2e3fc;
        }

        &.active {
          border: 1px solid var(--base-color);
        }

        .question-title-box {
          display: flex;
          justify-content: space-between;

          .question-title {
            display: -webkit-box;
            overflow: hidden;
            text-overflow: ellipsis;
            word-break: break-all;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            font-weight: 600;
          }
        }

        .message-header {
          margin: 6px 0;
          font-size: px;
        }

        .message-description {
          margin-bottom: 10px;
          display: -webkit-box;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-all;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
        }

        .question-status-box {
          display: flex;
          gap: 10px;
          min-width: 120px;
          justify-content: flex-end;
        }

        .question-item-title {
          font-size: 16px;
          font-weight: 500;
          color: #333333;
        }
      }
    }
  }

  .question-detail-box {
    border: 1px solid #ebeef5;
    border-radius: 4px;
    padding: 20px 20px 0;
    flex: 1;
    display: flex;
    flex-direction: column;
    line-height: 1.5;

    .message {
      flex: 1;
      margin-bottom: 10px;
    }

    .message-title {
      font-weight: 600;
      margin-bottom: 8px;
    }

    .question-content {}

    .message-body {
      border-left: 3px solid var(--base-color);
      padding: 6px 10px;
      background: #f8f9fa;
      border-radius: 4px;
    }
    .message-file-list {
        width: 100%;
        // height: 22px;
        line-height: 22px;
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        margin-top: 4px;
        color: #407BFF;
        div {
          margin-right: 10px;
          cursor: pointer;
        }
      }

    .message-name {
      color: var(--base-color);
      padding-right: 10px;
    }
  }

}

.comment-reply {
  padding: 10px 0;
  border-top: 1px solid #eee;

  .comment-editor {
    height: 110px;

    img {
      max-width: 60px !important
    }

    .w-e-text-container [data-slate-editor] p {
      margin: 0;
    }

    .w-e-text-container [data-slate-editor] img {
      max-width: 60px !important
    }

    .w-e-text-placeholder {
      top: 3px;
    }
  }

  .comment-reply-bottom {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 12px;
    padding: 0 2px;
    height: 40px;
  }

  .seed_upload_list {
    width: calc(100% - 20px);
    margin: 0px 5px;
    max-height: 36px;
    display: flex;
    flex-wrap: wrap;
    flex: 1 auto;
    overflow: auto;

    div {
      color: #407BFF;
      font-size: 12px;
      margin-right: 8px;
      margin-left: 8px;
      cursor: pointer;
    }
  }

  .comment-reply-tools {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 100%;
    color: #999;
    margin-right: 12px;

    .comment-reply-tools-item {
      position: relative;
      width: 24px;
      height: 24px;
    }

    svg {
      cursor: pointer;
    }
  }

}
</style>