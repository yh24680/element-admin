<template>
  <div class="dashboard-containner">
    <div class="app-containner">
      <PageTool>
        <template #right>
          <el-button type="primary" size="mini" @click="showDialog('0')"
            >添加权限</el-button
          >
        </template>
      </PageTool>
      <el-card>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="标识" prop="code"></el-table-column>
          <el-table-column label="描述" prop="description"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <div style="text-align: center">
                <el-button
                  v-if="scope.row.type === 1"
                  type="text"
                  @click="showDialog(scope.row.id)"
                  >添加</el-button
                >
                <el-button type="text" @click="editDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button type="text">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <!-- 添加权限弹窗 -->
      <el-dialog :title="title" :visible.sync="dialogVisible" @close="reset">
        <el-form
          ref="permissionFormRef"
          label-width="80px"
          :model="permissionForm"
          :rules="permissionFormRules"
        >
          <el-form-item label="权限名称" prop="name"
            ><el-input v-model="permissionForm.name"></el-input
          ></el-form-item>
          <el-form-item label="权限标识" prop="code"
            ><el-input v-model="permissionForm.code"></el-input
          ></el-form-item>
          <el-form-item label="权限描述" prop="description"
            ><el-input v-model="permissionForm.description"></el-input
          ></el-form-item>
          <el-form-item label="开启" prop="enVisible"
            ><el-switch v-model="permissionForm.enVisible"></el-switch
          ></el-form-item>
        </el-form>
        <template #footer>
          <el-button size="mini" type="peimary" @click.native="save"
            >确定</el-button
          >
          <el-button size="mini" @click="dialogVisible = false">取消</el-button>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getPernission, addPermission, editPermission } from '@/api/permission'
import { tranferListToTree } from '@/utils'
export default {
  filters: {},
  components: {},
  data () {
    return {
      permissionFormRules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      list: [],
      dialogVisible: false,
      permissionForm: {
        enVisible: 'false',
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      },
      id: null
    }
  },
  computed: {
    title () {
      return this.id ? '新增权限' : '编辑权限'
    }
  },
  watch: {},
  created () { this.getPernission() },
  methods: {
    async getPernission () {
      const res = await getPernission()
      this.list = tranferListToTree(res, '0')
      console.log(res)
    },
    // 关闭弹窗，重置表单数据
    reset () {
      this.$refs.permissionFormRef.resetFields()
      this.permissionForm = {
        enVisible: false,
        name: '',
        code: '',
        description: '',
        type: '',
        pid: ''
      }
    },
    showDialog (id) {
      this.dialogVisible = true
      this.id = id
    },
    //  发送请求
    async save () {
      if (this.id) {
        this.permissionForm.pid = this.id ? this.id : '0'
        this.permissionForm.type = this.id === '0' ? 1 : 2
        await addPermission(this.permissionForm)
        // console.log(res)
      } else {
        await editPermission(this.permissionForm)
      }
      this.dialogVisible = false
      this.getPernission()
    },
    // 编辑按钮
    editDialog (row) {
      this.id = null
      this.permissionForm = { ...row }
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
