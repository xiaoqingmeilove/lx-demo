<template>
  <div class="comment-emoji-panel" @click.stop>
    <ul class="comment-emoji-list">
      <li v-for="(item, index) in emojiList" @click.stop="onItemClick(item)">{{item}}</li>
    </ul>
  </div>
</template>

<script>
  import { emoji } from './emoji'
  export default {
    data() {
      return {
        emojiList: [...emoji]
      }
    },
    methods: {
      onItemClick(item) {
        this.$emit('select', item)
      }
    }
  }
</script>

<style lang="scss">
.comment-emoji-panel {
  position: absolute;
  right: -80px;
  bottom: 30px;
  padding: 6px;
  background: #fff;
  border: 1px solid #999;
  z-index: 1;
}
.comment-emoji-list {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
  > li {
    cursor: pointer;
  }
}
</style>
