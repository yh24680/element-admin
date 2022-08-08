<template>
  <div class="app-containner">
    <el-card>
      <el-tabs v-model="activeName">
        <el-tab-pane label="登陆账户设置" name="first">
          <el-form
            ref="userInfoRef"
            label-width="80px"
            :model="userInfo"
            :rules="userInfoRules"
            style="width: 400px; margin-left: 200px; margin-top: 50px"
          >
            <el-form-item prop="username" label="用户名">
              <el-input v-model="userInfo.username"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密码">
              <el-input v-model="userInfo.password"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="save">更新</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="个人详情" name="second">
          <UserInfo :id="id"></UserInfo>
        </el-tab-pane>
        <el-tab-pane label="岗位信息" name="third">
          <JobInfo></JobInfo>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import JobInfo from './conponents/JobInfo.vue'
import UserInfo from './conponents/UserInfo.vue'
import { getUserDetailById } from '@/api/user'
import { saveEmployee } from '@/api/employees'
export default {

  name: 'Detail',
  filters: {},
  components: { UserInfo, JobInfo },
  props: {
    id: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      activeName: 'first',
      userInfo: {
        username: '',
        password: ''
      },
      userInfoRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () { this.getUserDetailById() },
  methods: {
    async getUserDetailById () {
      const res = await getUserDetailById(this.id)
      res.password = null
      this.userInfo = res
    },
    handleClick (tab, event) {
      console.log(tab, event)
    },
    // 保存员工信息
    save () {
      this.$refs.userInfoRef.validate(async (valid) => {
        if (!valid) return this.$message.error('数据校验错误')
        const res = await saveEmployee(this.id, this.userInfo)
        console.log(res)
        this.$message.success('更新成功')
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
