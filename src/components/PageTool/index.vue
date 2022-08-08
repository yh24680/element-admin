<template>
  <el-card style="margin:15px 20px 10px 20px">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <el-alert
          v-if="title.length > 0"
          type="warning"
          show-icon
          :closable="false"
          >{{ title }}</el-alert
        >
      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <slot name="right"></slot>
        </el-row>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  filters: {},
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  methods: {}
}
</script>

<style scoped lang='scss'>
.el-alert {
  display: inline;
  width: unset;
}
</style>
