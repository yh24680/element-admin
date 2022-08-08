<template>
  <div style="width: 100%">
    <el-row
      type="flex"
      justify="space-between"
      align="middle"
      style="height: 40px; width: 100%"
    >
      <el-col>
        <span>{{ node.data ? node.data.name : node.name }}</span>
      </el-col>
      <el-col :span="4">
        <el-row type="flex" justify="end">
          <!-- 两个内容 -->
          <el-col>{{ node.data ? node.data.manager : "负责人" }}</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown @command="onCommand">
              <span> 操作<i class="el-icon-arrow-down" /> </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="a">添加子部门</el-dropdown-item>
                <template v-if="node.data">
                  <el-dropdown-item command="b">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="c">删除部门</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="50%"
      @click.native.stop
      @close="handleAddClose"
    >
      <el-form
        ref="addFromRef"
        label-width="100px"
        :model="addDepartmentsFrom"
        :rules="rules"
      >
        <el-form-item label="部门名称" prop="name">
          <el-input
            v-model="addDepartmentsFrom.name"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门编码" prop="code">
          <el-input
            v-model="addDepartmentsFrom.code"
            placeholder="1-50个字符"
          ></el-input>
        </el-form-item>
        <el-form-item label="部门负责人" prop="manager">
          <el-select
            v-model="addDepartmentsFrom.manager"
            placeholder="请选择负责人"
            style="width: 100%"
            filterable
          >
            <el-option
              v-for="item in addUser"
              :key="item.id"
              :label="item.username"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门介绍" prop="introduce">
          <el-input
            v-model="addDepartmentsFrom.introduce"
            placeholder="1-300个字符"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit"> 确 定 </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delDepartment, getSimpleUserList, addDepartment, getDepartmentsList, editDepartment } from '@/api/departments'
export default {
  filters: {},
  components: {},
  props: {
    node: {
      type: Object,
      required: true
    }
  },
  data () {
    const validateName = async (rule, value, callback) => {
      const res = await getDepartmentsList()
      if (this.isEdit) {
        // 标题不存在编辑
        const pid = this.node.data.pid // 把当前要编辑的部门父级的id找到。然后根据这个pid去找所有的兄弟元素
        // console.log(res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id))  找到兄弟元素，并且排除自己
        res.depts.filter(item => item.pid === pid && item.id !== this.node.data.id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      } else {
        // 待筛选的所有子部门的pid值
        const id = this.node.data ? this.node.data.id : ''
        // filter 筛选 只要子部门的pid和当前部门id一样，就说明就是他的子部门  some 看有没有符合的条件
        res.depts.filter(item => item.pid === id).some(item => item.name === value) ? callback(new Error('部门名称重复')) : callback()
      }
    }
    return {
      dialogVisible: false,
      addDepartmentsFrom: {
        name: '',
        code: '',
        introduce: '',
        manager: ''
      },
      addUser: [],
      rules: {
        name: [

          { required: true, message: '不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在2-10之间', trigger: 'blur' },
          { validator: validateName, trigger: 'change' }
        ]
      },
      isEdit: false
    }
  },
  computed: {
    title () {
      return this.isEdit ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created () { },
  methods: {
    async onCommand (key) {
      if (this.addUser === 0) {
        this.getSimpleUserList()
      }
      if (key === 'a') { // 添加部门显示
        // console.log('添加')
        this.dialogVisible = true
        this.isEdit = false
        this.getSimpleUserList()
      } else if (key === 'b') { // 编辑部门显示
        console.log('编辑')
        this.isEdit = true
        this.dialogVisible = true
        this.addDepartmentsFrom = { ...this.node.data }
      } else { // 删除
        // console.log('c')
        try {
          await this.$confirm('确定删除吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
          console.log('用户确定了')
          await delDepartment(this.node.data.id)
          this.$emit('delDepartments')
          this.$message.success('删除成功')
        } catch (err) {
          console.log(err)
          this.$notify({
            message: '取消了删除',
            duration: 1000
          })
        }
      }
    },
    async getSimpleUserList () {
      const res = await getSimpleUserList()
      this.addUser = res
    },
    // 清除表单
    handleAddClose () {
      console.log(this.form)
      this.$refs.addFromRef.resetFields()
    },
    // 添加部门
    async onSubmit () {
      if (this.isEdit) {
        delete this.addDepartmentsFrom.children
        await editDepartment(this.addDepartmentsFrom)
        this.dialogVisible = false
      } else {
        this.addDepartmentsFrom.pid = this.node.data ? this.node.data.id : ''
        const res = await addDepartment(this.addDepartmentsFrom)
        this.$emit('delDepartments')
        this.isEdit = false
        console.log(res)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-input__inner {
  font-size: 20px;
}
</style>
