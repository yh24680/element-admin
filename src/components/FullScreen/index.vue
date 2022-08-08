<template>
  <span @click="hanleClick">
    <svg-icon
      icon-class="fullscreen"
      style="margin-right: 15px; color: #fff; font-size: 19px"
    ></svg-icon>
  </span>
</template>

<script>
export default {
  filters: {},
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    async hanleClick () {
      if (document.fullscreenElement) { // 判断是否是全局状态
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
      }
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
