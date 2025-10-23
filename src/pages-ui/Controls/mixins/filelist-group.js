import { BILL_TYPE_LIST } from '@/data/bill-type'

export default {
  data() {
    return {
      billId: '8155763112325',
      billType: 'EA',
      billTypes: [...BILL_TYPE_LIST],
      isSet: false,
      isReadonly: false,

      setBillId: '',
      setBillType: '',

      filelist_group_groups: [],
      filelist_group_list: [],
      filelistGroupDisabled: true,

      filelist_group_groups2: [
        { id: 1, name: '分组A' },
        { id: 2, name: '分组1' },
      ],
      filelist_group_list2: [],

      filelistCount: 0
    }
  },
  mounted() {
    this.setGroup()
  },
  methods: {

    setGroup() {
      this.isSet = false
      this.setBillId = this.billId
      this.setBillType = this.billType
      this.$nextTick(() => {
        this.isSet = true
      })
    },

    onPrint() {
      console.log('附件分组', this.filelist_group_groups)
      console.log('附件列表', this.filelist_group_list)
      console.log('附件分组2', this.filelist_group_groups2)
      console.log('附件列表2', this.filelist_group_list2)
    },

    onFilelistGroupUpload({ files, groupId, next }) {
      console.log('onFilelistGroupUpload', files, groupId)
      //TODO
      // let list = [...this.filelist_group_list]
      // list = [
      //   ...list,
      //   ...files.map(file => {
      //     const { fileName, url, uploadTime, fileImageSize, originalFileName } = file
      //     return {
      //       id: new Date().valueOf(),
      //       fileName,
      //       originalFileName,
      //       url,
      //       fileImageSize,
      //       uploadTime,
      //       createUser: this.userInfo.userName,
      //       groupId
      //     }
      //   })
      // ]
      // this.filelist_group_list = list
      const list = files.map(file => {
        const { fileName, url, uploadTime, fileImageSize, originalFileName } = file
        return {
          id: new Date().valueOf(),
          fileName,
          originalFileName,
          url,
          fileImageSize,
          uploadTime,
          createUser: this.userInfo.userName,
          groupId
        }
      })
      next(list)
    },
    onAddFolder({ name, next }) {
      //TODO
      //异步添加目录后，返回id,传入回调函数；或刷新分组列表
      const id = new Date().valueOf()
      next(id)
    },
    onFilelistItemDelete({ data, index, next }) {
      //TODO
      next()
    },
    onFilelistItemMove({ groupId, next }) {
      //TODO
      next()
    },
    onFilelistGroupItemUpdateName({ item, index, name, next }) {
      //TODO
      next()
    },

    onFilelistUpdate(e) {
      const { fileList } = e
      this.filelistCount = fileList.length
      console.log('fileList', fileList)
    }
  },
}
