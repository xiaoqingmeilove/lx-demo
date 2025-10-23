import { mapState } from "vuex";
import { ApiBiddingManagement } from "@/apis";
import XEUtils from "xe-utils";



const apiBiddingManagement = new ApiBiddingManagement();

export default {
    name: "bidReview",
    props: {
        formData: {
            type: Object,
            default: () => ({}),
        },
        editState: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        ...mapState({
            menus: (state) => state.User.menus ?? [],
            userInfo: (state) => state.User.userInfo ?? {},
            businessCode: (state) => state.Common.businessCode,
        }),
    },
    data() {
        return {
            formDataShow: {
                gyslb: true,
            },
            form: {
            },
            progress: [
                { title: '技术评分', field: 'technicalScore', value: 20, max: 100 },
                { title: '商务评分', field: 'businessScore', value: 10, max: 100 },
                { title: '价格评分', field: 'priceScore', value: 25, max: 100 },
            ],
            fileObj: {},

        }
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            console.log(this.form);
        },
        getBidReview(id) {
            const loading = this.loading("加载中...");
            let params = { id: id }
            apiBiddingManagement.getBidReviewTenderExpertScoreReport(params).then((res) => {
                if (res.code === 200) {
                    this.form = res.data.map((item, index) => {
                        if (index == 0) {
                            item.checked = true;
                            this.fileObj = item;
                        } else {
                            item.checked = false;
                        }
                        return item;
                    })
                }
            }).finally(() => {
                loading.close();
            });
        },
        changeScore() {
            // this.fileObj.totalScore = this.fileObj.technicalScore + this.fileObj.businessScore + this.fileObj.priceScore;
        },
        saveScore(type) {
            const loading = this.loading("保存中...");
            apiBiddingManagement.putBidReviewTenderExpertScoreSave(this.fileObj).then((res) => {
                if (res.code === 200) {
                    this.$message.success("保存成功");
                    if (type == 1) {
                        this.getBidReview(this.formData.id);
                    }
                    if (type == 2) {
                        this.submitScore();
                    }
                }
            }).finally(() => {
                loading.close();
            });
        },
        submitScore() {
            const loading = this.loading("提交中...");
            let params = { id: this.fileObj.id }
            apiBiddingManagement.putBidReviewTenderExpertScoreSubmit(this.fileObj).then((res) => {
                if (res.code === 200) {
                    this.$message.success("提交成功");
                    this.getBidReview(this.formData.id);
                }
            }).finally(() => {
                loading.close();
            });
        },
        submitReview() {
            const loading = this.loading("提交中...");
            let params = { id: this.formData.id }
            apiBiddingManagement.putBidFinish(params).then((res) => {
                if (res.code === 200) {
                    this.$message.success("提交成功");
                    this.$emit("init");
                }
            }).finally(() => {
                loading.close();
            });
        },
        getGys(item) {
            this.fileObj = item;
            this.form.map(item => {
                item.checked = false;
            })
            item.checked = true;
        },
        downloadAllFile() {
            this.fileObj.fileList.forEach(item => {
                this.operationEvents(item)['download']()
            })
        },
        downloadFile(item) {
            this.operationEvents(item)['download']()
        },
        operationEvents(item) {
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
        // 加载组件功能
        loading(text) {
            const loading = this.$loading({
                lock: true,
                text,
                spinner: "el-icon-loading",
            });
            return loading;
        },
    },
    watch: {
        formData: {
            handler(newVal) {
                this.getBidReview(newVal.masterId);
            },
            deep: true,
            immediate: true,
        },
    },

}