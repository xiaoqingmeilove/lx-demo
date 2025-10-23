<template>
  <div class="base-color-picker">
    <div class="base-color-picker-body">
      <el-color-picker :value="theme.baseColor" @active-change="onColorPickerChange"></el-color-picker>
    </div>
    <div class="base-color-picker-footer">
      <page-button class="bcp-btn" type="text" style="margin-right: auto;" @click="onResetClick">恢复默认</page-button>
      <page-button class="bcp-btn" @click="onOkClick">确定</page-button>
      <page-button class="bcp-btn" theme="default" @click="onCancelClick">取消</page-button>
    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
  import VXETable from 'vxe-table'

  export default {
    computed: {
      ...mapState({
        theme: state => state.Theme.theme ?? {},
        themeClone: state => state.Theme.themeClone ?? {},
        userInfo: state => state.User.userInfo ?? {}
      }),
    },
    data() {
      return {
        currentColor: ''
      }
    },
    mounted() {
      this.currentColor = this.theme.baseColor || ''
    },
    methods: {
      ...mapMutations('Theme', ['changeBaseColor', 'setTheme']),
      onColorPickerChange(color) {
        this.changeBaseColor(color)
      },
      close() {
        this.$emit('close')
      },
      onOkClick() {
        localStorage.setItem(`${this.userInfo.userName}_local_theme`, JSON.stringify({
          baseColor: this.theme.baseColor,
          ['--base-color']: this.theme.baseColor,
        }))
        this.close()
      },
      onCancelClick() {
        this.changeBaseColor(this.currentColor)
        this.close()
      },
      onResetClick() {
        VXETable.modal.confirm({
          title: '提示',
          content: '是否恢复默认?',
          mask: true,
        }).then(type => {
          if (type === 'confirm') {
            const theme = {...this.themeClone}
            localStorage.removeItem(`${this.userInfo.userName}_local_theme`)
            this.setTheme(theme)
            this.currentColor = theme.baseColor
          }
        })
      }
    }
  }
</script>

<style scoped lang="less">
.base-color-picker {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  .base-color-picker-body {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;;
    flex: 1;
    height: 0;
  }
  .base-color-picker-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 40px;
    border-top: solid 1px #eee;
  }
  .bcp-btn {
    width: 64px;
  }
}
</style>
