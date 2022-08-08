<template>
  <div>
    <el-button type="primary" size="mini" @click="onClick">新增角色</el-button>
    <el-dialog
      v-loading="loading"
      style="width: 100%"
      :title="isEdit ? '编辑角色' : '新增角色'"
      :visible.sync="isAddShow"
      :before-close="handleClose"
      @close="reset"
    >
      <el-form ref="formRef" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="form.description"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="isAddShow = false">取 消</el-button>
        <el-button type="primary" @click="addClick">确 定</el-button>
      </template></el-dialog
    >
    <!-- 表格 -->
    <el-table v-loading="loading" :data="roleList" border style="width: 100%">
      <el-table-column type="index" label="#"> </el-table-column>
      <el-table-column prop="name" label="日期" width="180"> </el-table-column>
      <el-table-column prop="description" label="角色名"> </el-table-column>
      <el-table-column prop="description" label="描述"> </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="text" @click="assginClick(scope.row.id)"
            >分配权限</el-button
          >
          <el-button type="text" @click="editClick(scope.row)">修改</el-button>
          <el-button type="text" @click="delClick(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限弹出窗 -->
    <el-dialog
      v-if="dialogVisible"
      v-loading="loading"
      style="width: 100%"
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-tree
        ref="myTreeRef"
        :data="permissions"
        default-expand-all
        show-checkbox
        node-key="id"
        :default-checked-keys="selectedPermissions"
        :props="{ label: 'name' }"
      ></el-tree>
      <template #footer>
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleNodeClick">确 定</el-button>
      </template>
    </el-dialog>
    <el-row type="flex" justify="end">
      <el-pagination
        :current-page="paramsObj.page"
        :page-sizes="[1, 4, 7, 10]"
        :page-size="paramsObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
import { getRoleList, delRole, getPermissions, getPermissionsById, assignPermission, addRole, editRole } from '@/api/setting'
import { tranferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      paramsObj: {
        page: 1,
        pagesize: 10
      },
      total: null,
      roleList: [],
      dialogVisible: false,
      permissions: [],
      selectedPermissions: [], // 默认选中
      loading: true,
      id: null,
      isAddShow: false,
      form: {
        name: '',
        description: ''
      },
      isEdit: false,
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {},
  created () { this.getRoleList() },
  methods: {
    async getRoleList () {
      const res = await getRoleList(this.paramsObj)
      // console.log(res)
      this.roleList = res.rows
      this.total = res.total
      this.loading = false
    },
    // 添加
    onClick () {
      this.isAddShow = true
      this.isEdit = false
      this.form = {}
    },
    addClick () {
      if (this.isEdit) {
        this.$refs.formRef.validate(async (valid) => {
          if (!valid) return this.message.error('请正确填写表单')
          await editRole(this.form)
          this.$message.success('编辑成功')
        })
      } else {
        this.$refs.formRef.validate(async (bool) => {
          if (!bool) return this.$message.error('请正确填写表单')
          await addRole(this.form)
          this.$message.success('添加成功')
        })
      }
      this.getRoleList()
      this.isAddShow = false
    },
    reset () {
      this.$refs.formRef.resetFields()
    },
    handleSizeChange (val) {
      this.paramsObj.pagesize = val
      this.getRoleList()
    },
    handleCurrentChange (val) {
      this.paramsObj.page = val
      this.getRoleList()
    },
    // 分配权限
    async assginClick (id) {
      this.dialogVisible = true
      const res = await getPermissions()
      this.permissions = tranferListToTree(res, '0')
      const res1 = await getPermissionsById(id)
      this.selectedPermissions = res1.permIds
      this.loading = false
      this.id = id
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => { })
    },
    async handleNodeClick () {
      // console.log(this.$refs.myTreeRef.getCheckedKeys())
      await assignPermission(this.id, this.$refs.myTreeRef.getCheckedKeys())
      this.dialogVisible = false
    },
    // 修改
    editClick (row) {
      this.isAddShow = true
      this.isEdit = true
      this.form = { ...row } // 浅拷贝
      // this.form = Object.assign({}, row) // 浅拷贝
    },
    // 删除
    async delClick (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await delRole(id)
        if (this.roleList.length === 1 && this.paramsObj.page > 1) {
          this.paramsObj.page--
        }
        this.getRoleList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
