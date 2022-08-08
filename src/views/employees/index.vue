<template>
  <div class="dashboard-containner">
    <div class="app-containner">
      <PageTool title="提示消息">
        <template #right>
          <el-button type="danger" size="mini" @click="importExcel"
            >普通excel导出</el-button
          >
          <el-button type="info" size="mini" @click="exportExcel1"
            >复杂表头excel导出</el-button
          >
          <el-button
            type="success"
            size="mini"
            @click="$router.push('/import?type=user')"
            >excel导入</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="addEmployeesVisible = true"
            >新增员工</el-button
          >
        </template>
      </PageTool>
      <el-card style="margin: 0 20px">
        <el-table border :data="employees">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column
            label="姓名"
            sortable
            prop="username"
          ></el-table-column>
          <el-table-column label="头像" prop="staffPhoto">
            <template v-slot="scope">
              <img
                v-imgerror
                :src="scope.row.staffPhoto"
                style="width: 40px"
                @click="showQrDialog(scope.row.staffPhoto)"
              />
            </template>
          </el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="工号" prop="workNumber"></el-table-column>
          <el-table-column
            label="聘用形式"
            :formatter="formatterEmployees"
            prop="formOfEmployment"
          ></el-table-column>
          <el-table-column label="聘用形式" prop="formOfEmployment">
            <template v-slot="scope">
              {{ scope.row.formOfEmployment | formatFormType }}
            </template>
          </el-table-column>
          <el-table-column label="部门" prop="departmentName"></el-table-column>
          <el-table-column label="入职时间" prop="timeOfEntry">
            <template v-slot="scope">
              {{ scope.row.timeOfEntry | dateformat }}
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="enableState">
            <template v-slot="scope">
              <el-switch :value="scope.row.enableState"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button
                type="text"
                @click="$router.push('/employees/detail/' + scope.row.id)"
                >查看</el-button
              >
              <el-button type="text">转正</el-button>
              <el-button type="text">调岗</el-button>
              <el-button type="text">离职</el-button>
              <el-button type="text" @click="showRoleDialog(scope.row.id)"
                >角色</el-button
              >
              <el-button type="text">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
    <!-- 二维码对话框 -->
    <el-dialog title="图片二维码" :visible.sync="qrcodeVisible">
      <el-row type="flex" justify="center">
        <canvas ref="canvas"></canvas>
      </el-row>
    </el-dialog>
    <!-- 分配角色弹窗 -->
    <el-dialog title="分配角色" :visible.sync="roleVisible">
      <el-checkbox-group v-model="checkList">
        <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">
          {{ item.name }}
        </el-checkbox>
      </el-checkbox-group>
      <template #footer>
        <el-button type="primary" @click="roleClick">确定</el-button>
        <el-button @click="roleVisible = false">取消</el-button>
      </template>
    </el-dialog>
    <!-- 新增员工弹窗 -->
    <el-dialog
      title="新增员工"
      :visible.sync="addEmployeesVisible"
      @close="handleClose"
    >
      <el-form
        ref="employeesRef"
        label-width="80px"
        :model="employeeForm"
        :rules="employeeFormRules"
      >
        <el-form-item label="姓名" prop="username">
          <el-input v-model="employeeForm.username"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="employeeForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="入职时间" prop="timeOfEntry">
          <el-date-picker
            v-model="employeeForm.timeOfEntry"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="聘用形式" prop="formOfEmployment">
          <el-select
            v-model="employeeForm.formOfEmployment"
            placeholder="请选择"
          >
            <el-option
              v-for="item in hireType"
              :key="item.id"
              :label="item.value"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工号" prop="workNumber">
          <el-input v-model="employeeForm.workNumber"></el-input>
        </el-form-item>
        <el-form-item label="组织名称" prop="departmentName">
          <el-input
            v-model="employeeForm.departmentName"
            @focus="showDepartment"
          ></el-input>
          <el-tree
            v-if="deparmentList.length > 0"
            :data="deparmentList"
            default-expand-all
            :props="{ label: 'name' }"
            @node-click="handleNodeClick"
          ></el-tree>
        </el-form-item>
        <el-form-item label="转正时间" prop="correctionTime">
          <el-date-picker
            v-model="employeeForm.correctionTime"
            type="date"
            placeholder="选择日期"
            clearable
          >
          </el-date-picker>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="addStaff">确定</el-button>
        <el-button @click="addEmployeesVisible = false">取消</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from 'qrcode'
import { validMobile } from '@/utils/validate'
import { getUserDetailById } from '@/api/user'
import employees from '@/constant/employees'
import { getEmployees, assignRoles } from '@/api/employees'
import { getRoleList } from '@/api/setting'
import { getDepartmentsList } from '@/api/departments'
export default {
  // filters: {
  //   formatFormType (id) {
  //     return employees.hireType.find(item => item.id === id - 0).value
  //   }
  // },
  filters: {
    formatFormType (id) {
      var obj = employees.hireType.find(item => item.id === id - 0)
      if (obj) {
        return employees.hireType.find(item => item.id === id - 0).value
      } else {
        return '未知'
      }
    }
  },
  components: {},
  data () {
    const validateMobile = (rule, value, callback) => {
      validMobile(value) ? callback() : callback(new Error('手机格式不正确'))
    }
    return {
      paramsObj: {
        page: 1,
        size: 9999
      },
      employees: [],
      total: null,
      roleList: [], // 角色数据
      checkList: [], // 角色列表
      roleVisible: false, // 分配角色显示
      id: null,
      addEmployeesVisible: false, // 新增员工显示
      qrcodeVisible: false,
      employeeForm: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      hireType: employees.hireType,
      deparmentList: [], // 组织名称列表数据
      employeeFormRules: {
        mobile: [
          { required: true, message: '必填', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '必填', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () { this.getEmployees() },
  methods: {
    async getEmployees () {
      const res = await getEmployees({ page: this.paramsObj.page, size: this.paramsObj.size })
      // console.log(res)
      this.employees = res.rows
      this.total = res.total
    },
    // formatterEmployees (row, column, cellValue, index) {
    //   // row 就是这一行 column 当前这一列相关的信息  比如这一列有多宽 单元的值 索引
    //   return employees.hireType.find(item => item.id === cellValue - 0).value
    // }
    // 点击头像二维码
    showQrDialog (src) {
      this.qrcodeVisible = true
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.canvas, src, function (error) {
          if (error) console.error(error)
          console.log('success!')
        })
      })
    },
    // 获取组织名称列表
    async showDepartment () {
      const res = await getDepartmentsList()
      // 我们的数据不能直接使用，而是先加工处理一下才能使用 递归在写的时候慢慢就意识到了 层次不确定
      function tranferListToTree (list, pid) {
        var list1 = []
        list.forEach(item => {
          if (item.pid === pid) {
            list1.push(item)
            item.children = tranferListToTree(list, item.id)
          }
        })
        return list1
      }
      this.deparmentList = tranferListToTree(res.depts, '')
      var data = tranferListToTree(res.depts, '')
      console.log(data)
    },
    handleNodeClick (obj) {
      this.employeeForm.departmentName = obj.name
      this.deparmentList = []
    },
    // 新增员工
    async addStaff () { },
    // 关闭新增员工弹窗
    handleClose () {
      this.$refs.employeesRef.resetFields()
      this.deparmentList = []
    },
    // 显示角色弹窗
    async showRoleDialog (id) {
      this.id = id
      const { rows } = await getRoleList({ page: 1, size: 9999 })
      this.roleList = rows
      const { roleIds } = await getUserDetailById(id)
      this.checkList = roleIds
      this.roleVisible = true
      // console.log(rows)
      // console.log(id)
    },
    // 发送角色分配请求
    async roleClick () {
      const res = await assignRoles({ id: this.id, roleIds: this.checkList })
      console.log(res)
      this.roleVisible = false
    },
    formatterEmployees (row, column, cellValue, index) {
      var obj = employees.hireType.find(item => item.id === cellValue)
      if (obj) {
        return employees.hireType.find(item => item.id === cellValue).value
      } else {
        return '未知'
      }
    },

    async importExcel () {
      const { rows } = await getEmployees({ page: 1, size: 9999 })
      console.log(rows)
      rows.forEach(item => {
        delete item.password
        delete item.staffPhoto
      })

      var data = []
      rows.forEach(item => {
        data.push(Object.values(item))
      })
      const headers = {
        'id': '编号',
        'username': '姓名',
        'mobile': '手机',
        'timeOfEntry': '入职日期',
        'formOfEmployment': '聘用形式',
        'correctionTime': '转正日期',
        'workNumber': '工号',
        'departmentName': '部门'
      }
      var tHeader = Object.keys(rows[0]).map(item => (headers[item]))
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '牛马资源表', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx' // 非必填
        })
      })
    },
    exportExcel1 () {
      const multiHeader = [['', '主要信息', '', '', '', '', '']]
      const merges = ['A1:A2', 'B1:F1', 'G1:G2']
      const tHeader = ['姓名', '手机号', '入职日期', '聘用形式', '转正日期', '工号', '部门']
      const data = [
        ['张三', '13000000', '2019-1-1', '正式', '2019-1-2', '110', 'java部门'],
        ['李四', '13000000', '2019-1-1', '正式', '2019-1-2', '111', 'java部门']
      ]

      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          multiHeader, // 第一行表头 复杂表头
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          merges // 设置合并规则
        })
      })
    }
  }
}
</script>

<style scoped lang='scss'>
::v-deep .el-alert__icon.is-big {
  font-size: 20px;
}
</style>
