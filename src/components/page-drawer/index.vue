<template>
  <transition name="fadein">
    <div :class="computedClassName"
      :style="drawerStyle"
      v-show="visible"
      @click="onDrawerMaskClick"
    >
      <transition :name="transName">
        <template v-if="destroyOnClose">
          <div class="page-drawer-view" :style="viewStyle" v-if="visible" @click.stop>
            <slot></slot>
          </div>
        </template>
        <template v-else>
          <div class="page-drawer-view" :style="viewStyle" v-show="visible" @click.stop>
            <slot></slot>
          </div>
        </template>
      </transition>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'pageDrawer',
    model: {
    	prop: 'visible',
    	event: 'change'
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      maskClosable: {
        type: Boolean,
        default: true
      },
      fixed: {
        type: Boolean,
        default: false
      },
      container: {
        type: null,
        default: null
      },
      direction: {
        type: String,
        default: 'rtl'
      },
      maskBackground: {
        type: String,
        default: 'rgba(0, 0, 0, 0.5)'
      },
      zIndex: {
        type: Number,
        default: 10
      },
      width: {
        type: [String, Number],
        default: '100%'
      },
      destroyOnClose: {
        type: Boolean,
        default: false
      },
      beforeClose: {
        type: Function,
        default: null
      },
    },
    computed: {
      computedClassName() {
        const { fixed, direction } = this
        return {
          ['page-drawer']: true,
          ['page-drawer--fixed']: !!fixed,
          [`page-drawer--${direction}`]: !!direction
        }
      },
      transName() {
        const direction = this.direction === 'ltr' ? 'right' : 'left'
        return `fade-${direction}`
      },
      drawerStyle() {
        const { maskBackground, zIndex } = this
        return {
          background: maskBackground,
          zIndex
        }
      },
      viewStyle() {
        const style = {}
        let width = String(this.width)
        if (/^\d+$/.test(width)) {
          width = `${width}px`
        }
        style.width = width
        return style
      }
    },
    data() {
      return {
        containerEl: null
      }
    },
    mounted() {
      if (this.container) {
        const container = document.querySelector(this.container)
        if (container) {
          this.containerEl = container
          const el = this.$el
          el.parentNode.removeChild(el)
          this.containerEl.appendChild(el)
        }
      }
    },

    methods: {
      async onDrawerMaskClick() {
        if (!this.maskClosable) return
        if (typeof this.beforeClose === 'function') {
          this.beforeClose(() => {
            this.close()
          })
        } else {
          this.close()
        }
      },
      close() {
        this.$emit('change', false)
        this.$emit('closed')
      }
    }
  }
</script>

<style lang="less">
.page-drawer {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  z-index: 10;
  .page-drawer-view {
    position: absolute;
    right: 0;
    top: 0;
    height: 100%;
    background: #fff;
    box-shadow: -5px 0px 4px rgba(197, 200, 209, 0.25);
  }

}
.page-drawer--fixed {
  position: fixed;
}
.page-drawer--ltr {
  .page-drawer-view {
    left: 0;
    right: auto;
  }
}
.page-drawer--rtl {
  .page-drawer-view {
    border-radius: 4px 0 0 4px;
  }
}
.page-drawer--let {
  .page-drawer-view {
    border-radius: 0 4px 4px 0;
  }
}
</style>
