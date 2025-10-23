<template>
  <svg class="setting-icon-btn" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
    :style="bindStyle"
  	:width="width"
  	:height="height"
  	:fill="fill"
  	@click.stop="onClick"
  >
  	<path d="M411.4 112H202c-50.3 0-87.9 37.2-87.9 80.6v206.7c0 45.5 37.7 82.7 83.8 82.7h213.6c46.1 0 83.8-37.2 83.8-82.7V192.6c-4.3-43.4-42-80.6-83.9-80.6zM828.2 112H618.8c-46.1 0-83.8 37.2-83.8 80.6v206.7c0 45.5 37.7 82.7 83.8 82.7h209.4c46.1 0 83.8-37.2 83.8-82.7V192.6c2-43.4-35.7-80.6-83.8-80.6zM405.9 539.9H196.5c-50.3 0-87.9 37.2-87.9 80.6v206.7c0 45.5 37.7 82.7 83.8 82.7H406c46.1 0 83.8-37.2 83.8-82.7V620.5c-4.3-43.4-42-80.6-83.9-80.6zM827.8 539.9H618.4c-46.1 0-83.8 37.2-83.8 80.6v206.7c0 45.5 37.7 82.7 83.8 82.7h209.4c46.1 0 83.8-37.2 83.8-82.7V620.5c2-43.4-35.7-80.6-83.8-80.6z"></path>
  </svg>
</template>

<script>
  export default {
    props: {
      width: {
        type: Number,
        default: 16
      },
      height: {
        type: Number,
        default: 16
      },
      fill: {
        type: String,
        default: '#a3a3a3'
      }
    },
    computed: {
      bindStyle() {
        return {
          borderColor: this.fill
        }
      }
    },
    methods: {
      onClick() {
        this.$emit('click')
      }
    }
  }
</script>

<style>
.setting-icon-btn {
  cursor: pointer;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: solid 1px transparent;
  padding: 3px;
}
</style>
