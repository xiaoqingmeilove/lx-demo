<template>
  <div class="workflow-comments-view"
    v-loading="loading"
    element-loading-text="正在加载"
    element-loading-spinner="el-icon-loading"
  >
    <template v-if="loadSuccess">
      <el-scrollbar class="workflow-comments-scrollbar" ref="scorllbarRef">
        <div class="workflow-comment-list">
          <div class="workflow-comment-list-item" :class="[item._isSelf_ ? 'workflow-comment--self' : '']"
            v-for="item in computedCommentList" :key="item.uuid"
          >
            <template v-if="item.logicFlag === 1">
              <p class="withdraw-tips">{{item.comment}}</p>
            </template>
            <template v-else>
              <div class="workflow-comment-avatar">
                <div class="comment-user-avatar"></div>
              </div>
              <div class="workflow-comment-wrapper">
                <div class="workflow-comment-info">
                  <span>{{item.userName}}</span>
                  <span>{{item.createTime}}</span>
                </div>
                <div class="workflow-comment-content-container">
                  <div class="workflow-comment-content">
                    <div v-html="item._content_"></div>
                    <div class="workflow-comment-files" v-if="item.fileList && item.fileList.length">
                      <div class="workflow-comment-file-item" v-for="file in item.fileList" :key="file.url">
                        <svg-icon icon-class="attachment"></svg-icon>
                        <div class="workflow-comment-file-name">
                          <a @click="onFileClick(file)">{{file.originalFileName}}</a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="workflow-comment-content-bottom">
                    <page-button type="text" @click="onReplyClick(item)">回复</page-button>
                    <page-button type="text" @click="onDeleteClick(item)" v-if="item._isSelf_">删除</page-button>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </el-scrollbar>
      <div class="workflow-comment-autofresh">
        <div class="workflow-comment-fresh-wrapper">
          <div class="workflow-comment-auto-fresh">
            <el-checkbox v-model="autoFresh" @change="onAutoFreshChange">自动刷新</el-checkbox>
            <el-select size="mini" class="auto-fresh-time"
              v-model="autoFreshInterval"
              :disabled="!autoFresh"
              @change="onTimerChange"
            >
              <el-option label="5秒" :value="5000"></el-option>
              <el-option label="10秒" :value="10000"></el-option>
              <el-option label="30秒" :value="30000"></el-option>
              <el-option label="1分钟" :value="60000"></el-option>
              <el-option label="2分钟" :value="120000"></el-option>
            </el-select>
          </div>
          <div class="workflow-comment-manul-fresh" @click="onManulRefresh">
            <svg-icon icon-class="refresh" size="20"></svg-icon>手动刷新
          </div>
        </div>
      </div>
      <div class="workflow-comment-reply">
        <div class="workflow-comment-reply-to" v-if="replyTo">
          <span>@{{replyTo.userName}}</span>
          <div class="reply-to-close" @click="replyTo = null;">
            <svg-icon icon-class="close-circle"></svg-icon>
          </div>
        </div>
        <blockquote v-if="replyTo" v-html="replyTo.comment"></blockquote>
        <!-- <el-input type="textarea" v-model="content"
          :rows="6"
          maxlength="200"
          show-word-limit
          @keydown.native="onContentTextareaKeydown"
          ref="textareaRef"
        ></el-input> -->
        <Editor class="workflow-comment-editor"
          v-model="content"
          :defaultConfig="editorConfig"
          mode="default"
          @onChange="handleEditorChange"
          ref="editorRef"
        ></Editor>
        <div class="workflow-comment-reply-bottom">
          <!-- <span class="workflow-comment-tips">(Ctrl+Enter 发送)</span> -->
          <div class="workflow-comment-reply-tools">
            <div class="workflow-comment-reply-tools-item tool-item-at"
              :class="{ on: atIds && atIds.length }"
            >
              <svg-icon icon-class="at" size="24" @click.stop="onToolItemClick('at')"></svg-icon>
              <div class="comment-userlist" v-if="computedCommentUsers && computedCommentUsers.length && atVisible"
                @click.stop
              >
                <div class="comment-userlist-item"
                  :class="{ on: item._at_ === true }"
                  v-for="item in computedCommentUsers" :key="item.userId"
                  @click.stop="onCommentUserClick(item)"
                >
                  <svg-icon icon-class="at" size="20" v-if="item._at_ === true"></svg-icon>
                  <div><span>{{item.userName}}</span></div>
                </div>
              </div>
            </div>
            <div class="workflow-comment-reply-tools-item">
              <svg-icon icon-class="emoji" size="24" @click.stop="onToolItemClick('emoji')"></svg-icon>
              <Emoji v-if="emojiVisible" @select="onEmojiSelected"></Emoji>
            </div>
            <div class="workflow-comment-reply-tools-item">
              <svg-icon icon-class="attachment" size="24" @click="onToolItemClick('files')"></svg-icon>
            </div>
            <div class="workflow-comment-reply-tools-item">
              <svg-icon icon-class="img" size="24" @click="onToolItemClick('img')"></svg-icon>
            </div>
          </div>
          <page-button @click="onSendBtnClick" :disabled="isSending">
            {{isSending ? '正在发送' : '添加评论'}}
          </page-button>
        </div>
      </div>
    </template>
    <template v-else>
      <div v-if="!loading" class="comment-error">
        <span>加载失败!</span>
        <page-button type="text" @click="onRetryClick">点击重试</page-button>
      </div>
    </template>
  </div>

</template>

<script>
  import { Editor } from '@wangeditor/editor-for-vue'
  import { mapState, mapGetters } from 'vuex'
  import ApiWorkflow from '../apis'
  import { ApiCommon } from '@/apis'
  import Emoji from './emoji.vue'

  const WORKFLOW_COMMENT_KEYS = {
    autoFresh: 'WORKFLOW_COMMENT_AUTOFRESH',
    interval: 'WORKFLOW_COMMENT_AUTOFRESH_INTERVAL',
  }

  const apiWorkflow = new ApiWorkflow()

  export default {
    components: {
      Editor,
      Emoji
    },
    props: {
      billId: {
        type: Number,
        default: null
      },
      billNo: {
        type: String,
        default: ''
      },
    },
    computed: {
      ...mapState({
        userInfo: state => state.User.userInfo ?? {},
      }),
      computedCommentList() {
        return this.commentList.map(item => {
          item._isSelf_ = item.userId === this.userInfo.userId
          item._content_ = item.comment.replace(/\n/g, '<br />')
          if (item.replyCommentInfo) {
            const replyUsername = item.replyCommentInfo.userName
            const replyLogicFlag = item.replyCommentInfo.logicFlag
            if (replyLogicFlag) {
              item._content_ = `<blockquote>${replyUsername}: <p class="withdraw-tips">${item.replyCommentInfo.comment}</p></blockquote>`
                + item._content_
            } else {
              item._content_ = `<blockquote>${replyUsername}: ${item.replyCommentInfo.comment.replace(/\n/g, '<br />')}</blockquote>`
                + item._content_
            }
          }
          return item
        })
      },
      computedCommentUsers() {
        const list = [...this.commentUsers]
        return list.map(item => {
          const obj = {...item}
          obj._at_ = this.atIds.includes(obj.userId)
          return obj
        })
      }
    },
    data() {
      return {
        commentList: [],
        content: '',
        isSending: false,
        replyTo: null,
        loading: false,
        loadSuccess: false,

        editorConfig: {
          placeholder: '请输入评论',
          autoFocus: false,
          maxLength: 200,
          MENU_CONF: {
            uploadImage:{
              base64LimitSize: 5 * 1024,
              customUpload: this.updateImage,
            }
          },
        },

        autoFresh: true,
        autoFreshInterval: 5000,
        autoFreshTimer: null,
        emojiVisible: false,

        handleDocClick: null,
        commentUsers: [],
        atVisible: false,
        atIds: []
      }
    },
    mounted() {
      this.autoFresh = localStorage.getItem(WORKFLOW_COMMENT_KEYS.autoFresh) != 'false'
      this.autoFreshInterval = Number(localStorage.getItem(WORKFLOW_COMMENT_KEYS.interval) || 5000)
      if (this.billId) {
        this.getComments(true)
        this.getCommentUser()
        this.setAutoFreshTimer()
      }
      this.handleDocClick = this.hidePopup.bind(this)
      this.$el.addEventListener('click', this.handleDocClick)
    },
    destroyed() {
      this.clearAutoFreshTimer()
      this.$el.removeEventListener('click', this.handleDocClick)
    },
    methods: {
      async getComments(toBottom = false) {
        if (this.loading) return
        this.loading = true
        const id = this.billId
        const type = this.billNo.split('-')[0]
        //this.commentList = []
        const res = await apiWorkflow.getComment(id, type)
        this.loading = false
        this.commentList = res.data?.commentInfos || []
        this.loadSuccess = res.code === 200
        if (toBottom && this.loadSuccess) {
          this.scrollToBottom()
        }
        this.$emit('change', {
          count: this.commentList.filter(item => item.logicFlag !== 1).length
        })
      },
      getCommentUser() {
        const id = this.billId
        const type = this.billNo.split('-')[0]
        apiWorkflow.getCommentUser(id, type).then(res => {
          this.commentUsers = res.data || []
        })
      },
      scrollToBottom() {
        this.$nextTick(() => {
          const wrap = this.$refs.scorllbarRef.$el.querySelector('.el-scrollbar__wrap')
          wrap.scrollTop = wrap.scrollHeight
        })
      },
      onSendBtnClick() {
        this.hidePopup()
        if (this.$refs.editorRef.editor.isEmpty()) {
          this.$message.warning('内容不能为空')
          return
        }
        this.sendReply()
      },
      onContentTextareaKeydown(e) {
        const { keyCode, ctrlKey } = e
        if (keyCode === 13) {
          if (ctrlKey) {
            e.preventDefault()
            this.sendReply()
          }
        }
      },
      async sendReply() {
        if (this.isSending) return
        const loading = this.$loading({
        	lock: true,
        	text: '正在提交',
        	spinner: 'el-icon-loading',
        })
        this.isSending = true
        if (this.replyTo) {
          delete this.replyTo._isSelf_
          delete this.replyTo._content_
        }
        let content = this.content
        if (this.atIds && this.atIds.length) {
          content += this.commentUsers.filter(item => this.atIds.includes(item.userId))
            .map(item => `<strong class="at-user">@${item.userName}</strong>`).join(' ')
        }
        const res = await apiWorkflow.addComment({
          masterId: this.billId,
          masterType: this.billNo.split('-')[0],
          comment: content,
          replyCommentInfo: this.replyTo,
          fileList: [],
          replyUserList: this.commentUsers.filter(item => this.atIds.includes(item.userId)).map(item => ({
            replyUserId: item.userId,
            replyUserName: item.userName,
          }))
        })
        this.isSending = false
        loading.close()
        if (res.code === 200) {
          this.content = ''
          this.replyTo = null
          this.atIds = []
          this.getComments(true)
        } else {
          this.$message.error(res.message || '操作失败')
        }
      },
      async sendImgReply(imgBase64) {
        if (this.isSending) return
        const loading = this.$loading({
        	lock: true,
        	text: '正在提交',
        	spinner: 'el-icon-loading',
        })
        this.isSending = true
        if (this.replyTo) {
          delete this.replyTo._isSelf_
          delete this.replyTo._content_
        }
        const res = await apiWorkflow.addComment({
          masterId: this.billId,
          masterType: this.billNo.split('-')[0],
          comment: `<p><img src="${imgBase64}"/></p>`,
          replyCommentInfo: this.replyTo,
          fileList: [],
          replyUserList: this.commentUsers.filter(item => this.atIds.includes(item.userId)).map(item => ({
            replyUserId: item.userId,
            replyUserName: item.userName,
          }))
        })
        this.isSending = false
        loading.close()
        if (res.code === 200) {
          this.replyTo = null
          this.atIds = []
          this.getComments(true)
        } else {
          this.$message.error(res.message || '操作失败')
        }
      },
      async sendFilesReply(files = []) {
        if (this.isSending) return
        const loading = this.$loading({
        	lock: true,
        	text: '正在提交',
        	spinner: 'el-icon-loading',
        })
        this.isSending = true
        if (this.replyTo) {
          delete this.replyTo._isSelf_
          delete this.replyTo._content_
        }
        const res = await apiWorkflow.addComment({
          masterId: this.billId,
          masterType: this.billNo.split('-')[0],
          comment: `[附件]`,
          replyCommentInfo: this.replyTo,
          fileList: [...files],
          replyUserList: this.commentUsers.filter(item => this.atIds.includes(item.userId)).map(item => ({
            replyUserId: item.userId,
            replyUserName: item.userName,
          }))
        })
        this.isSending = false
        loading.close()
        if (res.code === 200) {
          this.replyTo = null
          this.atIds = []
          this.getComments(true)
        } else {
          this.$message.error(res.message || '操作失败')
        }
      },
      onReplyClick(item) {
        this.replyTo = {...item}
        //this.$refs.textareaRef.focus()
        this.$nextTick(() => {
          this.$refs.editorRef.editor.focus()
        })
      },
      onRetryClick() {
        this.getComments(true)
      },
      onDeleteClick(item) {
        this.$confirm("是否删除此评论?", "提示", {
          closeOnClickModal: false,
        }).then(async () => {
          const res = await apiWorkflow.withdrawComment({
            masterId: this.billId,
            masterType: this.billNo.split('-')[0],
            uuid: item.uuid
          })
          if (res.code === 200) {
            this.getComments()
          } else {
            this.$message.error(res.message || '操作失败')
          }
        })
      },

      updateImage(file, insertFn) {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader()
          reader.onload = function(event) {
            insertFn(event.target.result)
          }
          reader.readAsDataURL(file)
        }
      },

      clearAutoFreshTimer() {
        if (this.autoFreshTimer) {
          clearInterval(this.autoFreshTimer)
        }
        this.autoFreshTimer = null
      },
      setAutoFreshTimer() {
        if (this.autoFresh) {
          this.autoFreshTimer = setInterval(() => {
            this.getComments()
          }, this.autoFreshInterval)
        }
      },
      onTimerChange(value) {
        this.clearAutoFreshTimer()
        this.$nextTick(() => {
          this.setAutoFreshTimer()
        })
        localStorage.setItem(WORKFLOW_COMMENT_KEYS.interval, value)
      },
      onManulRefresh() {
        this.clearAutoFreshTimer()
        this.getComments()
        this.setAutoFreshTimer()
      },
      toolEvents() {
        return {
          img: () => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = 'image/*'
            input.click()
            input.onchange = event => {
              const file = event.target.files[0]
              const reader = new FileReader();
              reader.onload = (e) => {
                this.sendImgReply(e.target.result)
              }
              reader.readAsDataURL(file)
            }
          },
          files: () => {
            const input = document.createElement('input')
            input.type = 'file'
            input.multiple = true
            input.accept = '.doc,.docx,.xls,.xlsx,.pdf'
            input.click()
            input.onchange = event => {
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
                this.sendFilesReply(postFiles)
              }).finally(() => {
                loading.close()
              })
            }
          },
          emoji: () => {
            this.emojiVisible = !this.emojiVisible
          },
          at: () => {
            this.atVisible = !this.atVisible
          }
        }
      },
      onToolItemClick(eventName) {
        const fn = this.toolEvents()[eventName]
        fn && fn()
      },
      hidePopup() {
        this.emojiVisible = false
        this.atVisible = false
      },
      onEmojiSelected(value) {
        const editorRef = this.$refs.editorRef
        const editor = editorRef.editor
        editor.focus()
        setTimeout(() => {
          editor.insertText(value)
          this.emojiVisible = false
        }, 30)
      },
      onCommentUserClick(item) {
        const findIndex = this.atIds.findIndex(id => item.userId === id)
        if (findIndex > -1) {
          this.atIds.splice(findIndex, 1)
        } else {
          this.atIds.push(item.userId)
          //this.content += `<strong>@${item.userName}</strong>`
        }
      },
      handleEditorChange(editorContent) {
      },
      onFileClick(file) {
        if (file.extensionName === 'pdf') {
          this.previewPdf(`/${file.url}`)
        } else {
          window.open(`/${file.url}`, '_blank')
        }
      },
      previewPdf(url) {
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const fileUrl = URL.createObjectURL(new Blob([blob], { type: 'application/pdf'}))
            window.open(fileUrl, '_blank')
          })
          .catch(error => this.$message.error('文件转换失败'));
      },

      onAutoFreshChange(value) {
        this.clearAutoFreshTimer()
        if (value) {
          this.$nextTick(() => {
            this.setAutoFreshTimer()
          })
        }
        localStorage.setItem(WORKFLOW_COMMENT_KEYS.autoFresh, value)
      }
    }
  }
</script>

<style lang="scss">
@import './style.scss'
</style>
