<template>
  <div>
    <el-form
      ref="formRef"
      :model="formInfo"
      label-width="80px"
      style="width: 600px"
    >
      <el-form-item label="企业名称" prop="">
        <el-input v-model="formInfo.name" disabled></el-input>
      </el-form-item>
      <el-form-item label="公司地址" prop="">
        <el-input v-model="formInfo.companyAddress" disabled></el-input>
      </el-form-item>
      <el-form-item label="公司电话" prop=" ">
        <el-input v-model="formInfo.companyPhone" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop=" ">
        <el-input v-model="formInfo.mailbox" disabled></el-input>
      </el-form-item>
      <el-form-item label="备注" prop=" ">
        <el-input v-model="formInfo.remarks" disabled></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getCompanyInfo } from '@/api/setting'
import { mapGetters } from 'vuex'
export default {
  filters: {},
  components: {},
  data () {
    return {
      formInfo: {}
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  watch: {},
  async created () {
    const res = await getCompanyInfo(this.companyId)
    this.formInfo = res
    // console.log(this.formInfo)
  },
  methods: {}
}
</script>

<style scoped lang='scss'>
</style>
