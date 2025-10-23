<template>
</template>

<script>
  import { mapActions } from 'vuex'
  import { getFirstMenu } from '@/utils/menu'

  export default {
    created() {
      const menus = this.$store.state.User?.menus ?? []
      const first = getFirstMenu(menus)
      if (first) {
        this.$router.push({
          path: first.path
        })
      } else {
        this.userLogout()
        this.$router.push(`/`)
      }
    },
    methods: {
      ...mapActions('User', ['userLogout']),
    }
  }
</script>

<style>
</style>
