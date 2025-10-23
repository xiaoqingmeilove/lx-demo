<template>
  <button
    :class="computedClassName"
    type="button"
    :style="bindStyle"
    :disabled="disabled"
     @click.stop="onClick"
  >
    <template v-if="icon">
      <i :class="icon"></i>
    </template>
    <slot name="img"></slot>
    <template v-if="$slots.default">
      <span><slot #default></slot></span>
    </template>
    <template v-else>
      <span v-if="content">{{content}}</span>
    </template>
  </button>
</template>

<script>
  const TEXT_ALIGN = {
    center: 'center',
    left: 'flex-start',
    right: 'flex-end'
  }

  export default {
    name: 'pageButton',
    props: {
      content: {
        type: String,
        default: ''
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
      icon: {
        type: String,
        default: null
      },
      theme: {
        type: String,
        default: null
      },
      fixedSize: {
        type: [Number, String],
        default: null
      },
      type: {
        type: String,
        default: 'button'
      },
      size: {
        type: String,
        default: ''
      },
      shadow: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
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
      computedClassName() {
        const { theme, size, type, disabled, shadow } = this
        return {
          ['page-button']: true,
          [`page-button-${theme}`]: !!theme,
          ['page-button--disabled']: !!disabled,
          ['page-button--text']: type === 'text',
          [`page-button-${size}`]: !!size,
          ['page-button--shadow']: !!shadow
        }
      },
      bindStyle() {
        const { background, color, borderColor, type, fixedSize, align, width } = this
        const style = {
          background,
          color,
          borderColor,
        }
        if (type === 'text') {
          style.background = 'none'
          style.borderColor = 'transparent'
          style.padding = 0
          style.height = 'auto'
        }
        if (width) {
          style.width = typeof width === 'number' ? `${width}px` : width
        }
        if (fixedSize) {
          const size = typeof fixedSize === 'number' ? `${fixedSize}px` : fixedSize
          style.width = size
          style.height = size
          style.padding = 0
        }
        style.justifyContent = TEXT_ALIGN[align]
        style.color = color
        return style
      }
    },
    methods: {
      onClick(e) {
        this.$emit('click', e)
      }
    }
  }
</script>

<style lang="less">
.page-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0 10px;
  height: 32px;
  line-height: 1;
  border-radius: 4px;
  font-size: 14px;
  outline: 0;
  white-space: nowrap;
  border: solid 1px #dcdcdc;
  background: #fff;
  color: #595959;
  cursor: pointer;
  > i {
    &+span {
      margin-left: 5px;
    }
  }
}
.page-button-small {
  height: 26px;
  font-size: 13px;
  padding: 0 10px;
}
.page-button-mini {
  height: 20px;
  font-size: 11px;
  padding: 0 6px;
}
.page-button-big {
  height: 40px;
  font-size: 16px;
  padding: 0 16px;
}
.page-button +.page-button {
  margin-left: 12px;
}

.page-button.page-button--disabled {
  cursor: not-allowed;
  &::before {
    display: block;
    content: "";
    position: absolute;
    left: -2px;
    top: -2px;
    right: -2px;
    bottom: -2px;
    background: #fff;
    border-radius: inherit;
    opacity: 0.5;
  }
}

button.page-button-default {
  background: var(--base-color);
  color: #fff;
  border-color: none;
}
button.page-button-tomato {
  background: #FFE4E1 ;
  color: #e94e4e;
  border-color: #fa7d67 ;
}

button.page-button-greener {
  background: #DCF8C6 ;
  color: #388E3C;
  border-color: #4CAF50 ;
}
button.page-button-higtblue{
  background: #E1F5FE ;
  color:#2980B9 ;
  border-color: #3498DB ;
}
button.page-button-golden{
  background: #FFF0D5;
  color:#F39C12 ;
  border-color: #F1C40F ;
}
button.page-button-purple{
  background: #F2F0F7;
  color:#7B1FA2;
  border-color: #8E44AD  ;
}
button.page-button-redorange{
  background: #f1c8a2;
  color: #f84f00 ;
  border-color:  #e69f4f;
}
button.page-button-darkgreen{
  background: #E6F7F1;
  color:#1ABC9C  ;
  border-color: #2ECC71;
}
button.page-button-darkblue{
  background: #E8F1F7;
  color:#2C3E50;
  border-color:  #337AB7 ;
}
button.page-button-lavender{
  background: #F8F0FA;
  color:#8E44AD ;
  border-color: #9B59B6;
}





button.page-button-primary {
  background: #e8f4ff;
  color: #2696ff;
  border-color: #a4d3ff;
}
button.page-button-success {
  background: #e7faf0;
  color: #81e6ae;
  border-color: #d0f5e0;
}
button.page-button-warning {
  background: #fff8e6;
  color: #ffc425;
  border-color: #ffe399;
}
button.page-button-danger {
  background: #ffeded;
  color: #ff9d9d;
  border-color: #ffdcdc;
}
button.page-button-info {
  background: #f4f4f5;
  color: #999b9e;
  border-color: #d3d4d6;
}
button.page-button-cancel {
  background: #D2D2D2;
  color: #fff;
  border-color: #D2D2D2;
}

button.page-button-red {
  color: #fff;
  background: #f56c6c;
}
button.page-button-green {
  color: #fff;
  background: #67c23a;
}
button.page-button-gray {
  color: #fff;
  background: #909399;
}
button.page-button-white {
  background: #fff;
  color: #595959;
  border-color: #dcdcdc;
}

button.page-button--text {
  color: var(--base-color);
  font-size: 15px;
}

button.page-button--shadow {
  border-color: transparent !important;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.15);
}
</style>
