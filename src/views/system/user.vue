<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="form" :model="queryForm" class="demo-form-inline" :inline="true">
        <el-form-item label="">
          <el-input v-model="queryForm.userName" placeholder="User Name" />
        </el-form-item>
        <el-form-item label="">
          <el-select v-model="queryForm.userType" placeholder="Select">
            <el-option
              v-for="item in userTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" type="primary" @click="handleQuery">Query</el-button>
          <el-button v-show="showButton('Add',actions)" type="primary" @click="handleAdd()">Add User</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table :data="userList" style="width:100%;margin-top:30px;" border>
      <el-table-column v-if="false" align="center" label="User Id" width="220">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed label="User Name" width="220">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="email" width="220">
        <template slot-scope="scope">
          {{ scope.row.email }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Status" width="220">
        <template slot-scope="{row}">
          <el-tag>
            {{ row.status | statusTextFilter }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="memo" width="220">
        <template slot-scope="scope">
          {{ scope.row.memo }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Create Time" width="220">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" width="500" label="Operations">
        <template slot-scope="scope">
          <el-button v-show="showButton('View',actions)" type="primary" :disabled="scope.row.userType===0" size="small" @click="handleView(scope)">View</el-button>
          <el-button v-show="showButton('Edit',actions)" type="primary" :disabled="scope.row.userType===0" size="small" @click="handleEdit(scope)">Edit</el-button>
          <el-button v-show="showButton('Delete',actions)" type="danger" :disabled="scope.row.userType===0" size="small" @click="handleDelete(scope)">Delete</el-button>
          <el-button v-show="showButton('ResetGA',actions)" type="danger" :disabled="scope.row.userType===0" size="small" @click="handleDelete(scope)">Reset GA</el-button>
          <el-button v-show="showButton('ResetApiKey',actions)" type="danger" :disabled="scope.row.userType===0" size="small" @click="handleDelete(scope)">Reset ApiKey</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogTitle">
      <el-form :model="user" label-width="100px" label-position="right">
        <el-input v-model="user.id" class="hidden" />
        <el-form-item label="Name">
          <el-input v-model="user.userName" :disabled="disableInput" placeholder="Please enter user name" />
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="user.email" :disabled="disableInput" placeholder="Please enter email" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="user.password" :disabled="disableInput" placeholder="Please enter a new password" />
        </el-form-item>
        <el-form-item label="Company">
          <el-select v-model="user.companyId" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in companies"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Department">
          <el-select v-model="user.userType" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in departments"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="User Type">
          <el-select v-model="user.userType" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in userTypes"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="user.status" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in statusList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Gender">
          <el-select v-model="user.gender" :disabled="disableInput" placeholder="Please Select">
            <el-option
              v-for="item in genderList"
              :key="item.key"
              :label="item.label"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="user.phone" :disabled="disableInput" placeholder="Please enter phone number" />
        </el-form-item>
        <el-form-item label="Memo">
          <el-input
            v-model="user.memo"
            :disabled="disableInput"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="User Description"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button :class="{'hidden':disableInput}" type="danger" @click="dialogVisible=false">Cancel</el-button>
        <el-button :class="{'hidden':disableInput}" type="primary" @click="confirmUser">Confirm</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { addRole, deleteRole, updateRole } from '@/api/role'
import { getUsers } from '@/api/user'

const defaultRole = {
  id: '',
  userName: '',
  userType: '',
  status: null,
  gender: null,
  password: '',
  secret: '',
  deptId: null,
  companyId: null,
  email: '',
  phone: '',
  memo: ''
}

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        0: 'danger'
      }
      return statusMap[status]
    },
    statusTextFilter(status) {
      const textMap = {
        1: 'Normal',
        0: 'Disable'
      }
      return textMap[status]
    }
  },
  data() {
    return {
      user: Object.assign({}, defaultRole),
      routes: [],
      queryForm: {
        userName: '',
        userType: null
      },
      actions: [],
      userList: [],
      departments: [],
      companies: [],
      statusList: [
        { 'key': 0, 'label': 'Disable' },
        { 'key': 1, 'label': 'Normal' }
      ],
      genderList: [
        { 'key': 0, 'label': 'Male' },
        { 'key': 1, 'label': 'Female' }
      ],
      userTypes: [
        { 'key': 1, 'label': 'Administrator' },
        { 'key': 2, 'label': 'Merchant' },
        { 'key': 3, 'label': 'Sub-Merchant' }
      ],
      dialogVisible: false,
      dialogType: 'new',
      dialogTitle: 'New User',
      disableInput: true,
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      loading: false
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    this.actions = this.storage(this.$route.name)
    console.log('actions', this.actions)
    this.getUsers()
  },
  methods: {
    async getUsers(query) {
      this.loading = true
      const res = await getUsers(query)
      this.userList = res.data.list
      this.loading = false
    },
    handleAdd() {
      this.disableInput = false
      this.user = Object.assign({}, defaultRole)
      if (this.$refs.tree) {
        this.$refs.tree.setCheckedNodes([])
      }
      this.dialogType = 'new'
      this.dialogTitle = 'New User'
      this.dialogVisible = true
    },
    handleQuery() {
      this.getUsers(this.queryForm)
    },
    handleView(scope) {
      console.log(JSON.stringify(this.genderList))
      this.dialogTitle = 'View User'
      this.disableInput = true
      this.dialogVisible = true
      this.checkStrictly = true
      this.user = deepClone(scope.row)
    },
    handleEdit(scope) {
      this.dialogTitle = 'Edit User'
      this.disableInput = false
      this.dialogType = 'edit'
      this.dialogVisible = true
      this.checkStrictly = true
      this.user = deepClone(scope.row)
    },
    handleDelete({ $index, row }) {
      this.$confirm('Confirm to remove the role?', 'Warning', {
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        type: 'warning'
      })
        .then(async() => {
          await deleteRole(row.key)
          this.userList.splice($index, 1)
          this.$message({
            type: 'success',
            message: 'Delete succed!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'

      const checkedKeys = this.$refs.tree.getCheckedKeys()
      console.log('checkedKeys==', checkedKeys)
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      var menuIds = []
      checkedKeys.forEach(element => {
        element = element.replace('0-', '')
        var mids = element.split('-')
        menuIds = menuIds.concat(mids)
      })
      menuIds = [...new Set(menuIds.sort())]
      this.role.checkedKeys = menuIds
      if (isEdit) {
        await updateRole(this.role)
        for (let index = 0; index < this.userList.length; index++) {
          if (this.userList[index].levelPath === this.role.levelPath) {
            this.userList.splice(index, 1, Object.assign({}, this.role))
            break
          }
        }
      } else {
        const { data } = await addRole(this.role)
        this.role.id = data.id
        this.userList.push(this.role)
      }

      const { memo, id, roleName } = this.role
      this.dialogVisible = false
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>Role Key: ${id}</div>
            <div>Role Name: ${roleName}</div>
            <div>Description: ${memo}</div>
          `,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }
  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>
